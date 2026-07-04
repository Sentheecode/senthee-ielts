"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { seedLearnerState } from "@/lib/storage/seed";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";

const todayISO = () => new Date().toLocaleDateString("en-CA");

export function VocabularyReview({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const item = seedLearnerState.vocabulary[index % seedLearnerState.vocabulary.length];

  function speak() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(item.phrase));
    }
  }

  function next() {
    repo.recordAttempt({
      id: `vocab-${item.id}-${Date.now()}`,
      taskId: "vocab-3",
      date: todayISO(),
      kind: "completion",
      minutes: 3,
      detail: `复习词块：${item.phrase}`,
    });
    setReviewed((value) => value + 1);
    setIndex((value) => value + 1);
    setRevealed(false);
  }

  return (
    <div className="vocab-layout">
      <section className="vocab-card">
        <div className="vocab-meta"><span>个人词块</span><strong>{index + 1} / {seedLearnerState.vocabulary.length}</strong></div>
        <div className="phrase-row"><h2>{item.phrase}</h2><button aria-label="播放发音" onClick={speak}><Volume2 aria-hidden="true" /></button></div>
        {revealed ? <div className="phrase-answer"><strong>{item.meaning}</strong><p>{item.example}</p></div> : <button className="outline-button" onClick={() => setRevealed(true)}>显示释义</button>}
        {revealed && <div className="review-actions"><button onClick={next}>还要复习</button><button className="primary-button" onClick={next}>掌握了</button></div>}
      </section>
      <aside className="vocab-summary"><strong>今日已复习 {reviewed} 个词块</strong><p>不背孤立单词：听辨、拼写、搭配、造句都过关才算掌握。</p></aside>
    </div>
  );
}
