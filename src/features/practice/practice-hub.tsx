"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Headphones, Mic, PenLine } from "lucide-react";
import { AudioRecorder } from "./audio-recorder";
import { WritingTopicBank } from "./writing-topic-bank";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";
import { createClient } from "@/lib/supabase/client";
import { SupabaseSync } from "@/lib/storage/supabase-sync";
import type { LearningAttempt } from "@/lib/domain/types";
import { getListeningQuestions, getReadingQuestions, getSpeakingPrompts } from "@/data/index";
import type { ReadingQuestion, ListeningQuestion, SpeakingQuestion } from "@/data/types";

type Tab = "reading" | "writing" | "speaking";
type SubSkill = "reading" | "listening";

const ANSWERED_KEY = "senthee-ielts:answered-ids";

const fallbackFeedback =
  "反馈已保存：表达目的清楚。下一步请补充具体影响，并检查冠词与句子衔接。";
const todayISO = () => new Date().toLocaleDateString("en-CA");

function loadAnswered(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(ANSWERED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAnswered(answered: Record<string, string[]>) {
  localStorage.setItem(ANSWERED_KEY, JSON.stringify(answered));
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNext(skill: SubSkill): ReadingQuestion | ListeningQuestion | null {
  const answered = loadAnswered();
  let all: ReadingQuestion[] | ListeningQuestion[];
  if (skill === "reading") {
    all = getReadingQuestions();
  } else {
    all = getListeningQuestions();
  }
  const excluded = new Set(answered[skill] ?? []);
  if (excluded.size >= all.length) {
    saveAnswered({ ...answered, [skill]: [] });
    const shuffled = shuffle([...all]);
    return shuffled[0] ?? null;
  }
  const available = all.filter((q) => !excluded.has(q.id));
  const shuffled = shuffle(available);
  return shuffled[0] ?? null;
}

export function PracticeHub({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [tab, setTab] = useState<Tab>("reading");
  const [subSkill, setSubSkill] = useState<SubSkill>("reading");

  const [readingState, setReadingState] = useState<{
    current: ReadingQuestion | null;
    answers: Record<string, number>;
    checked: boolean;
  }>(() => {
    const q = getNext("reading");
    return { current: q as ReadingQuestion | null, answers: {}, checked: false };
  });

  const [listeningState, setListeningState] = useState<{
    current: ListeningQuestion | null;
    answers: Record<string, number>;
    checked: boolean;
  }>(() => {
    const q = getNext("listening");
    return { current: q as ListeningQuestion | null, answers: {}, checked: false };
  });

  const readingAnswersRef = useRef<Record<string, number>>({});
  const listeningAnswersRef = useRef<Record<string, number>>({});

  const [writingText, setWritingText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const sync = useMemo(
    () => (supabase ? new SupabaseSync(supabase, repo) : null),
    [supabase, repo]
  );

  function syncAttempt(attempt: LearningAttempt) {
    if (sync) {
      sync.syncAttempt(attempt).catch(() => {});
    }
  }

  const currentReading = readingState.current;
  const currentListening = listeningState.current;

  function ensureListeningLoaded() {
    if (!currentListening) {
      const q = getNext("listening");
      setListeningState({ current: q as ListeningQuestion | null, answers: {}, checked: false });
    }
  }

  function advance(skill: SubSkill) {
    const next = getNext(skill);
    if (skill === "reading") {
      setReadingState({ current: next as ReadingQuestion | null, answers: {}, checked: false });
    } else {
      setListeningState({ current: next as ListeningQuestion | null, answers: {}, checked: false });
    }
  }

  function submitCheck(skill: SubSkill) {
    const st = skill === "reading" ? readingState : listeningState;
    const q = st.current;
    if (!q) return;

    const answers = skill === "reading" ? readingAnswersRef.current : listeningAnswersRef.current;
    const allAnswered = q.questions.every((qu) => answers[qu.id] !== undefined);
    if (!allAnswered) {
      const fb = document.getElementById("feedback");
      if (fb) { fb.className = "feedback bad"; fb.textContent = "请回答所有题目再检查。"; }
      return;
    }

    const allCorrect = q.questions.every((qu) => answers[qu.id] === qu.answer);

    const attempt: LearningAttempt = {
      id: `${skill}-${q.id}-${Date.now()}`,
      taskId: `${skill}-drill`,
      date: todayISO(),
      kind: allCorrect ? "completion" : "correction",
      minutes: 5,
      detail: `${skill === "reading" ? "阅读" : "听力"}：${q.title} · ${allCorrect ? "全部正确" : "有错需订正"}`,
    };
    repo.recordAttempt(attempt);
    syncAttempt(attempt);

    const answered = loadAnswered();
    if (!answered[skill]) answered[skill] = [];
    if (!answered[skill].includes(q.id)) {
      answered[skill].push(q.id);
      saveAnswered(answered);
    }

    if (skill === "reading") {
      setReadingState((s) => ({ ...s, checked: true }));
    } else {
      setListeningState((s) => ({ ...s, checked: true }));
    }

    const fb = document.getElementById("feedback");
    if (fb) {
      fb.className = `feedback ${allCorrect ? "" : "bad"}`;
      fb.textContent = allCorrect ? "全部正确！" : "部分答错，看解析订正后再做下一题。";
      q.questions.forEach((qu) => {
        if (answers[qu.id] !== qu.answer) {
          const hint = document.createElement("div");
          hint.className = "explanation";
          hint.textContent = `第 ${q.questions.indexOf(qu) + 1} 题：${qu.explanation}`;
          fb.appendChild(hint);
        }
      });
    }
  }

  async function handleWritingSubmit() {
    if (!writingText.trim()) return;
    setLoading(true);
    const attempt: LearningAttempt = {
      id: `writing-${Date.now()}`,
      taskId: "writing-paragraph",
      date: todayISO(),
      kind: "output",
      minutes: 15,
      detail: "提交写作段落给 Agent",
    };
    repo.recordAttempt(attempt);
    syncAttempt(attempt);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "writing", content: writingText }),
      });
      const data = (await response.json()) as { feedback?: string };
      setFeedback(`反馈已保存：${data.feedback ?? fallbackFeedback.replace("反馈已保存：", "")}`);
    } catch {
      setFeedback(fallbackFeedback);
    } finally {
      setLoading(false);
    }
  }

  function playListeningScript(script: string) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "en-GB";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  const readingQuestions = useMemo(() => getReadingQuestions(), []);
  const listeningQuestions = useMemo(() => getListeningQuestions(), []);
  const speakingPrompts = useMemo(() => getSpeakingPrompts(), []);

  return (
    <div className="practice-hub">
      <div className="practice-tabs" role="tablist" aria-label="练习类型">
        <button role="tab" aria-selected={tab === "reading"} onClick={() => setTab("reading")}>
          <Headphones aria-hidden="true" />阅读
        </button>
        <button role="tab" aria-selected={tab === "writing"} onClick={() => setTab("writing")}>
          <PenLine aria-hidden="true" />写作
        </button>
        <button role="tab" aria-selected={tab === "speaking"} onClick={() => setTab("speaking")}>
          <Mic aria-hidden="true" />口语
        </button>
      </div>

      {tab === "reading" && (
        <div className="practice-tabs" role="tablist" aria-label="技能子标签">
          <button
            role="tab"
            aria-selected={subSkill === "reading"}
            onClick={() => setSubSkill("reading")}
          >
            阅读 ({readingQuestions.length} 题)
          </button>
          <button
            role="tab"
            aria-selected={subSkill === "listening"}
            onClick={() => { setSubSkill("listening"); ensureListeningLoaded(); }}
          >
            听力 ({listeningQuestions.length} 题)
          </button>
        </div>
      )}

      {tab === "reading" && currentReading && (
        <section className="practice-sheet">
          <span className="source-label">阅读 · {currentReading.difficulty}</span>
          <div className="question-meta">
            <span className="tag">{currentReading.title}</span>
            <span className="muted">
              {currentReading.questions.length} 题 · 来源: {currentReading.source}
            </span>
          </div>
          <div className="passage-text">{currentReading.passage}</div>
          {currentReading.questions.map((q, idx) => (
            <div key={q.id} className="question-block">
              <p className="question-text">{idx + 1}. {q.text}</p>
              <fieldset>
                <legend>选择答案</legend>
                {q.options.map((option, oi) => (
                  <label key={oi}>
                    <input
                      type="radio"
                      name={`reading-ans-${q.id}`}
                      value={oi}
                      checked={readingState.answers[q.id] === oi}
                      onChange={() => {
                        const next = { ...readingState.answers, [q.id]: oi };
                        readingAnswersRef.current = next;
                        setReadingState((s) => ({ ...s, answers: next }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
              {readingState.checked && (
                <AnswerFeedback
                  correct={readingState.answers[q.id] === q.answer}
                  explanation={q.explanation}
                />
              )}
            </div>
          ))}
          {!readingState.checked && (
            <button className="primary-button" onClick={() => submitCheck("reading")}>
              检查答案
            </button>
          )}
          {readingState.checked && (
            <button className="secondary-button" onClick={() => advance("reading")}>
              下一题
            </button>
          )}
        </section>
      )}

      {subSkill === "listening" && currentListening && (
        <section className="practice-sheet">
          <span className="source-label">听力 · {currentListening.difficulty}</span>
          <div className="question-meta">
            <span className="tag">{currentListening.title}</span>
            <span className="muted">
              {currentListening.questions.length} 题 · 来源: {currentListening.source}
            </span>
          </div>
          <button
            className="secondary-button"
            onClick={() => playListeningScript(currentListening.script)}
          >
            <Headphones aria-hidden="true" /> 播放听力
          </button>
          <p className="listening-script muted">
            听力原文：{currentListening.script}
          </p>
          {currentListening.questions.map((q, idx) => (
            <div key={q.id} className="question-block">
              <p className="question-text">{idx + 1}. {q.text}</p>
              <fieldset>
                <legend>选择答案</legend>
                {q.options.map((option, oi) => (
                  <label key={oi}>
                    <input
                      type="radio"
                      name={`listening-ans-${q.id}`}
                      value={oi}
                      checked={listeningState.answers[q.id] === oi}
                      onChange={() => {
                        const next = { ...listeningState.answers, [q.id]: oi };
                        listeningAnswersRef.current = next;
                        setListeningState((s) => ({ ...s, answers: next }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
              {listeningState.checked && (
                <AnswerFeedback
                  correct={listeningState.answers[q.id] === q.answer}
                  explanation={q.explanation}
                />
              )}
            </div>
          ))}
          {!listeningState.checked && (
            <button className="primary-button" onClick={() => submitCheck("listening")}>
              检查答案
            </button>
          )}
          {listeningState.checked && (
            <button className="secondary-button" onClick={() => advance("listening")}>
              下一题
            </button>
          )}
        </section>
      )}

      {tab === "writing" && (
        <section className="practice-sheet">
          <span className="source-label">写作</span>
          <p className="practice-instructions">
            选择一个题目，先写大纲再写全文。写完后提交给 Agent 获取反馈。
          </p>
          <WritingTopicBank repository={repo} />
          <div className="writing-input-section">
            <label className="writing-label">
              写作内容
              <textarea
                aria-label="写作内容"
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="建议 80–150 词…"
              />
            </label>
            <div className="writing-footer">
              <span>
                {writingText.trim()
                  ? writingText.trim().split(/\s+/).length
                  : 0}{" "}
                words
              </span>
              <button
                className="primary-button"
                disabled={!writingText.trim() || loading}
                onClick={handleWritingSubmit}
              >
                {loading ? "分析中…" : "提交给 Agent"}
              </button>
            </div>
          </div>
          {feedback && <div className="agent-feedback">{feedback}</div>}
        </section>
      )}

      {tab === "speaking" && (
        <section className="practice-sheet">
          <span className="source-label">口语</span>
          <h2>Part 2 话题卡片</h2>
          {speakingPrompts.length > 0 && <SpeakingCard prompts={speakingPrompts} />}
          <AudioRecorder />
        </section>
      )}
    </div>
  );
}

function AnswerFeedback({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation: string;
}) {
  return (
    <div
      className={`answer-feedback ${correct ? "correct" : "incorrect"}`}
      role="alert"
    >
      <CheckCircle2 aria-hidden="true" />
      {correct ? "回答正确" : "还不正确"}: {explanation}
    </div>
  );
}

function SpeakingCard({ prompts }: { prompts: SpeakingQuestion[] }) {
  const [idx, setIdx] = useState(0);
  const card = prompts[idx % prompts.length];

  return (
    <div className="speaking-card">
      <h3>{card.prompt}</h3>
      <ul>
        {card.part === 2 && (
          <>
            <li>
              what it was / who it was / where it is / how you learned it
            </li>
            <li>how it helped you / why you like it / what happened</li>
            <li>follow-up questions practice</li>
          </>
        )}
      </ul>
      <button
        className="secondary-button"
        onClick={() => setIdx((i) => i + 1)}
      >
        换一题 ({idx + 1} / {prompts.length})
      </button>
    </div>
  );
}
