import type { LearningAttempt } from "@/lib/domain/types";
import type { LearnerRepository, LearnerState } from "./repository";
import { seedLearnerState } from "./seed";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "senthee-ielts:v3";

const cloneSeed = () => structuredClone(seedLearnerState);

function isLearnerState(value: unknown): value is LearnerState {
  if (!value || typeof value !== "object") return false;
  const state = value as LearnerState;
  return (
    typeof state.profile?.name === "string" &&
    Array.isArray(state.tasks) &&
    Array.isArray(state.attempts) &&
    Array.isArray(state.estimates) &&
    Array.isArray(state.vocabulary)
  );
}

export class LocalLearnerRepository implements LearnerRepository {
  constructor(private readonly storage: StorageLike) {}

  load(): LearnerState {
    const saved = this.storage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved) as LearnerState; } catch { /* fall through */ }
    }
    const initial = cloneSeed();
    this.storage.setItem(STORAGE_KEY, JSON.stringify(initial));
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
          : task
      );
      this.save(state);
    }
    return state;
  }

  importJson(raw: string): LearnerState {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("备份文件格式不正确");
    }
    if (!isLearnerState(parsed)) {
      throw new Error("备份文件格式不正确");
    }
    this.save(parsed);
    return parsed;
  }

  reset(): LearnerState {
    const initial = cloneSeed();
    this.save(initial);
    return initial;
  }

  exportJson(): string {
    const saved = this.storage.getItem(STORAGE_KEY);
    return saved ?? JSON.stringify(cloneSeed(), null, 2);
  }
}
