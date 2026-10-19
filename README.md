
# 🥽 StereoLab — Visor Estereoscópico SBS

## 📌 Descripción del proyecto

**StereoLab** es una aplicación web interactiva desarrollada para la materia de **Desarrollo de Soluciones en Ambientes Virtuales**.

Su objetivo es permitir la visualización y calibración de fotografías estereoscópicas en formato **Side by Side (SBS)**, mediante un navegador web y dispositivos de realidad virtual como Google Cardboard.

La aplicación permite cargar fotografías desde una computadora o teléfono móvil, modificar su posición, escala y paralaje, y visualizar ambas perspectivas de manera simultánea para producir una sensación de profundidad tridimensional.

Además, cuenta con controles táctiles para dispositivos móviles, ajuste independiente para cada ojo y herramientas de calibración de la distancia entre las vistas.

El proyecto está desarrollado con **HTML5, CSS3, JavaScript, Three.js, Bootstrap 5 y lil-gui**.

---

## 🎯 Objetivo general

Desarrollar un visor estereoscópico web que permita visualizar, manipular y calibrar imágenes SBS, proporcionando herramientas interactivas para mejorar la experiencia visual con dispositivos compatibles con Google Cardboard.

### Objetivos específicos

- Visualizar fotografías estereoscópicas SBS.
- Permitir la carga de imágenes desde dispositivos locales.
- Implementar controles para modificar posición, escala y paralaje.
- Incorporar gestos táctiles para dispositivos móviles.
- Permitir ajustes independientes para cada ojo.
- Incorporar referencias visuales para calibrar la separación entre lentes.
- Implementar un modo de visualización inmersiva compatible con Google Cardboard.
- Permitir guardar los parámetros de calibración en formato JSON.
- Desarrollar una interfaz responsiva y fácil de utilizar.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Función |
|------------|---------|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño visual y adaptación a diferentes pantallas |
| JavaScript ES Modules | Lógica, eventos e interacción |
| Three.js | Renderizado de las imágenes mediante WebGL |
| lil-gui | Panel interactivo de calibración |
| Bootstrap 5 | Componentes y diseño responsivo |
| WebGL | Representación gráfica acelerada |
| Pointer Events API | Reconocimiento de gestos táctiles |
| ResizeObserver | Adaptación del visor a los cambios de tamaño |
| Fullscreen API | Visualización en pantalla completa |

### Versiones de las bibliotecas

- Three.js: 0.180.0
- lil-gui: 0.20.0
- Bootstrap: 5.3.8

Las bibliotecas se cargan mediante CDN, por lo que se requiere conexión a Internet para utilizarlas.

---

## 📁 Estructura del proyecto

```text
visor-sbs/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── main.js
│   ├── viewer.js
│   ├── scene.js
│   ├── controls.js
│   ├── fileLoader.js
│   ├── ui.js
│   ├── touchGestures.js
│   └── lensCalibration.js
│
├── assets/
│   ├── images/
│   │   ├── demo-sbs-1.jpg
│   │   └── demo-sbs-2.jpg
│   │
│   └── icons/
│       └── cardboard.svg
│
└── README.md
```

### Descripción de los archivos

| Archivo | Descripción |
|---------|-------------|
| index.html | Interfaz principal del proyecto |
| styles.css | Estilos y diseño responsivo |
| main.js | Inicialización y eventos principales |
| viewer.js | Visualización y transformación de imágenes SBS |
| scene.js | Escenas, cámara y renderizado con Three.js |
| controls.js | Panel de calibración con lil-gui |
| fileLoader.js | Carga y validación de imágenes |
| ui.js | Pantalla completa, Cardboard y notificaciones |
| touchGestures.js | Gestos táctiles para dispositivos móviles |
| lensCalibration.js | Puntos blancos y regla de calibración |

---

## ✨ Funcionalidades principales

### 1. Visualización estereoscópica SBS

StereoLab permite representar fotografías formadas por dos perspectivas:

- Vista izquierda (Left).
- Vista derecha (Right).

