import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = "/Users/zhaoyumeng/Downloads/ielts-work/ielts-complete";
const OUT_DIR = "/Users/zhaoyumeng/Documents/ielts/src/data";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// ---------- Speaking ----------
function parseSpeaking() {
  const text = readFileSync(join(DATA_DIR, "口语/雅思口语2025年1-4月雅思口语题库.md"), "utf-8");
  const part1: { part: 1; prompt: string }[] = [];
  const part2: { part: 2; prompt: string }[] = [];

  // Find content sections (not TOC - TOC has dots)
  const allMatches = [...text.matchAll(/\n(Part1:|Part2&3)\n/g)];

  // Part1 new: between first Part1: and first Part2&3
  const part1New = allMatches.length >= 2
    ? text.slice(allMatches[0].index + allMatches[0][0].length, allMatches[1].index)
    : "";

  // Part2 new: between first Part2&3 and second Part1:
  const part2New = allMatches.length >= 3
    ? text.slice(allMatches[1].index + allMatches[1][0].length, allMatches[2].index)
    : "";

  // Retained sections
  const retainedStart = allMatches[2] ? allMatches[2].index : -1;
  let retainedPart1 = "", retainedPart2 = "";
  if (retainedStart > 0) {
    const retainedSection = text.slice(retainedStart);
    const p2InRetained = retainedSection.indexOf("\nPart2&3", 100);
    if (p2InRetained > 0) {
      retainedPart1 = retainedSection.slice(0, p2InRetained);
      retainedPart2 = retainedSection.slice(p2InRetained + "\nPart2&3\n".length);
    } else {
      retainedPart1 = retainedSection;
    }
  }

  // Extract Part1 questions - find all "N. TopicName" blocks with questions
  function extractPart1(section: string) {
    const topics: { topic: string; questions: string[] }[] = [];
    // Split on topic headers: "N. Name" followed by content
    const topicRegex = /\n(\d+)\.\s+([^\n]+?)\s*\n([\s\S]*?)(?=\n\d+\.\s+[^\n]+\n|\Z)/g;
    for (const m of section.matchAll(topicRegex)) {
      const topic = m[2].trim();
      const block = m[3];
      // Find questions in this block
      const qRegex = /\n\d+\.\s*((?:What's|Do you|Did you|Have you|Would you|How|Why|Who|Where|When|Which|Are you|What color|What kind|What things|What makes|How often|Do you often|Are there|Do you think|Do you like|Is it|Do you prefer|Do you want|Do you usually|Have you ever|What was|What is|Do you agree)[^\n]*\?)/gi;
      const qMatch = block.match(qRegex);
      if (qMatch) {
        const q = qMatch[1].trim();
        if (topic.length > 1 && q.length > 5) {
          part1.push({ part: 1, prompt: `${topic} — ${q}` });
        }
      }
    }
  }

  // Extract Part2 questions
  function extractPart2(section: string) {
    // Part2 new: Chinese names without "N." prefix, followed by Describe table
    // Part2 retained: "N. ChineseName\nDescribe..."
    // Try both patterns
    const topicRegex1 = /\n(\d+)\.\s+([^\n]+?)\s*\nDescribe/gi;
    const topicRegex2 = /\n\n([^\n\d][^\n]+?)\s*\n\d+\.\s*\| Describe/gi;

    for (const m of section.matchAll(topicRegex1)) {
      const topic = m[2].trim();
      if (topic.length > 1 && topic.length < 60) {
        part2.push({ part: 2, prompt: `Describe ${topic}` });
      }
    }
    for (const m of section.matchAll(topicRegex2)) {
      const topic = m[1].trim();
      if (topic.length > 1 && topic.length < 60) {
        part2.push({ part: 2, prompt: `Describe ${topic}` });
      }
    }
  }

  extractPart1(part1New);
  extractPart1(retainedPart1);
  extractPart2(part2New);
  extractPart2(retainedPart2);

  const result = [...part1, ...part2];
  console.log(`Speaking: ${part1.length} Part1, ${part2.length} Part2 = ${result.length} total`);
  return result;
}

// ---------- Writing ----------
function parseWriting() {
  const text = readFileSync(join(DATA_DIR, "写作/雅思作文（大）2025.1-4月雅思写作大作文预测.md"), "utf-8");
  const questions: string[] = [];

  const clean = text.replace(/\n[^\n]*\.{5,}[^\n]*\n/g, "\n");
  const catMatches = [...clean.matchAll(/\n(社会类|政府类|教育类|环境类|文化类|经济发展类|旅游健康类|科技类|犯罪类|个人成长类)\n/g)];

  for (let i = 0; i < catMatches.length; i++) {
    const start = catMatches[i].index + catMatches[i][0].length;
    const end = i + 1 < catMatches.length ? catMatches[i + 1].index : clean.length;
    const section = clean.slice(start, end);

    for (const line of section.split("\n")) {
      const trimmed = line.trim();
      const m = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (m) {
        const q = m[2].trim();
        if (q.length > 30 && q.length < 500 &&
            (q.includes("To what extent") || q.includes("Discuss both views") || q.includes("What are the causes") ||
             q.includes("Is this a positive") || q.includes("agree or disagree") || q.includes("give your opinion") ||
             q.includes("outweigh") || q.includes("positive or negative") || q.includes("Some people") ||
             q.includes("Many people") || q.includes("The world has many"))) {
          questions.push(q);
        }
      }
    }
  }

  console.log(`Writing: ${questions.length} topics`);
  return questions;
}

// ---------- Reading 538 ----------
function parseReading538() {
  const text = readFileSync(join(DATA_DIR, "阅读/雅思阅读538考点词（结构化版）.md"), "utf-8");
  const words: { word: string; pos: string; meaning: string; synonyms: string }[] = [];

  const rows = text.match(/\|\s*(\d+)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|/g) || [];
  for (const row of rows) {
    const m = row.match(/\|\s*(\d+)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|/);
    if (m && m[1] !== "序号") {
      words.push({
        word: m[2].trim().replace(/\*$/, ""),
        pos: m[3].trim(),
        meaning: m[4].trim(),
        synonyms: m[5].trim(),
      });
    }
  }

  console.log(`Reading vocab: ${words.length} words`);
  return words;
}

// ---------- Listening 179 ----------
function parseListening179() {
  const text = readFileSync(join(DATA_DIR, "听力/雅思听力179考点词.md"), "utf-8");
  const words: { word: string; pos: string; meaning: string; synonyms: string }[] = [];

  const rows = text.match(/\|\s*(\d+)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|/g) || [];
  for (const row of rows) {
    const m = row.match(/\|\s*(\d+)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|\s*([^\|]+?)\s*\|/);
    if (m && m[1] !== "序号") {
      words.push({
        word: m[2].trim(),
        pos: m[3].trim(),
        meaning: m[4].trim(),
        synonyms: m[5].trim(),
      });
    }
  }

  console.log(`Listening vocab: ${words.length} words`);
  return words;
}

// ---------- Run ----------
const speaking = parseSpeaking();
const writing = parseWriting();
const readingVocab = parseReading538();
const listeningVocab = parseListening179();

writeFileSync(join(OUT_DIR, "speaking-bank.json"), JSON.stringify(speaking, null, 2));
writeFileSync(join(OUT_DIR, "writing-bank.json"), JSON.stringify(writing, null, 2));
writeFileSync(join(OUT_DIR, "reading-vocab.json"), JSON.stringify(readingVocab, null, 2));
writeFileSync(join(OUT_DIR, "listening-vocab.json"), JSON.stringify(listeningVocab, null, 2));

console.log("\nDone. Files written to", OUT_DIR);
