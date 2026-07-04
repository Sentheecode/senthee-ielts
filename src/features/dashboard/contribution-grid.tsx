function levelForPoints(points: number): number {
  if (points === 0) return 0;
  if (points < 20) return 2;
  if (points < 40) return 3;
  return 4;
}

function subtractDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  cursor.setUTCDate(cursor.getUTCDate() - days);
  return cursor.toISOString().slice(0, 10);
}

export function ContributionGrid({
  dailyContributions,
  streak,
  today,
}: {
  dailyContributions: Record<string, number>;
  streak: number;
  today: string;
}) {
  const cells = Array.from({ length: 84 }, (_, index) => {
    const date = subtractDays(today, 83 - index);
    return levelForPoints(dailyContributions[date] ?? 0);
  });
  const todayPoints = dailyContributions[today] ?? 0;
  return (
    <section className="panel contribution-panel" aria-labelledby="contribution-title">
      <div className="section-heading-row">
        <div>
          <h2 id="contribution-title">学习贡献</h2>
          <p>有效完成、订正和输出才会点亮</p>
        </div>
        <strong className="streak"><span>{streak}</span> 连续 {streak} 天</strong>
      </div>
      <div className="heatmap" role="img" aria-label={`最近 12 周学习贡献，今日 ${todayPoints} 积分`}>
        {cells.map((level, index) => (
          <span key={index} className={`level-${level}`} aria-hidden="true" />
        ))}
      </div>
      <div className="heatmap-footer">
        <span>4 月</span><span>5 月</span><span>6 月</span><span>今天</span>
      </div>
    </section>
  );
}
