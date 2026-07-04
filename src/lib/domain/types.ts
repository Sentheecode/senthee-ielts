export type Skill =
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "vocabulary";

export type TaskDuration = 3 | 10 | 25 | 60;

export interface StudyTask {
  id: string;
  title: string;
  skill: Skill;
  duration: TaskDuration;
  priority: number;
  completed: boolean;
  description?: string;
  source?: string;
}

export interface LearningAttempt {
  id: string;
  taskId: string;
  date: string;
  kind: "passive" | "completion" | "correction" | "output";
  minutes: number;
  detail?: string;
}

export interface SkillEstimate {
  skill: Exclude<Skill, "vocabulary">;
  current: number | null;
  target: number;
  confidence: "unmeasured" | "low" | "medium" | "high";
}

export interface VocabularyItem {
  id: string;
  phrase: string;
  meaning: string;
  example: string;
  due: string;
  mastery: number;
}
