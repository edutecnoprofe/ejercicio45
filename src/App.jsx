import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import './index.css'
import { generateDailyRoutine, motivationalPhrases } from './data/exercises'
import { useTimer } from './hooks/useTimer'
import { TimerRing } from './components/TimerRing'
import { SessionProgress } from './components/SessionProgress'

// Tipos de ejercicio → color del badge
const TYPE_BADGE = {
  CARDIO:   { label: 'Cardio',   color: '#FF5C00' },
  STRENGTH: { label: 'Fuerza',   color: '#00F0FF' },
  CORE:     { label: 'Core',     color: '#FFD700' },
  TENSION:  { label: 'Tensión',  color: '#A855F7' },
}

function App() {
  const [routine, setRoutine]         = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ytPlayer, setYtPlayer]       = useState(null)
  const [musicState, setMusicState]   = useState('Pausado')
  const [finished, setFinished]       = useState(false)

  const currentExercise = routine[currentIndex] ?? null
  const nextExercise    = routine[currentIndex + 1] ?? null

  const timerSeconds = currentExercise?.duration ?? 0
  const { secondsLeft, formatted, isRunning, isFinished: timerDone, toggle, reset } = useTimer(timerSeconds)

  // Generar rutina al montar
  useEffect(() => {
    setRoutine(generateDailyRoutine())
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Auto-avance cuando termina el temporizador
  useEffect(() => {
    if (timerDone) {
      const timeout = setTimeout(handleNext, 1500)
      return () => clearTimeout(timeout)
    }
  }, [timerDone])

  // Avanzar al siguiente ejercicio
  const handleNext = () => {
    if (currentIndex < routine.length - 1) {
      setCurrentIndex(i => i + 1)
      reset()
    } else {
      setFinished(true)
    }
  }

  // Controles YouTube
  const onPlayerReady    = (e) => setYtPlayer(e.target)
  const onStateChange    = (e) => {
    setMusicState(e.data === YouTube.PlayerState?.PLAYING ? 'Sonando' : 'Pausado')
  }
  const handleMusicToggle = () => {
    if (!ytPlayer) return
    ytPlayer.getPlayerState() === 1 ? ytPlayer.pauseVideo() : ytPlayer.playVideo()
  }

  const sendTestNotification = () => {
    const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Hora de entrenar!', {
        body: phrase,
        icon: '/favicon.svg'
      })
    } else {
      alert('Recordatorio de hoy:\n\n' + phrase)
    }
  }

  // ─── Pantalla de fin de sesión ──────────────────────────────────────
  if (finished) {
    return (
      <div className="app-layout app-layout--centered">
        <div className="glass-panel" style={{ textAlign:'center', maxWidth:600 }}>
          <div style={{ fontSize:'5rem', marginBottom:'1rem' }}>🏆</div>
          <h1 className="exercise-title">¡Sesión Completada!</h1>
          <p style={{ color:'var(--text-secondary)', margin:'1rem 0 2rem' }}>
            Has hecho {routine.length} ejercicios hoy. Descansa bien.
          </p>
          <button className="btn-massive btn-orange" onClick={() => { setCurrentIndex(0); setFinished(false); reset(); setRoutine(generateDailyRoutine()) }}>
            Nueva Sesión
          </button>
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return <div className="app-layout app-layout--centered"><p>Cargando rutina...</p></div>
  }

  const badge = TYPE_BADGE[currentExercise.type] ?? { label: currentExercise.type, color: '#fff' }

  return (
    <div className="app-layout">

      {/* YouTube oculto — reproduce la playlist de fondo */}
      <div style={{ position:'absolute', opacity:0, pointerEvents:'none', width:1, height:1, overflow:'hidden' }}>
        <YouTube
          opts={{ playerVars: { autoplay: 0, controls: 0 } }}
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

        {/* Imagen / placeholder del movimiento */}
        <div className="exercise-media-placeholder">
          <img
            src={`https://fakeimg.pl/800x500/180b06/${badge.color.replace('#','')}?text=${encodeURIComponent(currentExercise.name)}&font=bebas`}
            alt={`Ilustración de ${currentExercise.name}`}
            className="exercise-image"
          />
          <span className="media-hint">Ilustración del movimiento</span>
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
        />
      </div>

      {/* ── FILA INFERIOR IZQUIERDA: Botones de acción ─────────────── */}
      <div className="action-panel">
        {currentExercise.duration ? (
          <>
            <button className="btn-massive btn-orange" onClick={toggle}>
              {isRunning ? '⏸ PAUSA' : timerDone ? '✓ COMPLETADO' : '▶ INICIAR'}
            </button>
            <button className="btn-skip" onClick={handleNext}>
              Saltar ejercicio ⏭
            </button>
          </>
        ) : (
          <button className="btn-massive btn-orange" onClick={handleNext}>
            ✓ REPS COMPLETADAS
          </button>
        )}

        <button className="btn-notify" onClick={sendTestNotification}>
          🔔 Test recordatorio push
        </button>
      </div>

      {/* ── FILA INFERIOR DERECHA: Widget de Música ─────────────────── */}
      <div className="music-panel">
        <div className="music-widget glass-panel">
          <div className="music-info">
            <h4>Música de Fondo</h4>
            <p style={{ color:'var(--accent-cyan)' }}>YouTube · {musicState}</p>
          </div>
          <div className="music-controls">
            <button className="music-btn" onClick={() => ytPlayer?.previousVideo()}>⏮</button>
            <button className="music-btn music-btn--main" onClick={handleMusicToggle}>
              {musicState === 'Sonando' ? '⏸' : '▶'}
            </button>
            <button className="music-btn" onClick={() => ytPlayer?.nextVideo()}>⏭</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
