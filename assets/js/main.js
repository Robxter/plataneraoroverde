// assets/js/main.js (reemplazo completo)
// Manejo de header, mobile menu y dropdown 'Descubre' (click + hover-friendly)

(function(){
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const yearEl = document.getElementById('year');

  // Dropdown elementos
  const discoverParent = document.querySelector('.has-dropdown');
  const discoverToggle = discoverParent ? discoverParent.querySelector('.dropdown-toggle') : null;

  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Open / close mobile menu (improved: lock scroll, focus, close nested details)
  function openMobile(){
    if(!mobileMenu) return;
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden','false');
    if(hamburger) hamburger.setAttribute('aria-expanded','true');

    // prevent background scroll while menu open
    document.body.style.overflow = 'hidden';

    // focus first control inside menu for accessibility
    const firstControl = mobileMenu.querySelector('a, button, summary');
    if(firstControl) firstControl.focus();
  }

  function closeMobile(){
    if(!mobileMenu) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden','true');
    if(hamburger) hamburger.setAttribute('aria-expanded','false');

    // restore body scroll
    document.body.style.overflow = '';

    // ensure any open nested details are closed
    mobileMenu.querySelectorAll('details[open]').forEach(d => d.removeAttribute('open'));
  }


  if(hamburger){
    hamburger.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if(!expanded) openMobile();
      else closeMobile();
    });
  }
  if(mobileClose) mobileClose.addEventListener('click', closeMobile);
  if(mobileMenu){
    mobileMenu.addEventListener('click', function(e){
      const tag = e.target.tagName;
      if(tag === 'A' || tag === 'BUTTON') closeMobile();
    });
  }

  // Ensure mobile 'Descubre' (details/summary) toggles reliably on touch & click
  document.querySelectorAll('.mobile-submenu details summary').forEach(summary => {
    const toggleDetails = function(e){
      // prevent native double-toggle + stop bubbling to overlay (which might close the menu)
      e.preventDefault();
      e.stopPropagation();

      const details = summary.parentElement;
      if(!details) return;

      if (details.hasAttribute('open')) {
        details.removeAttribute('open');
      } else {
        details.setAttribute('open', '');
      }
    };

    // Handle both click and touchstart for better mobile coverage
    summary.addEventListener('click', toggleDetails);
    summary.addEventListener('touchstart', toggleDetails, {passive: false});
  });

  // -----------------------
  // Mobile submenu toggle
  // -----------------------
  document.querySelectorAll('.mobile-submenu summary').forEach(summary => {
    summary.addEventListener('click', function(e){
      e.preventDefault(); // evita que el resumen haga toggle nativo
      const parent = summary.parentElement;
      const list = summary.nextElementSibling;
      const isOpen = parent.classList.contains('open');
      if(isOpen){
        parent.classList.remove('open');
        list.style.display = 'none';
      } else {
        parent.classList.add('open');
        list.style.display = 'block';
      }
    });
  });


  // compact header on scroll adds only box-shadow (keeps nav visible)
  window.addEventListener('scroll', function(){
    const sc = window.pageYOffset || document.documentElement.scrollTop;
    if(sc > 60) header.classList.add('compact');
    else header.classList.remove('compact');
  });

  // AOS init if present
  if(window.AOS){
    AOS.init({
      duration: 700,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });
  }

  // Latest news buttons placeholder
  const newsBtns = document.querySelectorAll('#newsBtn, #newsBtnMobile');
  newsBtns.forEach(b => b && b.addEventListener('click', function(e){ e.preventDefault(); alert('Sección \"Últimas noticias\" pendiente de implementación.'); }));

  // -----------------------
  // DISCOVER dropdown logic
  // -----------------------
  // Behavior:
  // - Click on .dropdown-toggle toggles .open class on parent .has-dropdown (keeps it visible)
  // - Hovering the .has-dropdown will show it (CSS hover handles it)
  // - Clicking outside closes it
  // - ESC closes it

  function closeDiscover(){
    if(!discoverParent) return;
    discoverParent.classList.remove('open');
    if(discoverToggle) discoverToggle.setAttribute('aria-expanded','false');
  }
  function openDiscover(){
    if(!discoverParent) return;
    discoverParent.classList.add('open');
    if(discoverToggle) discoverToggle.setAttribute('aria-expanded','true');
  }

  if(discoverToggle){
    // click toggles
    discoverToggle.addEventListener('click', function(e){
      e.stopPropagation();
      const isOpen = discoverParent.classList.contains('open');
      if(isOpen) closeDiscover();
      else openDiscover();
    });

    // mouseenter/mouseleave keep open while hovering
    discoverParent.addEventListener('mouseenter', function(){
      discoverParent.classList.add('open');
      if(discoverToggle) discoverToggle.setAttribute('aria-expanded','true');
    });
    discoverParent.addEventListener('mouseleave', function(){
      // If it was opened by click, keep it open; only close on mouseleave if not clicked-open
      // We cannot easily detect click-open vs hover-open without state; so we close on mouseleave only if not focused
      // Simpler approach: close on mouseleave after short timeout unless focus moved into the dropdown
      setTimeout(function(){
        const active = document.activeElement;
        if(discoverParent.contains(active)) return; // keep open if focus inside
        // otherwise close
        discoverParent.classList.remove('open');
        if(discoverToggle) discoverToggle.setAttribute('aria-expanded','false');
      }, 150);
    });
  }

  // Close discover when clicking outside anywhere
  document.addEventListener('click', function(e){
    if(!discoverParent) return;
    if(!discoverParent.contains(e.target)){
      closeDiscover();
    }
  });

  // Close discover on ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' || e.key === 'Esc'){
      closeDiscover();
    }
  });

})();

// -----------------------
// Estadísticas dinámicas
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const duration = 2000; // duración en ms
    const stepTime = 20;
    let current = 0;
    const increment = target / (duration / stepTime);

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = counter.getAttribute("data-target").includes(".")
          ? "₡" + current.toFixed(2)
          : "+" + Math.floor(current);
        setTimeout(updateCounter, stepTime);
      } else {
        counter.textContent = counter.getAttribute("data-target").includes(".")
          ? "₡" + target.toFixed(2)
          : "+" + target;
      }
    };

    updateCounter();
  });
});
