/**
 * Gestión del historial de sesiones (localStorage)
 * Lógica de sugerencias inteligentes basada en:
 *   - Recuperación muscular: mínimo 48h entre sesiones del mismo grupo
 *   - Distribución semanal del documento (Inf → Cardio → Sup → repeat)
 *   - Máximo 7 días de historial relevante
 */

import { sessions, SESSION_MUSCLE_GROUPS } from './sessions'

const STORAGE_KEY = 'ejercicio45_session_history'
/**
 * @typedef {{ sessionId: string|null, date: string, timestamp: number, activityType?: string, durationMin?: number }} HistoryEntry
 */

/** Actividades libres disponibles */
export const FREE_ACTIVITIES = {
  FREE_EXERCISE: { id: 'FREE_EXERCISE', label: 'Ejercicio Libre', icon: '🏃', color: '#22c55e' },
  RUNNING:       { id: 'RUNNING',       label: 'Día de Correr',   icon: '👟', color: '#f97316' },
  ROWING:        { id: 'ROWING',        label: 'Día de Remo',     icon: '🚣', color: '#3b82f6' },
}

// ─── Persistencia ─────────────────────────────────────────────────────

/** Lee el historial de localStorage */
export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/** Guarda una entrada de sesión completada */
export function saveSessionToHistory(sessionId) {
  const history = getHistory()
  const now = Date.now()
  history.unshift({
    sessionId,
    date: new Date(now).toLocaleDateString('es-ES'),
    timestamp: now,
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

/**
 * Guarda una actividad libre (correr, remo, ejercicio libre) con su duración.
 * @param {string} activityType - ID de FREE_ACTIVITIES
 * @param {number} durationMin  - Duración en minutos
 */
export function saveFreeActivityToHistory(activityType, durationMin) {
  const history = getHistory()
  const now = Date.now()
  history.unshift({
    sessionId: null,
    activityType,
    durationMin,
    date: new Date(now).toLocaleDateString('es-ES'),
    timestamp: now,
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

/** Borra una entrada específica del historial por su timestamp */
export function deleteSessionFromHistory(timestamp) {
  const history = getHistory()
  const updated = history.filter(e => e.timestamp !== timestamp)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

// ─── Lógica de Sugerencias ─────────────────────────────────────────────

/** Devuelve las horas desde la última sesión de un tipo dado */
function hoursSinceLastSession(sessionId, history) {
  const entry = history.find(e => e.sessionId === sessionId)
  if (!entry) return Infinity
  return (Date.now() - entry.timestamp) / (1000 * 60 * 60)
}

/** Comprueba si hay solapamiento de grupos musculares en las últimas 48h */
function musclesRecentlyWorked(session, history) {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000
  const recentEntries = history.filter(e => e.timestamp > cutoff)

  const recentMuscles = new Set()
  for (const entry of recentEntries) {
    const groups = SESSION_MUSCLE_GROUPS[
      sessions.find(s => s.id === entry.sessionId)?.type
    ] ?? []
    groups.forEach(m => recentMuscles.add(m))
  }

  const sessionMuscles = SESSION_MUSCLE_GROUPS[session.type] ?? []
  return sessionMuscles.some(m => recentMuscles.has(m))
}

/**
 * Calcula una puntuación de idoneidad para cada sesión (0-100).
 * Criterios:
 *  - No repetir grupo muscular en <48h (-50 pts)
 *  - Seguir la progresión Inf→Cardio→Sup del documento (+30 pts)
 *  - Variedad (no repeir misma sesión que ayer) (+20 pts)
 *  - REHAB siempre disponible con puntuación neutra
 */
function scoreSession(session, history) {
  let score = 50 // base

  // Penalizar si los músculos se trabajaron recientemente
  if (musclesRecentlyWorked(session, history)) {
    score -= 50
  }

  // Penalizar si es exactamente la misma sesión de ayer
  const lastSession = history[0]
  if (lastSession?.sessionId === session.id) {
    score -= 25
  }

  // Premio por seguir la rotación canónica del doc
  // Rotación ideal: LOWER_BODY → HIIT_4X4 → UPPER_BODY → (repite)
  const rotationOrder = ['lower_body', 'hiit_4x4', 'upper_body']
  const lastRotIdx = lastSession
    ? rotationOrder.indexOf(lastSession.sessionId)
    : -1
  const expectedNext = rotationOrder[(lastRotIdx + 1) % rotationOrder.length]
  if (session.id === expectedNext) {
    score += 30
  }

  // Premio extra si han pasado >36h desde la última vez que se hizo
  if (hoursSinceLastSession(session.id, history) > 36) {
    score += 20
  }

  // REHAB tiene puntuación fija alta cuando hay dolor (se muestra siempre)
  if (session.type === 'REHAB') {
    score = Math.max(score, 40)
  }

  return score
}

/**
 * Devuelve las 3 mejores sesiones sugeridas para hoy,
 * ordenadas de mayor a menor idoneidad.
 */
export function getSuggestedSessions() {
  const history = getHistory()

  const scored = sessions.map(s => ({
    session: s,
    score: scoreSession(s, history),
  }))

  scored.sort((a, b) => b.score - a.score)

  // Devolver las 3 mejores (siempre incluye la mejor opción de recuperación)
  return scored.slice(0, 3).map(({ session }) => session)
}

/** Últimas N sesiones del historial (para mostrar en la UI) */
export function getRecentHistory(n = 5) {
  return getHistory().slice(0, n)
}

/**
 * Fusiona el historial local con uno remoto recibido vía P2P.
 * Elimina duplicados por timestamp exacto, ordena por fecha desc
 * y guarda el resultado en localStorage.
 * @param {HistoryEntry[]} remoteHistory - historial del otro dispositivo
 * @returns {HistoryEntry[]} historial fusionado
 */
export function mergeHistories(remoteHistory) {
  const local = getHistory()
  const combined = [...local, ...remoteHistory]

  // Deduplicar por timestamp (mismo instante = mismo registro)
  const seen = new Set()
  const merged = combined
    .filter(e => {
      if (seen.has(e.timestamp)) return false
      seen.add(e.timestamp)
      return true
    })
    .sort((a, b) => b.timestamp - a.timestamp) // más reciente primero

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  return merged
}
