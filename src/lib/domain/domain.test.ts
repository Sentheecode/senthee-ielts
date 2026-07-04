import {
  calculateDailyContribution,
  selectNextTask,
} from "./learning";
import type { LearningAttempt, StudyTask } from "./types";

const attempt = (
  id: string,
  kind: LearningAttempt["kind"],
): LearningAttempt => ({
  id,
  taskId: "task-1",
  date: "2026-07-04",
  kind,
  minutes: 10,
});

describe("learning domain", () => {
  it("does not reward passive page time", () => {
    expect(calculateDailyContribution([attempt("a", "passive")])).toBe(0);
  });

  it("rewards correction more than basic completion", () => {
    const completion = calculateDailyContribution([
      attempt("a", "completion"),
    ]);
    const correction = calculateDailyContribution([
      attempt("b", "correction"),
    ]);
    expect(correction).toBeGreaterThan(completion);
  });

  it("counts a repeated attempt id only once", () => {
    const one = attempt("same", "output");
    expect(calculateDailyContribution([one, one])).toBe(
      calculateDailyContribution([one]),
    );
  });

  it("selects the highest priority task inside the time budget", () => {
    const tasks: StudyTask[] = [
      {
        id: "short",
        title: "词块复习",
        skill: "vocabulary",
        duration: 3,
        priority: 2,
        completed: false,
      },
      {
        id: "best",
        title: "听力填空",
        skill: "listening",
        duration: 10,
        priority: 9,
        completed: false,
      },
      {
        id: "too-long",
        title: "完整写作",
        skill: "writing",
        duration: 60,
        priority: 10,
        completed: false,
      },
    ];

    expect(selectNextTask(tasks, 10)?.id).toBe("best");
  });
});
