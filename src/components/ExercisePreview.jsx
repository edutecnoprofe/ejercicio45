/**
 * ExercisePreview — Vista previa de la sesión seleccionada
 * Muestra el listado completo de ejercicios con sus detalles.
 * El usuario puede volver atrás o confirmar para iniciar la sesión.
 */

const TYPE_BADGE = {
  CARDIO:   { label: 'Cardio',   color: '#FF5C00' },
  STRENGTH: { label: 'Fuerza',   color: '#00F0FF' },
  CORE:     { label: 'Core',     color: '#FFD700' },
  TENSION:  { label: 'Tensión',  color: '#A855F7' },
}

function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m} min`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ExercisePreview({ session, onConfirm, onBack }) {
  return (
    <div className="preview-screen">
      {/* Header con botón volver */}
      <div className="preview-header">
        <button className="btn-back" onClick={onBack} id="btn-back-to-selector">
          ← Volver
        </button>
        <div className="preview-session-info">
          <span className="preview-icon">{session.icon}</span>
          <div>
            <h1 className="preview-title">{session.name}</h1>
            <p className="preview-meta">
              ⏱ {session.durationLabel} · {session.exercises.length} ejercicios
            </p>
          </div>
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div className="preview-exercise-list">
        {session.exercises.map((ex, idx) => {
          const badge = TYPE_BADGE[ex.type] ?? { label: ex.type, color: '#fff' }
          return (
            <div key={ex.id} className="preview-exercise-item">
              <div className="preview-ex-number">{idx + 1}</div>

              {/* Imagen miniatura */}
              <div className="preview-ex-thumb">
                <img
                  src={ex.image}
                  alt={ex.name}
                  className="preview-thumb-img"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="preview-ex-info">
                <div className="preview-ex-top">
                  <span
                    className="preview-ex-badge"
                    style={{ '--badge-color': badge.color }}
                  >
                    {badge.label}
                  </span>
                  <span className="preview-ex-equipment">{ex.equipment}</span>
                </div>
                <h3 className="preview-ex-name">{ex.name}</h3>
                <p className="preview-ex-volume">
                  {ex.duration
                    ? formatDuration(ex.duration)
                    : ex.sets && ex.reps
                    ? `${ex.sets} × ${ex.reps} reps`
                    : ex.reps
                    ? `${ex.reps} reps`
                    : ''}
                </p>
                {ex.notes && (
                  <p className="preview-ex-notes">{ex.notes}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Botón de confirmación */}
      <div className="preview-footer">
        <button
          id="btn-start-session"
          className="btn-massive btn-orange btn-start-session"
          onClick={onConfirm}
        >
          ▶ EMPEZAR SESIÓN
        </button>
      </div>
    </div>
  )
}
