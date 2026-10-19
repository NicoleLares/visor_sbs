
/**
 * Controles táctiles para StereoLab.
 * Usa la configuración existente del visor y de lil-gui.
 */
export function enableTouchCalibration(stage, config, viewer, calibration) {
    const fingers = new Map();
    let start = null;
    let twoFingerMode = null;

    const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

    // Respetar los límites existentes de lil-gui.
    const range = {
        panX: [-160, 160],
        panY: [-120, 120],
        scale: [40, 180],
        parallax: [-100, 100],
    };

    function apply(changes) {
        let changed = false;

        for (const [key, value] of Object.entries(changes)) {
            const [min, max] = range[key];
            const next = Math.round(clamp(value, min, max));

            if (next !== config[key]) {
                config[key] = next;
                changed = true;
            }
        }

        if (changed) {
            viewer.update();
            calibration.refresh();
        }
    }

    function gestureOrigin() {
        const points = [...fingers.values()];

        if (points.length === 1) {
            const point = points[0];

            start = {
                kind: 'pan',
                x: point.x,
                y: point.y,
                panX: config.panX,
                panY: config.panY,
            };
        } else if (points.length === 2) {
            const [a, b] = points;

            start = {
                kind: 'multi',
                x: (a.x + b.x) / 2,
                y: (a.y + b.y) / 2,
                distance: Math.hypot(a.x - b.x, a.y - b.y),
                scale: config.scale,
                parallax: config.parallax,
                a: { ...a },
                b: { ...b },
            };
        } else {
            start = null;
        }

        twoFingerMode = null;
    }

    function onDown(event) {
        // No interferir con el ratón ni con el modo Cardboard.
        if (
            event.pointerType !== 'touch' ||
            document.body.classList.contains('cardboard-mode') ||
            !viewer.getImageInfo()
        ) {
            return;
        }

        event.preventDefault();

        fingers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        try {
            stage.setPointerCapture(event.pointerId);
        } catch {
            // Captura opcional.
        }

        gestureOrigin();
    }

    function onMove(event) {
        if (!fingers.has(event.pointerId)) return;

        event.preventDefault();

        fingers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        });

        // UN DEDO: mover las dos perspectivas.
        if (fingers.size === 1 && start?.kind === 'pan') {
            apply({
                panX: start.panX + event.clientX - start.x,
                panY: start.panY + event.clientY - start.y,
            });
            return;
        }

        if (fingers.size !== 2 || start?.kind !== 'multi') {
            return;
        }

        const [a, b] = fingers.values();
        const x = (a.x + b.x) / 2;
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        const deltaDistance = distance - start.distance;
        const deltaX = x - start.x;

        // Identificar si el usuario hace zoom o ajusta paralaje.
        if (!twoFingerMode) {
            const dxA = a.x - start.a.x;
            const dxB = b.x - start.b.x;

            const sameDirection = dxA * dxB > 0;

            if (
                sameDirection &&
                Math.abs(dxA) >= 10 &&
                Math.abs(dxB) >= 10 &&
                Math.abs(deltaDistance) < 12
            ) {
                twoFingerMode = 'parallax';
            } else if (Math.abs(deltaDistance) >= 20) {
                twoFingerMode = 'zoom';
            } else {
                return;
            }
        }

        // DOS DEDOS: pellizcar para ampliar o reducir.
        if (twoFingerMode === 'zoom') {
            if (start.distance > 0) {
                apply({
                    scale: start.scale * distance / start.distance,
                });
            }
        } else {
            // DOS DEDOS: deslizamiento horizontal para paralaje.
            apply({
                parallax: start.parallax + deltaX,
            });
        }
    }

    function onEnd(event) {
        if (!fingers.has(event.pointerId)) return;

        fingers.delete(event.pointerId);

        try {
            if (stage.hasPointerCapture(event.pointerId)) {
                stage.releasePointerCapture(event.pointerId);
            }
        } catch {
            // Liberación opcional.
        }

        // Evita saltos al levantar uno de los dedos.
        gestureOrigin();
    }

    function onBlur() {
        fingers.clear();
        start = null;
        twoFingerMode = null;
    }

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onEnd);
    stage.addEventListener('pointercancel', onEnd);
    stage.addEventListener('lostpointercapture', onEnd);
    window.addEventListener('blur', onBlur);

    return function disposeTouchCalibration() {
        stage.removeEventListener('pointerdown', onDown);
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerup', onEnd);
        stage.removeEventListener('pointercancel', onEnd);
        stage.removeEventListener('lostpointercapture', onEnd);
        window.removeEventListener('blur', onBlur);
        onBlur();
    };
}
