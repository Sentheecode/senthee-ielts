"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Clock3, Download, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { calculateDailyContribution, selectNextTask } from "@/lib/domain/learning";
import type { TaskDuration } from "@/lib/domain/types";
import { LocalLearnerRepository, type StorageLike } from "@/lib/storage/local-repository";
import type { LearnerRepository, LearnerState } from "@/lib/storage/repository";
import { ContributionGrid } from "./contribution-grid";
import { SkillProgress } from "./skill-progress";

const memoryStorage: StorageLike = (() => {
  const data = new Map<string, string>();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
})();

const createRepository = () =>
  new LocalLearnerRepository(typeof window === "undefined" ? memoryStorage : window.localStorage);

const budgets: TaskDuration[] = [3, 10, 25, 60];

export function Dashboard({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createRepository());
  const [state, setState] = useState<LearnerState>(() => repo.load());
  const [budget, setBudget] = useState<TaskDuration>(25);
  const task = useMemo(() => selectNextTask(state.tasks, budget), [state.tasks, budget]);
  const points = calculateDailyContribution(state.attempts);

  const completeTask = () => {
    if (!task) return;
    const next = repo.recordAttempt({
      id: `${task.id}-${Date.now()}`,
      taskId: task.id,
      date: new Date().toISOString().slice(0, 10),
      kind: task.skill === "writing" || task.skill === "speaking" ? "output" : "completion",
      minutes: task.duration,
      detail: task.title,
    });
    setState({ ...next });
  };

  const latest = state.attempts.at(-1);

  const exportData = () => {
    const blob = new Blob([repo.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ielts-learning-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <main className="dashboard">
        <header className="page-header">
          <div><h1>今天，继续靠近 <em>7</em> 分</h1><p>雅思通用培训（General Training） · 六个月计划</p></div>
          <div className="date-copy">{new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date())}</div>
        </header>

        <div className="dashboard-grid">
          <div className="main-column">
            <ContributionGrid todayPoints={points} />
            <section className="task-section" aria-labelledby="task-title">
              <div className="section-title-line"><div><h2 id="task-title">今天的自适应任务</h2><p>按你现在可用的时间，给出一件最值得做的事</p></div></div>
              <div className="panel task-panel">
                <div className="budget-block">
                  <h3>今天可用多久？</h3>
                  <div className="budget-options">
                    {budgets.map((value) => (
                      <button key={value} className={budget === value ? "selected" : ""} onClick={() => setBudget(value)} aria-pressed={budget === value}>
                        <Clock3 aria-hidden="true" /><strong>{value}</strong> 分钟
                      </button>
                    ))}
                  </div>
                </div>
                {task ? (
                  <div className="selected-task">
                    <div className="task-icon"><Sparkles aria-hidden="true" /></div>
                    <div className="task-copy"><span>{task.source}</span><h3>{task.title}</h3><p>{task.description}</p><small>预计 {task.duration} 分钟 · 完成后记入学习贡献</small></div>
                    <button className="primary-button" onClick={completeTask}>完成并记录 <ArrowRight aria-hidden="true" /></button>
                  </div>
                ) : (
                  <div className="empty-task"><CheckCircle2 aria-hidden="true" /><strong>这个时长的任务都完成了</strong><span>换一个时长，或去练习页继续。</span></div>
                )}
              </div>
            </section>

            <div className="mobile-skills">
              <SkillProgress estimates={state.estimates} idSuffix="-mobile" />
            </div>

            <section className="panel diff-panel" aria-labelledby="diff-title">
              <div className="section-heading-row compact"><div><h2 id="diff-title">今日学习 diff</h2><p>每一分都能解释来源</p></div><div className="diff-actions"><strong className="points">{points} pts</strong><button onClick={exportData} aria-label="导出学习数据"><Download aria-hidden="true" />导出</button></div></div>
              {latest ? <div className="diff-row"><span className="diff-plus">+</span><div><strong>{latest.detail}</strong><p>{latest.minutes} 分钟 · {latest.kind === "correction" ? "完成订正" : "完成练习"}</p></div></div> : <div className="empty-diff">完成第一项任务后，这里会出现今天的学习变化。</div>}
            </section>
          </div>
          <aside className="right-column">
            <div className="desktop-skills"><SkillProgress estimates={state.estimates} /></div>
            <section className="panel coach-note">
              <div className="coach-title"><Bot aria-hidden="true" /><div><h2>Agent 起步建议</h2><p>基于当前尚未诊断的状态</p></div></div>
              <p>先用官方免费样题测出四科基线。今天不要刷很多题，重点记录“为什么错”。</p>
              <a href="/coach" className="text-link">和 Agent 制定首周计划 →</a>
            </section>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
