/* ============================================================
   scenes.js — 分幕演示引擎 + 顾问控制台  v2（6 幕）
   ============================================================ */
(function () {
  "use strict";
  const P = window.PRODUCT;
  const M = window.MODEL;
  const C = window.CHARTS;

  const TOTAL = 6;
  const t = function (k, v) { return I18N.t(k, v); };
  const $ = function (s) { return document.querySelector(s); };
  const $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- 状态 ---------- */
  const state = {
    clientName: P.defaults.clientName.zh,
    advisor: P.defaults.advisor.zh,
    age: P.defaults.age,
    retireAge: P.defaults.retireAge,
    premium: P.defaults.premium,
    payYears: P.defaults.payYears,
    risk: P.defaults.risk,
    payoutYears: P.defaults.payoutYears,
    stressGross: null,
    scene: 0
  };

  /* ---------- 引擎幕右侧 chips ---------- */
  const CHIPS = ["chip.pct100", "chip.welcome", "chip.special", "chip.cap"];
  const FLEX = ["fx.medical", "fx.pass", "fx.holiday", "fx.cashout", "fx.legacy"];

  /* ============================================================
     计算
     ============================================================ */
  let scenarios = null, current = null, hitCase = null;

  function inputOf() {
    return {
      age: state.age, retireAge: state.retireAge, premium: state.premium,
      payYears: state.payYears, risk: state.risk, payoutYears: state.payoutYears,
      stressGross: state.stressGross
    };
  }

  /* 只有参数与手册案例完全一致时才启用锚定，避免调整后数值失真 */
  function matchCase(input) {
    if (input.stressGross !== undefined && input.stressGross !== null) return null;
    for (let i = 0; i < P.cases.length; i++) {
      const c = P.cases[i], ci = c.input;
      if (ci.age === input.age && ci.retireAge === input.retireAge &&
          ci.premium === input.premium && ci.payYears === input.payYears &&
          ci.payoutYears === input.payoutYears) return c;
    }
    return null;
  }

  function compute() {
    const input = inputOf();
    hitCase = matchCase(input);
    if (hitCase) input.anchors = hitCase.anchors;
    scenarios = M.allScenarios(input);
    current = scenarios[state.risk];
  }

  /* ============================================================
     各幕渲染
     ============================================================ */
  function renderCover() {
    const brand = P.brand[I18N.getLang()];
    $("#coverEyebrow").textContent = brand.latin.toUpperCase();
    $("#coverName").textContent = state.clientName;
    $("#coverPersona").textContent = hitCase
      ? hitCase.persona[I18N.getLang()]
      : brand.name + " · " + brand.category;
    $("#coverAge").textContent = state.age + " " + t("unit.age");
    $("#coverPremium").textContent = I18N.money(state.premium);
    $("#coverRetire").textContent = state.retireAge + " " + t("unit.age");
    $("#coverGoal").textContent = I18N.money(current.endValue);
    $("#coverGoalSub").textContent = t("path.atAge", { age: state.retireAge });
    $("#coverAdvisor").textContent = state.advisor;
    C.spark($("#coverSpark"), current);
  }

  function renderEngine() {
    C.invest($("#chartInvest"), inputOf(), current);
    $("#eqOwn").textContent = I18N.money(current.principal);
    $("#eqBonus").textContent = I18N.money(current.totalBonus);
    $("#eqTotal").textContent = I18N.money(current.principal + current.totalBonus);

    const g = $("#engineChips");
    g.innerHTML = "";
    CHIPS.forEach(function (key) {
      const el = document.createElement("div");
      el.className = "chip";
      el.innerHTML = "<b data-i18n=\"" + key + ".t\"></b><span data-i18n=\"" + key + ".d\"></span>";
      g.appendChild(el);
    });
    I18N.applyI18n(g);
  }

  function renderPath() {
    C.path($("#chartPath"), current, inputOf());
    $("#pathValueLabel").textContent = t("path.atAge", { age: state.retireAge });
    $("#pathValue").textContent = I18N.money(current.endValue);
    $("#pathDelta").textContent = I18N.money(current.delta);
    const pct = current.principal > 0 ? current.delta / current.principal : 0;
    $("#pathDeltaPct").textContent = t("delta.extraPct", { pct: I18N.fmtPct(pct, 0) });
  }

  function renderValue() {
    C.valueBars($("#chartValue"), current, inputOf());
  }

  function renderFunds() {
    const g = $("#fundGrid");
    g.innerHTML = "";
    P.fundOrder.forEach(function (k) {
      const f = P.funds[k], s = scenarios[k], on = k === state.risk;
      const el = document.createElement("div");
      el.className = "fund-card" + (on ? " current" : "");
      el.setAttribute("data-fund", k);
      el.innerHTML =
        '<div class="fund-top">' +
          '<div class="fund-name" data-i18n="fund.' + k + '"></div>' +
          '<span class="fund-flag" data-i18n="funds.current"></span>' +
        "</div>" +
        '<div class="fund-ring" id="ring-' + k + '"></div>' +
        '<div class="fund-foot">' +
          '<div class="stat-label"><span></span>' +
            "<em>" + I18N.fmtPct(f.gross, 0) + " · " + t("fund.risk." + f.risk) + "</em></div>" +
          '<div class="stat-value num" style="color:' +
            (on ? "var(--gold-soft)" : "var(--ink)") + '">' + I18N.money(s.endValue) + "</div>" +
        "</div>";
      g.appendChild(el);
    });

    const ageLabel = t("funds.atAge", { age: state.retireAge });
    $$("#fundGrid .stat-label span").forEach(function (el) { el.textContent = ageLabel; });
    I18N.applyI18n(g);

    P.fundOrder.forEach(function (k) { C.ring($("#ring-" + k), k, k === state.risk); });

    $$("[data-fund]").forEach(function (el) {
      el.addEventListener("click", function () {
        state.risk = el.getAttribute("data-fund");
        update();
      });
    });
  }

  function renderSummary() {
    $("#sumClient").textContent = state.clientName;
    $("#sumAdvisor").textContent = state.advisor;
    $("#sumAge").textContent = state.age + " " + t("unit.age");
    $("#sumTerm").textContent = state.payYears + " " + t("unit.year");
    $("#sumPremium").textContent = I18N.money(state.premium);
    $("#sumPayout").textContent = state.retireAge + " " + t("unit.age");
    $("#sumFund").textContent = t("fund." + state.risk);
    $("#sumPrincipal").textContent = I18N.money(current.principal);

    C.summaryBars($("#chartSummary"), scenarios, inputOf());

    const g = $("#flexChips");
    g.innerHTML = "";
    FLEX.forEach(function (key) {
      const el = document.createElement("div");
      el.className = "chip";
      el.style.borderLeftColor = "var(--gold)";
      el.innerHTML = '<span data-i18n="' + key + '"></span>';
      g.appendChild(el);
    });
    I18N.applyI18n(g);
  }

  function renderAll() {
    renderCover();
    renderEngine();
    renderPath();
    renderValue();
    renderFunds();
    renderSummary();
  }

  /* ============================================================
     幕次导航
     ============================================================ */
  function buildDots() {
    const wrap = $("#dots");
    wrap.innerHTML = "";
    for (let i = 0; i < TOTAL; i++) {
      const b = document.createElement("button");
      b.className = "dot-btn";
      b.setAttribute("data-go", i);
      b.innerHTML = "<i></i>" + t("scene." + i);
      b.addEventListener("click", function () { goTo(+b.getAttribute("data-go")); });
      wrap.appendChild(b);
    }
    syncDots();
  }
  function relabelDots() {
    $$("[data-go]").forEach(function (b) {
      b.innerHTML = "<i></i>" + t("scene." + b.getAttribute("data-go"));
    });
  }
  function syncDots() {
    $$("[data-go]").forEach(function (b) {
      b.classList.toggle("active", +b.getAttribute("data-go") === state.scene);
    });
  }

  function goTo(n, back) {
    n = Math.max(0, Math.min(TOTAL - 1, n));
    const dirBack = back === undefined ? n < state.scene : back;
    state.scene = n;
    $$(".scene").forEach(function (s) {
      const i = +s.getAttribute("data-scene");
      s.classList.toggle("active", i === n);
      s.classList.toggle("back", i !== n && dirBack);
    });
    syncDots();
    C.resize();
  }
  function next() { goTo(state.scene + 1, false); }
  function prev() { goTo(state.scene - 1, true); }

  /* ============================================================
     顾问控制台
     ============================================================ */
  const SLIDERS = [
    { id: "age", key: "console.age", min: 18, max: 55, step: 1,
      get: function () { return state.age; },
      set: function (v) { state.age = v; if (state.retireAge < v + 5) state.retireAge = v + 5; },
      fmt: function (v) { return v + " " + t("unit.age"); } },
    { id: "retire", key: "console.retire", min: 45, max: 80, step: 1,
      get: function () { return state.retireAge; },
      set: function (v) { state.retireAge = Math.max(v, state.age + 5); },
      fmt: function (v) { return v + " " + t("unit.age"); } },
    { id: "premium", key: "console.premium", min: 6000, max: 60000, step: 600,
      get: function () { return state.premium; },
      set: function (v) { state.premium = v; },
      fmt: function (v) { return I18N.money(v); } },
    { id: "payout", key: "console.payout", min: 5, max: 30, step: 1,
      get: function () { return state.payoutYears; },
      set: function (v) { state.payoutYears = v; },
      fmt: function (v) { return v + " " + t("unit.year"); } }
  ];

  function fillSlider(el) {
    const min = +el.min, max = +el.max, v = +el.value;
    el.style.setProperty("--fill", ((v - min) / (max - min) * 100) + "%");
  }

  function buildConsole() {
    const b = $("#consoleBody");
    b.innerHTML = "";

    b.insertAdjacentHTML("beforeend",
      '<div class="c-field"><label data-i18n="console.client"></label>' +
        '<input type="text" id="cClient"></div>' +
      '<div class="c-field"><label data-i18n="console.advisor"></label>' +
        '<input type="text" id="cAdvisor"></div>');

    b.insertAdjacentHTML("beforeend", '<div class="c-group-t">' + t("console.title") + "</div>");
    SLIDERS.forEach(function (d) {
      const el = document.createElement("div");
      el.className = "c-field";
      el.innerHTML =
        "<label>" + t(d.key) + '<span class="c-val" id="v-' + d.id + '"></span></label>' +
        '<input type="range" id="r-' + d.id + '" min="' + d.min + '" max="' + d.max +
          '" step="' + d.step + '">';
      b.appendChild(el);
      const r = $("#r-" + d.id);
      r.addEventListener("input", function () { d.set(+r.value); update(); });
    });

    b.insertAdjacentHTML("beforeend",
      '<div class="c-field"><label data-i18n="console.term"></label>' +
        '<div class="seg seg-3" id="segTerm"></div></div>');
    const segTerm = $("#segTerm");
    P.iipOptions.forEach(function (y) {
      const btn = document.createElement("button");
      btn.setAttribute("data-term", y);
      btn.textContent = y + " " + t("unit.year");
      btn.addEventListener("click", function () { state.payYears = y; update(); });
      segTerm.appendChild(btn);
    });

    b.insertAdjacentHTML("beforeend",
      '<div class="c-field"><label data-i18n="console.risk"></label>' +
        '<div class="seg seg-3" id="segRisk"></div></div>');
    const segRisk = $("#segRisk");
    P.fundOrder.forEach(function (k) {
      const btn = document.createElement("button");
      btn.setAttribute("data-risk", k);
      btn.textContent = I18N.fmtPct(P.funds[k].gross, 0);
      btn.title = t("fund." + k);
      btn.addEventListener("click", function () { state.risk = k; update(); });
      segRisk.appendChild(btn);
    });

    b.insertAdjacentHTML("beforeend",
      '<div class="c-group-t">' + t("console.cases") + "</div>" +
      '<div class="c-field"><div class="seg" id="segCase" style="grid-template-columns:1fr 1fr"></div>' +
        '<div class="seg" id="segCaseReset" style="margin-top:6px"></div></div>');
    const segCase = $("#segCase");
    P.cases.forEach(function (c) {
      const btn = document.createElement("button");
      btn.setAttribute("data-case", c.id);
      btn.textContent = t("console.case." + c.id);
      btn.addEventListener("click", function () { loadCase(c.id); });
      segCase.appendChild(btn);
    });
    const customBtn = document.createElement("button");
    customBtn.setAttribute("data-case", "custom");
    customBtn.textContent = t("console.case.custom");
    $("#segCaseReset").appendChild(customBtn);

    b.insertAdjacentHTML("beforeend",
      '<div class="c-group-t">' + t("console.stress") + "</div>" +
      '<div class="c-field"><div class="seg seg-3" id="segStress"></div>' +
        '<div class="stress-on" id="stressOn"></div></div>');
    const segStress = $("#segStress");
    const stressOpts = [{ id: "off", key: "console.stress.off", val: null }]
      .concat(P.stress.map(function (s) { return { id: s.id, key: s.key, val: s.gross }; }));
    stressOpts.forEach(function (o) {
      const btn = document.createElement("button");
      btn.setAttribute("data-stress", o.id);
      btn.textContent = t(o.key);
      btn.addEventListener("click", function () { state.stressGross = o.val; update(); });
      segStress.appendChild(btn);
    });

    b.insertAdjacentHTML("beforeend",
      '<div class="c-group-t" style="border:none"></div>' +
      '<div style="font-size:11px;color:var(--ink-3);line-height:1.6">' +
        "C " + t("app.console") + " ・ F 全屏 ・ P " + t("sum.print") + " ・ ← → 翻页</div>");

    I18N.applyI18n(b);

    const ci = $("#cClient"), ai = $("#cAdvisor");
    ci.value = state.clientName;
    ai.value = state.advisor;
    ci.addEventListener("input", function () { state.clientName = ci.value; renderCover(); renderSummary(); });
    ai.addEventListener("input", function () { state.advisor = ai.value; renderCover(); renderSummary(); });

    syncConsole();
  }

  function syncConsole() {
    SLIDERS.forEach(function (d) {
      const r = $("#r-" + d.id);
      if (!r) return;
      r.value = d.get();
      fillSlider(r);
      const v = $("#v-" + d.id);
      if (v) v.textContent = d.fmt(d.get());
    });

    $$("[data-term]").forEach(function (b) {
      b.classList.toggle("active", +b.getAttribute("data-term") === state.payYears);
    });
    $$("[data-risk]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-risk") === state.risk);
    });
    $$("[data-stress]").forEach(function (b) {
      const id = b.getAttribute("data-stress");
      const on = (id === "off" && (state.stressGross === null || state.stressGross === undefined)) ||
        (state.stressGross !== null && state.stressGross !== undefined &&
          P.stress.some(function (s) { return s.id === id && s.gross === state.stressGross; }));
      b.classList.toggle("active", on);
    });
    $$("[data-case]").forEach(function (b) {
      const id = b.getAttribute("data-case");
      const on = id === "custom" ? !hitCase : (hitCase && hitCase.id === id);
      b.classList.toggle("active", !!on);
    });

    const so = $("#stressOn");
    if (so) {
      const on = state.stressGross !== null && state.stressGross !== undefined;
      so.classList.toggle("show", on);
      if (on) so.textContent = t("console.stressOn") + " · " + I18N.fmtPct(state.stressGross, 0);
    }
  }

  function loadCase(id) {
    const c = P.cases.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    const ci = c.input;
    state.age = ci.age;
    state.retireAge = ci.retireAge;
    state.premium = ci.premium;
    state.payYears = ci.payYears;
    state.risk = ci.risk;
    state.payoutYears = ci.payoutYears;
    state.stressGross = null;
    state.clientName = c.name[I18N.getLang()];
    update();
  }

  function update() {
    compute();
    renderAll();
    syncConsole();
  }

  /* ============================================================
     交互
     ============================================================ */
  function toggleConsole(force) {
    const el = $("#console");
    const open = force === undefined ? !el.classList.contains("open") : force;
    el.classList.toggle("open", open);
    $("#consoleToggle").classList.toggle("on", open);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  function bindEvents() {
    $("#consoleToggle").addEventListener("click", function () { toggleConsole(); });
    $("#coverStart").addEventListener("click", function () { goTo(1); });
    $("#restartBtn").addEventListener("click", function () { goTo(0, true); });
    $("#printBtn").addEventListener("click", function () {
      if (state.scene !== 5) {
        goTo(5);
        setTimeout(function () { window.print(); }, 480);
      } else {
        window.print();
      }
    });

    document.addEventListener("keydown", function (e) {
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
        case " ": e.preventDefault(); next(); break;
        case "Home": goTo(0, true); break;
        case "End": goTo(TOTAL - 1); break;
        case "c": case "C": toggleConsole(); break;
        case "f": case "F": toggleFullscreen(); break;
        case "p": case "P": if (state.scene === 5) window.print(); break;
      }
    });

    const stage = $("#stage");
    let sx = 0, sy = 0, tracking = false;
    stage.addEventListener("touchstart", function (e) {
      sx = e.changedTouches[0].clientX;
      sy = e.changedTouches[0].clientY;
      tracking = true;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });

    let rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { C.resize(); }, 140);
    });

    I18N.onChange(function () {
      relabelDots();
      update();
      buildConsole();
    });
  }

  /* ============================================================
     初始化
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    compute();
    buildDots();
    renderAll();
    buildConsole();
    bindEvents();
    goTo(0, true);
    setTimeout(function () { C.resize(); }, 60);
  });

  window.__VISTA = { state: state, update: update, goTo: goTo };
})();
