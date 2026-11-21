// ライトザライト マーケ・広報支援サイト
// タブ・よくある質問の開閉・ヘッダーの影・スマホの固定ボタン・控えめな出現
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- タブ（これまでの仕事） ----------
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

    function select(index, focus) {
      tabs.forEach(function (t, i) {
        var on = i === index;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    select(0, false);
  });

  // ---------- よくある質問 ----------
  document.querySelectorAll('[data-faq] .faq-q button').forEach(function (btn) {
    var answer = document.getElementById(btn.getAttribute('aria-controls'));
    if (!answer) return;
    // 質問の文を span で包む（矢印と並べるため）
    if (!btn.querySelector('span')) {
      var s = document.createElement('span');
      s.textContent = btn.textContent;
      btn.textContent = '';
      btn.appendChild(s);
    }
    answer.hidden = true;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      answer.hidden = open;
    });
  });

  // ---------- ヘッダーの影 ----------
  var header = document.getElementById('header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- スマホの固定ボタン（最初の画面を過ぎたら出し、最後の呼びかけでは隠す） ----------
  var bar = document.getElementById('mobile-cta');
  var hero = document.getElementById('top');
  var closing = document.getElementById('contact');
  if (bar && hero && closing && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var closingVisible = false;
    var link = bar.querySelector('a');
    var update = function () {
      var show = !heroVisible && !closingVisible;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (link) link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.target === hero) heroVisible = en.isIntersecting;
        if (en.target === closing) closingVisible = en.isIntersecting;
      });
      update();
    }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { closingVisible = en.isIntersecting; });
      update();
    }, { threshold: 0 }).observe(closing);
  }

  // ---------- 控えめな出現 ----------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.worry, .flowmap-outputs li, .service, .work, .reason, .member, .steps li');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
