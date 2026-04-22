const fs = require('fs');

let lines = fs.readFileSync('src/data/sessions.js', 'utf8').split('\n');

const map = {
  'Marcha': '3666-rjiM4L3',
  'Prensa': '1512-qBcKorM',
  'Step-Up': '3214-RtyAsy1',
  'Extensión de Cuádriceps': '1760-yn8yg1r',
  'Curl Femoral': '1708-GxDwDX0',
  'Plancha': '0972-tZkGYZ9',
  'Elevación de Piernas': '0012-UGhRD1A',
  'Estiramientos de Piernas': '1709-yn0LjwL',
  'Calentamiento en Bicicleta': '2138-H1PESYI',
  'Intervalo': '2138-H1PESYI',
  'Recuperación': '2138-H1PESYI',
  'Enfriamiento': '1710-RQNVT10',
  'Spinning': '2138-H1PESYI',
  'Press de Pecho': '1293-O8o7q4d',
  'Jalón': '0861-fUBheHs',
  'Remo': '3144-Nu7jqFE',
  'Elevación Lateral': '0120-UDlhcO8',
  'Isométrica': '0979-9pa4H5m',
  'Cardio Zona': '2138-H1PESYI',
  'Pecho y Hombros': '3124-4x5Okof',
  'Elíptica': '3666-rjiM4L3',
  'Dislocaciones': '0979-9pa4H5m',
  'Movilidad': '0979-9pa4H5m',
  'Estiramientos Generales': '1710-RQNVT10'
};

let currentName = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('name:')) {
    currentName = lines[i];
  }
  if (lines[i].includes('image:')) {
    let foundHash = '1293-O8o7q4d'; // Default fallback
    for (const [k, v] of Object.entries(map)) {
      if (currentName.includes(k)) {
        foundHash = v;
        break;
      }
    }
    lines[i] = lines[i].replace(/image:\s*'.*?'/, 'image: \'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/' + foundHash + '.gif\'');
  }
}

fs.writeFileSync('src/data/sessions.js', lines.join('\n'));
