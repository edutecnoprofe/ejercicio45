/**
 * Catálogo de Sesiones de Entrenamiento
 * Basado en: "Programa Ejercicio Hombre 45 edad.md"
 *
 * 3 tipos principales según la programación semanal del documento:
 *   - Día 1: Tren Inferior + Core  (fuerza piernas, anti-sarcopenia)
 *   - Día 2: Cardio HIIT 4x4       (VO₂max, longevidad cardiovascular)
 *   - Día 3: Tren Superior Mod.    (pecho/espalda con agarre neutro por tidinosis codo)
 * Bonus:
 *   - Rehabilitación + Cardio Suave (para días de dolor moderado EVA 3-5)
 */

export const SESSION_TYPES = {
  LOWER_BODY: 'LOWER_BODY',
  HIIT_4X4:   'HIIT_4X4',
  UPPER_BODY:  'UPPER_BODY',
  REHAB:       'REHAB',
}

// Grupos musculares de cada sesión (para calcular descanso)
export const SESSION_MUSCLE_GROUPS = {
  LOWER_BODY: ['piernas', 'glúteos', 'core'],
  HIIT_4X4:   ['cardiovascular', 'core'],
  UPPER_BODY:  ['pecho', 'espalda', 'hombros', 'bíceps'],
  REHAB:       ['codo', 'movilidad', 'cardiovascular'],
}

