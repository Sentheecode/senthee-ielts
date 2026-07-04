import { AppShell } from "@/components/app-shell";
import { CoachChat } from "@/features/coach/coach-chat";

export default function CoachPage() {
  return <AppShell><main className="inner-page"><header className="inner-header"><h1>Agent 教练</h1><p>让 Agent 看记录、解释问题、安排下一步；不要只和它闲聊。</p></header><CoachChat /></main></AppShell>;
}
