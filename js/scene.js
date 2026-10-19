
import * as THREE from 'three';

export function calculateEyeLayout(width, height, separation = null) {
  const w = Math.max(1, width);
  const h = Math.max(1, height);

  // Modo original: dos mitades iguales.
  if (separation == null) {
    const leftWidth = Math.floor(w / 2);
    return {
      left: {
        x: 0,
        width: leftWidth,
        center: leftWidth / 2,
      },
      right: {
        x: leftWidth,
        width: w - leftWidth,
        center: leftWidth + (w - leftWidth) / 2,
      },
      height: h,
    };
  }

  // Evitar que las vistas se superpongan.
  const distance = Math.max(
    2,
    Math.min(Number(separation) || 2, w - 2)
  );

  const eyeWidth = Math.max(
    1,
    Math.floor(Math.min(w / 2, distance, w - distance))
  );

  const leftCenter = (w - distance) / 2;
  const rightCenter = (w + distance) / 2;

  const leftX = Math.max(
    0,
    Math.round(leftCenter - eyeWidth / 2)
  );

  const rightX = Math.min(
    w - eyeWidth,
    Math.round(rightCenter - eyeWidth / 2)
  );

  return {
    left: {
      x: leftX,
      width: eyeWidth,
      center: leftX + eyeWidth / 2,
    },
    right: {
      x: rightX,
      width: eyeWidth,
      center: rightX + eyeWidth / 2,
    },
    height: h,
  };
}

export function createStereoScene(stage) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );
  renderer.setClearColor('#060d19', 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.prepend(renderer.domElement);

  const sceneLeft = new THREE.Scene();
  const sceneRight = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -1, 1, 1, -1, 0.1, 10
  );
  camera.position.z = 5;

  let width = 0;
  let height = 0;
  let separation = null;
  let scheduled = false;
  let resizeListener = null;
  let destroyed = false;

  function getSize() {
    return { width, height };
  }

  function getEyeLayout() {
    return calculateEyeLayout(width, height, separation);
  }

  function setEyeSeparation(value) {
    separation = value == null ? null : value;
    requestRender();
  }

  function render() {
    if (destroyed || !width || !height) return;

    const layout = getEyeLayout();

    // Limpiar toda la pantalla, incluidos los espacios
    // que puedan existir entre las dos vistas.
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, width, height);
    renderer.clear();

    renderer.setScissorTest(true);

    for (const [viewport, scene] of [
      [layout.left, sceneLeft],
      [layout.right, sceneRight],
    ]) {
      const aspect = viewport.width / height;

      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      renderer.setViewport(
        viewport.x, 0, viewport.width, height
      );

      renderer.setScissor(
        viewport.x, 0, viewport.width, height
      );

      renderer.render(scene, camera);
    }

    renderer.setScissorTest(false);
  }

  function requestRender() {
    if (scheduled || destroyed) return;

    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  }

  function resize() {
    if (destroyed) return;

    const rect = stage.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));

    if (w !== width || h !== height) {
      width = w;
      height = h;

      renderer.setSize(width, height, false);
      resizeListener?.();
    }

    requestRender();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(stage);

  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);

  resize();

  return {
    sceneLeft,
    sceneRight,
    getSize,
    getEyeLayout,
    setEyeSeparation,
    requestRender,
    resize,

    onResize(callback) {
      resizeListener = callback;
      callback();
    },

    dispose() {
      destroyed = true;
      observer.disconnect();

      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);

      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
