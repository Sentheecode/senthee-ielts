"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";

interface WritingTopic {
  year?: string;
  topic?: string;
  en: string;
  zh?: string;
}

const EXTERNAL_URL = "https://yanyihann.github.io/ielts-site/data.json";
const todayISO = () => new Date().toLocaleDateString("en-CA");

const LOCAL_TOPICS: WritingTopic[] = [
  { year: "2024", topic: "教育", en: "Some people believe that university education should be free for everyone. To what extent do you agree or disagree?" },
  { year: "2024", topic: "环境", en: "In many countries, fast food is becoming cheaper and more widely available. Do the advantages of this trend outweigh the disadvantages?" },
  { year: "2024", topic: "科技", en: "Some people think that governments should ban dangerous sports, while others believe individuals should have the freedom to participate. Discuss both views and give your opinion." },
  { year: "2024", topic: "社会", en: "Many people choose to live alone in recent years. What are the advantages and disadvantages of this trend?" },
  { year: "2024", topic: "教育", en: "University students should pay the full cost of their studies because education benefits individuals rather than society as a whole. To what extent do you agree?" },
  { year: "2024", topic: "环境", en: "Some people claim that not enough of the waste from homes is recycled. They say that the only way to increase recycling is for governments to make it a legal requirement. To what extent do you agree?" },
  { year: "2024", topic: "工作", en: "Many people now work from home. Discuss the advantages and disadvantages of this development." },
  { year: "2024", topic: "科技", en: "Some people argue that all young people should be required to stay in full-time education until they are 18. To what extent do you agree?" },
  { year: "2024", topic: "社会", en: "Some employers think that academic qualifications are more important than experience and personal qualities when hiring new staff. Discuss both views and give your opinion." },
  { year: "2024", topic: "城市", en: "The world has many towns and cities constructed in previous centuries that were suitable for living in at the time. What problems do these cause today, and how can they be solved?" },
  { year: "2024", topic: "媒体", en: "Some people think that printed books are no longer necessary in the digital age because electronic devices can be used for reading. Others believe printed books still play an important role. Discuss both views and give your opinion." },
  { year: "2024", topic: "健康", en: "In some countries, the average weight of people is increasing while their levels of health and fitness are decreasing. What are the causes, and what measures could be taken to address this?" },
  { year: "2024", topic: "交通", en: "Some cities are replacing parks with housing. Is this a positive or negative development?" },
  { year: "2024", topic: "教育", en: "Some people believe public transport should be free. To what extent do you agree or disagree?" },
  { year: "2024", topic: "犯罪", en: "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative methods. Discuss both views and give your opinion." },
  { year: "2024", topic: "消费", en: "Advertisements are becoming more and more common in everyday life. Is it a positive or negative development?" },
  { year: "2024", topic: "科技", en: "Some people say that the main environmental problem today is the loss of particular species of plants and animals. Others say that there are more important environmental problems. Discuss both views and give your own opinion." },
  { year: "2024", topic: "全球化", en: "Globalisation affects the world's economies, cultures and societies. Do you think the advantages of globalisation outweigh the disadvantages?" },
  { year: "2024", topic: "教育", en: "Some people think that children should learn to compete in school. Others think that children should learn to cooperate instead. Discuss both views and give your own opinion." },
  { year: "2024", topic: "环境", en: "Many countries are experiencing a decline in the number of people visiting museums and art galleries. What are the reasons for this, and how can it be solved?" },
];

export function WritingTopicBank({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [topics, setTopics] = useState<WritingTopic[]>(LOCAL_TOPICS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(`来源：本地题库 · ${LOCAL_TOPICS.length} 题`);
  const [saved, setSaved] = useState("");
  const attemptIndex = useRef(0);

  useEffect(() => {
    let alive = true;
    fetch(EXTERNAL_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<unknown[]>;
      })
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: WritingTopic[] = data.map((item) => {
            const record = item as Record<string, unknown>;
            return {
              year: String(record.year ?? ""),
              topic: String(record.topic ?? ""),
              en: String(record.en || record.title || record.question || "写作题"),
              zh: String(record.zh ?? ""),
            };
          });
          setTopics([...LOCAL_TOPICS, ...mapped]);
          setStatus(`来源：本地 + 外部题库 · 共 ${LOCAL_TOPICS.length + mapped.length} 题`);
        }
      })
      .catch(() => {
        if (!alive) return;
        setStatus(`来源：本地题库 · ${LOCAL_TOPICS.length} 题（外部题库不可用）`);
      });
    return () => { alive = false; };
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
      .slice(0, 20);
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
    setTimeout(() => setSaved(""), 3000);
  }

  return (
    <section className="writing-bank" aria-label="写作题库">
      <div className="writing-bank-head">
        <div>
          <h3>写作题</h3>
          <p>{status}</p>
        </div>
        <a href="https://yanyihann.github.io/ielts-site/" target="_blank" rel="noreferrer">
          打开来源 <ExternalLink aria-hidden="true" />
        </a>
      </div>

      <label className="topic-search">
        <Search aria-hidden="true" />
        <input
          aria-label="搜索写作题"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索主题或关键词"
        />
      </label>

      <div className="topic-list">
        {visible.map((item, index) => (
          <article key={`${item.year}-${index}`} className="topic-card">
            <div className="topic-meta">
              <span>{item.year ?? "年份未标"}</span>
              <span>{item.topic ?? "未分类"}</span>
            </div>
            <p>{item.en}</p>
            {item.zh && <p className="muted">{item.zh}</p>}
            <button className="outline-button" onClick={() => recordTopic(item)}>
              记录这题
            </button>
          </article>
        ))}
      </div>
      {saved && <p className="book-message">{saved}</p>}
    </section>
  );
}
