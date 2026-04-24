import { useState } from 'react'
import { getHistory, deleteSessionFromHistory } from '../data/sessionHistory'
import { sessions } from '../data/sessions'

const FREE_META = {
  FREE_EXERCISE: { label: 'Ejercicio Libre', icon: '🏃', color: '#22c55e' },
  RUNNING:       { label: 'Día de Correr',   icon: '👟', color: '#f97316' },
  ROWING:        { label: 'Día de Remo',     icon: '🚣', color: '#3b82f6' },
}

export function HistoryModal({ onClose, onChange }) {
  const [history, setHistory] = useState(getHistory())

  const handleDelete = (timestamp) => {
    if (confirm('¿Seguro que quieres borrar este entrenamiento del historial?')) {
      const updated = deleteSessionFromHistory(timestamp)
      setHistory(updated)
      if (onChange) onChange()
    }
  }

  return (
    <div className="sync-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
      <div className="sync-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <button className="sync-close" onClick={onClose}>×</button>
        <h2>Historial de Entrenamientos</h2>
        <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Aquí puedes ver y gestionar todos tus entrenamientos pasados.
        </p>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.5 }}>No hay entrenamientos registrados aún.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {history.map(entry => {
                const dateObj = new Date(entry.timestamp)
                const dateStr = dateObj.toLocaleDateString('es-ES', {
                  weekday: 'short', year: 'numeric', month: 'short',
                  day: 'numeric', hour: '2-digit', minute: '2-digit'
                })

                // ── Actividad Libre ─────────────────────────────────────
                if (entry.activityType) {
                  const meta = FREE_META[entry.activityType] ?? { label: entry.activityType, icon: '🏅', color: '#a855f7' }
                  return (
                    <li
                      key={entry.timestamp}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: `3px solid ${meta.color}`,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <strong style={{ fontSize: '1.05rem' }}>{meta.icon} {meta.label}</strong>
                        <span style={{ fontSize: '0.85rem', color: meta.color, fontWeight: 600 }}>⏱ {entry.durationMin} min</span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)' }}>{dateStr}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.timestamp)}
                        style={{ background: 'rgba(255, 0, 0, 0.2)', border: 'none', color: '#ff4444', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        title="Borrar entrenamiento"
                      >
                        🗑️
                      </button>
                    </li>
                  )
                }

                // ── Sesión normal ───────────────────────────────────────
                const sessionInfo = sessions.find(s => s.id === entry.sessionId)
                const name = sessionInfo ? `${sessionInfo.icon ?? ''} ${sessionInfo.name}`.trim() : 'Sesión Desconocida'
                return (
                  <li
                    key={entry.timestamp}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '1.05rem' }}>{name}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>{dateStr}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.timestamp)}
                      style={{ background: 'rgba(255, 0, 0, 0.2)', border: 'none', color: '#ff4444', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      title="Borrar entrenamiento"
                    >
                      🗑️
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
