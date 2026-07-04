import { AppShell } from "@/components/app-shell";
import { VocabularyReview } from "@/features/vocabulary/vocabulary-review";

export default function VocabularyPage() {
  return <AppShell><main className="inner-page"><header className="inner-header"><h1>个人词库</h1><p>词块来自你的错题、写作和口语，而不是一份永远背不完的清单。</p></header><VocabularyReview /></main></AppShell>;
}
