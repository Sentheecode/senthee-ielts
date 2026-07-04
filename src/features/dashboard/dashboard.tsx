"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Download, Sparkles, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  aggregateDailyContributions,
  calculateDailyContribution,
  calculateStreak,
  getAttemptsForDate,
  selectNextTask,
} from "@/lib/domain/learning";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository, LearnerState } from "@/lib/storage/repository";
import { ContributionGrid } from "./contribution-grid";
import { SkillProgress } from "./skill-progress";

const todayISO = () => new Date().toLocaleDateString("en-CA");

export function Dashboard({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [state, setState] = useState<LearnerState>(() => repo.load());
  const [dataMessage, setDataMessage] = useState("");
  const today = todayISO();
  const task = useMemo(() => selectNextTask(state.tasks, 10), [state.tasks]);
  const todayAttempts = getAttemptsForDate(state.attempts, today);
  const points = calculateDailyContribution(todayAttempts);
  const dailyContributions = aggregateDailyContributions(state.attempts);
  const streak = calculateStreak(dailyContributions, today);

  const completeTask = () => {
    if (!task) return;
    const next = repo.recordAttempt({
      id: `${task.id}-${Date.now()}`,
      taskId: task.id,
      date: todayISO(),
      kind: task.skill === "writing" || task.skill === "speaking" ? "output" : "completion",
      minutes: task.duration,
      detail: task.title,
    });
    setState({ ...next });
  };

  const todayDiff = [...todayAttempts].reverse();

  const exportData = () => {
    const blob = new Blob([repo.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ielts-learning-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const next = repo.importJson(await file.text());
      setState({ ...next });
      setDataMessage("备份已导入");
    } catch (error) {
      setDataMessage(error instanceof Error ? error.message : "备份文件格式不正确");
    } finally {
      event.target.value = "";
    }
  };

  const resetData = () => {
    if (!window.confirm("确认清空本机学习记录？清空前建议先导出备份。")) return;
    const next = repo.reset();
    setState({ ...next });
    setDataMessage("本机记录已清空");
  };

  return (
    <AppShell>
      <main className="dashboard">
        <header className="page-header">
          <div><h1>{state.profile.name}</h1><p>今天先做这一组，做完有空再继续。</p></div>
          <div className="date-copy">{new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date())}</div>
        </header>

        <div className="dashboard-grid">
          <div className="main-column">
            <ContributionGrid dailyContributions={dailyContributions} streak={streak} today={today} />
            <section className="task-section" aria-labelledby="task-title">
              <div className="section-title-line"><div><h2 id="task-title">今天先做这个</h2><p>完成后自动给下一项。</p></div></div>
              <div className="panel task-panel">
                {task ? (
                  <div className="selected-task">
                    <div className="task-icon"><Sparkles aria-hidden="true" /></div>
                    <div className="task-copy"><span>{task.source}</span><h3>{task.title}</h3><p>{task.description}</p><small>预计 {task.duration} 分钟 · 完成后记入学习贡献</small></div>
                    <button className="primary-button" onClick={completeTask}>完成并记录 <ArrowRight aria-hidden="true" /></button>
                  </div>
                ) : (
                  <div className="empty-task"><CheckCircle2 aria-hidden="true" /><strong>今天这组做完了</strong><span>可以去练习页继续加一项。</span></div>
                )}
              </div>
            </section>

            <div className="mobile-skills">
              <SkillProgress estimates={state.estimates} idSuffix="-mobile" />
            </div>

            <section className="panel diff-panel" aria-labelledby="diff-title">
              <div className="section-heading-row compact"><div><h2 id="diff-title">今日学习 diff</h2><p>每一分都能解释来源</p></div><div className="diff-actions"><strong className="points">{points} pts</strong><button onClick={exportData} aria-label="导出学习数据"><Download aria-hidden="true" />导出</button></div></div>
              {todayDiff.length ? todayDiff.slice(0, 3).map((item) => <div className="diff-row" key={item.id}><span className="diff-plus">+</span><div><strong>{item.detail}</strong><p>{item.minutes} 分钟 · {item.kind === "correction" ? "完成订正" : item.kind === "output" ? "完成输出" : "完成练习"}</p></div></div>) : <div className="empty-diff">完成第一项任务后，这里会出现今天的学习变化。</div>}
              <details className="data-tools">
                <summary>数据管理</summary>
                <div className="data-tool-actions">
                  <label className="file-action"><Upload aria-hidden="true" />导入备份<input aria-label="导入备份 JSON" type="file" accept="application/json,.json" onChange={importData} /></label>
                  <button className="danger-action" onClick={resetData}><Trash2 aria-hidden="true" />清空本机记录</button>
                </div>
                <p>记录保存在当前设备。换手机前先导出，换好后在这里导入。</p>
              </details>
              {dataMessage && <p className="data-message">{dataMessage}</p>}
            </section>
          </div>
          <aside className="right-column">
            <div className="desktop-skills"><SkillProgress estimates={state.estimates} /></div>
            <section className="panel coach-note">
              <div className="coach-title"><Bot aria-hidden="true" /><div><h2>Agent</h2><p>看记录，给下一步。</p></div></div>
              <p>先把今天这一项做完。错因写清楚，比多刷更有用。</p>
              <a href="/coach" className="text-link">打开 Agent →</a>
            </section>
            <section className="panel install-note" aria-labelledby="install-title">
              <h2 id="install-title">安装为 App</h2>
              <p>iPhone 用 Safari 打开本站，点分享按钮，再选“添加到主屏幕”。之后从桌面图标 Senthee IELTS 打开。</p>
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
