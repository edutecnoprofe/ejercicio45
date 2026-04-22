/**
 * SyncScreen — Sincronización P2P bidireccional entre dispositivos
 *
 * Flujo:
 *  1. Al montar, crea un Peer con PeerJS (servidor público gratuito)
 *  2. Genera un QR con la URL de esta misma app + el Peer ID como param
 *  3. El otro dispositivo escanea el QR → la app arranca con ?peer=ID en la URL
 *  4. Ese dispositivo detecta el param y se conecta al peer que generó el QR
 *  5. Ambos intercambian su historial JSON
 *  6. Ambos ejecutan mergeHistories() y quedan sincronizados
 */

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { getHistory, mergeHistories } from '../data/sessionHistory'

// ─── Estados de la pantalla ──────────────────────────────────────────────────
const STATUS = {
  INIT:        'init',        // creando el peer
  WAITING:     'waiting',     // QR visible, esperando conexión del otro dispositivo
  CONNECTING:  'connecting',  // conexión entrante detectada
  SYNCING:     'syncing',     // intercambiando datos
  DONE:        'done',        // sync completada con éxito
  ERROR:       'error',       // algo falló
}

// Servidor de señalización PeerJS gratuito (0.peerjs.com es el oficial)
const PEER_CONFIG = {
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true,
  debug: 0,
}