Las imágenes se representan mediante Two Viewports de Three.js, utilizando las coordenadas UV para seleccionar la región correspondiente de la fotografía.

Los formatos disponibles son:

- Full-SBS: fotografías estereoscópicas de ancho completo.
- Half-SBS: fotografías con cada perspectiva comprimida horizontalmente.

También es posible intercambiar las perspectivas izquierda y derecha.

### 2. Carga de fotografías

El usuario puede cargar fotografías almacenadas en su dispositivo.

Formatos compatibles:

- JPG / JPEG
- PNG
- WEBP
- AVIF

Tamaño máximo por archivo: 30 MB.

La aplicación permite:

- Seleccionar imágenes desde el explorador de archivos.
- Cargar imágenes desde un teléfono móvil.
- Arrastrar y soltar archivos desde una computadora.
- Utilizar dos imágenes de demostración incluidas en el proyecto.

Las fotografías se procesan localmente en el navegador y no se envían a un servidor.

### 3. Calibración general

Mediante el panel lil-gui es posible modificar:

| Control | Función |
|---------|---------|
| Paralaje | Ajustar la separación visual relativa entre perspectivas |
| Escala | Aumentar o reducir el tamaño de ambas imágenes |
| Mover X | Desplazar horizontalmente ambas imágenes |
| Mover Y | Desplazar verticalmente ambas imágenes |
| Desnivel L/R | Corregir la alineación vertical relativa |
| Tipo de SBS | Seleccionar Full-SBS o Half-SBS |
| Intercambiar L/R | Cambiar el orden de las perspectivas |

Los cambios se reflejan inmediatamente en el visor.

---

## 📱 4. Calibración mediante gestos táctiles

Una de las mejoras implementadas es la manipulación directa de imágenes mediante la pantalla táctil del teléfono.

### Gestos disponibles

| Gesto | Acción |
|-------|--------|
| Arrastrar con un dedo | Mover horizontal y verticalmente ambas perspectivas |
| Pellizcar con dos dedos | Reducir el tamaño de las imágenes |
| Separar dos dedos | Aumentar el tamaño de las imágenes |
| Deslizar dos dedos horizontalmente | Modificar el paralaje |

### Funcionamiento

Los gestos táctiles modifican los mismos parámetros utilizados por el panel lil-gui.

Por lo tanto, los cambios realizados directamente sobre la fotografía se reflejan en los controles de calibración.

La interacción táctil está diseñada principalmente para el visor normal. Durante el modo Cardboard se evita que estos gestos modifiquen accidentalmente la imagen.

### Ventajas

- Mayor comodidad en teléfonos móviles.
- Manipulación directa de las fotografías.
- Calibración intuitiva.
- Sincronización con los controles manuales.
- No modifica los archivos originales.

---

## 👀 5. Ajuste independiente de cada ojo

StereoLab incorpora una herramienta para modificar individualmente las perspectivas izquierda y derecha.

Esta función es útil cuando una fotografía SBS presenta pequeñas diferencias de alineación entre ambos ojos.

### Controles del ojo izquierdo

- Izquierdo X: movimiento horizontal.
- Izquierdo Y: movimiento vertical.
- Izquierdo escala: ampliación o reducción.

### Controles del ojo derecho

- Derecho X: movimiento horizontal.
- Derecho Y: movimiento vertical.
- Derecho escala: ampliación o reducción.

### ¿Cómo utilizar esta función?

1. Cargar una fotografía SBS.
2. Abrir el panel de calibración.
3. Localizar la sección "Ajuste independiente por ojo".
4. Modificar los parámetros del ojo izquierdo.
5. Ajustar los parámetros del ojo derecho.
6. Comparar la alineación de ambas perspectivas.
7. Activar Cardboard para comprobar el resultado.

Los controles independientes se combinan con los ajustes generales del visor.

Esto permite corregir una perspectiva sin modificar necesariamente la otra.

---

## 🥽 6. Calibración de distancia entre lentes

La aplicación cuenta con un sistema visual para configurar la separación entre los centros de ambas vistas.

