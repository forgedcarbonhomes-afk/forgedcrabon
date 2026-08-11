/* ================================================================
   FORGED CARBON — motion system (P1)
   Smooth scroll (Lenis), count-ups, number tweens.
   Progressive enhancement only: the site is fully usable without it.
   ================================================================ */
(function () {
  'use strict';

  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Smooth scroll (Lenis via CDN, lazy) ----------------
     Skipped for reduced-motion and coarse pointers — native touch
     scrolling is already inertial; hijacking it reads cheap.      */
  var FINE = matchMedia('(pointer: fine)').matches;
  if (!REDUCE && FINE) {
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/lenis@1.1.14/dist/lenis.min.js';
    s.async = true;
    s.onload = function () {
      if (typeof Lenis !== 'function') return;
      var lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
      window.fcLenis = lenis; // programmatic scrolls must go through lenis.scrollTo
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // Anchor links glide instead of jumping.
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var el = document.querySelector(a.getAttribute('href'));
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -68, duration: 1.1 });
      });
    };
    document.head.appendChild(s);
  }

  /* ---------- Number tween core ---------------------------------- */
  var EASE = function (t) { return 1 - Math.pow(1 - t, 4); }; // expo-ish out

  function tweenNumber(el, from, to, dur, fmt) {
    if (REDUCE) { el.textContent = fmt(to); return; }
    var t0 = null;
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = fmt(from + (to - from) * EASE(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Parse "prefix 1,234.5 suffix" out of an element's current text. */
  function parseNumeric(text) {
    var m = text.match(/^([^0-9\-]*)(-?[\d,]+(?:\.\d+)?)([\s\S]*)$/);
    if (!m) return null;
    var raw = m[2];
    return {
      prefix: m[1],
      suffix: m[3],
      value: parseFloat(raw.replace(/,/g, '')),
      decimals: (raw.split('.')[1] || '').length,
      grouped: raw.indexOf(',') !== -1
    };
  }

  function formatterFor(p) {
    return function (v) {
      var s = p.grouped
        ? v.toLocaleString('en-AU', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals })
        : v.toFixed(p.decimals);
      return p.prefix + s + p.suffix;
    };
  }

  /* ---------- Stats bar count-up ---------------------------------
     Animates the leading number inside each .stat__n (the <em> unit
     suffix is left untouched). Elements with no digits are skipped. */
  function initCountUps() {
    var nodes = document.querySelectorAll('.stat__n');
    if (!nodes.length) return;
    var targets = [];
    nodes.forEach(function (el) {
      var tn = el.firstChild;
      if (!tn || tn.nodeType !== 3) return;
      var p = parseNumeric(tn.textContent);
      if (!p || isNaN(p.value)) return;
      targets.push({ node: tn, p: p });
    });
    if (!targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        targets.forEach(function (t, i) {
          var fmt = formatterFor(t.p);
          if (REDUCE) return;
          t.node.textContent = fmt(0);
          setTimeout(function () {
            var t0 = null, dur = 1100;
            (function step(now) {
              if (!now) return requestAnimationFrame(step);
              if (!t0) t0 = now;
              var pr = Math.min((now - t0) / dur, 1);
              t.node.textContent = fmt(t.p.value * EASE(pr));
              if (pr < 1) requestAnimationFrame(step);
            })();
          }, 90 * i); // stagger
        });
      });
    }, { threshold: 0.4 });
    io.observe(nodes[0].closest('.stats') || nodes[0]);
  }

  /* ---------- ROI results: count up on first view ---------------- */
  function initRoiReveal() {
    var root = document.getElementById('home-roi-calculator') ||
               document.querySelector('.home-roi, .roi');
    if (!root) return;
    var ids = ['hroi-net', 'hroi-monthly', 'hroi-return', 'hroi-payback', 'hroi-gross',
               'roi-net', 'roi-monthly', 'roi-return', 'roi-payback', 'roi-gross'];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (!el) return;
          var p = parseNumeric(el.textContent);
          if (!p || isNaN(p.value)) return;
          tweenNumber(el, 0, p.value, 1200, formatterFor(p));
        });
      });
    }, { threshold: 0.35 });
    io.observe(root);
  }

  /* ---------- Typography reveals (21st.dev patterns, vanilla port) --
     Display headings: words rise out of an overflow mask, staggered.
     Eyebrows: tracking-in — letters settle from wide to final spacing.
     Skipped wholesale for reduced-motion; without JS nothing is hidden. */
  var TT_HEADS = [
    '.fc-manifesto__line',
    '.certs__title', '.fc-builds__title', '.home-roi__title', '.fc-incl__title',
    '.fc-reviews__title', '.contact-aside__title',
    '.section-intro__title', '.page-header__title', '.hero__headline', '.cta-section__title'
  ].join(',');
  var TT_EYEBROWS = [
    '.home-roi__eyebrow', '.fc-incl__eyebrow', '.fc-builds__eyebrow', '.fc-reviews__eyebrow',
    '.product__eyebrow', '.cert-strip__eyebrow', '.form-eyebrow',
    '.section-intro__eyebrow', '.page-header__eyebrow', '.cta-section__eyebrow'
  ].join(',');

  function splitWords(el) {
    var idx = 0;
    function wrap(text) {
      var w = document.createElement('span'); w.className = 'tt-w';
      var i = document.createElement('span'); i.className = 'tt-i';
      i.style.setProperty('--tt-d', idx++);
      if (text != null) i.textContent = text;
      w.appendChild(i);
      return w;
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
          else frag.appendChild(wrap(part));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        // <em> etc. rise as one unit: swap the wrapper in FIRST, then move
        // the element inside it (moving first orphans it and replaceChild throws)
        var w = wrap(null);
        el.replaceChild(w, node);
        w.firstChild.appendChild(node);
      }
    });
    return idx;
  }

  function initTextReveal() {
    if (REDUCE || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        // double rAF: let the split's initial transform paint first
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { e.target.classList.add('tt-in'); });
        });
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll(TT_HEADS).forEach(function (el) {
      if (el.dataset.ttDone) return;
      el.dataset.ttDone = '1';
      var n = splitWords(el);
      if (n === 0 || n > 30) return;
      el.classList.add('tt-split', 'tt-anim');
      io.observe(el);
    });
    document.querySelectorAll(TT_EYEBROWS).forEach(function (el) {
      if (el.dataset.ttDone) return;
      el.dataset.ttDone = '1';
      el.classList.add('tt-track');
      io.observe(el);
    });
  }

  /* ---------- Magnetic buttons — a few px of pull, nothing springy */
  function initMagnetic() {
    if (REDUCE || !FINE) return;
    document.querySelectorAll('.btn, .nav__cta, .viewer3d__btn').forEach(function (el) {
      el.style.transition = 'transform ' + '350ms cubic-bezier(0.16, 1, 0.3, 1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'translate(' + (dx * 5).toFixed(1) + 'px,' + (dy * 4).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initCountUps(); initRoiReveal(); initMagnetic(); initTextReveal(); });
  } else {
    initCountUps(); initRoiReveal(); initMagnetic(); initTextReveal();
  }
})();
