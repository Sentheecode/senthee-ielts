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

  it("exports learner data without hidden band or exam labels", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    const exported = repository.exportJson();

    expect(JSON.parse(exported).profile).toEqual({ name: "Senthee" });
    expect(exported).not.toContain("target");
    expect(exported).not.toContain("General Training");
  });

  it("imports a valid backup JSON into the current device", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    const backup = {
      ...repository.load(),
      attempts: [
        {
          id: "backup-1",
          taskId: "listen-10",
          date: "2026-07-04",
          kind: "completion" as const,
          minutes: 10,
          detail: "备份里的听力任务",
        },
      ],
    };

    const imported = repository.importJson(JSON.stringify(backup));

    expect(imported.profile.name).toBe("Senthee");
    expect(repository.load().attempts[0].detail).toBe("备份里的听力任务");
  });

  it("rejects invalid backup JSON without replacing existing data", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    repository.recordAttempt({
      id: "keep-me",
      taskId: "listen-10",
      date: "2026-07-04",
      kind: "completion",
      minutes: 10,
    });

    expect(() => repository.importJson("{\"profile\":null}")).toThrow("备份文件格式不正确");
    expect(repository.load().attempts[0].id).toBe("keep-me");
  });

  it("resets the device back to Senthee's empty starter log", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    repository.recordAttempt({
      id: "remove-me",
      taskId: "listen-10",
      date: "2026-07-04",
      kind: "completion",
      minutes: 10,
    });

    const reset = repository.reset();

    expect(reset.profile.name).toBe("Senthee");
    expect(reset.attempts).toEqual([]);
    expect(repository.load().attempts).toEqual([]);
  });
});
