/* ================================================================
   FORGED CARBON — hero ignite (P2)
   The signature moment: raw timber chars in real time as you scroll.
   A GLSL burn-front sweeps across a procedural cedar surface,
   leaving the Shou Sugi Ban finish behind, then dissolves into the
   existing film scrub. Progressive enhancement over the frame-
   sequence hero: any failure here leaves the hero exactly as it was.
   ================================================================ */
(function () {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  var hero = document.getElementById('hero');
  var canvas = document.getElementById('heroIgnite');
  if (!hero || !canvas) return;

  // Cheap WebGL capability probe before paying for the three.js download.
  var probe = document.createElement('canvas');
  var glTest = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!glTest) return;

  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'uniform float uBurn;',   // 0 raw .. 1 fully charred
    'varying vec2 vUv;',

    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),',
    '             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float v = 0.0, a = 0.5;',
    '  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }',
    '  return v;',
    '}',

    'void main(){',
    '  vec2 uv = vUv;',
    '  float aspect = uRes.x / max(uRes.y, 1.0);',
    '  vec2 q = vec2(uv.x * aspect, uv.y);',

    // burn front: a noisy vertical line sweeping left -> right
    '  float edge = fbm(q * 2.6 + vec2(0.0, uTime * 0.03)) * 0.35;',
    '  float front = uBurn * (aspect + 0.8) - 0.4;',
    '  float d = (q.x + edge) - front;',   // >0 raw side, <0 charred side

    // heat shimmer just ahead of the front
    '  float ahead = smoothstep(0.30, 0.0, d) * step(0.0, d);',
    '  vec2 sh = q + vec2(0.0, ahead * 0.012 * sin(uTime * 9.0 + q.x * 40.0));',

    // raw cedar: stretched grain
    '  float grain = fbm(vec2(sh.x * 3.0, sh.y * 26.0));',
    '  float rings = 0.5 + 0.5 * sin(sh.y * 90.0 + fbm(sh * 4.0) * 7.0);',
    '  vec3 cedar = mix(vec3(0.56, 0.37, 0.20), vec3(0.38, 0.24, 0.12), grain);',
    '  cedar *= 0.92 + 0.08 * rings;',

    // char: near-black crackle plates
    '  float crack = fbm(q * 7.0);',
    '  float plates = smoothstep(0.35, 0.65, fbm(q * 12.0 + 30.0));',
    '  vec3 charCol = mix(vec3(0.030, 0.024, 0.020), vec3(0.085, 0.070, 0.058), plates);',
    '  charCol *= 0.75 + 0.5 * crack;',

    // scorch zone: cedar browning as the front approaches
    '  float scorch = smoothstep(0.22, 0.02, d);',
    '  vec3 raw = mix(cedar, cedar * vec3(0.45, 0.30, 0.22), scorch * step(0.0, d));',

    '  float charMix = smoothstep(0.015, -0.015, d);',
    '  vec3 col = mix(raw, charCol, charMix);',

    // ember line: broken glow riding the front
    '  float flicker = 0.75 + 0.25 * sin(uTime * 7.0 + q.y * 30.0) * noise(q * 20.0 + uTime);',
    '  float emberBand = smoothstep(0.045, 0.0, abs(d)) * (0.4 + 0.6 * noise(q * 26.0));',
    '  col += vec3(1.0, 0.30, 0.045) * emberBand * 2.6 * flicker;',

    // embers lingering in fresh char cracks behind the front
    '  float behind = smoothstep(0.0, -0.35, d);',
    '  float inCrack = smoothstep(0.62, 0.75, crack);',
    '  col += vec3(1.0, 0.22, 0.03) * inCrack * behind * (1.0 - behind) * 0.9 * flicker;',

    // warm key light from upper left + gentle vignette
    '  float key = 1.0 + 0.28 * (1.0 - distance(uv, vec2(0.25, 0.85)));',
    '  col *= key * vec3(1.03, 1.0, 0.95);',
    '  float vig = smoothstep(1.25, 0.45, distance(uv, vec2(0.5, 0.5)));',
    '  col *= 0.72 + 0.28 * vig;',

    // fine film grain
    '  col += (hash(uv * uRes + uTime) - 0.5) * 0.028;',

    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var VERT = [
    'varying vec2 vUv;',
    'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
  ].join('\n');

  import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js').then(function (THREE) {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true });
    } catch (e) { return; }

    var DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    var scene = new THREE.Scene();
    var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var uniforms = {
      uRes:  { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uBurn: { value: 0 }
    };
    var mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uniforms });
    // fullscreen triangle
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
    scene.add(new THREE.Mesh(geo, mat));

    function size() {
      var w = hero.clientWidth, h = Math.min(window.innerHeight, hero.clientHeight);
      renderer.setPixelRatio(DPR);
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * DPR, h * DPR);
    }
    size();
    window.addEventListener('resize', size);

    hero.classList.add('has-ignite');

    var visible = true, raf = 0, t0 = performance.now();
    var io = new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(hero);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame);
    });

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      var p = parseFloat(hero.style.getPropertyValue('--p')) || 0;

      // scroll mapping: hold raw briefly, burn through, then hand to the film
      var burn = Math.max(0, Math.min(1, (p - 0.06) / 0.30));
      var fade = 1 - Math.max(0, Math.min(1, (p - 0.40) / 0.16));
      canvas.style.opacity = fade.toFixed(3);

      if (fade > 0) {
        uniforms.uTime.value = (now - t0) / 1000;
        uniforms.uBurn.value = burn;
        renderer.render(scene, cam);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }).catch(function () { /* CDN unreachable — hero stays as-is */ });
})();
