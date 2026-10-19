
import GUI from 'lil-gui';

export function createCalibrationGUI(
  host,
  config,
  onChange
) {
  const gui = new GUI({
    container: host,
    width: 330,
    title: 'Ajustes SBS',
  });

  const controllers = [];

  const add = (parent, key, ...options) => {
    const controller = parent
      .add(config, key, ...options)
      .onChange(onChange);

    controllers.push(controller);
    return controller;
  };

  // ==========================================
  // CONTROLES ORIGINALES
  // ==========================================

  const stereo = gui.addFolder('Paralaje y tamaño');

  add(stereo, 'parallax', -100, 100, 1)
    .name('Paralaje (px)');

  add(stereo, 'scale', 40, 180, 1)
    .name('Escala (%)');

  stereo.open();

  const alignment = gui.addFolder('Alineación');

  add(alignment, 'panX', -160, 160, 1)
    .name('Mover X (px)');

  add(alignment, 'panY', -120, 120, 1)
    .name('Mover Y (px)');

  add(alignment, 'vertical', -50, 50, 1)
    .name('Desnivel L/R (px)');

  alignment.open();

  // ==========================================
  // NUEVO: AJUSTE INDIVIDUAL POR OJO
  // ==========================================

  const perEye = gui.addFolder(
    'Ajuste independiente por ojo'
  );

  add(perEye, 'leftPanX', -160, 160, 1)
    .name('Izquierdo X (px)');

  add(perEye, 'leftPanY', -120, 120, 1)
    .name('Izquierdo Y (px)');

  add(perEye, 'leftScale', 60, 160, 1)
    .name('Izquierdo escala (%)');

  add(perEye, 'rightPanX', -160, 160, 1)
    .name('Derecho X (px)');

  add(perEye, 'rightPanY', -120, 120, 1)
    .name('Derecho Y (px)');

  add(perEye, 'rightScale', 60, 160, 1)
    .name('Derecho escala (%)');

  // ==========================================
  // NUEVO: CALIBRACIÓN DE LENTES
  // ==========================================

  const lenses = gui.addFolder(
    'Distancia entre lentes'
  );

  add(lenses, 'lensEnabled')
    .name('Activar calibración');

  add(lenses, 'rulerPixels', 80, 380, 1)
    .name('Regla 5 cm (px)');

  add(lenses, 'lensDistanceMm', 50, 75, 1)
    .name('Entre lentes (mm)');

  add(lenses, 'showLensDots')
    .name('Mostrar puntos');

  add(lenses, 'showLensRuler')
    .name('Mostrar regla');

  lenses.open();

  // ==========================================
  // FORMATO ORIGINAL SBS
  // ==========================================

  const source = gui.addFolder('Formato SBS');

  add(source, 'format', {
    'Completo (Full-SBS)': 'full',
    'Comprimido (Half-SBS)': 'half',
  }).name('Tipo de SBS');

  add(source, 'swap')
    .name('Intercambiar L/R');

  source.open();

  return {
    gui,

    refresh() {
      controllers.forEach(controller =>
        controller.updateDisplay()
      );
    },

    dispose() {
      gui.destroy();
    },
  };
}
