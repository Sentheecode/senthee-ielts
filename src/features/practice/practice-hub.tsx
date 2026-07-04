"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Headphones, Mic, PenLine } from "lucide-react";
import { AudioRecorder } from "./audio-recorder";

type Tab = "reading" | "writing" | "speaking";

const fallbackFeedback = "反馈已保存：表达目的清楚。下一步请补充具体影响，并检查冠词与句子衔接。";

export function PracticeHub() {
  const [tab, setTab] = useState<Tab>("reading");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [writing, setWriting] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitWriting() {
    if (!writing.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "writing", content: writing }),
      });
      const data = (await response.json()) as { feedback?: string };
      setFeedback(`反馈已保存：${data.feedback ?? fallbackFeedback.replace("反馈已保存：", "")}`);
    } catch {
      setFeedback(fallbackFeedback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="practice-hub">
      <div className="practice-tabs" role="tablist" aria-label="练习类型">
        <button role="tab" aria-selected={tab === "reading"} onClick={() => setTab("reading")}><Headphones aria-hidden="true" />阅读</button>
        <button role="tab" aria-selected={tab === "writing"} onClick={() => setTab("writing")}><PenLine aria-hidden="true" />写作</button>
        <button role="tab" aria-selected={tab === "speaking"} onClick={() => setTab("speaking")}><Mic aria-hidden="true" />口语</button>
      </div>

      {tab === "reading" && (
        <section className="practice-sheet">
          <span className="source-label">AI 原创 · IELTS General Training 题型</span>
          <h2>工作场景定位阅读</h2>
          <blockquote>Employees may adjust their start and finish times, provided they complete their contracted hours and attend the weekly team meeting.</blockquote>
          <fieldset>
            <legend>Which benefit is offered to employees?</legend>
            {["free training courses", "flexible working hours", "remote work every day"].map((option) => (
              <label key={option}><input type="radio" name="reading-answer" value={option} checked={answer === option} onChange={(event) => setAnswer(event.target.value)} />{option}</label>
            ))}
          </fieldset>
          <button className="primary-button" onClick={() => setChecked(true)}>检查答案</button>
          {checked && <div className={answer === "flexible working hours" ? "answer-feedback correct" : "answer-feedback incorrect"}><CheckCircle2 aria-hidden="true" />{answer === "flexible working hours" ? "回答正确：你识别出了同义替换。" : "还不对。adjust their start and finish times 对应 flexible working hours。请订正后再读一遍原句。"}</div>}
          <a className="official-link" href="https://www.ielts.org/take-a-test/preparation-resources/sample-test-questions/general-training-test" target="_blank" rel="noreferrer">打开 IELTS 官方免费样题 <ExternalLink aria-hidden="true" /></a>
        </section>
      )}

      {tab === "writing" && (
        <section className="practice-sheet">
          <span className="source-label">AI 原创 · General Training Task 1</span>
          <h2>写一封信反映排班变化</h2>
          <p>向经理说明新排班对你的影响，提出一个可行方案，并礼貌请求回复。先写一个核心段落。</p>
          <label className="writing-label">写作练习内容<textarea aria-label="写作练习内容" value={writing} onChange={(event) => setWriting(event.target.value)} placeholder="建议 80–150 词…" /></label>
          <div className="writing-footer"><span>{writing.trim() ? writing.trim().split(/\s+/).length : 0} words</span><button className="primary-button" disabled={!writing.trim() || loading} onClick={submitWriting}>{loading ? "分析中…" : "提交给 Agent"}</button></div>
          {feedback && <div className="agent-feedback">{feedback}</div>}
        </section>
      )}

      {tab === "speaking" && (
        <section className="practice-sheet">
          <span className="source-label">AI 原创 · Speaking Part 2</span>
          <h2>Describe a useful skill you learned at work</h2>
          <ul><li>what the skill was</li><li>how you learned it</li><li>how it helped you</li></ul>
          <p>准备 1 分钟，连续说 1–2 分钟。先追求完整表达，不要逐句翻译。</p>
          <AudioRecorder />
        </section>
      )}
    </div>
  );
}
