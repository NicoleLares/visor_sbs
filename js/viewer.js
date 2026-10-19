
import * as THREE from 'three';
import { createStereoScene } from './scene.js';

export const DEFAULT_CONFIG = Object.freeze({
  // Configuración original
  parallax: 0,
  scale: 100,
  panX: 0,
  panY: 0,
  vertical: 0,
  format: 'full',
  swap: false,

  // NUEVO: calibración independiente
  leftPanX: 0,
  leftPanY: 0,
  leftScale: 100,

  rightPanX: 0,
  rightPanY: 0,
  rightScale: 100,

  // NUEVO: distancia entre lentes
  lensEnabled: false,
  lensDistanceMm: 60,
  rulerPixels: 190,
  showLensDots: true,
  showLensRuler: true,
});

function halfUV(side, imageWidth) {
  const border = 0.5 / imageWidth;

  const minU = side === 'left'
    ? border
    : 0.5 + border;

  const maxU = side === 'left'
    ? 0.5 - border
    : 1 - border;

  const geometry = new THREE.PlaneGeometry(1, 1);
  const uv = geometry.getAttribute('uv');

  for (let i = 0; i < uv.count; i++) {
    const oldU = uv.getX(i);

    uv.setX(
      i,
      minU + (maxU - minU) * oldU
    );
  }

  uv.needsUpdate = true;
  return geometry;
}

export function createStereoViewer(stage, settings) {
  const engine = createStereoScene(stage);
  const params = settings;

  const materialLeft = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.FrontSide,
  });

  const materialRight = materialLeft.clone();

  const placeholder = new THREE.PlaneGeometry(1, 1);

  const meshLeft = new THREE.Mesh(
    placeholder, materialLeft
  );

  const meshRight = new THREE.Mesh(
    placeholder, materialRight
  );

  engine.sceneLeft.add(meshLeft);
  engine.sceneRight.add(meshRight);

  let texture = null;
  let geometryLeft = null;
  let geometryRight = null;
  let imageWidth = 0;
  let imageHeight = 0;
  let imageName = '';

  meshLeft.visible = false;
  meshRight.visible = false;

  function update() {
    // Separación óptica calculada desde la regla.
    const cssSeparation = params.lensEnabled
      ? params.rulerPixels * params.lensDistanceMm / 50
      : null;

    engine.setEyeSeparation(cssSeparation);

    if (!texture) return;

    const { height } = engine.getSize();
    const layout = engine.getEyeLayout();

    if (!height) return;

    // Conserva los formatos Full-SBS y Half-SBS.
    const eyeAspect = params.format === 'half'
      ? imageWidth / imageHeight
      : (imageWidth / 2) / imageHeight;

    const px = 2 / height;

    // Aplicar posición y escala a un solo ojo.
    function fitEye(
      mesh,
      viewportWidth,
      panX,
      panY,
      scale
    ) {
      const viewportAspect = viewportWidth / height;

      const fit = Math.min(
        1,
        viewportAspect / eyeAspect
      );

      const worldHeight =
        2 * fit *
        (params.scale / 100) *
        (scale / 100);

      mesh.scale.set(
        worldHeight * eyeAspect,
        worldHeight,
        1
      );

      mesh.position.set(
        panX * px,
        -panY * px,
        0
      );
    }

    // OJO IZQUIERDO
    fitEye(
      meshLeft,
      layout.left.width,
      params.panX - params.parallax / 2 +
        params.leftPanX,
      params.panY - params.vertical / 2 +
        params.leftPanY,
      params.leftScale
    );

    // OJO DERECHO
    fitEye(
      meshRight,
      layout.right.width,
      params.panX + params.parallax / 2 +
        params.rightPanX,
      params.panY + params.vertical / 2 +
        params.rightPanY,
      params.rightScale
    );

    // Conserva la opción de intercambiar L/R.
    meshLeft.geometry = params.swap
      ? geometryRight
      : geometryLeft;

    meshRight.geometry = params.swap
      ? geometryLeft
      : geometryRight;

    engine.requestRender();
  }

  function setImage(img, name) {
    const newTexture = new THREE.Texture(img);

    newTexture.colorSpace = THREE.SRGBColorSpace;
    newTexture.minFilter = THREE.LinearFilter;
    newTexture.magFilter = THREE.LinearFilter;
    newTexture.generateMipmaps = false;
    newTexture.needsUpdate = true;

    const newLeft = halfUV(
      'left',
      img.naturalWidth
    );

    const newRight = halfUV(
      'right',
      img.naturalWidth
    );

    materialLeft.map = newTexture;
    materialRight.map = newTexture;

    materialLeft.needsUpdate = true;
    materialRight.needsUpdate = true;

    texture?.dispose();
    geometryLeft?.dispose();
    geometryRight?.dispose();

    if (placeholder && !geometryLeft) {
      placeholder.dispose();
    }

    texture = newTexture;
    geometryLeft = newLeft;
    geometryRight = newRight;

    imageWidth = img.naturalWidth;
    imageHeight = img.naturalHeight;
    imageName = name;

    meshLeft.visible = true;
    meshRight.visible = true;

    update();

    return {
      width: imageWidth,
      height: imageHeight,
      name: imageName,
    };
  }

  function getImageInfo() {
    return imageWidth
      ? {
          width: imageWidth,
          height: imageHeight,
          name: imageName,
        }
      : null;
  }

  engine.onResize(update);

  return {
    setImage,
    update,
    getImageInfo,
    getEyeLayout: engine.getEyeLayout,
    resize: engine.resize,

    dispose() {
      geometryLeft?.dispose();
      geometryRight?.dispose();
      texture?.dispose();

      materialLeft.dispose();
      materialRight.dispose();

      engine.dispose();
    },
  };
}
