# Platanera Oro Verde — sitio web

Sitio estático de **Platanera Oro Verde**, empresa estudiantil de la Universidad EARTH
(Guácimo, Costa Rica): plátano earthiano y chips con una cadena de valor completa.

HTML + CSS + JS vanilla, sin build ni dependencias externas (las animaciones son propias;
las fuentes Outfit/Inter vienen de Google Fonts).

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Video, cifras, quiénes somos, misión/visión, valores, cadena de valor, productos, aliados |
| `historia.html` | Origen (2025), compromiso social, liderazgo ambiental y el equipo |
| `operaciones.html` | Carrusel de la cadena de valor y galería de la operación con lightbox |
| `rsc.html` | Plan social externo y actividad con la ASADA La Alegría |
| `financiero.html` | Análisis de viabilidad e indicadores animados |
| `products/platano.html` · `products/chips.html` | Fichas de producto con specs y galería |

## Cómo editar

- **Textos:** directamente en cada `.html` (comentados por sección).
- **Contacto:** el número de WhatsApp está en `assets/js/main.js` (`const WHATSAPP`).
  El formulario del pie no usa backend: abre WhatsApp con el mensaje ya escrito.
- **Fotos:** las páginas usan los derivados optimizados de `assets/opt/` (WebP, dos
  tamaños: `-sm` para miniaturas y `-lg` para pantalla completa). Los originales viven en
  `assets/images/`. Para añadir una foto nueva: genera sus dos tamaños en `assets/opt/`
  y añade el `<a class="js-foto">` correspondiente en la galería.

## Ver en local

```bash
python -m http.server 5500
# http://localhost:5500
```

## Pendiente (material que falta)

- Fotos **3–8 de la actividad de RSC** (la versión anterior las referenciaba pero nunca
  se subieron). Hueco marcado con comentario en `rsc.html`.
- Fotos de la carpeta **"session Fotos en procesamiento CHIPS"** (misma situación).
  Hueco marcado en `products/chips.html`.
- **URL real de la página de Facebook** (el enlace anterior apuntaba a facebook.com
  genérico; se retiró hasta tener la URL). Comentario en el footer.

---

Desarrollado por **Roberto Terán** — Instagram [@robertoterancp](https://www.instagram.com/robertoterancp) ·
YouTube @robxterr · Tel. +34 643 072 867
