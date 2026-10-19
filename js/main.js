
import { createStereoViewer, DEFAULT_CONFIG } from './viewer.js';
import { createCalibrationGUI } from './controls.js';
import { loadSbsImage } from './fileLoader.js';
import { createImmersiveMode, showToast } from './ui.js';

// NUEVO: controles táctiles para celular.
import { enableTouchCalibration } from './touchGestures.js';

const config = { ...DEFAULT_CONFIG };
const stage = document.getElementById('viewerStage');
const info = document.getElementById('imageStatus');
const dimensions = document.getElementById('imageDimensions');
const emptyState = document.getElementById('emptyState');
const fileInput = document.getElementById('fileInput');

const demoButtons = [
  document.getElementById('demoOneBtn'),
  document.getElementById('demoTwoBtn')
];

let requestCounter = 0;
let viewer;

// ============================================
// INICIALIZAR VISOR THREE.JS
// ============================================

try {
  viewer = createStereoViewer(stage, config);
} catch (error) {
  emptyState.hidden = false;

  emptyState.querySelector('strong').textContent =
    'No se pudo iniciar WebGL';

  emptyState.querySelector('span').textContent =
    'Prueba Chrome o Safari actualizado con aceleración gráfica activada.';

  info.textContent = `Error: ${error.message}`;

  throw error;
}

// ============================================
// PANEL DE CALIBRACIÓN EXISTENTE
// ============================================

const calibration = createCalibrationGUI(
  document.getElementById('guiHost'),
  config,
  () => viewer.update()
);

// ============================================
// MODO CARDBOARD EXISTENTE
// ============================================

createImmersiveMode(() => viewer.resize());

// ============================================
// NUEVO: CALIBRACIÓN TÁCTIL
// ============================================

// Permite:
// - Arrastrar con un dedo para mover la imagen.
// - Pellizcar con dos dedos para hacer zoom.
// - Deslizar dos dedos para ajustar paralaje.
// - Sincronizar los valores con lil-gui.
//
// No modifica los controles existentes ni
// interfiere con el modo Cardboard.

enableTouchCalibration(
  stage,
  config,
  viewer,
  calibration
);

// ============================================
// RESTABLECER CALIBRACIÓN
// ============================================

function resetCalibration() {
  Object.assign(config, DEFAULT_CONFIG);

  calibration.refresh();
  viewer.update();

  showToast('Calibración restablecida.');
}

// ============================================
// CARGAR Y MOSTRAR IMÁGENES SBS
// ============================================

async function displaySource(source, selectedDemo = -1) {
  const requestId = ++requestCounter;

  info.textContent = 'Cargando fotografía…';

  try {
    const { image, name } = await loadSbsImage(source);

    // Ignorar el resultado de una carga anterior.
    if (requestId !== requestCounter) return;

    const { width, height } = viewer.setImage(image, name);

    emptyState.hidden = true;

    info.textContent = name;
    dimensions.textContent = `${width} × ${height} px`;

    demoButtons.forEach((button, index) => {
      button.classList.toggle(
        'active',
        selectedDemo === index
      );
    });

    if (width % 2 !== 0) {
      showToast(
        'Imagen cargada. Se recomienda un ancho par para SBS.'
      );
    } else {
      showToast(`Imagen cargada: ${name}`);
    }

  } catch (error) {
    if (requestId !== requestCounter) return;

    info.textContent =
      viewer.getImageInfo()?.name || 'Sin imagen';

    showToast(
      error.message ||
      'Ocurrió un problema al cargar la fotografía.'
    );

    if (!viewer.getImageInfo()) {
      emptyState.hidden = false;
    }
  }
}

// ============================================
// CARGAR IMAGEN DESDE EL DISPOSITIVO
// ============================================

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];

  if (file) {
    displaySource(file);
  }

  // Permitir seleccionar dos veces el mismo archivo.
  fileInput.value = '';
});

// ============================================
// IMÁGENES DE DEMOSTRACIÓN
// ============================================

demoButtons[0].addEventListener('click', () => {
  displaySource('./assets/images/demo-sbs-1.jpg', 0);
});

demoButtons[1].addEventListener('click', () => {
  displaySource('./assets/images/demo-sbs-2.jpg', 1);
});

// ============================================
// BOTÓN RESTABLECER
// ============================================

document
  .getElementById('resetBtn')
  .addEventListener('click', resetCalibration);

// ============================================
// GUARDAR CALIBRACIÓN EN JSON
// ============================================

document.getElementById('saveBtn').addEventListener('click', () => {
  const payload = {
    proyecto: 'StereoLab / Three.js',
    imagen: viewer.getImageInfo(),
    calibracion: { ...config },
    fecha: new Date().toISOString(),
    nota: 'Estos ajustes no modifican el archivo de imagen original.',
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    { type: 'application/json' }
  );

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = 'calibracion-sbs.json';

  document.body.append(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showToast('Ajustes descargados como JSON.');
});

// ============================================
// ARRASTRAR Y SOLTAR ARCHIVOS DESDE PC
// ============================================

function dragOver(event) {
  event.preventDefault();
  stage.classList.add('drag-over');
}

function dragLeave() {
  stage.classList.remove('drag-over');
}

stage.addEventListener('dragover', dragOver);
stage.addEventListener('dragleave', dragLeave);

stage.addEventListener('drop', (event) => {
  event.preventDefault();
  dragLeave();

  const file = event.dataTransfer?.files?.[0];

  if (file) {
    displaySource(file);
  }
});

// ============================================
// CARGAR IMAGEN INICIAL
// ============================================

// Se precarga una fotografía para que el visor
// no aparezca vacío al abrir la aplicación.

displaySource('./assets/images/demo-sbs-1.jpg', 0);