Su propósito es facilitar la adaptación del visor a diferentes tamaños de pantalla y dispositivos tipo Google Cardboard.

### Elementos de calibración

**Puntos blancos**

Se muestran dos puntos blancos sobre el visor que indican los centros de las áreas de visualización.

**Regla visual**

Permite representar una referencia de 5 cm sobre la pantalla.

**Distancia entre lentes**

Permite modificar la separación deseada entre los centros de visualización, expresada en milímetros.

### Configuración inicial

- Calibración de lentes: desactivada.
- Distancia de referencia: 60 mm (6 cm).
- Regla de calibración: 5 cm.
- Visualización de puntos: disponible.
- Visualización de regla: disponible.

### Procedimiento de calibración

1. Abrir la aplicación desde un teléfono móvil.
2. Cargar una fotografía SBS.
3. Abrir la sección "Distancia entre lentes".
4. Activar la calibración.
5. Mostrar los puntos blancos y la regla.
6. Colocar una regla física sobre la pantalla.
7. Ajustar el control "Regla 5 cm (px)" hasta que la referencia visual mida aproximadamente 5 cm reales.
8. Establecer la distancia deseada entre lentes, por ejemplo, 60 mm.
9. Verificar visualmente la posición de los puntos blancos.
10. Activar el modo Cardboard y comprobar la comodidad de la imagen.

**Importante:**

La distancia de 60 mm es una referencia inicial, no una medida universal.

La distancia adecuada depende del teléfono, las lentes y las características físicas del visor.

La aplicación limita las dimensiones de las vistas para evitar superposiciones cuando la pantalla no dispone de espacio suficiente.

Esta herramienta ajusta la separación de las áreas de visualización; no sustituye una calibración óptica completa ni corrige automáticamente la distorsión de las lentes.

---

## 🌐 7. Modo Google Cardboard

StereoLab incorpora un modo inmersivo para visualizar fotografías estereoscópicas desde un teléfono móvil.

### Funcionamiento

1. Abrir la aplicación en un navegador compatible.
2. Cargar una fotografía SBS.
3. Realizar la calibración necesaria.
4. Presionar "Entrar en modo Cardboard".
5. Girar el dispositivo horizontalmente.
6. Colocar el teléfono dentro de las gafas Cardboard.
7. Observar la fotografía mediante las dos lentes.

En este modo:

- Se aprovecha el espacio disponible de la pantalla.
- Se ocultan elementos de la interfaz normal.
- Las perspectivas se muestran separadamente.
- Se conservan los valores de calibración.
- Se puede salir mediante doble toque o los controles de pantalla completa del sistema, según el dispositivo.

### Compatibilidad

El visor está diseñado para navegadores móviles modernos compatibles con JavaScript, WebGL y las funcionalidades de pantalla completa disponibles.

El comportamiento puede variar entre Android, iOS y distintos navegadores.

---

## 💾 8. Guardar y restablecer calibración

### Guardar ajustes

El botón "Guardar ajustes (JSON)" permite descargar un archivo con la configuración actual.

El archivo puede incluir parámetros como:

```json
{
  "parallax": 0,
  "scale": 100,
  "panX": 0,
  "panY": 0,
  "leftPanX": 0,
  "leftPanY": 0,
  "leftScale": 100,
  "rightPanX": 0,
  "rightPanY": 0,
  "rightScale": 100,
  "lensEnabled": false,
  "lensDistanceMm": 60
}
```

Este ejemplo representa una parte de la configuración; el archivo exportado también contiene otros parámetros y metadatos.

La fotografía original no se incluye ni se modifica.

**Nota:** actualmente la aplicación permite exportar la configuración JSON, pero no dispone de una función para importarla y restaurarla automáticamente.

### Restablecer calibración

El botón "Restablecer calibración" devuelve los parámetros a sus valores predeterminados.

Permite comenzar una nueva calibración sin tener que volver a cargar la página.

---

## 🚀 9. Cómo ejecutar el proyecto

### Requisitos

