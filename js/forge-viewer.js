/* ================================================================
   FORGED CARBON — Forge 12 interactive viewer (P2)
   Real-time orbit/zoom massing model with cladding-finish switch,
   day/night lighting, and spec hotspots. The mesh is a placeholder
   massing model built from primitives — swap in the Draco GLB when
   photogrammetry / the Blender model is ready (see loadModel()).
   Lazy: three.js only downloads when the section scrolls near.
   ================================================================ */
(function () {
  'use strict';

  var mount = document.getElementById('forgeViewer');
  if (!mount) return;
  var probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) {
    var note = document.getElementById('viewerFallback');
    if (note) note.hidden = false;
    mount.hidden = true;
    return;
  }
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var started = false;
  var io = new IntersectionObserver(function (en) {
    if (!en[0].isIntersecting || started) return;
    started = true;
    io.disconnect();
    boot();
  }, { rootMargin: '400px' });
  io.observe(mount);

  function boot() {
    Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js')
    ]).then(function (mods) { init(mods[0], mods[1].OrbitControls); })
      .catch(function () { /* CDN unreachable — static gallery below still tells the story */ });
  }

  function init(THREE, OrbitControls) {
    var W = mount.clientWidth, H = mount.clientHeight;
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D model of the Forge 12. Drag to orbit, scroll to zoom.');

    var NIGHT_BG = 0x0e0e0c, DAY_BG = 0xe9e4d8;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(NIGHT_BG);
    scene.fog = new THREE.Fog(NIGHT_BG, 40, 90);

    var cam = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);
    cam.position.set(14, 5.5, 16);

    var controls = new OrbitControls(cam, renderer.domElement);
    controls.target.set(0, 1.4, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;      // heavy, inevitable — not nervous
    controls.minDistance = 8;
    controls.maxDistance = 34;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = !REDUCE;
    controls.autoRotateSpeed = 0.45;
    controls.addEventListener('start', function () { controls.autoRotate = false; });

    /* ---- lights ---- */
    var sun = new THREE.DirectionalLight(0xffd9a8, 2.6);
    sun.position.set(14, 16, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
    scene.add(sun);
    var sky = new THREE.HemisphereLight(0xfff4e0, 0x2a241c, 0.55);
    scene.add(sky);
    var emberFill = new THREE.PointLight(0xff5510, 12, 18, 2);
    emberFill.position.set(-5, 0.6, 4);
    scene.add(emberFill);

    /* ---- materials ---- */
    var finishes = {
      black: new THREE.MeshStandardMaterial({ color: 0x13100d, roughness: 0.42, metalness: 0.08 }),
      natural: new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.78, metalness: 0.02 })
    };
    var cedarMat = new THREE.MeshStandardMaterial({ color: 0x8a5a30, roughness: 0.7 });
    var glassDay = new THREE.MeshStandardMaterial({ color: 0x30322e, roughness: 0.12, metalness: 0.6 });
    var glassNight = new THREE.MeshStandardMaterial({ color: 0x1a120a, emissive: 0xff8a3c, emissiveIntensity: 0.75, roughness: 0.3 });
    var groundMat = new THREE.MeshStandardMaterial({ color: 0x161310, roughness: 1 });

    /* ---- placeholder massing model (12.0m x 3.5m x ~3m) ---- */
    var house = new THREE.Group();
    var body = new THREE.Mesh(new THREE.BoxGeometry(12, 2.9, 3.5), finishes.black);
    body.position.y = 1.45; body.castShadow = body.receiveShadow = true;
    house.add(body);
    var roof = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.12, 3.9), finishes.black);
    roof.position.y = 2.96; roof.castShadow = true;
    house.add(roof);
    // cedar-framed glazing band on the long elevation
    var frame = new THREE.Mesh(new THREE.BoxGeometry(5.3, 1.85, 0.08), cedarMat);
    frame.position.set(1.9, 1.35, 1.78);
    house.add(frame);
    var glass = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.6, 0.06), glassNight);
    glass.position.set(1.9, 1.35, 1.81);
    house.add(glass);
    // entry door
    var door = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.1, 0.07), cedarMat);
    door.position.set(-3.6, 1.05, 1.78);
    house.add(door);
    // low steel-frame skid (BlueScope steel chassis, visually hinted)
    var skid = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.22, 3.1),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2d, roughness: 0.5, metalness: 0.7 }));
    skid.position.y = -0.06; skid.castShadow = true;
    house.add(skid);
    scene.add(house);

    var ground = new THREE.Mesh(new THREE.CircleGeometry(38, 48), groundMat);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.17;
    ground.receiveShadow = true;
    scene.add(ground);

    /* hook for the real model: drop a Draco GLB at models/forge12.glb and
       load it here, then scene.remove(house). */
    function loadModel() {}

    /* ---- day / night ---- */
    var night = true;
    function setNight(n) {
      night = n;
      scene.background.set(n ? NIGHT_BG : DAY_BG);
      scene.fog.color.set(n ? NIGHT_BG : DAY_BG);
      sun.intensity = n ? 0.6 : 2.6;
      sun.color.set(n ? 0x9db4ff : 0xffd9a8);
      sky.intensity = n ? 0.3 : 0.55;
      emberFill.intensity = n ? 12 : 0;
      glass.material = n ? glassNight : glassDay;
      groundMat.color.set(n ? 0x161310 : 0xd9d2c2);
    }
    setNight(true);

    /* ---- UI ---- */
    function bindToggle(id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
      return el;
    }
    var btnDay = bindToggle('vwDay', function () {
      setNight(!night);
      btnDay.textContent = night ? 'Day light' : 'Night light';
      btnDay.setAttribute('aria-pressed', String(!night));
    });
    var btnBlack = document.getElementById('vwBlack');
    var btnNatural = document.getElementById('vwNatural');
    function setFinish(name) {
      body.material = roof.material = finishes[name];
      if (btnBlack) btnBlack.setAttribute('aria-pressed', String(name === 'black'));
      if (btnNatural) btnNatural.setAttribute('aria-pressed', String(name === 'natural'));
    }
    if (btnBlack) btnBlack.addEventListener('click', function () { setFinish('black'); });
    if (btnNatural) btnNatural.addEventListener('click', function () { setFinish('natural'); });

    /* ---- hotspots: project 3D anchors to CSS positions ---- */
    var spots = [];
    document.querySelectorAll('.vw-spot').forEach(function (el) {
      var p = (el.getAttribute('data-pos') || '0,0,0').split(',').map(Number);
      spots.push({ el: el, v: new THREE.Vector3(p[0], p[1], p[2]) });
    });
    var tmp = new THREE.Vector3();
    function placeSpots() {
      var w = mount.clientWidth, h = mount.clientHeight;
      spots.forEach(function (s) {
        tmp.copy(s.v).applyMatrix4(house.matrixWorld).project(cam);
        var behind = tmp.z > 1;
        s.el.style.left = ((tmp.x * 0.5 + 0.5) * w).toFixed(1) + 'px';
        s.el.style.top = ((-tmp.y * 0.5 + 0.5) * h).toFixed(1) + 'px';
        s.el.style.opacity = behind ? '0' : '1';
        s.el.style.pointerEvents = behind ? 'none' : 'auto';
      });
    }

    /* ---- loop: pause offscreen / hidden ---- */
    var visible = true, raf = 0;
    var vio = new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    vio.observe(mount);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(tick);
    });

    function tick() {
      raf = 0;
      if (!visible || document.hidden) return;
      controls.update();
      renderer.render(scene, cam);
      placeSpots();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener('resize', function () {
      var w = mount.clientWidth, h = mount.clientHeight;
      cam.aspect = w / h; cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    mount.classList.add('is-live');
  }
})();