export function SyncScreen({ onClose }) {
  const [status, setStatus]       = useState(STATUS.INIT)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [peerId, setPeerId]       = useState(null)
  const [mergedCount, setMergedCount] = useState(0)
  const [errorMsg, setErrorMsg]   = useState('')
  const [log, setLog]             = useState([])

  const peerRef = useState(null)   // useRef would be better but useState(null)[0] isn't reactive for cleanup
  const peerObj = useRef(null)
  const connRef = useRef(null)

  const addLog = (msg) => setLog(prev => [...prev.slice(-4), msg])

  // ─── Al montar: detectar si venimos de un QR (param ?peer=xxx) ───────────
  useEffect(() => {
    const url     = new URL(window.location.href)
    const remotId = url.searchParams.get('peer')

    if (remotId) {
      // Este dispositivo escaneó el QR → debe conectarse al peer remoto
      initPeerAndConnect(remotId)
    } else {
      // Este dispositivo generó el QR → espera conexión entrante
      initPeerAndWait()
    }

    return () => {
      // Limpieza al desmontar
      if (peerObj.current && !peerObj.current.destroyed) {
        peerObj.current.destroy()
      }
      // Limpiar el param de la URL sin recargar la página
      const clean = new URL(window.location.href)
      clean.searchParams.delete('peer')
      window.history.replaceState({}, '', clean.toString())
    }
  }, [])

  // ─── Modo HOST: genera el peer, espera conexión ──────────────────────────
  async function initPeerAndWait() {
    setStatus(STATUS.INIT)
    addLog('Iniciando peer...')

    try {
      const { Peer } = await import('peerjs')
      const peer = new Peer(undefined, PEER_CONFIG)
      peerObj.current = peer

      peer.on('open', async (id) => {
        setPeerId(id)
        addLog('Peer listo. Generando QR...')

        // Construir la URL que el móvil abrirá al escanear
        const syncUrl = `${window.location.origin}${window.location.pathname}?peer=${id}`

        try {
          const dataUrl = await QRCode.toDataURL(syncUrl, {
            width: 280,
            margin: 2,
            color: { dark: '#06080F', light: '#F0F4FF' },
            errorCorrectionLevel: 'M',
          })
          setQrDataUrl(dataUrl)
          setStatus(STATUS.WAITING)
          addLog('QR generado. Esperando al otro dispositivo...')
        } catch (err) {
          setStatus(STATUS.ERROR)
          setErrorMsg('No se pudo generar el QR: ' + err.message)
        }
      })

      peer.on('connection', (conn) => {
        connRef.current = conn
        setStatus(STATUS.CONNECTING)
        addLog('Dispositivo conectado. Sincronizando...')
        handleConnection(conn)
      })

      peer.on('error', (err) => {
        setStatus(STATUS.ERROR)
        setErrorMsg('Error de red: ' + err.type)
        addLog('❌ ' + err.type)
      })

    } catch (err) {
      setStatus(STATUS.ERROR)
      setErrorMsg('Error al cargar PeerJS: ' + err.message)
    }
  }

  // ─── Modo GUEST: conecta al peer que generó el QR ───────────────────────
  async function initPeerAndConnect(remoteId) {
    setStatus(STATUS.INIT)
    addLog('Conectando con el otro dispositivo...')

    try {
      const { Peer } = await import('peerjs')
      const peer = new Peer(undefined, PEER_CONFIG)
      peerObj.current = peer

      peer.on('open', () => {
        addLog('Enlazando...')
        const conn = peer.connect(remoteId, { reliable: true })
        connRef.current = conn
        setStatus(STATUS.CONNECTING)
        handleConnection(conn)
      })

      peer.on('error', (err) => {
        setStatus(STATUS.ERROR)
        setErrorMsg('Error de conexión: ' + err.type)
        addLog('❌ ' + err.type)
      })

    } catch (err) {
      setStatus(STATUS.ERROR)
      setErrorMsg('Error al cargar PeerJS: ' + err.message)
    }
  }

  // ─── Protocolo de intercambio de historial ────────────────────────────────
  function handleConnection(conn) {
    conn.on('open', () => {
      setStatus(STATUS.SYNCING)
      addLog('Conexión abierta. Enviando historial...')
      // Enviar historial local al otro peer
      conn.send({ type: 'HISTORY_SYNC', history: getHistory() })
    })

    conn.on('data', (data) => {
      if (data?.type === 'HISTORY_SYNC') {
        addLog(`Recibidos ${data.history.length} registros remotos.`)
        const merged = mergeHistories(data.history)
        setMergedCount(merged.length)
        setStatus(STATUS.DONE)
        addLog(`✅ Sync completada. ${merged.length} sesiones en total.`)

        // Confirmar al otro dispositivo
        conn.send({ type: 'HISTORY_ACK', total: merged.length })
      }
      if (data?.type === 'HISTORY_ACK') {
        addLog(`✅ El otro dispositivo confirmó: ${data.total} sesiones.`)
        if (status !== STATUS.DONE) setStatus(STATUS.DONE)
      }
    })

    conn.on('error', (err) => {
      setStatus(STATUS.ERROR)
      setErrorMsg('Error en la conexión: ' + err.message)
    })

    conn.on('close', () => {
      if (status !== STATUS.DONE) {
        setStatus(STATUS.ERROR)
        setErrorMsg('La conexión se cerró inesperadamente.')
      }
    })
  }

  // ─── Reintentar ──────────────────────────────────────────────────────────
  function handleRetry() {
    if (peerObj.current && !peerObj.current.destroyed) {
      peerObj.current.destroy()
    }
    setLog([])
    setQrDataUrl(null)
    setPeerId(null)
    setErrorMsg('')
    initPeerAndWait()
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="sync-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sync-panel glass-panel">

        {/* Header */}
        <div className="sync-header">
          <div className="sync-icon">🔄</div>
          <h2 className="sync-title">Sincronizar Dispositivos</h2>
          <p className="sync-subtitle">
            {status === STATUS.WAITING
              ? 'Escanea el QR con el otro dispositivo'
              : status === STATUS.DONE
              ? '¡Historial sincronizado!'
              : status === STATUS.ERROR
              ? 'Algo salió mal'
              : 'Estableciendo conexión...'}
          </p>
          <button className="sync-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Contenido principal según estado */}
        <div className="sync-body">

          {/* QR Code */}
          {status === STATUS.WAITING && qrDataUrl && (
            <div className="sync-qr-wrapper">
              <img
                src={qrDataUrl}
                alt="QR de sincronización"
                className="sync-qr"
              />
              <p className="sync-qr-hint">
                📱 Abre la app en el otro dispositivo<br/>
                y escanea este código
              </p>
              <div className="sync-peer-id">
                <span>ID: </span>
                <code>{peerId?.slice(0, 12)}…</code>
              </div>
            </div>
          )}

          {/* Spinner estados intermedios */}
          {(status === STATUS.INIT || status === STATUS.CONNECTING || status === STATUS.SYNCING) && (
            <div className="sync-spinner-wrapper">
              <div className="sync-spinner" />
              <p className="sync-spinner-label">
                {status === STATUS.INIT       && 'Iniciando...'}
                {status === STATUS.CONNECTING && 'Conectando...'}
                {status === STATUS.SYNCING    && 'Sincronizando datos...'}
              </p>
            </div>
          )}

          {/* Éxito */}
          {status === STATUS.DONE && (
            <div className="sync-done">
              <div className="sync-done-icon">✅</div>
              <p className="sync-done-text">
                Historial fusionado correctamente
              </p>
              <p className="sync-done-count">
                <strong>{mergedCount}</strong> sesiones en total
              </p>
              <button className="btn-massive btn-orange" style={{ marginTop: '1.5rem' }} onClick={onClose}>
                Continuar →
              </button>
            </div>
          )}

          {/* Error */}
          {status === STATUS.ERROR && (
            <div className="sync-error">
              <div className="sync-error-icon">⚠️</div>
              <p className="sync-error-text">{errorMsg}</p>
              <div className="sync-error-actions">
                <button className="btn-massive btn-orange" onClick={handleRetry}>
                  Reintentar
                </button>
                <button className="btn-skip" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Log de actividad */}
          <div className="sync-log">
            {log.map((line, i) => (
              <span key={i} className="sync-log-line">{line}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