- Computadora o teléfono móvil.
- Navegador web actualizado.
- Conexión a Internet para cargar las bibliotecas CDN.
- Editor de código, preferentemente Visual Studio Code.
- Servidor HTTP local para ejecutar los módulos JavaScript.

No se requiere una API Key ni instalar dependencias mediante npm.

### Opción A: Visual Studio Code

1. Descargar o clonar el repositorio.
2. Abrir la carpeta `visor-sbs` en Visual Studio Code.
3. Instalar la extensión "Live Server".
4. Abrir `index.html`.
5. Seleccionar "Open with Live Server".
6. La aplicación se abrirá en el navegador.

### Opción B: Servidor local con Python

Desde una terminal ubicada en la carpeta principal:

```bash
python -m http.server 5500
```

Abrir:

```text
http://localhost:5500/
```

No se recomienda abrir `index.html` directamente mediante `file://`, ya que los módulos JavaScript y determinadas funciones del navegador pueden presentar restricciones.

### Ejecutar desde un teléfono

Para utilizar la aplicación desde el teléfono se puede acceder al sitio publicado con GitHub Pages.

También es posible utilizar un servidor local accesible desde el dispositivo, siempre que la computadora y el teléfono estén conectados a la misma red y que la configuración de red permita la conexión.

---

## ☁️ 10. Publicación en GitHub Pages

StereoLab puede publicarse mediante GitHub Pages porque es una aplicación web estática.

### Pasos

1. Crear un repositorio en GitHub.
2. Subir todos los archivos del proyecto.
3. Mantener `index.html` en la raíz.
4. Abrir la configuración del repositorio.
5. Ir a "Settings → Pages".
6. Seleccionar "Deploy from a branch".
7. Elegir la rama `main`.
8. Seleccionar la carpeta `/(root)`.
9. Guardar los cambios.
10. Abrir la dirección pública proporcionada por GitHub Pages.

Ejemplo de dirección:

```text
https://USUARIO.github.io/visor-sbs/
```

Reemplazar `USUARIO` por el usuario correspondiente de GitHub.

### Actualizar cambios en GitHub

Después de modificar el proyecto:

```bash
git add .
git commit -m "feat: mejorar calibracion SBS y Cardboard"
git push origin main
```

---

## 🔧 11. Arquitectura técnica

La aplicación utiliza Three.js para crear dos escenas independientes correspondientes a las perspectivas izquierda y derecha.

### Procesamiento de imágenes

La fotografía SBS se carga como una textura.

Mediante coordenadas UV se selecciona la región correspondiente para cada ojo.

### Renderizado

El sistema utiliza:

- WebGLRenderer.
- Scene.
- OrthographicCamera.
- PlaneGeometry.
- Texture.
- Viewport y Scissor.

Las perspectivas se representan dentro de áreas independientes de la pantalla.

### Calibración

Las transformaciones se calculan a partir de un objeto de configuración compartido.

Este objeto contiene valores generales, parámetros individuales para cada ojo y opciones de separación entre lentes.

### Interacción táctil

Los eventos Pointer Events permiten detectar el movimiento de uno o dos dedos.

Se utilizan cálculos de posición y distancia entre puntos para interpretar los gestos y actualizar los parámetros de calibración.

### Separación entre lentes

La herramienta de calibración utiliza la relación entre los píxeles de la regla visual y su longitud de referencia.

Los resultados se aplican a la distribución de las áreas de visualización, respetando el espacio disponible.

---

## 🧪 12. Pruebas realizadas

Durante el desarrollo del proyecto se probaron las siguientes funcionalidades:

| Prueba | Resultado |
|--------|-----------|
| Carga de fotografías SBS | Funcional |
| Visualización de las perspectivas izquierda y derecha | Funcional |
| Calibración general con lil-gui | Funcional |
| Cambio de paralaje | Funcional |
| Ajuste de escala | Funcional |
| Movimiento táctil de imágenes | Funcional |
| Zoom mediante gesto de pellizco | Funcional |
| Ajuste independiente por ojo | Funcional |
| Visualización de puntos blancos | Funcional |
| Configuración de separación entre lentes | Funcional |
| Modo Google Cardboard | Funcional |
| Restablecimiento de calibración | Funcional |

