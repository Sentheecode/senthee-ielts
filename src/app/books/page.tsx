import { AppShell } from "@/components/app-shell";
import { BookPractice } from "@/features/books/book-practice";

export default function BooksPage() {
  return <AppShell><main className="inner-page"><header className="inner-header"><h1>真题</h1><p>用手机记录书上的做题过程、答案和订正。</p></header><BookPractice /></main></AppShell>;
}
