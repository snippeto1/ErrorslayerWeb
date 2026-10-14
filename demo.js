/* Error Slayer: playable demo inside the landing-page phone.
   Main menu -> (Settings: Easy / Medium / Hard) -> 5 cards -> score screen. */
(function () {
  var SVG = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  var ICO = {
    pause: '<svg ' + SVG + '><circle cx="12" cy="12" r="9.5"/><path d="M10 8.5v7M14 8.5v7"/></svg>',
    bulb:  '<svg ' + SVG + '><path d="M9 18h6M10 21h4M8.5 14.2A6.5 6.5 0 1 1 15.5 14.2c-.7.6-1 1.4-1 2.3V17h-5v-.5c0-.9-.3-1.7-1-2.3z"/></svg>',
    snd:   '<svg ' + SVG + '><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4z"/><path d="M16.5 9.2a4 4 0 0 1 0 5.6M19 7a7.5 7.5 0 0 1 0 10"/></svg>',
    cup:   '<svg ' + SVG + '><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 2.5M17 6h2.5a2.5 2.5 0 0 1-2.6 2.5M12 14v3.5M8.5 20.5h7M9.5 17.5h5l.5 3h-6l.5-3z"/></svg>',
    gear:  '<svg ' + SVG + '><circle cx="12" cy="12" r="3"/><path d="M12 2.8l1.6 2.3 2.7-.8.8 2.7 2.7.8-.8 2.7 2.3 1.6-2.3 1.6.8 2.7-2.7.8-.8 2.7-2.7-.8L12 21.2l-1.6-2.3-2.7.8-.8-2.7-2.7-.8.8-2.7L2.8 12l2.3-1.6-.8-2.7 2.7-.8.8-2.7 2.7.8L12 2.8z"/></svg>'
  };
  var CARDS = [
    { text: "Printmaking allowed a single artist to reach buyers across {{the}} Europe.",
      errors: [{ wrong: "the", correct: "—", distractors: ["an", "this"], rule: "Articles" }] },
    { text: "The scratches {{records}} the direction in {{who}} the ice was moving.",
      errors: [{ wrong: "records", correct: "record", distractors: ["recording", "recorded"], rule: "Subject–verb agreement" },
               { wrong: "who", correct: "which", distractors: ["what", "whom"], rule: "Relative pronouns" }] },
    { text: "The songs are recorded first by singers who never appear {{in}} the screen.",
      errors: [{ wrong: "in", correct: "on", distractors: ["at", "to"], rule: "Prepositions of place" }] },
    { text: "Stendhal {{write}} that a novel is a mirror {{carries}} along a road.",
      errors: [{ wrong: "write", correct: "wrote", distractors: ["writes", "writing"], rule: "Irregular verb" },
               { wrong: "carries", correct: "carried", distractors: ["carry", "carrying"], rule: "Past simple" }] },
    { text: "Momentum is the mass of a body multiplied by {{it's}} velocity.",
      errors: [{ wrong: "it's", correct: "its", distractors: ["their", "it is"], rule: "Apostrophes" }] },
    { text: "Attendances fell {{sharp}} afterwards, and {{them}} took several years to recover.",
      errors: [{ wrong: "sharp", correct: "sharply", distractors: ["more sharp", "most sharp"], rule: "Adverbs and adjectives" },
               { wrong: "them", correct: "they", distractors: ["their", "theirs"], rule: "Subject and object pronouns" }] }
  ];
  /* Same rules as the app: seconds per card, wrong taps allowed per card, max errors on a card, italic hint. */
  var LEVELS = {
    easy:   { label: "Easy",   sec: 60, wrong: 3, maxErr: 3, italic: true },
    medium: { label: "Medium", sec: 30, wrong: 2, maxErr: 2, italic: false },
    hard:   { label: "Hard",   sec: 15, wrong: 1, maxErr: 1, italic: false }
  };
  var ROUNDS = 5, HEARTS = 5, HINTS = 3;
  /* Scoring as in the app: first correct answer 1, then 2 each, 10 each once the score reaches 15; a hinted word is worth half (rounded up). */
  function points(hinted) { var p = S.correct === 0 ? 1 : (S.score >= 15 ? 10 : 2); return hinted ? Math.ceil(p / 2) : p; }
  var level = "easy";
  var remind = true;
  var root = document.querySelector(".phone .mock");
  if (!root) return;
  var S = null;

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function on(sel, fn) { root.querySelectorAll(sel).forEach(function (el) { el.addEventListener("click", function (e) { e.stopPropagation(); fn(el, e); }); }); }
  function stopTimers() { if (S) { clearInterval(S.timer); clearTimeout(S.swipeTimer); } }

  /* ---------- main menu (real screenshot) ---------- */
  function menu() {
    stopTimers();
    root.innerHTML = '<div class="menu"><img src="menu-screen.jpg" alt="Error Slayer main menu">' +
      '<button class="hot play" aria-label="Play"></button>' +
      '<a class="hot ig" href="https://www.instagram.com/error_slayer_" target="_blank" rel="noopener" aria-label="Instagram"></a>' +
      '<button class="hot gear" aria-label="Settings"></button></div>';
    on(".play", newGame);
    on(".gear", settings);
  }

  /* ---------- settings (built to match the app's screen) ---------- */
  function settings() {
    stopTimers();
    root.innerHTML = '<div class="set">' +
      '<div class="set-bar"><button class="back" aria-label="Back">‹</button><span>Settings</span><i class="ic snd">' + ICO.snd + '</i></div>' +
      '<div class="set-btns">' + ["easy", "medium", "hard"].map(function (k) {
        return '<button class="lvl' + (k === level ? " sel" : "") + '" data-lvl="' + k + '">' + LEVELS[k].label + "</button>";
      }).join("") + "</div>" +
      '<div class="set-rem"><span>Daily reminder</span><button class="sw' + (remind ? " on" : "") + '" role="switch" aria-checked="' + remind + '" aria-label="Daily reminder"><i></i></button></div>' +
      '<a class="set-pp" href="privacy.html">Privacy Policy</a></div>';
    on(".back", menu);
    on(".lvl", function (el) { level = el.getAttribute("data-lvl"); settings(); });
    on(".sw", function () { remind = !remind; settings(); });
  }

  /* ---------- game ---------- */
  function newGame() {
    stopTimers();
    var L = LEVELS[level];
    var pool = shuffle(CARDS.filter(function (c) { return c.errors.length <= L.maxErr; }));
    S = { L: L, deck: pool.slice(0, ROUNDS), i: 0, played: 0, score: 0, correct: 0, hearts: HEARTS, hints: HINTS, timer: null, swipeTimer: null };
    loadCard();
  }
  /* RETRY, as in the app: score, hearts and hints reset, but the deck continues from the card you failed on */
  function retryGame() {
    stopTimers();
    var deck = S.deck.slice(S.i).concat(S.deck.slice(0, S.i));
    S = { L: S.L, deck: deck, i: 0, played: 0, score: 0, correct: 0, hearts: HEARTS, hints: HINTS, timer: null, swipeTimer: null };
    loadCard();
  }
  function loadCard() {
    var c = S.deck[S.i];
    S.card = c; S.open = null; S.done = false; S.failed = false; S.wrongTaps = 0; S.left = S.L.sec; S.hint = "";
    S.tokens = c.text.split(/(\{\{[^}]+\}\})/).filter(Boolean).map(function (t) {
      var m = t.match(/^\{\{(.+)\}\}$/);
      if (m) { var e = c.errors.filter(function (x) { return x.wrong === m[1]; })[0]; return { err: e, text: m[1], fixed: false }; }
      return { text: t };
    });
    stopTimers();
    S.timer = setInterval(tick, 1000);
    render();
  }
  function tick() {
    if (S.done || S.paused) return;
    S.left--;
    if (S.left <= 0) { S.left = 0; clearInterval(S.timer); return endGame("Time's up"); }
    var t = root.querySelector(".tm"); if (t) t.textContent = S.left;
  }
  function hearts() { var h = ""; for (var k = 0; k < HEARTS; k++) h += '<b class="' + (k < S.hearts ? "" : "lost") + '">♥</b>'; return h; }
  function pbar() { var h = ""; for (var k = 0; k < ROUNDS; k++) h += '<i class="' + (k < S.played ? "on" : "") + '"></i>'; return h; }

  function render() {
    var chips;
    if (S.open !== null) {
      var tok = S.tokens[S.open];
      if (!tok.options) tok.options = shuffle([tok.err.correct].concat(tok.err.distractors));
      chips = tok.options.map(function (o, k) { return '<button class="chip" data-opt="' + k + '">' + esc(o) + "</button>"; }).join("");
    } else {
      chips = '<span class="chip ghost"></span><span class="chip ghost"></span><span class="chip ghost"></span>';
    }
    var words = S.tokens.map(function (t, k) {
      if (!t.err) return esc(t.text);
      if (t.fixed) return t.err.correct === "—" ? "" : '<span class="w fixed">' + esc(t.err.correct) + "</span>";
      return '<span class="w err' + (S.L.italic ? " it" : "") + (S.open === k ? " open" : "") + '" data-tok="' + k + '">' + esc(t.text) + "</span>";
    }).join("").replace(/\s{2,}/g, " ");
    if (S.paused) {
      root.innerHTML =
        '<div class="hud paused"><span class="l"><b class="pcount">' + S.score + '</b></span><span class="r"><i class="ic snd">' + ICO.snd + '</i><i class="ic cup">' + ICO.cup + '</i><i class="ic gear">' + ICO.gear + '</i></span></div>' +
        '<div class="hearts dim">' + hearts() + "</div>" +
        '<div class="chips"><span class="chip ghost"></span></div>' +
        '<div class="card dim"><span class="tm">' + S.left + '</span><div class="txt">' + S.tokens.map(function (t) { return t.err && !t.fixed ? '<span class="w' + (S.L.italic ? " it" : "") + '">' + esc(t.text) + "</span>" : esc(t.fixed ? t.err.correct : t.text); }).join("") + "</div>" +
          '<div class="paused-lbl">PAUSED</div><button class="pbtn resume">RESUME</button></div>' +
        '<button class="pbtn exit">EXIT</button>' +
        '<div class="score dim">' + S.score + "</div>";
      on(".resume", function () { S.paused = false; S.timer = setInterval(tick, 1000); render(); });
      on(".exit", menu);
      return;
    }
    root.innerHTML =
      '<div class="hud"><span class="l"><button class="ic pause" aria-label="Pause">' + ICO.pause + '</button><button class="bulb" aria-label="Hint"><i class="ic bulbi">' + ICO.bulb + '</i><b>' + S.hints + '</b></button></span><span class="r"><i class="ic snd">' + ICO.snd + '</i><i class="ic cup">' + ICO.cup + '</i><button class="ic gear" aria-label="Settings">' + ICO.gear + '</button></span></div>' +
      '<div class="hearts">' + hearts() + "</div>" +
      '<div class="chips">' + chips + "</div>" +
      '<div class="card' + (S.done ? " done" : "") + '"><span class="tm">' + S.left + '</span><div class="txt">' + words + "</div>" +
        (S.hint ? '<div class="hint">' + esc(S.hint) + "</div>" : "") + "</div>" +
      (S.done ? '<div class="swipe">← Swipe left</div>' : "") +
      '<div class="score">' + S.score + "</div>" +
      '<div class="pbar">' + pbar() + "</div>";
    bind();
  }

  function bind() {
    on(".w.err", function (el) { var k = +el.getAttribute("data-tok"); S.open = (S.open === k) ? null : k; render(); });
    on(".chip[data-opt]", function (el) { choose(+el.getAttribute("data-opt")); });
    on(".bulb", function () {
      if (S.hints <= 0 || S.done) return;
      var open = S.tokens.filter(function (t) { return t.err && !t.fixed; });
      if (!open.length) return;
      S.hints--; open[0].hinted = true; S.hint = "Hint: " + open[0].err.rule; render();
    });
    on(".hud .gear", function () { endGame(null, true); });
    on(".hud .pause", function () { if (S.done) return; S.paused = true; clearInterval(S.timer); render(); });
    var card = root.querySelector(".card");
    card.addEventListener("click", function () { if (S.open !== null) { S.open = null; render(); } });
    if (S.done) enableSwipe(card);
  }

  function choose(k) {
    var tok = S.tokens[S.open];
    if (tok.options[k] === tok.err.correct) {
      tok.fixed = true; S.score += points(tok.hinted); S.correct++; S.open = null; S.hint = "";
      if (S.tokens.every(function (t) { return !t.err || t.fixed; })) {
        S.done = true; clearInterval(S.timer);
        S.swipeTimer = setTimeout(function () { var s = root.querySelector(".swipe"); if (s) s.classList.add("show"); }, 5000);
      }
      render();
      return;
    }
    S.hearts--; S.wrongTaps++;
    var c = root.querySelector(".card"); c.classList.add("shake");
    var h = root.querySelectorAll(".hearts b")[S.hearts]; if (h) h.classList.add("lost");
    if (S.hearts <= 0) { clearInterval(S.timer); return setTimeout(function () { endGame("Out of hearts"); }, 450); }
    if (S.wrongTaps >= S.L.wrong) {
      /* card failed: it leaves the table and comes back later, as in the app */
      clearInterval(S.timer); S.done = true; S.failed = true;
      setTimeout(function () { flyOut(c, function () { S.deck.push(S.card); next(); }); }, 450);
      return;
    }
    setTimeout(function () { c.classList.remove("shake"); }, 400);
  }

  function flyOut(card, cb) {
    card.style.transition = "transform .25s, opacity .25s";
    card.style.transform = "translateX(-140%) rotate(-12deg)";
    setTimeout(cb, 230);
  }
  function enableSwipe(card) {
    var x0 = null, dx = 0;
    function start(e) { x0 = (e.touches ? e.touches[0] : e).clientX; dx = 0; card.style.transition = "none"; }
    function move(e) { if (x0 === null) return; dx = (e.touches ? e.touches[0] : e).clientX - x0; if (dx > 0) dx = dx / 4; card.style.transform = "translateX(" + dx + "px) rotate(" + dx / 40 + "deg)"; }
    function end() {
      if (x0 === null) return; x0 = null; card.style.transition = "transform .25s";
      if (dx < -50) flyOut(card, next); else card.style.transform = "";
    }
    card.addEventListener("mousedown", start); window.addEventListener("mousemove", move); window.addEventListener("mouseup", end);
    card.addEventListener("touchstart", start, { passive: true }); card.addEventListener("touchmove", move, { passive: true }); card.addEventListener("touchend", end);
    on(".swipe", function () { flyOut(card, next); });
  }
  function next() {
    S.played++; S.i++;
    if (S.played >= ROUNDS || S.i >= S.deck.length) return endGame(null);
    loadCard();
  }

  /* ---------- end screen ---------- */
  function endGame(reason, quit) {
    stopTimers();
    if (quit) return menu();
    if (reason) {
      /* game over, as in the app: everything dims, the score sits on the card, one button back to the menu */
      S.paused = false;
      root.innerHTML =
        '<div class="hud"><span class="l"><span class="bulb dim"><i class="ic bulbi">' + ICO.bulb + '</i><b>' + S.hints + '</b></span></span><span class="r"><i class="ic snd">' + ICO.snd + '</i><i class="ic cup">' + ICO.cup + '</i><i class="ic gear">' + ICO.gear + '</i></span></div>' +
        '<div class="hearts dim">' + hearts() + "</div>" +
        '<div class="chips"><span class="chip ghost"></span></div>' +
        '<div class="card dim"><span class="tm">' + S.left + '</span><div class="txt">' + S.tokens.map(function (t) { if (t.fixed) return t.err.correct === "\u2014" ? "" : esc(t.err.correct); return t.err ? '<span class="w' + (S.L.italic ? " it" : "") + '">' + esc(t.text) + "</span>" : esc(t.text); }).join("").replace(/\s{2,}/g, " ") + "</div>" +
          '<div class="over-score">' + S.score + '</div><button class="pbtn resume retry">RETRY</button><button class="pbtn exit quitb">EXIT</button></div>' +
        '<div class="score dim">' + S.score + "</div>";
      on(".retry", retryGame);
      on(".quitb", menu);
      return;
    }
    root.innerHTML =
      '<div class="end">' +
        '<div class="end-label">' + (reason ? esc(reason) : "Demo complete") + "</div>" +
        '<div class="end-score">' + S.score + "</div>" +
        '<div class="end-sub">' + (reason ? "Nice try. That was a taste of thousands." : "That was 5 cards of thousands.") + "</div>" +
        '<div class="end-badges"><a href="https://apps.apple.com/app/id6822198824" target="_blank" rel="noopener" aria-label="Download on the App Store"><img src="app-store-badge.svg" alt="App Store"></a><a href="#" aria-label="Get it on Google Play"><img src="google-play-badge.svg" alt="Google Play"></a></div>' +
        '<button class="again">Main menu</button>' +
      "</div>";
    on(".again", menu);
  }

  menu();
})();
