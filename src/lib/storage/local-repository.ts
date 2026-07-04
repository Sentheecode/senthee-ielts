import type { LearningAttempt } from "@/lib/domain/types";
import type { LearnerRepository, LearnerState } from "./repository";
import { seedLearnerState } from "./seed";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "ielts-seven:v2:senthee";

const cloneSeed = () => structuredClone(seedLearnerState);

export class LocalLearnerRepository implements LearnerRepository {
  constructor(private readonly storage: StorageLike) {}

  load(): LearnerState {
    const saved = this.storage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LearnerState;
    const initial = cloneSeed();
    this.save(initial);
    return initial;
  }

  save(state: LearnerState): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  recordAttempt(attempt: LearningAttempt): LearnerState {
    const state = this.load();
    if (!state.attempts.some((item) => item.id === attempt.id)) {
      state.attempts.push(attempt);
      state.tasks = state.tasks.map((task) =>
        task.id === attempt.taskId && attempt.kind !== "passive"
          ? { ...task, completed: true }
          : task,
      );
      this.save(state);
    }
    return state;
  }

  exportJson(): string {
    return JSON.stringify(this.load(), null, 2);
  }
}
