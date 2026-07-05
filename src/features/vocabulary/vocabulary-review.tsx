"use client";

import { useState, useMemo } from "react";
import { Volume2 } from "lucide-react";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";
import vocabularyData from "@/data/vocabulary.json";
import type { VocabularyItem } from "@/lib/domain/types";

const todayISO = () => new Date().toLocaleDateString("en-CA");

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VocabularyReview({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const shuffledIds = useMemo(() => {
    const list = vocabularyData as VocabularyItem[];
    return shuffle(list.map((v) => v.id));
  }, []);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [mastery, setMastery] = useState<Record<string, number>>({});

  const vocabList = useMemo(() => vocabularyData as VocabularyItem[], []);

  const currentId = shuffledIds[index % shuffledIds.length];
  const item = vocabList.find((v) => v.id === currentId) ?? vocabList[0];

  if (!item) {
    return <div className="vocab-layout"><p className="muted">词库加载中...</p></div>;
  }

  const currentMastery = mastery[item.id] ?? 0;

  function speak() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(item.phrase));
    }
  }

  function next(level: number) {
    repo.recordAttempt({
      id: `vocab-${item.id}-${Date.now()}`,
      taskId: "vocab-3",
      date: todayISO(),
      kind: "completion",
      minutes: 3,
      detail: `复习词块：${item.phrase}`,
    });
    setMastery((prev) => ({ ...prev, [item.id]: level }));
    setReviewed((value) => value + 1);
    setIndex((value) => value + 1);
    setRevealed(false);
  }

  return (
    <div className="vocab-layout">
      <section className="vocab-card">
        <div className="vocab-meta">
          <span>雅思高频词块 · {vocabList.length} 词</span>
          <strong>
            {index + 1} / {shuffledIds.length || vocabList.length}
          </strong>
        </div>
        <div className="phrase-row">
          <h2>{item.phrase}</h2>
          <button aria-label="播放发音" onClick={speak}>
            <Volume2 aria-hidden="true" />
          </button>
        </div>
        {revealed ? (
          <div className="phrase-answer">
            <strong>{item.meaning}</strong>
            <p>{item.example}</p>
          </div>
        ) : (
          <button className="outline-button" onClick={() => setRevealed(true)}>
            显示释义
          </button>
        )}
        {revealed && (
          <div className="review-actions">
            <button onClick={() => next(Math.max(currentMastery, 1))}>模糊</button>
            <button className="primary-button" onClick={() => next(currentMastery + 1)}>
              记住了
            </button>
          </div>
        )}
      </section>
      <aside className="vocab-summary">
        <strong>今日已复习 {reviewed} 个词块</strong>
        <p className="muted">
          共 {vocabList.length} 个词块，每次随机打乱，不重复出现直到全部复习一轮。
        </p>
      </aside>
    </div>
  );
}
