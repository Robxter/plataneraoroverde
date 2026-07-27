/* =========================================================
   Platanera Oro Verde — main.js
   Interacciones y animaciones propias, sin librerías:
   nav + dropdown accesibles, reveals con IntersectionObserver,
   contadores al entrar en pantalla, carrusel con scroll-snap,
   lightbox de galerías y formulario de contacto → WhatsApp.
   ========================================================= */

(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Contacto ---------- */
  const WHATSAPP = "593987407971";
  const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

  /* =======================================================
     Header: sombra al hacer scroll
     ======================================================= */
  function cablearHeader() {
    const header = $("#header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("con-sombra", window.scrollY > 10);
    let tick = false;
    window.addEventListener("scroll", () => {
      if (!tick) {
        requestAnimationFrame(() => { onScroll(); tick = false; });
        tick = true;
      }
    });
    onScroll();
  }

  /* =======================================================
     Menú móvil + dropdown "Descubre"
     ======================================================= */
  function cablearMenu() {
    const btn = $("#hamburguesa");
    const nav = $("#nav");
    if (btn && nav) {
      const cerrar = () => {
        nav.classList.remove("abierta");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Abrir menú");
      };
      btn.addEventListener("click", () => {
        const abierta = nav.classList.toggle("abierta");
        btn.setAttribute("aria-expanded", String(abierta));
        btn.setAttribute("aria-label", abierta ? "Cerrar menú" : "Abrir menú");
      });
      $$("a", nav).forEach((a) => a.addEventListener("click", cerrar));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
    }

    const desplegable = $(".desplegable");
    const toggle = desplegable && $("button", desplegable);
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const abierto = desplegable.classList.toggle("abierto");
        toggle.setAttribute("aria-expanded", String(abierto));
      });
      document.addEventListener("click", (e) => {
        if (!desplegable.contains(e.target)) {
          desplegable.classList.remove("abierto");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          desplegable.classList.remove("abierto");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* =======================================================
     Reveals al hacer scroll ([data-reveal] y [data-reveal-grupo])
     ======================================================= */
  function cablearReveals() {
    const items = $$("[data-reveal],[data-reveal-grupo]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* =======================================================
     Contadores: arrancan cuando el bloque entra en pantalla
     Formato en data-formato: "entero" (por defecto) | "colones"
     ======================================================= */
  function animarContador(el) {
    const objetivo = parseFloat(el.dataset.contador);
    if (isNaN(objetivo)) return;
    const colones = el.dataset.formato === "colones";
    const dec = colones && String(el.dataset.contador).includes(".") ? 2 : 0;
    const prefijo = colones ? "₡" : (el.dataset.prefijo || "");
    const fmt = (v) => prefijo + v.toLocaleString("es-CR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

    if (reduceMotion) { el.textContent = fmt(objetivo); return; }
    const dur = 1600, t0 = performance.now();
    const paso = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const suave = 1 - Math.pow(1 - p, 3); // ease-out
      el.textContent = fmt(objetivo * suave);
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  function cablearContadores() {
    const contadores = $$("[data-contador]");
    if (!contadores.length) return;
    if (!("IntersectionObserver" in window)) { contadores.forEach(animarContador); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animarContador(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    contadores.forEach((el) => io.observe(el));
  }

  /* =======================================================
     Carrusel (scroll-snap + flechas + puntos + auto-avance)
     ======================================================= */
  function cablearCarrusel() {
    $$(".carrusel").forEach((carrusel) => {
      const pista = $(".carrusel__pista", carrusel);
      const items = $$(".carrusel__item", carrusel);
      if (!pista || items.length < 2) return;

      const puntosCont = $(".carrusel__puntos", carrusel);
      if (puntosCont) {
        puntosCont.innerHTML = items.map((_, i) =>
          `<button type="button" class="carrusel__punto${i ? "" : " activo"}" data-i="${i}" aria-label="Ir a la lámina ${i + 1}"></button>`
        ).join("");
      }

      const irA = (i) => {
        const idx = ((i % items.length) + items.length) % items.length;
        pista.scrollTo({ left: items[idx].offsetLeft - pista.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
      };
      const actual = () => {
        let mejor = 0, dist = Infinity;
        items.forEach((it, i) => {
          const d = Math.abs(it.offsetLeft - pista.offsetLeft - pista.scrollLeft);
          if (d < dist) { dist = d; mejor = i; }
        });
        return mejor;
      };

      const prev = $(".carrusel__nav--prev", carrusel);
      const next = $(".carrusel__nav--next", carrusel);
      if (prev) prev.addEventListener("click", () => irA(actual() - 1));
      if (next) next.addEventListener("click", () => irA(actual() + 1));
      if (puntosCont) puntosCont.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i]");
        if (b) irA(+b.dataset.i);
      });

      // puntos sincronizados con el scroll (también con swipe)
      let stTick = null;
      pista.addEventListener("scroll", () => {
        clearTimeout(stTick);
        stTick = setTimeout(() => {
          const i = actual();
          $$(".carrusel__punto", carrusel).forEach((p, pi) => p.classList.toggle("activo", pi === i));
        }, 80);
      }, { passive: true });

      // auto-avance suave; se pausa al interactuar o al salir de pantalla
      if (!reduceMotion) {
        let timer = setInterval(() => irA(actual() + 1), 5200);
        const parar = () => { clearInterval(timer); timer = null; };
        const seguir = () => { if (!timer) timer = setInterval(() => irA(actual() + 1), 5200); };
        carrusel.addEventListener("pointerenter", parar);
        carrusel.addEventListener("pointerleave", seguir);
        carrusel.addEventListener("touchstart", parar, { passive: true });
        if ("IntersectionObserver" in window) {
          new IntersectionObserver((en) => en[0].isIntersecting ? seguir() : parar(), { threshold: .2 })
            .observe(carrusel);
        }
      }
    });
  }

  /* =======================================================
     Lightbox de galerías (delegado; navegable con flechas)
     Cualquier <a class="js-foto" href="foto-grande"> lo abre.
     ======================================================= */
  let fotos = [], fotoIdx = 0;

  function abrirLightbox(lista, idx) {
    fotos = lista; fotoIdx = idx;
    const o = document.createElement("div");
    o.className = "lightbox";
    o.innerHTML = `
      <img src="${fotos[fotoIdx].href}" alt="${fotos[fotoIdx].dataset.alt || ""}">
      ${fotos.length > 1 ? `
        <button class="lightbox__nav lightbox__nav--prev" aria-label="Foto anterior">‹</button>
        <button class="lightbox__nav lightbox__nav--next" aria-label="Foto siguiente">›</button>
        <span class="lightbox__contador num">${fotoIdx + 1} / ${fotos.length}</span>` : ""}
      <button class="lightbox__cerrar" aria-label="Cerrar">✕</button>`;
    const img = $("img", o);
    const cont = $(".lightbox__contador", o);

    const mostrar = (i) => {
      fotoIdx = ((i % fotos.length) + fotos.length) % fotos.length;
      img.src = fotos[fotoIdx].href;
      img.alt = fotos[fotoIdx].dataset.alt || "";
      if (cont) cont.textContent = `${fotoIdx + 1} / ${fotos.length}`;
    };
    const onKey = (e) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowLeft") mostrar(fotoIdx - 1);
      if (e.key === "ArrowRight") mostrar(fotoIdx + 1);
    };
    function cerrar() { o.remove(); document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; }

    o.addEventListener("click", (e) => {
      if (e.target.closest(".lightbox__nav--prev")) { e.stopPropagation(); mostrar(fotoIdx - 1); return; }
      if (e.target.closest(".lightbox__nav--next")) { e.stopPropagation(); mostrar(fotoIdx + 1); return; }
      cerrar();
    });
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.appendChild(o);
  }

  function cablearLightbox() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a.js-foto");
      if (!a) return;
      e.preventDefault();
      const grupo = a.closest("[data-galeria]") || document;
      const lista = $$("a.js-foto", grupo);
      abrirLightbox(lista, lista.indexOf(a));
    });
  }

  /* =======================================================
     Formulario de contacto → WhatsApp
     (la web es estática: el mensaje sale por wa.me, donde
     el equipo lo recibe al instante)
     ======================================================= */
  function cablearFormulario() {
    const form = $("#form-contacto");
    if (!form) return;
    const estado = $(".form__estado", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const nombre = String(d.get("nombre") || "").trim();
      const correo = String(d.get("correo") || "").trim();
      const mensaje = String(d.get("mensaje") || "").trim();
      if (!nombre || !mensaje) {
        if (estado) estado.textContent = "Cuéntanos tu nombre y tu mensaje.";
        (nombre ? $("[name='mensaje']", form) : $("[name='nombre']", form)).focus();
        return;
      }
      let msg = `Hola Platanera Oro Verde, soy ${nombre}. ${mensaje}`;
      if (correo) msg += ` (Mi correo: ${correo})`;
      if (estado) estado.textContent = "Abriendo WhatsApp con tu mensaje…";
      window.open(waLink(msg), "_blank", "noopener");
    });
  }

  /* ---------- Año del pie ---------- */
  function ponerAnio() {
    const el = $("#anio");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    cablearHeader();
    cablearMenu();
    cablearReveals();
    cablearContadores();
    cablearCarrusel();
    cablearLightbox();
    cablearFormulario();
    ponerAnio();
  });
})();
