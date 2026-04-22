import '../styles/TimerRing.css';

const SIZE = 400;
const STROKE = 18;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function TimerRing({ secondsLeft, totalSeconds, formatted, label, isRunning }) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-ring-wrapper">
      <svg className="timer-ring-svg" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ filter: 'drop-shadow(0 0 12px var(--accent-cyan))' }}
        />
      </svg>
      <div className="timer-ring-text">
        <span className="timer-ring-time">{formatted}</span>
        <span className="timer-ring-label">{label}</span>
        {isRunning && <span className="timer-ring-indicator">●</span>}
      </div>
    </div>
  );
}
