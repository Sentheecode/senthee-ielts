"use client";

import { useMemo, useRef, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { createBrowserLearnerRepository } from "@/lib/storage/browser-repository";
import type { LearnerRepository } from "@/lib/storage/repository";

type BookSkill = "Listening" | "Reading" | "Writing" | "Speaking";

const books = [
  "Cambridge IELTS 19",
  "Cambridge IELTS 18",
  "Cambridge IELTS 17",
  "Cambridge IELTS 16",
  "Cambridge IELTS 15",
];

const skillTasks: Record<BookSkill, { taskId: string; minutes: number; parts: string[] }> = {
  Listening: { taskId: "book-listening", minutes: 10, parts: ["Section 1", "Section 2", "Section 3", "Section 4"] },
  Reading: { taskId: "book-reading", minutes: 20, parts: ["Passage 1", "Passage 2", "Passage 3"] },
  Writing: { taskId: "book-writing", minutes: 20, parts: ["Task 1", "Task 2"] },
  Speaking: { taskId: "book-speaking", minutes: 10, parts: ["Part 1", "Part 2", "Part 3"] },
};

const todayISO = () => new Date().toLocaleDateString("en-CA");

export function BookPractice({ repository }: { repository?: LearnerRepository }) {
  const [repo] = useState(() => repository ?? createBrowserLearnerRepository());
  const [book, setBook] = useState(books[0]);
  const [test, setTest] = useState("Test 1");
  const [skill, setSkill] = useState<BookSkill>("Listening");
  const [part, setPart] = useState("Section 1");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [wrongNumbers, setWrongNumbers] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const attemptIndex = useRef(0);

  const config = skillTasks[skill];
  const questionCount = skill === "Writing" ? 2 : skill === "Speaking" ? 3 : 10;
  const labels = useMemo(
    () => Array.from({ length: questionCount }, (_, index) => index + 1),
    [questionCount],
  );

  function changeSkill(value: BookSkill) {
    setSkill(value);
    setPart(skillTasks[value].parts[0]);
    setAnswers({});
    setWrongNumbers("");
    setNote("");
    setMessage("");
  }

  function recordSection() {
    const answered = Object.entries(answers)
      .filter(([, value]) => value.trim())
      .map(([number, value]) => `${number}:${value.trim()}`)
      .join(" ");
    const summary = `${book} · ${test} · ${skill} ${part}`;
    attemptIndex.current += 1;
    repo.recordAttempt({
      id: `book-${todayISO()}-${attemptIndex.current}`,
      taskId: config.taskId,
      date: todayISO(),
      kind: wrongNumbers.trim() || note.trim() ? "correction" : "completion",
      minutes: config.minutes,
      detail: `${summary}${answered ? `；答案：${answered}` : ""}${wrongNumbers.trim() ? `；错题：${wrongNumbers.trim()}` : ""}${note.trim() ? `；订正：${note.trim()}` : ""}`,
    });
    setMessage(`已记录：${summary}`);
  }

  return (
    <section className="book-practice">
      <div className="book-intro">
        <BookOpenCheck aria-hidden="true" />
        <div>
          <h2>真题书</h2>
          <p>不含题文和音频，只记录做题过程。</p>
        </div>
      </div>

      <div className="book-controls">
        <label>Book<select aria-label="Book" value={book} onChange={(event) => setBook(event.target.value)}>{books.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Test<select aria-label="Test" value={test} onChange={(event) => setTest(event.target.value)}>{["Test 1", "Test 2", "Test 3", "Test 4"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>科目<select aria-label="科目" value={skill} onChange={(event) => changeSkill(event.target.value as BookSkill)}>{Object.keys(skillTasks).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>部分<select aria-label="部分" value={part} onChange={(event) => setPart(event.target.value)}>{config.parts.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>

      <div className="answer-sheet" aria-label="答题卡">
        {labels.map((number) => (
          <label key={`${skill}-${number}`}>{number}<input aria-label={String(number)} value={answers[number] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [number]: event.target.value }))} /></label>
        ))}
      </div>

      <label className="book-note">错题号<input aria-label="错题号" value={wrongNumbers} onChange={(event) => setWrongNumbers(event.target.value)} placeholder="例如：1, 4, 8" /></label>
      <label className="book-note">订正记录<textarea aria-label="订正记录" value={note} onChange={(event) => setNote(event.target.value)} placeholder="写一句错因或下次注意点" /></label>

      <div className="book-footer">
        <span>{book} · {test} · {skill} {part}</span>
        <button className="primary-button" onClick={recordSection}>记录本节</button>
      </div>
      {message && <p className="book-message">{message}</p>}
    </section>
  );
}
