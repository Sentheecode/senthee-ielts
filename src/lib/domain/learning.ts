import type { LearningAttempt, StudyTask, TaskDuration } from "./types";

const POINTS: Record<LearningAttempt["kind"], number> = {
  passive: 0,
  completion: 10,
  correction: 24,
  output: 30,
};

function uniqueAttempts(attempts: LearningAttempt[]): LearningAttempt[] {
  const unique = new Map<string, LearningAttempt>();
  attempts.forEach((item) => {
    if (!unique.has(item.id)) unique.set(item.id, item);
  });
  return [...unique.values()];
}

export function calculateDailyContribution(
  attempts: LearningAttempt[],
): number {
  return uniqueAttempts(attempts).reduce((sum, item) => sum + POINTS[item.kind], 0);
}

export function getAttemptsForDate(
  attempts: LearningAttempt[],
  date: string,
): LearningAttempt[] {
  return attempts.filter((attempt) => attempt.date === date);
}

export function aggregateDailyContributions(
  attempts: LearningAttempt[],
): Record<string, number> {
  return uniqueAttempts(attempts).reduce<Record<string, number>>((daily, item) => {
    daily[item.date] = (daily[item.date] ?? 0) + POINTS[item.kind];
    return daily;
  }, {});
}

export function calculateStreak(
  dailyContributions: Record<string, number>,
  today: string,
): number {
  let streak = 0;
  const [year, month, day] = today.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  while (true) {
    const date = cursor.toISOString().slice(0, 10);
    if (!dailyContributions[date]) return streak;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
}

export function selectNextTask(
  tasks: StudyTask[],
  budget: TaskDuration,
): StudyTask | undefined {
  return tasks
    .filter((task) => !task.completed && task.duration <= budget)
    .sort((a, b) => b.priority - a.priority || b.duration - a.duration)[0];
}
