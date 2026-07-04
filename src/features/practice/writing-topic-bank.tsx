"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";

const TOPIC_SOURCE_URL = "https://yanyihann.github.io/ielts-site/data.json";

interface WritingTopic {
  year?: number;
  date?: string;
  topic?: string;
  en?: string;
  zh?: string;
}

const todayISO = () => new Date().toLocaleDateString("en-CA");

export function WritingTopicBank({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [topics, setTopics] = useState<WritingTopic[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("正在加载写作题…");
  const [saved, setSaved] = useState("");
  const attemptIndex = useRef(0);

  useEffect(() => {
    let alive = true;
    fetch(TOPIC_SOURCE_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<WritingTopic[]>;
      })
      .then((data) => {
        if (!alive) return;
        setTopics(Array.isArray(data) ? data : []);
        setStatus(Array.isArray(data) ? "来源：外部题库 JSON" : "题库格式不正确");
      })
      .catch(() => {
        if (!alive) return;
        setStatus("题库暂时没加载出来，可以稍后再试。");
      });
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return topics
      .filter((item) => {
        if (!text) return true;
        return [item.topic, item.en, item.zh, String(item.year ?? "")]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(text));
      })
      .slice(0, 8);
  }, [query, topics]);

  function recordTopic(item: WritingTopic) {
    const title = item.en || item.zh || "写作题";
    attemptIndex.current += 1;
    repo.recordAttempt({
      id: `writing-topic-${todayISO()}-${attemptIndex.current}`,
      taskId: "writing-topic",
      date: todayISO(),
      kind: "output",
      minutes: 20,
      detail: `写作题：${item.year ?? ""} ${item.topic ?? ""}；${title}`.trim(),
    });
    setSaved(`已记录：${item.year ?? ""} ${item.topic ?? "写作题"}`.trim());
  }

  return (
    <section className="writing-bank" aria-label="写作题库">
      <div className="writing-bank-head">
        <div>
          <h3>写作题</h3>
          <p>{status}</p>
        </div>
        <a href="https://yanyihann.github.io/ielts-site/" target="_blank" rel="noreferrer">打开来源 <ExternalLink aria-hidden="true" /></a>
      </div>

      <label className="topic-search">
        <Search aria-hidden="true" />
        <input aria-label="搜索写作题" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索主题或关键词" />
      </label>

      <div className="topic-list">
        {visible.map((item, index) => (
          <article key={`${item.date}-${index}`} className="topic-card">
            <div className="topic-meta"><span>{item.year ?? "年份未标"}</span><span>{item.topic ?? "未分类"}</span></div>
            {item.en && <p>{item.en}</p>}
            {item.zh && <p className="muted">{item.zh}</p>}
            <button className="outline-button" onClick={() => recordTopic(item)}>记录这题</button>
          </article>
        ))}
      </div>
      {saved && <p className="book-message">{saved}</p>}
    </section>
  );
}
