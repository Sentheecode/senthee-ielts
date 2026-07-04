import {
  aggregateDailyContributions,
  calculateDailyContribution,
  calculateStreak,
  getAttemptsForDate,
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

  it("aggregates real contribution points by attempt date", () => {
    expect(
      aggregateDailyContributions([
        attempt("a", "completion"),
        { ...attempt("b", "output"), date: "2026-07-05" },
        { ...attempt("a", "correction"), date: "2026-07-05" },
      ]),
    ).toEqual({
      "2026-07-04": 10,
      "2026-07-05": 30,
    });
  });

  it("filters today's attempts before calculating today's diff", () => {
    const today = attempt("today", "completion");
    const yesterday = { ...attempt("yesterday", "output"), date: "2026-07-03" };

    expect(getAttemptsForDate([yesterday, today], "2026-07-04")).toEqual([
      today,
    ]);
    expect(calculateDailyContribution(getAttemptsForDate([yesterday, today], "2026-07-04"))).toBe(10);
  });

  it("calculates a streak from real daily contribution only", () => {
    expect(calculateStreak({ "2026-07-02": 10, "2026-07-04": 30 }, "2026-07-04")).toBe(1);
    expect(calculateStreak({ "2026-07-02": 10, "2026-07-03": 24, "2026-07-04": 30 }, "2026-07-04")).toBe(3);
    expect(calculateStreak({}, "2026-07-04")).toBe(0);
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
