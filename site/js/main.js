/* =============================================================
   Oreo Stylessy — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully
   and switches off under prefers-reduced-motion.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lerp    = function (a, b, n) { return a + (b - a) * n; };
  var clamp   = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var $       = function (s, c) { return (c || document).querySelector(s); };
  var $$      = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Split headings into masked lines
     --------------------------------------------------------- */
  function splitLines() {
    $$('[data-split]').forEach(function (el) {
      if (el.dataset.splitDone) return;
      var lines = el.textContent.split('\n')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
      el.textContent = '';
      lines.forEach(function (text) {
        var outer = document.createElement('span');
        var inner = document.createElement('span');
        outer.className = 'line';
        inner.className = 'line__in';
        inner.textContent = text;
        outer.appendChild(inner);
        el.appendChild(outer);
      });
      el.dataset.splitDone = '1';
    });
  }
  splitLines();

  /* ---------------------------------------------------------
     2. Reveal on scroll
     --------------------------------------------------------- */
  var revealTargets = $$('[data-reveal], [data-split]');

  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     3. Loader
     --------------------------------------------------------- */
  var loader = $('#loader');
  var fill   = $('#loaderFill');
  var num    = $('#loaderNum');

  (function runLoader() {
    if (!loader) return;

    var SPAN = 1100;   // how long a full sweep to 100 takes
    var MAX  = 3200;   // hard ceiling — the curtain never traps anyone
    var start = performance.now();
    var loaded = document.readyState === 'complete';
    var ended = false;

    if (reduced) { finish(); return; }

    window.addEventListener('load', function () { loaded = true; });
    // rAF is throttled in background tabs, so the ceiling runs on a timer too
    setTimeout(finish, MAX);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) finish();
    });

    (function tick() {
      if (ended) return;
      var elapsed = performance.now() - start;
      var pct = Math.min(loaded ? 100 : 92, (elapsed / SPAN) * 100);
      if (fill) fill.style.width = pct + '%';
      if (num) num.textContent = Math.round(pct);
      if (pct >= 100) { finish(); return; }
      requestAnimationFrame(tick);
    })();

    function finish() {
      if (ended) return;
      ended = true;
      if (fill) fill.style.width = '100%';
      if (num) num.textContent = '100';
      loader.classList.add('is-done');
      document.body.classList.remove('is-locked');
      setTimeout(function () { loader.setAttribute('hidden', ''); }, 700);
      // kick the hero in once the curtain lifts
      $$('.hero [data-reveal], .hero [data-split]').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-in'); }, 90 * i);
      });
    }
  })();

  /* ---------------------------------------------------------
     4. Custom cursor
     --------------------------------------------------------- */
  if (fine && !reduced) {
    var cur   = $('#cursor');
    var ring  = $('.cursor__ring', cur);
    var dot   = $('.cursor__dot', cur);
    var label = $('.cursor__label', cur);
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

    (function spin() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      if (dot)   dot.style.transform   = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (ring)  ring.style.transform  = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      if (label) label.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(spin);
    })();

    $$('a, button, [data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cur.classList.add('is-big');
        if (label) label.textContent = el.dataset.cursor || '';
      });
      el.addEventListener('mouseleave', function () {
        cur.classList.remove('is-big');
        if (label) label.textContent = '';
      });
    });
  }

  /* ---------------------------------------------------------
     5. Header: hide on scroll down, solid once past hero
     --------------------------------------------------------- */
  var head = $('#head');
  var lastY = 0;

  function onHeader(y) {
    if (!head) return;
    head.classList.toggle('is-solid', y > 40);
    if (y > lastY && y > 260) head.classList.add('is-hidden');
    else head.classList.remove('is-hidden');
    lastY = y;
  }

  /* ---------------------------------------------------------
     6. Burger / full menu
     --------------------------------------------------------- */
  var burger = $('#burger');
  var menu   = $('#menu');

  function setMenu(open) {
    if (!menu || !burger) return;
    if (open) menu.removeAttribute('hidden');
    requestAnimationFrame(function () { menu.classList.toggle('is-open', open); });
    burger.classList.toggle('is-on', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('is-locked', open);
    if (!open) setTimeout(function () { menu.setAttribute('hidden', ''); }, 800);
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
  }
  if (menu) {
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---------------------------------------------------------
     7. Smooth anchor scrolling (header-aware)
     --------------------------------------------------------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     8. Counters
     --------------------------------------------------------- */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count) || 0;
    var sfx = el.dataset.suffix || '';
    var done = false;

    function run() {
      if (done) return;
      done = true;
      if (reduced) { el.textContent = end + sfx; return; }
      var t0 = performance.now(), dur = 1500;
      (function step(now) {
        var p = clamp((now - t0) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + (p === 1 ? sfx : '');
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); o.disconnect(); } });
      }, { threshold: 0.5 }).observe(el);
    } else { run(); }
  });

  /* ---------------------------------------------------------
     9. Magnetic buttons
     --------------------------------------------------------- */
  if (fine && !reduced) {
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * 0.25 + 'px,' + dy * 0.35 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------------------------------------------------------
     10. Services — image peek that follows the pointer
     --------------------------------------------------------- */
  (function servicePeek() {
    var peek = $('#svcPeek');
    var list = $('#svcList');
    if (!peek || !list || !fine || reduced) return;
    var img = $('img', peek);

    $$('li', list).forEach(function (li) {
      li.addEventListener('mouseenter', function () {
        if (li.dataset.img) img.src = li.dataset.img;
        peek.classList.add('is-on');
      });
      li.addEventListener('mouseleave', function () { peek.classList.remove('is-on'); });
    });

    list.addEventListener('mousemove', function (e) {
      peek.style.left = e.clientX + 'px';
      peek.style.top  = e.clientY + 'px';
    });
  })();

  /* ---------------------------------------------------------
     11. Scroll engine — rail, parallax, progress bars
     --------------------------------------------------------- */
  var rail     = $('#rail');
  var track    = $('#railTrack');
  var railBar  = $('#railBar');
  var procList = $('#procList');
  var procFill = $('#procFill');
  var parallax = $$('[data-parallax]');
  var railOn   = false;
  var distance = 0;

  function measure() {
    railOn = !!(rail && track) && window.innerWidth > 760 && !reduced;
    if (!railOn) {
      if (rail) rail.style.height = '';
      if (track) track.style.transform = '';
      return;
    }
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    rail.style.height = (distance + window.innerHeight) + 'px';
  }

  function frame() {
    var y = window.scrollY || window.pageYOffset;
    onHeader(y);

    // horizontal rail
    if (railOn && distance > 0) {
      var top = rail.offsetTop;
      var p = clamp((y - top) / distance, 0, 1);
      track.style.transform = 'translate3d(' + (-p * distance) + 'px,0,0)';
      if (railBar) railBar.style.width = (p * 100) + '%';
    }

    // process line
    if (procList && procFill) {
      var r = procList.getBoundingClientRect();
      var pp = clamp((window.innerHeight * 0.85 - r.top) / (r.height * 0.6), 0, 1);
      procFill.style.width = (pp * 100) + '%';
    }

    // parallax layers
    if (!reduced) {
      parallax.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0;
        var box = el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) return;
        var off = (box.top + box.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      });
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { frame(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); frame(); });
  window.addEventListener('load', function () { measure(); frame(); });

  measure();
  frame();

  /* ---------------------------------------------------------
     12. Odds and ends
     --------------------------------------------------------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  if (!reduced && loader) document.body.classList.add('is-locked');

  // re-measure once webfonts land (they change the track width)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { measure(); frame(); });
  }
})();
