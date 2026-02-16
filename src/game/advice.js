/**
 * Post-game advice generator.
 * Analyzes score patterns across all encounters and produces
 * personalized coaching for the next playthrough.
 */

export function generateAdvice(scores) {
  const avgOpenness = scores.reduce((a, s) => a + s.openness, 0) / scores.length;
  const avgAccuracy = scores.reduce((a, s) => a + s.accuracy, 0) / scores.length;

  // Check openness trend (improving or declining across encounters)
  const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
  const secondHalf = scores.slice(Math.ceil(scores.length / 2));
  const firstAvgOpen = firstHalf.reduce((a, s) => a + s.openness, 0) / firstHalf.length;
  const secondAvgOpen = secondHalf.reduce((a, s) => a + s.openness, 0) / secondHalf.length;
  const opennessTrend = secondAvgOpen - firstAvgOpen; // positive = improving

  const lines = [];

  // Primary pattern
  if (avgOpenness >= 35 && avgAccuracy >= 35) {
    lines.push(
      `Exceptional work, explorer. You held multiple possibilities open <em>and</em> read the evidence well. ` +
      `That combination — comfort with ambiguity plus sharp observation — is rare.`
    );
  } else if (avgOpenness >= 35 && avgAccuracy < 25) {
    lines.push(
      `You stayed beautifully open — you resisted the urge to lock in. But the evidence was pointing somewhere. ` +
      `Next run, pay closer attention to the <em>Supports</em> and <em>Challenges</em> tags on each scan result. ` +
      `They're your compass.`
    );
  } else if (avgOpenness < 25 && avgAccuracy >= 35) {
    lines.push(
      `You have sharp instincts — your final selections were often right. But you narrowed too early. ` +
      `Next run, try keeping all four hypotheses active through at least three scans before dismissing any. ` +
      `You might be surprised what the later evidence reveals.`
    );
  } else if (avgOpenness < 25 && avgAccuracy < 25) {
    lines.push(
      `You moved fast, and speed isn't the goal here. The game is designed to reward patience. ` +
      `Next run: slow down, read each scan result carefully, and resist the urge to commit to a single answer ` +
      `before you've seen most of the evidence.`
    );
  } else {
    lines.push(
      `Solid work. You balanced openness and accuracy — room to grow in both. ` +
      `Next run, experiment: try keeping <em>every</em> hypothesis active until the report phase ` +
      `and see how that changes your perception of the evidence.`
    );
  }

  // Trend observation
  if (opennessTrend > 5) {
    lines.push(
      `Something interesting: you got <em>more</em> open-minded as the mission progressed. ` +
      `That's the growth curve — each encounter taught you to hold the uncertainty a little longer.`
    );
  } else if (opennessTrend < -5) {
    lines.push(
      `One pattern to watch: your open-mindedness <em>decreased</em> as the mission went on. ` +
      `That's frame-lock creeping in under pressure — the exact thing this game is designed to help you notice.`
    );
  }

  return lines.join('</p><p style="margin-top:10px;">');
}
