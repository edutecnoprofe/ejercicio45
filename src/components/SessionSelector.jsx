/**
 * SessionSelector — Pantalla de selección de sesión
 * Muestra 2-3 sesiones sugeridas para hoy con nombre, duración y músculos.
 * El usuario selecciona una → pasa a ExercisePreview.
 */

import { useState, useEffect } from 'react'
import { getSuggestedSessions, getRecentHistory, saveFreeActivityToHistory, FREE_ACTIVITIES } from '../data/sessionHistory'
import { SyncScreen } from './SyncScreen'
import { HistoryModal } from './HistoryModal'

const TYPE_ICON_BG = {
  LOWER_BODY: 'linear-gradient(135deg, #FF5C00 0%, #FF9500 100%)',
  HIIT_4X4:   'linear-gradient(135deg, #FF2D55 0%, #FF6B81 100%)',
  UPPER_BODY:  'linear-gradient(135deg, #00C6FF 0%, #00F0FF 100%)',
  REHAB:       'linear-gradient(135deg, #A855F7 0%, #D946EF 100%)',
}

const MUSCLE_LABELS = {
  piernas: '🦵 Piernas',
  glúteos: '🍑 Glúteos',
  core: '⚡ Core',
  cardiovascular: '❤️ Cardio',
  pecho: '💪 Pecho',
  espalda: '🔙 Espalda',
  hombros: '🏔️ Hombros',
  bíceps: '💪 Bíceps',
  codo: '🩹 Codo',
  movilidad: '🤸 Movilidad',
}