export const sessions = [
  // ───────────────────────────────────────────────────────────────────
  // SESIÓN 1 · Tren Inferior + Core
  // Fuente doc: Día 1 - 40' Fuerza Tren Inferior y Core
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'lower_body',
    type: SESSION_TYPES.LOWER_BODY,
    name: 'Piernas & Core',
    shortDesc: 'Fuerza de tren inferior y estabilidad',
    durationLabel: '~55 min',
    durationMinutes: 55,
    icon: '🦵',
    accentColor: '#FF5C00',
    muscleGroups: SESSION_MUSCLE_GROUPS.LOWER_BODY,
    exercises: [
      // Calentamiento cardio
      {
        id: 'lb_warm1',
        name: 'Marcha Rápida (Calentamiento)',
        type: 'CARDIO',
        equipment: 'Cinta',
        duration: 600, // 10 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3666-rjiM4L3.gif',
        notes: '60% FCmáx. Ritmo cómodo para activar.',
      },
      // Piernas — máquinas sin carga en brazos
      {
        id: 'lb_s1',
        name: 'Prensa de Piernas',
        type: 'STRENGTH',
        equipment: 'Máquina',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1512-qBcKorM.gif',
        notes: 'RPE 7-8. Temp 3-0-3. Sin agarre de brazo.',
      },
      {
        id: 'lb_s2',
        name: 'Step-Ups (Subida al Cajón)',
        type: 'STRENGTH',
        equipment: 'Cajón',
        sets: 3, reps: 10,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3214-RtyAsy1.gif',
        notes: 'Peso corporal o chaleco lastrado. Sin mancuernas.',
      },
      {
        id: 'lb_s3',
        name: 'Extensión de Cuádriceps',
        type: 'STRENGTH',
        equipment: 'Máquina',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1760-yn8yg1r.gif',
        notes: 'Control en la bajada. Tempo lento.',
      },
      {
        id: 'lb_s4',
        name: 'Puente de Glúteo (En Suelo)',
        type: 'STRENGTH',
        equipment: 'Suelo',
        sets: 3, reps: 15,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0583-U59m137.gif',
        notes: 'Enfoque en isquiotibiales y glúteos. Sin carga en brazos.',
      },
      // Core — sobre antebrazos (sin extensión de muñeca)
      {
        id: 'lb_co1',
        name: 'Plancha sobre Antebrazos',
        type: 'CORE',
        equipment: 'Suelo',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif',
        notes: 'Sobre antebrazos para proteger el codo. 3 series.',
      },
      {
        id: 'lb_co2',
        name: 'Elevación de Piernas Colgado',
        type: 'CORE',
        equipment: 'Barra Dominadas',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0012-UGhRD1A.gif',
        notes: 'Agarre cómodo. Si molesta el codo, usa correas.',
      },
      // Vuelta a la calma
      {
        id: 'lb_cool',
        name: 'Estiramientos de Piernas',
        type: 'TENSION',
        equipment: 'Suelo',
        duration: 300, // 5 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1709-yn0LjwL.gif',
        notes: 'Isquios, cuádriceps, psoas. Respiración profunda.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // SESIÓN 2 · HIIT Noruego 4x4
  // Fuente doc: Día 2 - Protocolo Noruego 4x4 para VO₂max
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'hiit_4x4',
    type: SESSION_TYPES.HIIT_4X4,
    name: 'HIIT Noruego 4×4',
    shortDesc: 'Protocolo cardiovascular de alta intensidad',
    durationLabel: '~38 min',
    durationMinutes: 38,
    icon: '❤️',
    accentColor: '#FF2D55',
    muscleGroups: SESSION_MUSCLE_GROUPS.HIIT_4X4,
    exercises: [
      {
        id: 'h_warm',
        name: 'Calentamiento en Bicicleta',
        type: 'CARDIO',
        equipment: 'Bicicleta',
        duration: 600, // 10 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '60% FCmáx. Intensidad cómoda para activar el sistema.',
      },
      // 4 intervalos alternando alta intensidad y recuperación
      {
        id: 'h_int1', name: 'Intervalo Alta Intensidad #1',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 240, // 4 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '85-95% FCmáx. Imposible mantener conversación.',
      },
      {
        id: 'h_rec1', name: 'Recuperación Activa #1',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 180, // 3 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '70% FCmáx. Recuperar sin parar.',
      },
      {
        id: 'h_int2', name: 'Intervalo Alta Intensidad #2',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 240,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '85-95% FCmáx.',
      },
      {
        id: 'h_rec2', name: 'Recuperación Activa #2',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 180,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '70% FCmáx.',
      },
      {
        id: 'h_int3', name: 'Intervalo Alta Intensidad #3',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 240,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '85-95% FCmáx.',
      },
      {
        id: 'h_rec3', name: 'Recuperación Activa #3',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 180,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '70% FCmáx.',
      },
      {
        id: 'h_int4', name: 'Intervalo Alta Intensidad #4',
        type: 'CARDIO', equipment: 'Bicicleta / Elíptica',
        duration: 240,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: '85-95% FCmáx. ¡El último, dalo todo!',
      },
      {
        id: 'h_cool', name: 'Enfriamiento + Movilidad',
        type: 'TENSION', equipment: 'Suelo',
        duration: 300, // 5 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1710-RQNVT10.gif',
        notes: 'Bajar intensidad progresivamente. Respiración nasal.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // SESIÓN 3 · Tren Superior Adaptado (Codo de Tenista)
  // Fuente doc: Día 3 - 30' Fuerza Tren Superior (Modificada)
  //   - Siempre agarre neutro (palmas enfrentadas)
  //   - Tempo 3-0-3 para ser terapéutico con el tendón
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'upper_body',
    type: SESSION_TYPES.UPPER_BODY,
    name: 'Tren Superior Adaptado',
    shortDesc: 'Fuerza + Cardio Zona 2 · Agarre neutro para el codo',
    durationLabel: '~55 min',
    durationMinutes: 55,
    icon: '💪',
    accentColor: '#00F0FF',
    muscleGroups: SESSION_MUSCLE_GROUPS.UPPER_BODY,
    exercises: [
      {
        id: 'ub_warm',
        name: 'Spinning Suave (Calentamiento)',
        type: 'CARDIO',
        equipment: 'Bicicleta',
        duration: 600, // 10 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: 'Sin resistencia. Activa el sistema cardiovascular.',
      },
      // Pecho — mancuernas con agarre neutro
      {
        id: 'ub_s1',
        name: 'Press de Pecho con Mancuernas',
        type: 'STRENGTH',
        equipment: 'Mancuernas',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1293-O8o7q4d.gif',
        notes: '⚠️ Agarre neutro (palmas enfrentadas). Tempo 3-0-3.',
      },
      // Espalda — accesorio en V para evitar pronación
      {
        id: 'ub_s2',
        name: 'Jalón al Pecho (Agarre Neutro)',
        type: 'STRENGTH',
        equipment: 'Máquina Jalón',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0861-fUBheHs.gif',
        notes: '⚠️ Usa el accesorio en V o paralelo. Evita pronación.',
      },
      {
        id: 'ub_s3',
        name: 'Remo en Máquina (Apoyo de Pecho)',
        type: 'STRENGTH',
        equipment: 'Máquina Remo',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3144-Nu7jqFE.gif',
        notes: 'El apoyo de pecho estabiliza el tronco. Agarre neutro.',
      },
      // Hombros
      {
        id: 'ub_s4',
        name: 'Elevación Lateral (Codo Ligeramente Flexionado)',
        type: 'STRENGTH',
        equipment: 'Mancuernas',
        sets: 3, reps: 12,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0120-UDlhcO8.gif',
        notes: '⚠️ Ligera flexión del codo reduce el torque lateral.',
      },
      // Rehabilitación codo — isometría analgésica
      {
        id: 'ub_rehab',
        name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION',
        equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: '5 series × 45 seg al 70% de tu máximo. Reduce el dolor (EVA).',
      },
      // Cardio Zona 2 final
      {
        id: 'ub_z2',
        name: 'Cardio Zona 2 (Bicicleta)',
        type: 'CARDIO',
        equipment: 'Bicicleta',
        duration: 1200, // 20 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif',
        notes: 'Zona 2: puedes hablar sin jadear. Quema grasa activa.',
      },
      {
        id: 'ub_cool',
        name: 'Estiramientos de Pecho y Hombros',
        type: 'TENSION',
        equipment: 'Suelo',
        duration: 300,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3124-4x5Okof.gif',
        notes: 'Especial atención al antebrazo y zona del codo.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  // SESIÓN 4 · Rehabilitación + Cardio Suave
  // Para EVA 3-5 (dolor moderado de codo) o días de baja energía
  // Fuente doc: "EVA 3-5: protocolo 4x4 o tren inferior en máquinas"
  // ───────────────────────────────────────────────────────────────────
  {
    id: 'rehab',
    type: SESSION_TYPES.REHAB,
    name: 'Rehab + Cardio Suave',
    shortDesc: 'Isometría de codo y movilidad · Baja intensidad',
    durationLabel: '~45 min',
    durationMinutes: 45,
    icon: '🩹',
    accentColor: '#A855F7',
    muscleGroups: SESSION_MUSCLE_GROUPS.REHAB,
    exercises: [
      {
        id: 'rb_warm',
        name: 'Marcha Suave (Cinta)',
        type: 'CARDIO',
        equipment: 'Cinta',
        duration: 600,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3666-rjiM4L3.gif',
        notes: 'Ritmo muy cómodo. 60% FCmáx. Nada de correr.',
      },
      // Isometría codo (fase analgésica del documento)
      {
        id: 'rb_iso1',
        name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION',
        equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Serie 1/5. 70% del máximo. Reduce dolor cortical.',
      },
      {
        id: 'rb_iso2', name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION', equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Serie 2/5.',
      },
      {
        id: 'rb_iso3', name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION', equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Serie 3/5.',
      },
      {
        id: 'rb_iso4', name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION', equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Serie 4/5.',
      },
      {
        id: 'rb_iso5', name: 'Extensión de Muñeca Isométrica',
        type: 'TENSION', equipment: 'Sin Material',
        duration: 45,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Serie 5/5. ¡Ya tienes alivio de dolor!',
      },
      // Cardio sin brazo
      {
        id: 'rb_cardio',
        name: 'Elíptica (Sin Manos)',
        type: 'CARDIO',
        equipment: 'Elíptica',
        duration: 1200, // 20 min
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3666-rjiM4L3.gif',
        notes: 'Sin agarrar las barras. Brazos libres o cruzados.',
      },
      // Movilidad
      {
        id: 'rb_mob',
        name: 'Movilidad de Hombro y Antebrazo',
        type: 'TENSION',
        equipment: 'Cintas Elásticas',
        sets: 3, reps: 10,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif',
        notes: 'Dislocaciones con cinta. Rango de movimiento sin dolor.',
      },
      {
        id: 'rb_cool',
        name: 'Estiramientos Generales',
        type: 'TENSION',
        equipment: 'Suelo',
        duration: 300,
        image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1710-RQNVT10.gif',
        notes: 'Especial codo, antebrazo y zona lumbar.',
      },
    ],
  },
]

// ─── Utilidad: duración estimada de la sesión en minutos ─────────────
export function estimateSessionDuration(session) {
  const totalSeconds = session.exercises.reduce((acc, ex) => {
    if (ex.duration) return acc + ex.duration
    // Estima ~40s por rep + 60s de descanso entre series
    const sets = ex.sets ?? 1
    const reps = ex.reps ?? 0
    return acc + sets * (reps * 4 + 60)
  }, 0)
  return Math.round(totalSeconds / 60)
}
