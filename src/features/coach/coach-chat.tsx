"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";

interface Message { role: "agent" | "user"; content: string }

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([{ role: "agent", content: "你好。我会根据你的练习记录安排下一步。现在尚未完成首周诊断，建议先从 10 分钟听力或官方样题开始。" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const content = input.trim();
    setMessages((items) => [...items, { role: "user", content }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "coach", content }) });
      const data = (await response.json()) as { feedback: string; provider?: string };
      setMessages((items) => [...items, { role: "agent", content: data.feedback }]);
    } catch {
      setMessages((items) => [...items, { role: "agent", content: "暂时无法连接在线模型。你可以继续完成今日任务，记录会保存在本机。" }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="coach-chat">
      <div className="chat-status"><Bot aria-hidden="true" /><div><strong>IELTS 学习 Agent</strong><span>中文讲解 · DeepSeek 在线 / 本地建议兜底</span></div></div>
      <div className="messages" aria-live="polite">{messages.map((message, index) => <div key={index} className={`message ${message.role}`}>{message.content}</div>)}{loading && <div className="message agent">正在结合你的目标分析…</div>}</div>
      <div className="composer"><label><span className="sr-only">给 Agent 的消息</span><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="问错题、要一个任务，或粘贴写作内容…" /></label><button aria-label="发送" disabled={loading || !input.trim()} onClick={send}><Send aria-hidden="true" /></button></div>
    </div>
  );
}
