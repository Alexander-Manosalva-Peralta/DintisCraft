# 🦷 DentisCraft — Landing Page de Presentación con Modelo 3D Interactivo

Página web de presentación para el aplicativo **DentisCraft AI** (Asistente Clínico Inteligente con IA, Visualización 3D y Backend Convex), desarrollada para el hackathon **The Next Craft 2026**.

---

## 🎯 ¿Qué incluye esta Landing Page?

1. **Hero Section con Avatar Robótico 3D Interactivo (DentisCraft AI):**
   - Integración nativa de **Spline 3D** con seguimiento de cursor en tiempo real (`https://my.spline.design/robotfollowcursorforlandingpage-DASHteKOoak9yrc0gZcwivkA/`).
   - Canvas 3D holográfico con Three.js de respaldo.
2. **Problemática vs. Solución:**
   - Diagnóstico claro de los cuellos de botella en la consulta odontológica tradicional (carga administrativa, contaminación cruzada, brecha comunicativa).
   - Solución propuesta por **DentisCraft AI** con asistente de voz y modelos 3D interactivos.
3. **Pilares y Características Clave:**
   - Dictado por voz clínico manos libres.
   - Odontograma 3D interactivo.
   - Sincronización en tiempo real con Convex Cloud (`colorless-anteater-240.convex.cloud`).
   - Diagnóstico asistido con IA predictiva y preservación de bioseguridad.
4. **Showcase 3D y Tester de Spline en Vivo:**
   - Visualizador de la escena 3D y panel para probar dinámicamente cualquier URL pública de Spline o archivo `.splinecode`.
5. **Sección del Equipo (The Next Craft Hackathon):**
   - Tarjetas de los integrantes: **Michael Gavino** (Lead Backend & Convex), **Alexander Manosalva Peralta** (Lead Frontend & 3D), y áreas de producto/clínica.
6. **Monitor en Tiempo Real de la API Convex:**
   - Comprobación de estado y consola interactiva para probar peticiones HTTP en vivo a `https://colorless-anteater-240.convex.site/api/health`.

---

## 📍 ¿Dónde cambiar la URL del Modelo 3D de Spline?

Abre el archivo [`landing/index.html`](file:///c:/Users/MICHAEL/2026_2/PRUE/reflejo/landing/index.html):

### 1. Modelo Principal en el Hero (Línea ~845):
```html
<iframe 
  id="spline-hero-iframe"
  class="spline-embed-frame"
  src="https://my.spline.design/robotfollowcursorforlandingpage-DASHteKOoak9yrc0gZcwivkA/" 
  frameborder="0" 
  width="100%" 
  height="100%"
  allow="autoplay; fullscreen; xr-spatial-tracking">
</iframe>
```

### 2. Modelo Secundario en la Sección Showcase (Línea ~1100):
```html
<iframe 
  id="spline-showcase-iframe"
  class="spline-embed-frame"
  src="https://my.spline.design/robotfollowcursorforlandingpage-DASHteKOoak9yrc0gZcwivkA/" 
  frameborder="0" 
  width="100%" 
  height="100%"
  allow="autoplay; fullscreen; xr-spatial-tracking">
</iframe>
```

---

## 🚀 Cómo abrir y visualizar la Landing Page

Puedes abrir directamente el archivo en tu navegador:
- Haz doble clic sobre [`landing/index.html`](file:///c:/Users/MICHAEL/2026_2/PRUE/reflejo/landing/index.html).

O si prefieres levantar un servidor local rápido:
```bash
npx serve landing
```
o abrir con la extensión **Live Server** de VS Code.
