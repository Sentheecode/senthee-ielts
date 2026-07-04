const levels = Array.from({ length: 84 }, (_, index) => {
  const pattern = [0, 1, 2, 1, 3, 0, 2, 4, 1, 2, 0, 3];
  return pattern[index % pattern.length];
});

export function ContributionGrid({ todayPoints }: { todayPoints: number }) {
  const todayLevel = todayPoints === 0 ? 0 : todayPoints < 20 ? 2 : todayPoints < 40 ? 3 : 4;
  return (
    <section className="panel contribution-panel" aria-labelledby="contribution-title">
      <div className="section-heading-row">
        <div>
          <h2 id="contribution-title">学习贡献</h2>
          <p>有效完成、订正和输出才会点亮</p>
        </div>
        <strong className="streak"><span>12</span> 连续 12 天</strong>
      </div>
      <div className="heatmap" role="img" aria-label={`最近 12 周学习贡献，今日 ${todayPoints} 积分`}>
        {levels.map((level, index) => {
          const value = index === levels.length - 1 ? todayLevel : level;
          return <span key={index} className={`level-${value}`} aria-hidden="true" />;
        })}
      </div>
      <div className="heatmap-footer">
        <span>4 月</span><span>5 月</span><span>6 月</span><span>今天</span>
      </div>
    </section>
  );
}
