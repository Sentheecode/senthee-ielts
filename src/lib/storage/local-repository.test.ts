import { LocalLearnerRepository, type StorageLike } from "./local-repository";
import { seedLearnerState } from "./seed";

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("LocalLearnerRepository", () => {
  it("loads seed data only when no saved state exists", () => {
    const storage = new MemoryStorage();
    const repository = new LocalLearnerRepository(storage);
    const first = repository.load();
    first.profile.name = "Leo";
    repository.save(first);
    expect(repository.load().profile.name).toBe("Leo");
    expect(first.tasks).toHaveLength(seedLearnerState.tasks.length);
  });

  it("starts Senthee with an empty real learning log", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    const state = repository.load();

    expect(state.profile.name).toBe("Senthee");
    expect(state.attempts).toEqual([]);
    expect(state.tasks.every((task) => !task.completed)).toBe(true);
  });

  it("records the same attempt idempotently", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    const attempt = {
      id: "attempt-1",
      taskId: "listen-10",
      date: "2026-07-04",
      kind: "completion" as const,
      minutes: 10,
    };
    repository.recordAttempt(attempt);
    repository.recordAttempt(attempt);
    expect(repository.load().attempts).toHaveLength(1);
  });

  it("records a correction separately from completion", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    repository.recordAttempt({
      id: "correction-1",
      taskId: "read-10",
      date: "2026-07-04",
      kind: "correction",
      minutes: 5,
    });
    expect(repository.load().attempts[0].kind).toBe("correction");
  });

  it("exports all learner data as JSON", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    expect(JSON.parse(repository.exportJson()).profile.target).toBe(7);
  });
});
