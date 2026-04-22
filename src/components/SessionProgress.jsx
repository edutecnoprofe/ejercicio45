import '../styles/SessionProgress.css';

const TYPE_COLORS = {
  CARDIO: '#FF5C00',
  STRENGTH: '#00F0FF',
  CORE: '#FFD700',
  TENSION: '#A855F7',
};

export function SessionProgress({ routine, currentIndex }) {
  return (
    <div className="session-progress">
      <div className="session-progress-bar">
        {routine.map((ex, i) => {
          const status = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
          return (
            <div
              key={ex.id}
              className={`segment ${status}`}
              style={{ '--seg-color': TYPE_COLORS[ex.type] ?? '#fff', flex: 1 }}
              title={ex.name}
            >
              {status === 'done' && <span className="seg-check">✓</span>}
            </div>
          );
        })}
      </div>
      <p className="session-progress-label">
        Ejercicio {currentIndex + 1} / {routine.length}
      </p>
    </div>
  );
}
