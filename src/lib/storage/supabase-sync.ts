import type { LearnerRepository, LearnerState } from "./repository";
import type { LearningAttempt } from "@/lib/domain/types";
import type { VocabularyItem } from "@/lib/domain/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const USER_ID = "default";

export class SupabaseSync {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly fallback: LearnerRepository
  ) {}

  async syncState(state: LearnerState): Promise<void> {
    try {
      const attempts = state.attempts.map((a) => ({
        id: a.id,
        user_id: USER_ID,
        date: a.date,
        kind: a.kind,
        minutes: a.minutes,
        detail: a.detail,
      }));
      await this.supabase.from("attempts").upsert(attempts, { onConflict: "id" });
    } catch {
      // silent
    }
  }

  async syncAttempt(attempt: LearningAttempt): Promise<void> {
    try {
      await this.supabase.from("attempts").insert({
        id: attempt.id,
        user_id: USER_ID,
        date: attempt.date,
        kind: attempt.kind,
        minutes: attempt.minutes,
        detail: attempt.detail,
      });
    } catch {
      // silent
    }
  }

  async syncVocabulary(vocabulary: VocabularyItem[]): Promise<void> {
    try {
      const rows = vocabulary.map((v) => ({
        id: v.id,
        user_id: USER_ID,
        phrase: v.phrase,
        meaning: v.meaning,
        example: v.example,
        mastery: v.mastery,
        due: v.due,
      }));
      await this.supabase.from("vocabulary").upsert(rows, { onConflict: "id" });
    } catch {
      // silent
    }
  }

  async syncAnswer(questionId: string, skill: string, correct: boolean): Promise<void> {
    try {
      await this.supabase.from("question_history").insert({
        id: crypto.randomUUID(),
        user_id: USER_ID,
        question_id: questionId,
        skill,
        correct,
      });
    } catch {
      // silent
    }
  }

  async clearUserData(): Promise<void> {
    try {
      await this.supabase
        .from("attempts")
        .delete()
        .eq("user_id", USER_ID);
      await this.supabase
        .from("vocabulary")
        .delete()
        .eq("user_id", USER_ID);
      await this.supabase
        .from("question_history")
        .delete()
        .eq("user_id", USER_ID);
    } catch {
      // silent
    }
  }
}
