import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import './index.css'
import { motivationalPhrases } from './data/exercises'
import { saveSessionToHistory } from './data/sessionHistory'
import { useTimer } from './hooks/useTimer'
import { TimerRing } from './components/TimerRing'
import { SessionProgress } from './components/SessionProgress'
import { SessionSelector } from './components/SessionSelector'
import { ExercisePreview } from './components/ExercisePreview'

// Tipos de ejercicio → color del badge
const TYPE_BADGE = {
  CARDIO:   { label: 'Cardio',   color: '#FF5C00' },
  STRENGTH: { label: 'Fuerza',   color: '#00F0FF' },
  CORE:     { label: 'Core',     color: '#FFD700' },
  TENSION:  { label: 'Tensión',  color: '#A855F7' },
}

// Estados del flujo de pantallas
const SCREEN = {
  SELECT:   'SELECT',    // selección de sesión
  PREVIEW:  'PREVIEW',   // vista previa de ejercicios
  WORKOUT:  'WORKOUT',   // sesión en curso
  FINISHED: 'FINISHED',  // sesión completada
}

function App() {
  const [screen, setScreen]             = useState(SCREEN.SELECT)
  const [selectedSession, setSelectedSession] = useState(null)
  const [routine, setRoutine]           = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ytPlayer, setYtPlayer]         = useState(null)
  const [musicState, setMusicState]     = useState('Pausado')
  const [noMusic, setNoMusic]           = useState(false)

  const currentExercise = routine[currentIndex] ?? null
  const nextExercise    = routine[currentIndex + 1] ?? null

  const timerSeconds = currentExercise?.duration ?? 0
  const { secondsLeft, formatted, isRunning, isFinished: timerDone, toggle, reset } = useTimer(timerSeconds)

  // Solicitar permisos de notificación al arrancar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Auto-avance cuando termina el temporizador
  useEffect(() => {
    if (timerDone && screen === SCREEN.WORKOUT) {
      const timeout = setTimeout(handleNext, 1500)
      return () => clearTimeout(timeout)
    }
  }, [timerDone, screen])

  // Pausar música si marca "Sin música"
  useEffect(() => {
    if (noMusic && ytPlayer?.getPlayerState() === 1) {
      ytPlayer.pauseVideo()
    }
  }, [noMusic, ytPlayer])

  // ─── Handlers de flujo ──────────────────────────────────────────────

  /** Usuario elige una sesión en el selector */
  const handleSessionSelect = (session) => {
    setSelectedSession(session)
    setScreen(SCREEN.PREVIEW)
  }

  /** Usuario confirma desde la vista previa → inicia la sesión */
  const handleSessionConfirm = () => {
    setRoutine(selectedSession.exercises)
    setCurrentIndex(0)
    reset()
    setScreen(SCREEN.WORKOUT)
  }

  /** Vuelve del preview al selector */
  const handleBackToSelector = () => {
    setSelectedSession(null)
    setScreen(SCREEN.SELECT)
  }

  /** Avanzar al siguiente ejercicio */
  const handleNext = () => {
    if (currentIndex < routine.length - 1) {
      setCurrentIndex(i => i + 1)
      reset()
    } else {
      // Guardar en historial al completar
      if (selectedSession) {
        saveSessionToHistory(selectedSession.id)
      }
      setScreen(SCREEN.FINISHED)
    }
  }

  /** Nueva sesión → vuelve al selector */
  const handleNewSession = () => {
    setSelectedSession(null)
    setRoutine([])
    setCurrentIndex(0)
    reset()
    setScreen(SCREEN.SELECT)
  }

  // ─── Controles YouTube ───────────────────────────────────────────────
  const onPlayerReady    = (e) => {
    const player = e.target
    player.setShuffle(true)
    setYtPlayer(player)
  }
  const onStateChange    = (e) => {
    setMusicState(e.data === YouTube.PlayerState?.PLAYING ? 'Sonando' : 'Pausado')
  }
  const handleMusicToggle = () => {
    if (!ytPlayer) return
    if (noMusic) setNoMusic(false)
    ytPlayer.getPlayerState() === 1 ? ytPlayer.pauseVideo() : ytPlayer.playVideo()
  }

  /** Toggle temporizador + sincroniza música */
  const handleToggle = () => {
    const willRun = !isRunning
    toggle()
    if (ytPlayer && !noMusic) {
      willRun ? ytPlayer.playVideo() : ytPlayer.pauseVideo()
    }
  }

  const handleRepsComplete = () => {
    if (ytPlayer && !noMusic) {
      const state = ytPlayer.getPlayerState()
      if (state !== 1) ytPlayer.playVideo()
    }
    handleNext()
  }

  const sendTestNotification = () => {
    const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Hora de entrenar!', { body: phrase, icon: '/favicon.svg' })
    } else {
      alert('Recordatorio de hoy:\n\n' + phrase)
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // PANTALLA 1: Selección de sesión
  // ═══════════════════════════════════════════════════════════════════
  if (screen === SCREEN.SELECT) {
    return <SessionSelector onSelect={handleSessionSelect} />
  }

  // ═══════════════════════════════════════════════════════════════════
  // PANTALLA 2: Vista previa de ejercicios
  // ═══════════════════════════════════════════════════════════════════
  if (screen === SCREEN.PREVIEW && selectedSession) {
    return (
      <ExercisePreview
        session={selectedSession}
        onConfirm={handleSessionConfirm}
        onBack={handleBackToSelector}
      />
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // PANTALLA 3: Sesión completada
  // ═══════════════════════════════════════════════════════════════════
  if (screen === SCREEN.FINISHED) {
    return (
      <div className="app-layout app-layout--centered">
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
          <h1 className="exercise-title">¡Sesión Completada!</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 0.5rem' }}>
            {selectedSession?.icon} {selectedSession?.name}
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 2rem' }}>
            Has hecho {routine.length} ejercicios. ¡Descansa bien y come proteína!
          </p>
          <button
            id="btn-new-session"
            className="btn-massive btn-orange"
            onClick={handleNewSession}
          >
            Nueva Sesión
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // PANTALLA 4 (SCREEN.WORKOUT): Sesión en curso — layout original
  // ═══════════════════════════════════════════════════════════════════
  if (!currentExercise) {
    return <div className="app-layout app-layout--centered"><p>Cargando rutina...</p></div>
  }

  const badge = TYPE_BADGE[currentExercise.type] ?? { label: currentExercise.type, color: '#fff' }

  return (
    <div className="app-layout">

      {/* YouTube oculto — reproduce la playlist de fondo */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, overflow: 'hidden' }}>
        <YouTube
          opts={{
            playerVars: {
              autoplay: 0,
              controls: 0,
              listType: 'playlist',
              list: 'RDTMAK5uy_mVNeBBFwty5UdrYVbVfr9rb8E2KJYKkFE'
            }
          }}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>

      {/* ── COLUMNA IZQUIERDA: Info del ejercicio ──────────────────── */}
      <div className="glass-panel exercise-panel">

        {/* Barra de progreso de sesión */}
        <SessionProgress routine={routine} currentIndex={currentIndex} />

        {/* Badge de tipo */}
        <span className="type-badge" style={{ '--badge-color': badge.color }}>
          {badge.label} · {currentExercise.equipment}
        </span>

        <h1 className="exercise-title">{currentExercise.name}</h1>

        {currentExercise.notes && (
          <p className="exercise-notes">{currentExercise.notes}</p>
        )}

        <div className="exercise-media-placeholder" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <img
            src={currentExercise.image || `https://dummyimage.com/800x500/180b06/${badge.color.replace('#', '')}&text=${encodeURIComponent(currentExercise.name)}`}
            alt={`Ilustración de ${currentExercise.name}`}
            className="exercise-image"
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
        </div>

        <p className="next-exercise">
          {nextExercise ? `▶ Siguiente: ${nextExercise.name}` : '¡Último ejercicio de la sesión!'}
        </p>
      </div>

      {/* ── COLUMNA DERECHA: Reloj ─────────────────────────────────── */}
      <div className="timer-panel">
        <TimerRing
          secondsLeft={currentExercise.duration ? secondsLeft : currentExercise.reps}
          totalSeconds={currentExercise.duration ?? currentExercise.reps}
          formatted={currentExercise.duration ? formatted : `${currentExercise.reps}`}
          label={currentExercise.duration ? 'Tiempo' : 'Reps'}
          isRunning={isRunning}
          onClick={currentExercise.duration ? handleToggle : handleRepsComplete}
        />
      </div>

      {/* ── FILA INFERIOR IZQUIERDA: Botones de acción ─────────────── */}
      <div className="action-panel">
        {currentExercise.duration ? (
          <>
            <button className="btn-massive btn-orange" onClick={handleToggle}>
              {isRunning ? '⏸ PAUSA' : timerDone ? '✓ COMPLETADO' : '▶ INICIAR'}
            </button>
            <button className="btn-skip" onClick={handleNext}>
              Saltar ejercicio ⏭
            </button>
          </>
        ) : (
          <button className="btn-massive btn-orange" onClick={handleRepsComplete}>
            ✓ REPS COMPLETADAS
          </button>
        )}

        {/* Botón volver al selector desde dentro de la sesión */}
        <button className="btn-back-workout" onClick={handleBackToSelector}>
          ← Cambiar sesión
        </button>

        <button className="btn-notify" onClick={sendTestNotification}>
          🔔 Test recordatorio push
        </button>
      </div>

      {/* ── FILA INFERIOR DERECHA: Widget de Música ─────────────────── */}
      <div className="music-panel">
        <div className="music-widget glass-panel">
          <div className="music-info">
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Música de Fondo</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <p style={{ color: 'var(--accent-cyan)', margin: 0 }}>YouTube · {musicState}</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <input 
                  type="checkbox" 
                  checked={noMusic} 
                  onChange={(e) => setNoMusic(e.target.checked)} 
                />
                Sin música
              </label>
            </div>
          </div>
          <div className="music-controls" style={{ opacity: noMusic ? 0.3 : 1, pointerEvents: noMusic ? 'none' : 'auto' }}>
            <button className="music-btn" onClick={() => ytPlayer?.previousVideo()} disabled={noMusic}>⏮</button>
            <button className="music-btn music-btn--main" onClick={handleMusicToggle} disabled={noMusic}>
              {musicState === 'Sonando' ? '⏸' : '▶'}
            </button>
            <button className="music-btn" onClick={() => ytPlayer?.nextVideo()} disabled={noMusic}>⏭</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
