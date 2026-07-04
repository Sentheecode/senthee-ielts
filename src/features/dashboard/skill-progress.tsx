import { BookOpen, Headphones, MessageCircle, PenLine } from "lucide-react";
import type { SkillEstimate } from "@/lib/domain/types";

const labels = {
  listening: { name: "听力", icon: Headphones },
  reading: { name: "阅读", icon: BookOpen },
  writing: { name: "写作", icon: PenLine },
  speaking: { name: "口语", icon: MessageCircle },
};

export function SkillProgress({ estimates, idSuffix = "" }: { estimates: SkillEstimate[]; idSuffix?: string }) {
  const titleId = `skills-title${idSuffix}`;
  return (
    <section className="panel skills-panel" aria-labelledby={titleId}>
      <div className="section-heading-row compact">
        <div><h2 id={titleId}>四项技能</h2><p>目标 7 分</p></div>
      </div>
      <div className="skill-list">
        {estimates.map((item) => {
          const meta = labels[item.skill];
          const Icon = meta.icon;
          const current = item.current;
          return (
            <div className="skill-row" key={item.skill}>
              <Icon aria-hidden="true" />
              <div className="skill-copy"><strong>{meta.name}</strong><span>{current === null ? "待诊断" : current.toFixed(1)}</span></div>
              <div className="progress-track" aria-label={`${meta.name} ${current === null ? "待诊断" : `${current} 分`}，目标 7 分`}>
                <span style={{ width: `${current === null ? 8 : (current / item.target) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <LinkToPractice />
    </section>
  );
}

function LinkToPractice() {
  return <a href="/practice" className="text-link">开始首周诊断 →</a>;
}
