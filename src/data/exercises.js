// Catálogo de Ejercicios y Máquinas
export const equipment = {
  CARDIO: ['Cinta', 'Bicicleta', 'Remo'],
  STRENGTH: ['Mancuernas', 'Pesas Rusas', 'Barra'],
  CORE: ['Banco Plano'],
  TENSION: ['Cintas Elásticas', 'Anillas en Suspensión']
};

export const exercises = [
  // CARDIO
  { id: 'c1', name: 'Marcha Rápida (Cinta)', type: 'CARDIO', equipment: 'Cinta', duration: 300, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3666-rjiM4L3.gif' }, // 5 mins
  { id: 'c2', name: 'Spinning Intervalos', type: 'CARDIO', equipment: 'Bicicleta', duration: 300, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2138-H1PESYI.gif' },
  { id: 'c3', name: 'Remo Fuerte', type: 'CARDIO', equipment: 'Remo', duration: 300, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0861-fUBheHs.gif' },

  // STRENGTH
  { id: 's1', name: 'Press de Pecho', type: 'STRENGTH', equipment: 'Mancuernas', reps: 15, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1293-O8o7q4d.gif' },
  { id: 's2', name: 'Sentadilla Goblet', type: 'STRENGTH', equipment: 'Pesas Rusas', reps: 15, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1760-yn8yg1r.gif' },
  { id: 's3', name: 'Peso Muerto Rumano', type: 'STRENGTH', equipment: 'Barra', reps: 12, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0085-wQ2c4XD.gif' },
  { id: 's4', name: 'Curl de Bíceps', type: 'STRENGTH', equipment: 'Mancuernas', reps: 12, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1651-1VpF8db.gif' },
  { id: 's5', name: 'Remo al Mentón', type: 'STRENGTH', equipment: 'Pesas Rusas', reps: 12, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0120-UDlhcO8.gif' },

  // CORE
  { id: 'co1', name: 'Crunch Abdominal', type: 'CORE', equipment: 'Banco Plano', reps: 20, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif' },
  { id: 'co2', name: 'Elevación de Piernas', type: 'CORE', equipment: 'Banco Plano', reps: 15, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0012-UGhRD1A.gif' },

  // TENSION
  { id: 't1', name: 'Aperturas Pecho Elásticas', type: 'TENSION', equipment: 'Cintas Elásticas', reps: 15, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3124-4x5Okof.gif' },
  { id: 't2', name: 'Remo Suspensión Estático', type: 'TENSION', equipment: 'Anillas en Suspensión', duration: 45, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3144-Nu7jqFE.gif' }, // Mantener 45s
  { id: 't3', name: 'Dislocaciones de Hombro', type: 'TENSION', equipment: 'Cintas Elásticas', reps: 10, image: 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif' }
];

// Base estática en lugar de API externa
export const motivationalPhrases = [
  "Sé que el día fue largo, pero 15 minutitos en la cinta te van a dejar nuevo. ¡Venga!",
  "El remo te está llamando... es hora de descargar la tensión de hoy.",
  "¿Saltamos a la bici 10 minutos y vemos un vídeo de YouTube? Te sentirás mucho mejor.",
  "Las pesas te echan de menos. Sólo un par de series de fuerza para no perder el hábito.",
  "Un rato de tensión y estiramientos te quitará ese dolor de espalda. ¡Levántate y vamos a ello!"
];

export function generateDailyRoutine() {
  const randomC = equipment.CARDIO[Math.floor(Math.random() * equipment.CARDIO.length)];
  const cardioStart = exercises.find(e => e.type === 'CARDIO' && e.equipment === randomC);
  
  const strengthExercises = exercises.filter(e => e.type === 'STRENGTH').sort(() => 0.5 - Math.random()).slice(0, 3);
  const coreExercise = exercises.find(e => e.type === 'CORE');
  const tensionExercise = exercises.find(e => e.type === 'TENSION');

  return [cardioStart, ...strengthExercises, coreExercise, tensionExercise];
}