Las funcionalidades fueron comprobadas durante las pruebas de uso del proyecto.

La compatibilidad y precisión visual pueden variar dependiendo del dispositivo, el navegador y las gafas utilizadas.

---

## ⚠️ 13. Recomendaciones de uso

Para obtener una mejor experiencia visual:

- Utilizar fotografías SBS correctamente alineadas.
- Comenzar con un paralaje de 0 px.
- Mantener inicialmente la escala en 100%.
- Realizar ajustes graduales.
- Utilizar el ajuste independiente solamente cuando sea necesario.
- Comprobar físicamente la distancia de calibración.
- Utilizar el teléfono en posición horizontal para Cardboard.
- Evitar movimientos bruscos durante la visualización.
- Interrumpir el uso si se presenta cansancio visual, mareo o incomodidad.

La calidad del efecto tridimensional depende principalmente de las fotografías originales y de su correcta calibración.

---

## 🛠️ 14. Solución de problemas

### La pantalla aparece negra

Verificar la conexión a Internet, la compatibilidad con WebGL y la carga de las bibliotecas externas.

### Los controles táctiles no funcionan

Comprobar que `touchGestures.js` esté ubicado dentro de la carpeta `js` y que el archivo se cargue correctamente desde `main.js`.

### La imagen aparece deformada

Verificar si la fotografía corresponde a Full-SBS o Half-SBS.

### Las perspectivas están invertidas

Utilizar el control "Intercambiar L/R".

### Los puntos blancos no aparecen

Activar "Calibración de lentes" y "Mostrar puntos" desde el panel de control.

### La distancia visual no coincide con los 6 cm

Utilizar una regla física para ajustar primero la referencia de 5 cm.

La medida debe verificarse directamente sobre la pantalla del dispositivo.

### Cardboard no entra en pantalla completa

Comprobar las restricciones del navegador y girar manualmente el teléfono cuando sea necesario.

### La imagen produce molestias visuales

Reducir el paralaje, revisar la alineación y comprobar que las dos perspectivas correspondan a una fotografía estereoscópica válida.

---

## 📚 15. Referencias

- Three.js. https://threejs.org/
- Documentación Three.js. https://threejs.org/docs/
- lil-gui. https://lil-gui.georgealways.com/
- Bootstrap. https://getbootstrap.com/
- MDN Web Docs. https://developer.mozilla.org/
- Google Cardboard. https://developers.google.com/cardboard
- GitHub Pages. https://docs.github.com/en/pages

---

## 🎓 16. Información académica

**Proyecto:** StereoLab — Visor Estereoscópico SBS

**Asignatura:** Desarrollo de Soluciones en Ambientes Virtuales

**Institución:** Tecnológico Nacional de México — Instituto Tecnológico de Pachuca

**Tipo de proyecto:** Aplicación web de visualización y calibración estereoscópica.

---

## 📝 17. Conclusión

El desarrollo de StereoLab permitió integrar tecnologías de programación web y gráficos tridimensionales para construir un visor estereoscópico interactivo, accesible desde una computadora o un dispositivo móvil.

Mediante Three.js se logró representar fotografías SBS y aplicar transformaciones de escala, posición y paralaje. La incorporación de controles táctiles facilitó la manipulación directa de las imágenes desde teléfonos móviles, mientras que los ajustes independientes para cada ojo proporcionaron mayor flexibilidad durante la calibración.

Asimismo, la implementación de puntos blancos y referencias visuales de distancia permitió incorporar un procedimiento de calibración para dispositivos tipo Google Cardboard.

El proyecto demuestra cómo las tecnologías web modernas pueden utilizarse para desarrollar herramientas de visualización tridimensional sin depender de aplicaciones móviles nativas.

StereoLab constituye una base funcional que puede ampliarse con nuevas herramientas de calibración, gestión de imágenes y experiencias de realidad virtual.

---

**StereoLab — Proyecto académico de visualización estereoscópica.**
