/* ================================================================
   FORGED CARBON — sound layer (P3, opt-in)
   Whisper-quiet fire: a low hum + procedural crackle synthesized
   with WebAudio (no samples, nothing fabricated). Muted by default;
   the toggle click is the autoplay-policy gesture. Crackle follows
   the hero burn — it fades once the film takes over.
   ================================================================ */
(function () {
  'use strict';

  var btn = document.getElementById('soundToggle');
  if (!btn || !(window.AudioContext || window.webkitAudioContext)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // quiet path stays quiet
  btn.hidden = false;

  var ctx = null, master = null, crackleGain = null, on = false, timer = 0;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    /* low ambient hum: filtered brown noise, barely there */
    var len = ctx.sampleRate * 2;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    }
    var hum = ctx.createBufferSource();
    hum.buffer = buf; hum.loop = true;
    var humLP = ctx.createBiquadFilter();
    humLP.type = 'lowpass'; humLP.frequency.value = 110;
    var humGain = ctx.createGain(); humGain.gain.value = 0.22;
    hum.connect(humLP); humLP.connect(humGain); humGain.connect(master);
    hum.start();

    /* crackle bus: short noise pops through a warm bandpass */
    crackleGain = ctx.createGain(); crackleGain.gain.value = 0.5;
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.7;
    crackleGain.connect(bp); bp.connect(master);

    var popLen = Math.floor(ctx.sampleRate * 0.06);
    var popBuf = ctx.createBuffer(1, popLen, ctx.sampleRate);
    var pd = popBuf.getChannelData(0);
    for (var j = 0; j < popLen; j++) {
      pd[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / popLen, 6);
    }
    function pop() {
      if (!on) return;
      var s = ctx.createBufferSource();
      s.buffer = popBuf;
      s.playbackRate.value = 0.5 + Math.random() * 1.4;
      var g = ctx.createGain();
      g.gain.value = 0.10 + Math.random() * 0.35;
      s.connect(g); g.connect(crackleGain);
      s.start();
      timer = setTimeout(pop, 40 + Math.random() * 320);
    }
    pop._start = function () { clearTimeout(timer); pop(); };
    build.pop = pop;
  }

  /* crackle tracks the hero burn: full while the timber burns, low after */
  var hero = document.getElementById('hero');
  setInterval(function () {
    if (!on || !crackleGain || !hero) return;
    var p = parseFloat(hero.style.getPropertyValue('--p')) || 0;
    var r = hero.getBoundingClientRect();
    var inView = r.bottom > 0;
    var target = !inView ? 0.06 : (p < 0.45 ? 0.5 : 0.12);
    crackleGain.gain.setTargetAtTime(target, ctx.currentTime, 0.8);
  }, 400);

  btn.addEventListener('click', function () {
    if (!ctx) build();
    if (ctx.state === 'suspended') ctx.resume();
    on = !on;
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('.snd__state').textContent = on ? 'On' : 'Off';
    btn.classList.toggle('is-on', on);
    master.gain.setTargetAtTime(on ? 0.5 : 0, ctx.currentTime, 0.6);
    if (on) build.pop._start();
  });
})();
