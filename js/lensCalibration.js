
export function createLensCalibrationOverlay(
  stage,
  config,
  viewer
) {
  const overlay = document.createElement('div');

  overlay.className = 'lens-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = `
    <span class="lens-dot lens-dot-left"></span>
    <span class="lens-dot lens-dot-right"></span>

    <div class="lens-ruler">
      <span class="lens-ruler-bar"></span>
      <span class="lens-ruler-caption">
        5 cm — mide con una regla real
      </span>
    </div>
  `;

  stage.append(overlay);

  const left = overlay.querySelector('.lens-dot-left');
  const right = overlay.querySelector('.lens-dot-right');
  const ruler = overlay.querySelector('.lens-ruler');

  function refresh() {
    const enabled = Boolean(config.lensEnabled);

    overlay.hidden = !enabled;

    if (!enabled) return;

    // Obtener los centros reales de las vistas.
    const layout = viewer.getEyeLayout();

    left.style.left = `${layout.left.center}px`;
    right.style.left = `${layout.right.center}px`;

    // Mostrar u ocultar los puntos.
    left.hidden = !config.showLensDots;
    right.hidden = !config.showLensDots;

    // Mostrar u ocultar la regla.
    ruler.hidden = !config.showLensRuler;

    ruler.style.width = `${config.rulerPixels}px`;
  }

  // Actualizar puntos cuando cambia el tamaño
  // de la pantalla o entra en modo Cardboard.
  const observer = new ResizeObserver(refresh);
  observer.observe(stage);

  refresh();

  return {
    refresh,

    dispose() {
      observer.disconnect();
      overlay.remove();
    },
  };
}