export function SessionSelector({ onSelect }) {
  const [suggested, setSuggested] = useState([])
  const [recentHistory, setRecentHistory] = useState([])
  const [hoveredId, setHoveredId] = useState(null)
  const [showSync, setShowSync] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Estado para actividad libre
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [durationMin, setDurationMin] = useState(30)
  const [freeActivitySaved, setFreeActivitySaved] = useState(false)

  // Abrir sync automáticamente si venimos de un QR escaneado
  useEffect(() => {
    setSuggested(getSuggestedSessions())
    setRecentHistory(getRecentHistory(3))
    const url = new URL(window.location.href)
    if (url.searchParams.get('peer')) {
      setShowSync(true)
    }
  }, [])

  // Refrescar historial y sugerencias tras cerrar la sync
  const handleSyncClose = () => {
    setShowSync(false)
    setSuggested(getSuggestedSessions())
    setRecentHistory(getRecentHistory(3))
  }

  // Guardar actividad libre
  const handleSaveFreeActivity = () => {
    if (!selectedActivity) return
    saveFreeActivityToHistory(selectedActivity, durationMin)
    setFreeActivitySaved(true)
    setSelectedActivity(null)
    setDurationMin(30)
    setRecentHistory(getRecentHistory(3))
    setTimeout(() => setFreeActivitySaved(false), 2500)
  }

  return (
    <div className="selector-screen">
      {/* Modal de sincronización P2P */}
      {showSync && <SyncScreen onClose={handleSyncClose} />}
      {/* Modal de Historial Completo */}
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} onChange={() => { setSuggested(getSuggestedSessions()); setRecentHistory(getRecentHistory(3)); }} />}
      {/* Header */}
      <div className="selector-header">
        <div className="selector-greeting">
          <span className="selector-day-label">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long', day: 'numeric', month: 'long'
            })}
          </span>
          <h1 className="selector-title">¿Qué sesión hacemos hoy?</h1>
          <p className="selector-subtitle">
            Seleccionadas para respetar tu recuperación muscular
          </p>
        </div>

        {/* Historial reciente */}
        {recentHistory.length > 0 && (
          <div className="recent-history" onClick={() => setShowHistory(true)} style={{ cursor: 'pointer' }} title="Ver historial completo">
            <span className="history-label">Últimas sesiones (click para más):</span>
            <div className="history-pills">
              {recentHistory.map((entry, i) => (
                <span key={i} className="history-pill">
                  {entry.date}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botón de sincronización P2P */}
        <button
          id="btn-sync-devices"
          className="btn-sync"
          onClick={() => setShowSync(true)}
          title="Sincronizar historial con otro dispositivo"
        >
          <span className="btn-sync-icon">🔄</span>
          <span>Sincronizar dispositivos</span>
        </button>
      </div>

      {/* Cards de sesiones */}
      <div className="session-cards-grid">
        {suggested.map((session, idx) => (
          <button
            key={session.id}
            id={`session-card-${session.id}`}
            className={`session-card ${hoveredId === session.id ? 'session-card--hovered' : ''} ${idx === 0 ? 'session-card--top' : ''}`}
            onClick={() => onSelect(session)}
            onMouseEnter={() => setHoveredId(session.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ '--card-accent': session.accentColor }}
          >
            {/* Recomendado badge */}
            {idx === 0 && (
              <div className="recommended-badge">⭐ Recomendada</div>
            )}

            {/* Icono */}
            <div
              className="session-card-icon"
              style={{ background: TYPE_ICON_BG[session.type] }}
            >
              <span>{session.icon}</span>
            </div>

            {/* Info principal */}
            <div className="session-card-info">
              <h2 className="session-card-name">{session.name}</h2>
              <p className="session-card-desc">{session.shortDesc}</p>

              {/* Duración */}
              <div className="session-card-meta">
                <span className="session-duration">
                  ⏱ {session.durationLabel}
                </span>
                <span className="session-exercises-count">
                  {session.exercises.length} ejercicios
                </span>
              </div>

              {/* Grupos musculares */}
              <div className="session-muscles">
                {session.muscleGroups.map(m => (
                  <span key={m} className="muscle-chip">
                    {MUSCLE_LABELS[m] ?? m}
                  </span>
                ))}
              </div>
            </div>

            {/* Flecha */}
            <div className="session-card-arrow">›</div>
          </button>
        ))}
      </div>

      {/* ─── Actividad Libre ─────────────────────────────────────────── */}
      <div className="free-activity-section">
        <h2 className="free-activity-title">🏅 Registrar Actividad Libre</h2>
        <p className="free-activity-subtitle">
          ¿Hiciste algo fuera del plan? Regístralo para que cuente en tu historial.
        </p>

        {/* Selector de tipo */}
        <div className="free-activity-types">
          {Object.values(FREE_ACTIVITIES).map(act => (
            <button
              key={act.id}
              id={`btn-free-${act.id.toLowerCase()}`}
              className={`free-activity-btn ${selectedActivity === act.id ? 'free-activity-btn--active' : ''}`}
              style={{ '--act-color': act.color }}
              onClick={() => setSelectedActivity(prev => prev === act.id ? null : act.id)}
            >
              <span className="free-activity-btn-icon">{act.icon}</span>
              <span className="free-activity-btn-label">{act.label}</span>
            </button>
          ))}
        </div>

        {/* Selector de duración + botón guardar */}
        {selectedActivity && (
          <div className="free-activity-duration-row">
            <label className="free-activity-duration-label">⏱ Duración</label>
            <div className="free-activity-duration-controls">
              <button
                className="duration-step-btn"
                onClick={() => setDurationMin(m => Math.max(5, m - 5))}
              >−</button>
              <span className="duration-display">{durationMin} min</span>
              <button
                className="duration-step-btn"
                onClick={() => setDurationMin(m => Math.min(300, m + 5))}
              >+</button>
            </div>
            <input
              id="free-activity-duration-range"
              type="range"
              min="5" max="180" step="5"
              value={durationMin}
              onChange={e => setDurationMin(Number(e.target.value))}
              className="duration-range"
            />
            <button
              id="btn-save-free-activity"
              className="btn-save-activity"
              onClick={handleSaveFreeActivity}
            >
              ✅ Guardar actividad
            </button>
          </div>
        )}

        {/* Confirmación */}
        {freeActivitySaved && (
          <div className="free-activity-saved-msg">
            ✓ ¡Actividad registrada en tu historial!
          </div>
        )}
      </div>
    </div>
  )
}
