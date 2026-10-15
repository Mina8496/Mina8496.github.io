(function () {
  'use strict';

  window.__appReady = true; // tells the safety net in <head> that this file loaded

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ------------------------------------------------------------
     Ready state: starts the hero animations (after the splash)
     ------------------------------------------------------------ */
  var isReady = false;
  var readyCallbacks = [];
  function onReady(fn) { if (isReady) fn(); else readyCallbacks.push(fn); }
  function setReady() {
    if (isReady) return;
    isReady = true;
    root.classList.add('ready');
    readyCallbacks.forEach(function (fn) { fn(); });
  }

  /* ------------------------------------------------------------
     Headline: split into words for the mask-reveal animation
     ------------------------------------------------------------ */
  var h1 = $('.hero h1');
  if (h1 && !h1.dataset.split) {
    var headline = h1.textContent.trim();
    h1.setAttribute('aria-label', headline);
    h1.textContent = '';
    headline.split(/\s+/).forEach(function (word, i) {
      var wrap = document.createElement('span');
      wrap.className = 'w';
      wrap.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.textContent = word;
      inner.style.setProperty('--i', i);
      wrap.appendChild(inner);
      h1.appendChild(wrap);
      h1.appendChild(document.createTextNode(' '));
    });
    h1.dataset.split = '1';
  }

  /* ------------------------------------------------------------
     Splash screen (once per visit)
     ------------------------------------------------------------ */
  var splash = $('.splash');
  if (reduce || root.classList.contains('no-splash') || !splash) {
    if (splash) splash.remove();
    setReady();
  } else {
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      var wait = Math.max(0, 1300 - performance.now());
      setTimeout(function () {
        splash.classList.add('hide');
        try { sessionStorage.setItem('seen', '1'); } catch (e) {}
        setTimeout(setReady, 350);
        setTimeout(function () { splash.remove(); }, 1100);
      }, wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
    setTimeout(finish, 4000);
  }

  /* ------------------------------------------------------------
     Typing effect
     ------------------------------------------------------------ */
  var typed = $('[data-words]');
  if (typed && !reduce) {
    var words = [];
    try { words = JSON.parse(typed.dataset.words); } catch (e) {}
    if (words.length) {
      var wi = 0, ci = words[0].length, deleting = true;
      var tick = function () {
        var word = words[wi];
        if (!deleting) {
          ci++;
          typed.textContent = word.slice(0, ci);
          if (ci === word.length) { deleting = true; return setTimeout(tick, 1600); }
          return setTimeout(tick, 70);
        }
        ci--;
        typed.textContent = word.slice(0, ci);
        if (ci <= 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          return setTimeout(tick, 350);
        }
        return setTimeout(tick, 35);
      };
      onReady(function () { setTimeout(tick, 2200); });
    }
  }

  /* ------------------------------------------------------------
     Scroll reveal (with stagger)
     ------------------------------------------------------------ */
  $$('[data-stagger]').forEach(function (parent) {
    var kind = parent.getAttribute('data-stagger') || '';
    Array.prototype.forEach.call(parent.children, function (child, i) {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', kind);
      child.style.setProperty('--i', i);
    });
  });

  var revealObserver = null;
  if (!reduce && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  }
  function watchReveal(el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('in');
  }
  $$('[data-reveal]').forEach(watchReveal);

  /* ------------------------------------------------------------
     Projects grid: rendered from projects.js, with filters
     ------------------------------------------------------------ */
  (function () {
    var grid = $('#project-grid');
    var data = window.PROJECTS || [];
    if (!grid || !data.length) return;

    var filterBox = $('.filters');
    var moreBtn = $('#more-btn');
    var countEl = $('[data-projects-count]');
    var GH = 'https://github.com/Mina8496/';
    var LIMIT = 9;
    var current = 'all';
    var expanded = false;

    // Projects can omit cats / tech / repo without breaking anything
    function catsOf(p) { return p.cats || []; }
    function allFilters() {
      var list = (window.PROJECT_FILTERS || [['all', 'All']]).slice();
      var known = list.map(function (f) { return f[0]; });
      data.forEach(function (p) {
        catsOf(p).forEach(function (c) {
          if (known.indexOf(c) === -1) {
            known.push(c);
            list.push([c, c.charAt(0).toUpperCase() + c.slice(1)]);
          }
        });
      });
      return list;
    }

    if (countEl) countEl.textContent = data.length;

    function make(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }

    function buildLink(href, iconClass, label) {
      var link = make('a', 'link');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      var icon = make('i', iconClass);
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      link.appendChild(document.createTextNode(' ' + label));
      return link;
    }

    function buildCard(p, i) {
      var card = make('article', 'mini glow');
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--i', i % 3);
      card.appendChild(make('h4', '', p.name));
      card.appendChild(make('p', '', p.desc));

      var chips = make('ul', 'chips chips-sm');
      (p.tech || []).forEach(function (t) { chips.appendChild(make('li', '', t)); });
      if (chips.children.length) card.appendChild(chips);

      var href = p.url || (p.repo ? GH + p.repo : '');
      var row = make('div', 'mini-links');
      if (href) row.appendChild(buildLink(href, 'fa-brands fa-github', 'View on GitHub'));
      if (p.play) row.appendChild(buildLink(p.play, 'fa-brands fa-google-play', 'Google Play'));
      if (row.children.length) card.appendChild(row);
      return card;
    }

    function matches(p) { return current === 'all' || catsOf(p).indexOf(current) !== -1; }

    function render(animateNow) {
      var list = data.filter(matches);
      var shown = expanded ? list : list.slice(0, LIMIT);
      grid.textContent = '';
      shown.forEach(function (p, i) {
        var card = buildCard(p, i);
        grid.appendChild(card);
        if (animateNow) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { card.classList.add('in'); });
          });
        } else {
          watchReveal(card);
        }
      });
      if (moreBtn) {
        moreBtn.hidden = list.length <= LIMIT;
        moreBtn.textContent = expanded ? 'Show fewer' : 'Show all ' + list.length + ' projects';
      }
    }

    if (filterBox) {
      allFilters().forEach(function (f) {
        var count = f[0] === 'all' ? data.length : data.filter(function (p) { return catsOf(p).indexOf(f[0]) !== -1; }).length;
        if (!count) return;
        var btn = make('button', 'filter-btn');
        btn.type = 'button';
        btn.dataset.filter = f[0];
        btn.setAttribute('aria-pressed', f[0] === current ? 'true' : 'false');
        btn.appendChild(document.createTextNode(f[1]));
        btn.appendChild(make('span', 'n', String(count)));
        filterBox.appendChild(btn);
      });

      filterBox.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn || btn.dataset.filter === current) return;
        current = btn.dataset.filter;
        expanded = false;
        $$('.filter-btn', filterBox).forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        grid.classList.add('swap');
        setTimeout(function () { render(true); grid.classList.remove('swap'); }, reduce ? 0 : 180);
      });
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        expanded = !expanded;
        render(true);
      });
    }

    render(false);
  })();

  /* ------------------------------------------------------------
     Apps gallery: arrows, real screenshots (if present), tilt
     ------------------------------------------------------------ */
  (function () {
    var track = $('.shots');
    if (!track) return;
    var prev = $('[data-shots-prev]');
    var next = $('[data-shots-next]');

    function step() {
      var first = track.querySelector('.shot');
      return (first ? first.getBoundingClientRect().width : 232) + 30;
    }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // If a real screenshot exists (images/xxx.png), it replaces the drawn screen
    var shots = $$('.shot[data-shot]');
    var note = $('[data-shots-note]');
    var pending = shots.length, real = 0;
    function settle() {
      pending--;
      if (pending === 0 && note && real === shots.length) note.hidden = true;
    }
    shots.forEach(function (shot) {
      var img = new Image();
      img.onload = function () {
        var screen = $('.screen', shot);
        var caption = $('figcaption strong', shot);
        img.alt = (caption ? caption.textContent : 'App') + ' screenshot';
        img.className = 'shot-img';
        if (screen) { screen.textContent = ''; screen.appendChild(img); }
        real++;
        settle();
      };
      img.onerror = settle;
      img.src = shot.dataset.shot;
    });

    // Mouse tilt on the phones
    if (fine && !reduce) {
      track.addEventListener('pointermove', function (e) {
        var dev = e.target.closest('.dev');
        if (!dev) return;
        var r = dev.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        dev.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) +
          'deg) rotateY(' + ((px - 0.5) * 9).toFixed(2) + 'deg) translateY(-6px)';
      });
      track.addEventListener('pointerout', function (e) {
        var dev = e.target.closest('.dev');
        if (dev && !dev.contains(e.relatedTarget)) dev.style.transform = '';
      });
    }
  })();

  /* Hero fact: total number of projects comes from the list (+2 client apps) */
  (function () {
    var total = $('[data-projects-total]');
    if (!total || !window.PROJECTS) return;
    var n = window.PROJECTS.length + $$('.feature').length;
    total.dataset.count = n;
    total.textContent = n;
  })();

  /* ------------------------------------------------------------
     Count-up numbers
     ------------------------------------------------------------ */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count) || 0;
    if (reduce || !('IntersectionObserver' in window)) { el.textContent = end; return; }
    el.textContent = '0';

    function run() {
      var start = performance.now(), duration = 1400;
      (function step(now) {
        var p = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }

    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.disconnect();
        onReady(function () { setTimeout(run, 900); });
      });
    }, { threshold: 0.6 });
    countObserver.observe(el);
  });

  /* ------------------------------------------------------------
     Scroll-linked: progress bar, header shadow, back-to-top,
     timeline fill
     ------------------------------------------------------------ */
  var progress = $('.progress');
  var header = $('.site-header');
  var toTop = $('.to-top');
  var timeline = $('.timeline');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      if (header) header.classList.toggle('scrolled', y > 8);
      if (toTop) toTop.classList.toggle('show', y > 700);
      if (timeline) {
        var r = timeline.getBoundingClientRect();
        var p = (window.innerHeight * 0.6 - r.top) / r.height;
        timeline.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------
     Active nav link
     ------------------------------------------------------------ */
  (function () {
    var links = $$('.nav-links a');
    var sections = [];
    links.forEach(function (link) {
      var target = $(link.getAttribute('href'));
      if (target) sections.push({ link: link, el: target });
    });
    if (!('IntersectionObserver' in window) || !sections.length) return;

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (match) match.link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s.el); });
  })();

  /* ------------------------------------------------------------
     Theme toggle
     ------------------------------------------------------------ */
  (function () {
    var toggle = $('[data-theme-toggle]');
    if (!toggle) return;
    function sync() { toggle.setAttribute('aria-pressed', root.dataset.theme === 'dark'); }
    sync();
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      sync();
      setTimeout(function () { root.classList.remove('theme-anim'); }, 500);
    });
  })();

  /* ------------------------------------------------------------
     Tech marquee: duplicate the list for a seamless loop
     ------------------------------------------------------------ */
  (function () {
    var set = $('.marquee-set');
    if (!set) return;
    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    set.parentNode.appendChild(clone);
  })();

  /* ------------------------------------------------------------
     Quiz phone: countdown timer
     ------------------------------------------------------------ */
  (function () {
    var timer = $('[data-timer]');
    if (!timer || reduce) return;
    var left = 24;
    setInterval(function () {
      left = left <= 0 ? 24 : left - 1;
      timer.textContent = '00:' + (left < 10 ? '0' : '') + left;
    }, 1000);
  })();

  /* ------------------------------------------------------------
     Mouse-only effects: cursor glow, hero parallax, 3D tilt,
     card spotlight, magnetic buttons
     ------------------------------------------------------------ */
  if (fine && !reduce) {
    // Cursor glow
    var glow = $('.cursor-glow');
    if (glow) {
      var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, shown = false;
      window.addEventListener('pointermove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!shown) { shown = true; glow.classList.add('on'); }
      });
      (function loop() {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = 'translate3d(' + (gx - 190) + 'px,' + (gy - 190) + 'px,0)';
        requestAnimationFrame(loop);
      })();
    }

    // Hero parallax on the phones
    var hero = $('.hero');
    var stage = $('.stage-inner');
    if (hero && stage) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        stage.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
      });
      hero.addEventListener('pointerleave', function () {
        stage.style.setProperty('--ry', '0deg');
        stage.style.setProperty('--rx', '0deg');
      });
    }

    // 3D tilt + spotlight on the project cards (delegated, cards are created by JS)
    var projectGrid = $('#project-grid');
    if (projectGrid) {
      projectGrid.addEventListener('pointermove', function (e) {
        var card = e.target.closest('.mini');
        if (!card) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(800px) rotateX(' + ((0.5 - py) * 8).toFixed(2) +
          'deg) rotateY(' + ((px - 0.5) * 8).toFixed(2) + 'deg) translateY(-4px)';
        card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      });
      projectGrid.addEventListener('pointerout', function (e) {
        var card = e.target.closest('.mini');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
      });
    }

    // Spotlight that follows the mouse inside a card
    $$('.glow').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--gx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      });
    });

    // Magnetic buttons
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.25;
        var y = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.translate = x + 'px ' + y + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = ''; });
    });
  }

  /* ------------------------------------------------------------
     Avatar fallback + footer year
     ------------------------------------------------------------ */
  (function () {
    var img = $('.avatar img');
    if (img) {
      var drop = function () { img.remove(); };
      img.addEventListener('error', drop);
      if (img.complete && img.naturalWidth === 0) drop();
    }
    var y = $('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  })();
})();
