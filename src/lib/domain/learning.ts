import type { LearningAttempt, StudyTask, TaskDuration } from "./types";

const POINTS: Record<LearningAttempt["kind"], number> = {
  passive: 0,
  completion: 10,
  correction: 24,
  output: 30,
};

export function calculateDailyContribution(
  attempts: LearningAttempt[],
): number {
  const unique = new Map(attempts.map((item) => [item.id, item]));
  return [...unique.values()].reduce((sum, item) => sum + POINTS[item.kind], 0);
}

export function selectNextTask(
  tasks: StudyTask[],
  budget: TaskDuration,
): StudyTask | undefined {
  return tasks
    .filter((task) => !task.completed && task.duration <= budget)
    .sort((a, b) => b.priority - a.priority || b.duration - a.duration)[0];
}
