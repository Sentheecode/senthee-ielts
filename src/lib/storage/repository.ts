import type {
  LearningAttempt,
  SkillEstimate,
  StudyTask,
  VocabularyItem,
} from "@/lib/domain/types";

export interface LearnerState {
  profile: { name: string; target: number; examType: "General Training" };
  tasks: StudyTask[];
  attempts: LearningAttempt[];
  estimates: SkillEstimate[];
  vocabulary: VocabularyItem[];
}

export interface LearnerRepository {
  load(): LearnerState;
  save(state: LearnerState): void;
  recordAttempt(attempt: LearningAttempt): LearnerState;
  exportJson(): string;
}
