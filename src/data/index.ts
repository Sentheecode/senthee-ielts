import questionBank from "./questions.json";
import type { QuestionBank } from "./types";

export const questions: QuestionBank = questionBank as QuestionBank;

export function getQuestionsBySkill(skill: keyof QuestionBank) {
  return questions[skill] as QuestionBank[typeof skill];
}

export function getReadingQuestions() {
  return questions.reading as QuestionBank["reading"];
}

export function getListeningQuestions() {
  return questions.listening as QuestionBank["listening"];
}

export function getWritingPrompts() {
  return questions.writing as QuestionBank["writing"];
}

export function getSpeakingPrompts() {
  return questions.speaking as QuestionBank["speaking"];
}
