/**
 * MAI Corporation - Cinematic 3D Scroll Experience
 * Refined & Polished AAA WebGL Implementation
 *
 * Stages:
 *  1. Dark Rain (0.00 - 0.18): Atmospheric dark tempest, angled storm rain, moody lightning flashes.
 *  2. Falling Raindrop (0.18 - 0.38): Cinematic macro track following a glistening crystal waterdrop down through space.
 *  3. Water Splash (0.38 - 0.55): Dramatic surface impact, eruption of crown splash, micro-droplets and expanding waves.
 *  4. Sunrise (0.55 - 0.72): Storm clears, dawn magenta/gold sunrise emerges on horizon with radiant sun rays.
 *  5. City Skyline (0.72 - 0.88): Expansive modern architectural metropolis revealed in the warm morning light.
 *  6. MAI Building (0.88 - 1.00): Camera swoops in and zooms directly into the authentic MAI building entrance portal!
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js is required for MAI 3D Experience');
    return;
  }

  const container = document.getElementById('mai-3d-viewport');
  const scrollTrack = document.getElementById('mai-3d-scroll-track');
  if (!container || !scrollTrack) return;

  // HUD elements
  const hudStageTitle = document.getElementById('hud-stage-title');
  const hudStageDesc = document.getElementById('hud-stage-desc');
  const hudProgressFill = document.getElementById('hud-progress-fill');
  const hudIndicatorDots = document.querySelectorAll('.mai-step-dot');
  const skipBtn = document.getElementById('mai-skip-btn');
  const replayBtn = document.getElementById('mai-replay-btn');
  const promptEl = document.querySelector('.mai-scroll-prompt');

  const STAGES = [
    { name: 'Dark Rain', desc: 'A tempestuous night storm gathers in the dark sky', start: 0.0, end: 0.18 },
    { name: 'Falling Raindrop', desc: 'Tracking a pristine crystal waterdrop plummeting through 3D space', start: 0.18, end: 0.38 },
    { name: 'Water Splash', desc: 'Impact! Explosive water crown and radiating ripple waves', start: 0.38, end: 0.55 },
    { name: 'Sunrise', desc: 'Storm clouds part as golden dawn sweeps across the horizon', start: 0.55, end: 0.72 },
    { name: 'City Skyline', desc: 'A majestic modern architectural metropolis awakens in morning light', start: 0.72, end: 0.88 },
    { name: 'MAI Building', desc: 'Approaching MAI Corporation headquarters - We Build Homes', start: 0.88, end: 1.0 }
  ];

  // ----------------------------------------------------
  // THREE.JS SETUP
  // ----------------------------------------------------
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 3500);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Atmospheric Fog
  scene.fog = new THREE.FogExp2(0x060911, 0.0035);

  // ----------------------------------------------------
  // LIGHTING SYSTEM
  // ----------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x0e1726, 0.6);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffeedd, 0.0);
  sunLight.position.set(140, 50, -220);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 800;
  sunLight.shadow.camera.left = -200;
  sunLight.shadow.camera.right = 200;
  sunLight.shadow.camera.top = 200;
  sunLight.shadow.camera.bottom = -200;
  scene.add(sunLight);

  // Dedicated spotlight for raindrop illumination
  const raindropSpotLight = new THREE.PointLight(0xaadcff, 3.5, 60);
  raindropSpotLight.position.set(2, 45, 10);
  scene.add(raindropSpotLight);

  const lightningLight = new THREE.PointLight(0xbbe0ff, 0, 400);
  lightningLight.position.set(0, 180, 0);
  scene.add(lightningLight);

  // ----------------------------------------------------
  // 1. RAIN SYSTEM (Stage 1 & 2)
  // ----------------------------------------------------
  const rainCount = 4000;
  const rainGeo = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 6);
  const rainVelocities = new Float32Array(rainCount);

  for (let i = 0; i < rainCount; i++) {
    const x = (Math.random() - 0.5) * 350;
    const y = Math.random() * 260;
    const z = (Math.random() - 0.5) * 350;
    const len = 4.0 + Math.random() * 5.0;

    rainPositions[i * 6 + 0] = x;
    rainPositions[i * 6 + 1] = y;
    rainPositions[i * 6 + 2] = z;
    rainPositions[i * 6 + 3] = x - 0.35;
    rainPositions[i * 6 + 4] = y - len;
    rainPositions[i * 6 + 5] = z;

    rainVelocities[i] = 2.0 + Math.random() * 1.8;
  }

  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMat = new THREE.LineBasicMaterial({
    color: 0x88b0d4,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const rainSystem = new THREE.LineSegments(rainGeo, rainMat);
  scene.add(rainSystem);

  // ----------------------------------------------------
  // 2. HERO RAINDROP (Stage 2)
  // ----------------------------------------------------
  const heroDropGroup = new THREE.Group();

  // Outer Teardrop Geometry
  const dropBodyGeo = new THREE.SphereGeometry(1.4, 36, 36);
  const posAttr = dropBodyGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const py = posAttr.getY(i);
    if (py > 0) {
      posAttr.setY(i, py * (1.0 + py * 0.75));
      posAttr.setX(i, posAttr.getX(i) * Math.max(0.08, 1.0 - py * 0.48));
      posAttr.setZ(i, posAttr.getZ(i) * Math.max(0.08, 1.0 - py * 0.48));
    }
  }
  dropBodyGeo.computeVertexNormals();

  const dropMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    emissive: 0x0c253d,
    transmission: 0.94,
    opacity: 1.0,
    transparent: true,
    roughness: 0.02,
    ior: 1.333,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 1.0
  });

  const heroDropMesh = new THREE.Mesh(dropBodyGeo, dropMaterial);
  heroDropGroup.add(heroDropMesh);

  // Inner Refraction Core
  const innerCoreGeo = new THREE.SphereGeometry(0.85, 24, 24);
  const innerCoreMat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.55
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  heroDropGroup.add(innerCore);

  // Specular Light Glints
  const glint1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glint1.position.set(0.45, 0.6, 0.9);
  heroDropGroup.add(glint1);

  const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glint2.position.set(-0.35, -0.4, 1.0);
  heroDropGroup.add(glint2);

  heroDropGroup.position.set(0, 100, 0);
  scene.add(heroDropGroup);

  // ----------------------------------------------------
  // 3. WATER SURFACE & SPLASH SYSTEM (Stage 3)
  // ----------------------------------------------------
  const waterGeo = new THREE.PlaneGeometry(800, 800, 32, 32);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06182c,
    roughness: 0.08,
    metalness: 0.9,
    transparent: true,
    opacity: 0.96
  });
  const waterPlane = new THREE.Mesh(waterGeo, waterMat);
  waterPlane.rotation.x = -Math.PI / 2;
  waterPlane.position.y = 0;
  waterPlane.receiveShadow = true;
  scene.add(waterPlane);

  // Splash Crown Geometry
  const crownGeo = new THREE.CylinderGeometry(4.2, 1.0, 3.8, 32, 6, true);
  const cPos = crownGeo.attributes.position;
  for (let i = 0; i < cPos.count; i++) {
    const y = cPos.getY(i);
    const angle = Math.atan2(cPos.getZ(i), cPos.getX(i));
    if (y > 0.2) {
      cPos.setY(i, y + Math.sin(angle * 9) * 1.6);
    }
  }
  crownGeo.computeVertexNormals();

  const crownMat = new THREE.MeshPhysicalMaterial({
    color: 0xbde0fe,
    emissive: 0x1e3a5f,
    transmission: 0.88,
    roughness: 0.04,
    transparent: true,
    opacity: 0.0,
    ior: 1.33
  });
  const splashCrown = new THREE.Mesh(crownGeo, crownMat);
  splashCrown.position.set(0, 0, 0);
  scene.add(splashCrown);

  // Concentric Ripple Wave Rings
  const rippleGroup = new THREE.Group();
  const rippleCount = 5;
  const ripples = [];
  for (let i = 0; i < rippleCount; i++) {
    const ringGeo = new THREE.RingGeometry(0.8, 1.3, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x90e0ef,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.06 + i * 0.01;
    rippleGroup.add(ringMesh);
    ripples.push({ mesh: ringMesh, mat: ringMat, baseScale: 1.0 + i * 2.2, delay: i * 0.08 });
  }
  scene.add(rippleGroup);

  // Splash Micro-Droplets
  const splashDropCount = 75;
  const splashDropGeo = new THREE.SphereGeometry(0.22, 12, 12);
  const splashDropMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    emissive: 0x103050,
    transmission: 0.9,
    roughness: 0.04,
    ior: 1.33
  });
  const splashDroplets = [];
  const splashDropletsGroup = new THREE.Group();
  for (let i = 0; i < splashDropCount; i++) {
    const m = new THREE.Mesh(splashDropGeo, splashDropMat);
    const angle = (i / splashDropCount) * Math.PI * 2 + Math.random() * 0.3;
    const speed = 5.0 + Math.random() * 7.0;
    const vY = 6.0 + Math.random() * 9.0;
    splashDroplets.push({
      mesh: m,
      vx: Math.cos(angle) * speed,
      vy: vY,
      vz: Math.sin(angle) * speed
    });
    splashDropletsGroup.add(m);
  }
  scene.add(splashDropletsGroup);

  // ----------------------------------------------------
  // 4. SUNRISE SYSTEM (Stage 4)
  // ----------------------------------------------------
  const sunGroup = new THREE.Group();

  // Sun Core Orb
  const sunSphereGeo = new THREE.SphereGeometry(22, 32, 32);
  const sunSphereMat = new THREE.MeshBasicMaterial({ color: 0xfff3cc });
  const sunSphere = new THREE.Mesh(sunSphereGeo, sunSphereMat);
  sunGroup.add(sunSphere);

  // Sun Radiant Corona Halo
  const sunHaloGeo = new THREE.RingGeometry(22, 65, 48);
  const sunHaloMat = new THREE.MeshBasicMaterial({
    color: 0xffaa33,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const sunHalo = new THREE.Mesh(sunHaloGeo, sunHaloMat);
  sunHalo.position.z = 1.0;
  sunGroup.add(sunHalo);

  sunGroup.position.set(140, -40, -480);
  scene.add(sunGroup);

  // ----------------------------------------------------
  // 5. CITY SKYLINE (Stage 5)
  // ----------------------------------------------------
  const cityGroup = new THREE.Group();

  function createWindowTexture(litColor, unlitColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#060e18';
    ctx.fillRect(0, 0, 256, 512);

    const cols = 8;
    const rows = 24;
    const padX = 6;
    const padY = 6;
    const w = (256 - padX * (cols + 1)) / cols;
    const h = (512 - padY * (rows + 1)) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * (w + padX);
        const y = padY + r * (h + padY);
        const isLit = Math.random() > 0.42;
        ctx.fillStyle = isLit ? litColor : unlitColor;
        ctx.fillRect(x, y, w, h);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  const windowTex1 = createWindowTexture('#ffeaa7', '#142236');
  const windowTex2 = createWindowTexture('#90e0ef', '#0e1828');

  const buildingMat1 = new THREE.MeshStandardMaterial({
    map: windowTex1,
    roughness: 0.18,
    metalness: 0.75
  });

  const buildingMat2 = new THREE.MeshStandardMaterial({
    map: windowTex2,
    roughness: 0.15,
    metalness: 0.85
  });

  const buildingCount = 52;
  for (let i = 0; i < buildingCount; i++) {
    const angle = (i / buildingCount) * Math.PI * 2;
    const dist = 95 + Math.random() * 210;
    const x = Math.cos(angle) * dist;
    const z = -190 + Math.sin(angle) * dist * 0.85;

    // Preserve central corridor for MAI Building and clear foreground
    if (Math.abs(x) < 38 && z > -250 && z < -130) continue;
    if (z > -70) continue;

    const bW = 14 + Math.random() * 18;
    const bD = 14 + Math.random() * 18;
    const bH = 45 + Math.random() * 135;

    const bGeo = new THREE.BoxGeometry(bW, bH, bD);
    const bMat = Math.random() > 0.5 ? buildingMat1 : buildingMat2;
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.set(x, bH / 2, z);
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;

    if (bH > 95 && Math.random() > 0.45) {
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.8, 18, 8),
        new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 })
      );
      spire.position.set(0, bH / 2 + 9, 0);
      bMesh.add(spire);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff3322 })
      );
      beacon.position.set(0, bH / 2 + 18, 0);
      bMesh.add(beacon);
    }

    cityGroup.add(bMesh);
  }
  scene.add(cityGroup);

  // ----------------------------------------------------
  // 6. ACTUAL MAI BUILDING (Stage 6)
  // ----------------------------------------------------
  const maiBuildingGroup = new THREE.Group();
  maiBuildingGroup.position.set(0, 0, -180);

  const maiBaseW = 46;
  const maiBaseH = 55;
  const maiBaseD = 32;

  // Podium Base (MAI Brand Navy Blue #003f6b)
  const podiumGeo = new THREE.BoxGeometry(maiBaseW + 8, 14, maiBaseD + 8);
  const podiumMat = new THREE.MeshStandardMaterial({
    color: 0x003f6b,
    roughness: 0.22,
    metalness: 0.65
  });
  const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat);
  podiumMesh.position.y = 7;
  podiumMesh.castShadow = true;
  podiumMesh.receiveShadow = true;
  maiBuildingGroup.add(podiumMesh);

  // Tower Glass Curtain Wall
  const towerGeo = new THREE.BoxGeometry(maiBaseW, maiBaseH, maiBaseD);
  const towerMat = new THREE.MeshPhysicalMaterial({
    color: 0xcde4f7,
    transmission: 0.65,
    roughness: 0.1,
    metalness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.95
  });
  const towerMesh = new THREE.Mesh(towerGeo, towerMat);
  towerMesh.position.y = 14 + maiBaseH / 2;
  towerMesh.castShadow = true;
  towerMesh.receiveShadow = true;
  maiBuildingGroup.add(towerMesh);

  // Vertical Architectural Louvers / Ribs
  const ribCount = 10;
  for (let r = 0; r <= ribCount; r++) {
    const rx = -maiBaseW / 2 + (r / ribCount) * maiBaseW;
    const ribGeo = new THREE.BoxGeometry(0.8, maiBaseH, 0.8);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.85, roughness: 0.15 });
    const ribMesh = new THREE.Mesh(ribGeo, ribMat);
    ribMesh.position.set(rx, 14 + maiBaseH / 2, maiBaseD / 2 + 0.4);
    maiBuildingGroup.add(ribMesh);
  }

  // Roof Crown Architectural Structure
  const roofCrownGeo = new THREE.BoxGeometry(maiBaseW + 2, 4, maiBaseD + 2);
  const roofCrownMat = new THREE.MeshStandardMaterial({ color: 0x003f6b, metalness: 0.7, roughness: 0.2 });
  const roofCrown = new THREE.Mesh(roofCrownGeo, roofCrownMat);
  roofCrown.position.y = 14 + maiBaseH + 2;
  maiBuildingGroup.add(roofCrown);

  // High-Resolution Branding Signage Textures
  function createBrandedSign(title, sub, width = 1024, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#003f6b');
    grad.addColorStop(1, '#001a33');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 125px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, width / 2, height / 2 - 25);

    ctx.fillStyle = '#ffd15c';
    ctx.font = '700 34px "Open Sans", sans-serif';
    ctx.fillText(sub, width / 2, height / 2 + 55);

    return new THREE.CanvasTexture(canvas);
  }

  // 1. Rooftop Billboard Sign
  const roofSignTex = createBrandedSign('MAI', 'WE BUILD HOMES • MAI CORPORATION');
  const roofSign = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 8),
    new THREE.MeshBasicMaterial({ map: roofSignTex, side: THREE.DoubleSide })
  );
  roofSign.position.set(0, 14 + maiBaseH + 8, maiBaseD / 2);
  maiBuildingGroup.add(roofSign);

  const roofSignBox = new THREE.Mesh(
    new THREE.BoxGeometry(32.4, 8.4, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x002642, metalness: 0.8, roughness: 0.2 })
  );
  roofSignBox.position.set(0, 14 + maiBaseH + 8, maiBaseD / 2 - 0.6);
  maiBuildingGroup.add(roofSignBox);

  // 2. Main Entrance Sign & Marquee
  const entranceSignTex = createBrandedSign('MAI HOUSE', 'MAI CORPORATION • AMBATTUR, CHENNAI');
  const entranceSign = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 5),
    new THREE.MeshBasicMaterial({ map: entranceSignTex, side: THREE.DoubleSide })
  );
  entranceSign.position.set(0, 11, maiBaseD / 2 + 4.2);
  maiBuildingGroup.add(entranceSign);

  // Canopy Overhang
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(24, 1.2, 9),
    new THREE.MeshStandardMaterial({ color: 0x003f6b, metalness: 0.8, roughness: 0.2 })
  );
  canopy.position.set(0, 8.5, maiBaseD / 2 + 6.5);
  canopy.castShadow = true;
  maiBuildingGroup.add(canopy);

  // Warm Glow Inside Entrance Doors (Welcoming Entrance Portal)
  const entranceGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 7.2),
    new THREE.MeshBasicMaterial({ color: 0xffe6a3, side: THREE.DoubleSide })
  );
  entranceGlow.position.set(0, 3.6, maiBaseD / 2 + 4.1);
  maiBuildingGroup.add(entranceGlow);

  // Entrance Spot & Point Lights
  const entranceLight = new THREE.PointLight(0xffd580, 3.0, 45);
  entranceLight.position.set(0, 7.5, maiBaseD / 2 + 8);
  maiBuildingGroup.add(entranceLight);

  const buildingUplight = new THREE.SpotLight(0x4095d6, 4.5, 130, Math.PI / 3, 0.4);
  buildingUplight.position.set(0, 1, maiBaseD / 2 + 25);
  buildingUplight.target = towerMesh;
  maiBuildingGroup.add(buildingUplight);

  // Entrance Plaza Steps
  for (let s = 0; s < 3; s++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(26 + s * 2, 0.4, 4 + s * 1.5),
      new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.5 })
    );
    step.position.set(0, 0.2 + s * 0.4, maiBaseD / 2 + 6.5 + s * 1.5);
    step.receiveShadow = true;
    maiBuildingGroup.add(step);
  }

  scene.add(maiBuildingGroup);

  // ----------------------------------------------------
  // SCROLL PROGRESS INTERPOLATION & CONTROLS
  // ----------------------------------------------------
  let targetProgress = 0;
  let currentProgress = 0;

  const urlParams = new URLSearchParams(window.location.search);
  const paramProgress = urlParams.get('progress');
  const paramStage = urlParams.get('stage');

  let fixedProgress = null;
  if (paramProgress !== null) {
    fixedProgress = parseFloat(paramProgress);
  } else if (paramStage !== null) {
    const stageMap = {
      'dark-rain': 0.08,
      'raindrop': 0.28,
      'splash': 0.46,
      'sunrise': 0.64,
      'skyline': 0.80,
      'building': 0.96,
      'website': 1.0
    };
    if (stageMap[paramStage] !== undefined) {
      fixedProgress = stageMap[paramStage];
    }
  }

  function updateScrollProgress() {
    if (fixedProgress !== null) {
      targetProgress = fixedProgress;
      currentProgress = fixedProgress;
      if (fixedProgress >= 1.0) {
        document.body.classList.remove('in-3d-track');
        window.scrollTo(0, scrollTrack.offsetHeight);
      }
      return;
    }

    const rect = scrollTrack.getBoundingClientRect();
    const totalScrollable = scrollTrack.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    targetProgress = rawProgress;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateScrollProgress();
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      fixedProgress = null;
      const targetY = scrollTrack.offsetTop + scrollTrack.offsetHeight - window.innerHeight + 10;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      fixedProgress = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  hudIndicatorDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      fixedProgress = null;
      const stage = STAGES[idx];
      const targetY = scrollTrack.offsetTop + (scrollTrack.offsetHeight - window.innerHeight) * (stage.start + 0.03);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  // Sky colors for day-night interpolation
  const colorStormSky = new THREE.Color(0x060911);
  const colorDawnSky = new THREE.Color(0x281738);
  const colorSunriseOrange = new THREE.Color(0xd45517);
  const colorSunriseGold = new THREE.Color(0xffad33);
  const colorDayBlue = new THREE.Color(0x4a92db);
  const curSkyColor = new THREE.Color(0x060911);

  // ----------------------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------------------
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    currentProgress += (targetProgress - currentProgress) * 0.085;
    const p = Math.max(0, Math.min(1, currentProgress));

    // Update HUD fill
    if (hudProgressFill) {
      hudProgressFill.style.width = `${(p * 100).toFixed(1)}%`;
    }

    let activeStageIdx = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (p >= STAGES[i].start && p <= STAGES[i].end) {
        activeStageIdx = i;
        break;
      }
    }
    if (p >= 0.99) activeStageIdx = 5;

    if (hudStageTitle && hudStageDesc) {
      hudStageTitle.textContent = STAGES[activeStageIdx].name;
      hudStageDesc.textContent = STAGES[activeStageIdx].desc;
    }

    hudIndicatorDots.forEach((dot, idx) => {
      if (idx === activeStageIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // -------------------------------------------------
    // VISIBILITY GATING FOR SEAMLESS NARRATIVE PACING
    // -------------------------------------------------
    // In Stage 1-3 (p < 0.52), hide the city and sun so the storm and water splash dominate
    const showCity = p >= 0.52;
    cityGroup.visible = showCity;
    maiBuildingGroup.visible = showCity;
    sunGroup.visible = p >= 0.48;

    // -------------------------------------------------
    // STAGE 1 & 2: Rain Physics & Hero Droplet
    // -------------------------------------------------
    const rainPositionsArr = rainGeo.attributes.position.array;
    const rainFade = p < 0.52 ? 1.0 : Math.max(0, 1.0 - (p - 0.52) / 0.15);
    rainMat.opacity = rainFade * 0.8;

    if (rainFade > 0.01) {
      for (let i = 0; i < rainCount; i++) {
        const idx = i * 6;
        rainPositionsArr[idx + 1] -= rainVelocities[i] * 3.6;
        rainPositionsArr[idx + 4] -= rainVelocities[i] * 3.6;

        if (rainPositionsArr[idx + 1] < 0) {
          const newY = 250 + Math.random() * 40;
          const newX = (Math.random() - 0.5) * 350;
          const newZ = (Math.random() - 0.5) * 350;
          const len = 4.0 + Math.random() * 5.0;
          rainPositionsArr[idx + 0] = newX;
          rainPositionsArr[idx + 1] = newY;
          rainPositionsArr[idx + 2] = newZ;
          rainPositionsArr[idx + 3] = newX - 0.35;
          rainPositionsArr[idx + 4] = newY - len;
          rainPositionsArr[idx + 5] = newZ;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;
    }

    // Occasional lightning flash in Stage 1
    if (p < 0.22) {
      if (Math.random() < 0.018) {
        lightningLight.intensity = 5.0 + Math.random() * 6.0;
      } else {
        lightningLight.intensity *= 0.82;
      }
    } else {
      lightningLight.intensity = 0;
    }

    // Hero Raindrop motion (Stage 2: 0.18 - 0.38)
    if (p < 0.45) {
      heroDropGroup.visible = true;
      const dropP = Math.max(0, Math.min(1, (p - 0.16) / 0.24));
      const dropY = 85 * (1 - dropP) + 0.6;
      heroDropGroup.position.set(0, dropY, 0);

      const wobble = Math.sin(time * 14) * 0.06;
      heroDropMesh.scale.set(1.4 + wobble, 1.4 - wobble, 1.4 + wobble);

      raindropSpotLight.position.set(2, dropY + 12, 10);
    } else {
      heroDropGroup.visible = false;
    }

    // -------------------------------------------------
    // STAGE 3: Splash Crown & Ripples (0.38 - 0.55)
    // -------------------------------------------------
    if (p >= 0.38 && p <= 0.62) {
      const splashProgress = (p - 0.38) / 0.16;

      if (splashProgress < 0.65) {
        splashCrown.visible = true;
        const crownScale = Math.sin(splashProgress * Math.PI) * 1.5;
        splashCrown.scale.set(crownScale, Math.max(0.01, crownScale * 1.3), crownScale);
        crownMat.opacity = Math.max(0, (1 - splashProgress * 1.3) * 0.9);
      } else {
        splashCrown.visible = false;
      }

      splashDroplets.forEach((d) => {
        d.mesh.visible = true;
        const dt = splashProgress * 1.6;
        const curX = d.vx * dt;
        const curY = Math.max(0, d.vy * dt - 0.5 * 18 * dt * dt);
        const curZ = d.vz * dt;
        d.mesh.position.set(curX, curY, curZ);
        d.mesh.scale.setScalar(Math.max(0, 1.0 - splashProgress * 0.85));
      });

      ripples.forEach((r) => {
        const rProg = Math.max(0, splashProgress - r.delay);
        if (rProg > 0) {
          const currentScale = r.baseScale + rProg * 32.0;
          r.mesh.scale.set(currentScale, currentScale, currentScale);
          r.mat.opacity = Math.max(0, (1.0 - rProg * 1.4) * 0.85);
        } else {
          r.mat.opacity = 0;
        }
      });
    } else {
      splashCrown.visible = false;
      splashDropletsGroup.children.forEach(c => c.visible = false);
      ripples.forEach(r => r.mat.opacity = 0);
    }

    // -------------------------------------------------
    // STAGE 4: Sunrise Lighting & Sky (0.50 - 0.72)
    // -------------------------------------------------
    if (p < 0.50) {
      curSkyColor.copy(colorStormSky);
      ambientLight.color.setHex(0x0e1726);
      ambientLight.intensity = 0.5;
      sunLight.intensity = 0;
      sunGroup.position.y = -40;
    } else if (p >= 0.50 && p < 0.62) {
      const tDawn = (p - 0.50) / 0.12;
      curSkyColor.copy(colorStormSky).lerp(colorDawnSky, tDawn).lerp(colorSunriseOrange, tDawn * 0.75);
      ambientLight.color.setHex(0x2d1a33).lerp(new THREE.Color(0xff8844), tDawn);
      ambientLight.intensity = 0.5 + tDawn * 0.5;
      sunGroup.position.y = -35 + tDawn * 30;
      sunLight.intensity = tDawn * 1.0;
      sunLight.color.setHex(0xff7722);
    } else if (p >= 0.62 && p < 0.74) {
      const tSun = (p - 0.62) / 0.12;
      curSkyColor.copy(colorSunriseOrange).lerp(colorSunriseGold, tSun * 0.85).lerp(colorDayBlue, tSun * 0.65);
      ambientLight.color.setHex(0xffaa55).lerp(new THREE.Color(0xffeedd), tSun);
      ambientLight.intensity = 1.0 + tSun * 0.5;
      sunGroup.position.y = -5 + tSun * 40;
      sunLight.intensity = 1.0 + tSun * 1.5;
      sunLight.color.setHex(0xffe0aa);
    } else {
      curSkyColor.copy(colorDayBlue);
      ambientLight.color.setHex(0xffeedd);
      ambientLight.intensity = 1.5;
      sunGroup.position.y = 35;
      sunLight.intensity = 2.5;
      sunLight.color.setHex(0xfff8ee);
    }

    renderer.setClearColor(curSkyColor, 1.0);
    scene.fog.color.copy(curSkyColor);
    scene.fog.density = p < 0.52 ? 0.0035 : Math.max(0.0012, 0.0035 * (1 - (p - 0.52) / 0.3));

    const sunScale = 1.0 + Math.sin(time * 3) * 0.06;
    sunHalo.scale.set(sunScale, sunScale, 1.0);

    // -------------------------------------------------
    // CAMERA PATH THROUGH THE 6 STAGES
    // -------------------------------------------------
    if (p < 0.18) {
      // Stage 1: Dark rain downpour view
      const s1 = p / 0.18;
      camera.position.set(0, 16 + s1 * 12, 40 - s1 * 12);
      camera.lookAt(0, 55, -40);
    } else if (p >= 0.18 && p < 0.38) {
      // Stage 2: Macro camera following the hero raindrop
      const s2 = (p - 0.18) / 0.20;
      const dropY = heroDropGroup.position.y;
      const camY = dropY + 0.8 + Math.sin(s2 * Math.PI) * 1.2;
      const camZ = 5.2 + Math.cos(s2 * Math.PI) * 0.8;
      const camX = Math.sin(s2 * Math.PI * 2) * 1.0;
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, dropY, 0);
    } else if (p >= 0.38 && p < 0.55) {
      // Stage 3: Low water level angle watching the splash impact
      const s3 = (p - 0.38) / 0.17;
      const camDist = 13 + s3 * 7;
      camera.position.set(Math.cos(s3 * 1.2) * camDist, 4.0 + s3 * 3.5, Math.sin(s3 * 1.2) * camDist + 8);
      camera.lookAt(0, 1.8, 0);
    } else if (p >= 0.55 && p < 0.72) {
      // Stage 4: Rise high above the city and face the golden Sunrise
      const s4 = (p - 0.55) / 0.17;
      camera.position.set(
        Math.sin(s4 * 0.8) * 20,
        38 + s4 * 44,
        45 - s4 * 35
      );
      camera.lookAt(140, 20 + s4 * 10, -480);
    } else if (p >= 0.72 && p < 0.88) {
      // Stage 5: High altitude aerial view across the City Skyline
      const s5 = (p - 0.72) / 0.16;
      camera.position.set(
        -55 + s5 * 90,
        75 + Math.sin(s5 * Math.PI) * 12,
        15 - s5 * 65
      );
      camera.lookAt(0, 30, -180);
    } else {
      // Stage 6: Camera zoom toward the actual MAI building (0.88 - 1.00)
      const s6 = (p - 0.88) / 0.12;
      const easeZoom = s6 * s6 * (3 - 2 * s6);

      const startCam = new THREE.Vector3(20, 62, -45);
      const targetCam = new THREE.Vector3(0, 7.2, -155);

      camera.position.lerpVectors(startCam, targetCam, easeZoom);

      const lookTarget = new THREE.Vector3(0, 11 - easeZoom * 3.2, -180);
      camera.lookAt(lookTarget);
    }

    // -------------------------------------------------
    // TRANSITION TO WEBSITE (At 100% Zoom)
    // -------------------------------------------------
    const transitionOverlay = document.getElementById('mai-portal-transition');
    if (transitionOverlay) {
      if (p >= 0.94) {
        const transP = (p - 0.94) / 0.06;
        transitionOverlay.style.opacity = Math.min(1, transP * 1.5).toString();
      } else {
        transitionOverlay.style.opacity = '0';
      }
    }

    // Toggle body class and replay button
    const trackBottom = scrollTrack.offsetTop + scrollTrack.offsetHeight - window.innerHeight;
    const isPast3D = window.scrollY >= trackBottom - 50;

    if (isPast3D) {
      document.body.classList.remove('in-3d-track');
      if (replayBtn) replayBtn.classList.add('visible');
    } else {
      document.body.classList.add('in-3d-track');
      if (replayBtn) replayBtn.classList.remove('visible');
    }

    if (promptEl) {
      promptEl.style.opacity = p > 0.02 ? '0' : '1';
    }

    renderer.render(scene, camera);
  }

  document.body.classList.add('in-3d-track');
  animate();
  updateScrollProgress();

})();
