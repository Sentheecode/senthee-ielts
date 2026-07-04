"use client";

import { LocalLearnerRepository, type StorageLike } from "./local-repository";

const memoryStorage: StorageLike = (() => {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
})();

export function createBrowserLearnerRepository() {
  return new LocalLearnerRepository(
    typeof window === "undefined" ? memoryStorage : window.localStorage,
  );
}
