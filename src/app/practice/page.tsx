import { AppShell } from "@/components/app-shell";
import { PracticeHub } from "@/features/practice/practice-hub";

export default function PracticePage() {
  return <AppShell><main className="inner-page"><header className="inner-header"><h1>练习</h1><p>输入要短，反馈要快；每次练习都完成一次订正。</p></header><PracticeHub /></main></AppShell>;
}
