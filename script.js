// === Reproductor con control de canciones ===
const audio = document.getElementById("audio"),
  playBtn = document.getElementById("play"),
  prevBtn = document.getElementById("prev"),
  nextBtn = document.getElementById("next"),
  progress = document.getElementById("progress"),
  progressBar = document.getElementById("progress-bar"),
  timeDisplay = document.getElementById("time"),
  songName = document.getElementById("song-name");

let isPlaying = false;
let currentSong = 0;

// 🎵 Lista de canciones
const songs = [
  { name: "Only", src: "playlist/Only.mp3" },
  { name: "LIVE FOREVER(Español)-OASIS", src: "playlist/LIVE FOREVER(Español)-OASIS.mp3" },
  {name: "Be The One (spanish version)",src:"playlist/Be The One (spanish version).mp3"},
  {name:"Tattoo(Cover Español)",src:"playlist/Tattoo(Cover Español).mp3"},
  {name:"Baile Inolvidable",src:"playlist/Baile Inolvidable.mp3"},
  {name:"Enseñame a Bailar",src:"playlist/Enseñame a Bailar.mp3"},
];

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songName.textContent = song.name;
  progressBar.style.width = "0%";
  timeDisplay.textContent = "0:00 / 0:00";
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

playBtn.addEventListener("click", async () => {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶️";
  } else {
    await audio.play();
    playBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
});

audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = (isFinite(progressPercent) ? progressPercent : 0) + "%";
  timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

progress.addEventListener("click", e => {
  const rect = progress.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  if (isFinite(audio.duration)) audio.currentTime = percent * audio.duration;
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  if (isPlaying) audio.play();
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

loadSong(currentSong);

// === Escena THREE.JS ===
const canvas = document.getElementById("c"),
renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene(),
camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 20000);

// 🎮 Control de cámara con movimiento libre
let cameraPos = {x: 0, y: 0, z: 800};
let cameraVelocity = {x: 0, y: 0, z: 0};
let cameraRotation = {yaw: 0, pitch: 0};

// === Fondo espacial ===
const loader = new THREE.TextureLoader();
const nebulaTex = loader.load("https://jrenjm.github.io/amorlili/space.jpg");
scene.background = nebulaTex;

// === Estrellas de fondo mejoradas ===
(function(count = 8000, spread = 12000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(3 * count);
  const colors = new Float32Array(3 * count);
  
  for (let i = 0; i < count; i++) {
    const radius = spread * (0.3 + 0.7 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[3 * i + 0] = radius * Math.sin(phi) * Math.cos(theta);
    positions[3 * i + 1] = radius * Math.cos(phi);
    positions[3 * i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    
    // Colores variados para estrellas
    const starColor = Math.random();
    if (starColor < 0.7) {
      colors[3 * i + 0] = 1; colors[3 * i + 1] = 1; colors[3 * i + 2] = 1; // Blanco
    } else if (starColor < 0.85) {
      colors[3 * i + 0] = 1; colors[3 * i + 1] = 0.9; colors[3 * i + 2] = 0.8; // Amarillo
    } else {
      colors[3 * i + 0] = 0.8; colors[3 * i + 1] = 0.9; colors[3 * i + 2] = 1; // Azul
    }
  }
  
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  
  scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    depthWrite: false,
    transparent: true,
    opacity: 0.9
  })));
})();

// 🌌 PALABRAS BONITAS (más de 150 por galaxia)
const ALL_WORDS = [
  "💖 Mi amor", "🌞 Mi sol", "🌎 Mi mundo", "✨ Brillas", "❤️ Te amo", "🌌 Universo",
  "👑 Mi reina", "🌠 Estrella", "💫 Mi cielo", "🔥 Siempre tú", "🎶 Tu risa", "🦋 Libertad",
  "💎 Eres todo", "🙏 Gracias", "💕 Cariño", "🌹 Amor eterno", "🤗 Abrazos", "🌸 Esperanza",
  "🌈 Alegría", "🌟 Contigo", "🧸 Ternura", "🎁 Mi razón", "🌙 Mi destino", "💌 Recuerdos",
  "🕊️ Mi paz", "🪐 Mi universo", "🌊 Mi calma", "💡 Mi luz", "🍒 Dulzura", "🥰 Mi vida",
  "🎇 Felicidad", "🌻 Alegría", "🌺 Mi flor", "💜 Eternidad", "🌟 Sueños", "✨ Magia",
  "🎵 Canción", "🔥 Pasión", "⭐ Mi estrella", "🌴 Mi paraíso", "🌄 Amanecer", "🌃 Noche contigo",
  "🎉 Mi fiesta", "💫 Inspiración", "🎀 Mi ternura", "🍀 Mi fortuna", "🪞 Mi princesa",
  "🌷 Hermosa", "💝 Regalo", "🎊 Celebración", "🦄 Única", "🌼 Primavera", "🎭 Mi arte",
  "🍓 Dulce amor", "🎸 Mi melodía", "🌿 Naturaleza", "🔮 Magia pura", "🎪 Mi circo", "🏰 Mi castillo",
  "🌅 Resplandor", "🪄 Hechizo", "🎻 Sinfonía", "🌑 Mi luna", "☄️ Cometa", "🌪️ Torbellino",
  "🏔️ Mi cima", "🗻 Mi monte", "🏖️ Mi playa", "🎨 Mi color", "📿 Conexión", "🧿 Protección",
  "💒 Templo", "🕌 Sagrado", "⛪ Bendición", "🎆 Fuegos", "🎑 Contemplar", "🗼 Torre",
  "🗽 Libertad", "🗿 Eterno", "⚡ Energía", "🌪️ Fuerza", "❄️ Pureza", "☀️ Calidez",
  "🌺 Preciosa", "💗 Adorable", "🎀 Delicada", "🌸 Radiante", "✨ Divina", "💝 Tesoro",
  "🦋 Mariposa", "🌹 Belleza", "💖 Corazón", "🌟 Resplandor", "🎵 Melodía", "🌈 Arcoíris",
  "🍀 Suerte", "💫 Destello", "🌻 Girasol", "🎶 Armonía", "💕 Adoración", "🌙 Lunita",
  "⭐ Brillante", "🎨 Obra", "🌊 Ola", "🔥 Llama", "💎 Joya", "🌄 Aurora",
  "🎭 Musa", "🌺 Florecer", "💜 Violeta", "🌸 Sakura", "✨ Lucero", "🎀 Lazo",
  "🦄 Fantasía", "🌹 Rosa", "💗 Ternura", "🌟 Fulgor", "🎵 Nota", "🌈 Color",
  "🍀 Trébol", "💫 Chispa", "🌻 Sol", "🎶 Ritmo", "💕 Afecto", "🌙 Nocturna",
  "⭐ Astro", "🎨 Lienzo", "🌊 Mar", "🔥 Ardor", "💎 Diamante", "🌄 Alba",
  "🎭 Escena", "🌺 Jardín", "💜 Amatista", "🌸 Pétalo", "✨ Brillo", "🎀 Moño",
  "🦋 Vuelo", "🌹 Roja", "💗 Latido", "🌟 Centelleo", "🎵 Eco", "🌈 Prisma",
  "🍀 Verdor", "💫 Fulgor", "🌻 Campo", "🎶 Verso", "💕 Querer", "🌙 Eclipse",
  "⭐ Constelación", "🎨 Pincel", "🌊 Marea", "🔥 Fogata", "💎 Cristal", "🌄 Horizonte",
  "💞 Amor infinito", "🌠 Deseo", "💘 Enamorado", "🌅 Mañana", "🌆 Atardecer", "🌃 Estrellada",
  "💝 Regalo divino", "🌹 Rosas", "💐 Ramo", "🎁 Sorpresa", "💖 Latidos", "🌊 Océano",
  "🏞️ Paisaje", "🌋 Volcán", "🌈 Arco iris", "⚡ Relámpago", "🌧️ Lluvia", "❄️ Nieve",
  "🔥 Fuego", "💧 Agua", "🌬️ Viento", "🌍 Planeta", "🚀 Cohete", "👼 Ángel",
  "💑 Pareja", "💒 Boda", "💍 Anillo", "👶 Bebé", "🏡 Hogar", "💞 Compromiso"
];

// 🌌 CONFIGURACIÓN DE 3 GALAXIAS
const galaxies = [];
const totalPhotos = 100;
const photosPerGalaxy = 33;

// Mezclar fotos aleatoriamente
const shuffledPhotos = [];
for (let i = 1; i <= totalPhotos; i++) shuffledPhotos.push(i);
for (let i = shuffledPhotos.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffledPhotos[i], shuffledPhotos[j]] = [shuffledPhotos[j], shuffledPhotos[i]];
}

// Posiciones de las 3 galaxias con textos únicos
const galaxyPositions = [
  {x: 0, y: 0, z: 0, color: 0xff3366, name: "TE AMO LILIANA"},
  {x: 1800, y: 400, z: -1000, color: 0xff66ff, name: "ERES MI TODO"},
  {x: -1600, y: -300, z: 1200, color: 0x66ccff, name: "MI PRINCESA"}
];

// === Función para crear una galaxia MEJORADA ===
function createGalaxy(position, colorHex, galaxyIndex, textContent) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.set(position.x, position.y, position.z);
  
  // === Corazón 3D MEJORADO ===
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 3, -3, 3, -3, 0);
  heartShape.bezierCurveTo(-3, -3, 0, -3.5, 0, -6);
  heartShape.bezierCurveTo(0, -3.5, 3, -3, 3, 0);
  heartShape.bezierCurveTo(3, 3, 0, 3, 0, 0);

  const extrudeSettings = {
    depth: 3,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 3,
    bevelSize: 0.5,
    bevelThickness: 0.5
  };

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  heartGeometry.center();

  const heartMaterial = new THREE.MeshPhongMaterial({
    color: colorHex,
    shininess: 400,
    emissive: colorHex,
    emissiveIntensity: 0.4,
    specular: 0xffffff,
    transparent: true,
    opacity: 0.95
  });

  const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.scale.set(10, 10, 10);
  galaxyGroup.add(heartMesh);

  // Efecto de glow alrededor del corazón
  const heartGlowGeometry = new THREE.SphereGeometry(15, 16, 16);
  const heartGlowMaterial = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const heartGlow = new THREE.Mesh(heartGlowGeometry, heartGlowMaterial);
  galaxyGroup.add(heartGlow);

  // === Texto central MEJORADO ===
  function makeTextTexture(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 180px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowColor = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  }

  const centerTex = makeTextTexture(textContent);
  const centerMat = new THREE.SpriteMaterial({
    map: centerTex, 
    transparent: true, 
    depthTest: false,
    opacity: 0.9
  });
  const centerSprite = new THREE.Sprite(centerMat);
  centerSprite.scale.set(150, 45, 1);
  centerSprite.position.set(0, 70, 0);
  galaxyGroup.add(centerSprite);

  // === Luz MEJORADA ===
  const light = new THREE.PointLight(colorHex, 2, 1000);
  galaxyGroup.add(light);

  // === ANILLOS DINÁMICOS MEJORADOS (5 anillos) ===
  const rings = [];
  const ringCount = 5;
  
  for (let i = 0; i < ringCount; i++) {
    const innerRadius = 60 + i * 25;
    const outerRadius = innerRadius + 20;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, 64),
      new THREE.MeshBasicMaterial({
        color: colorHex, 
        transparent: true, 
        opacity: 0.3 - i * 0.05, 
        side: THREE.DoubleSide
      })
    );
    
    // Alternar orientación de anillos para efecto 3D
    if (i % 2 === 0) {
      ring.rotation.x = Math.PI / 2;
    } else {
      ring.rotation.y = Math.PI / 2;
    }
    
    ring.userData = {
      speed: 0.001 + i * 0.0005,
      pulseSpeed: 0.02 + i * 0.01,
      pulse: Math.random() * Math.PI * 2,
      originalScale: 1
    };
    
    rings.push(ring);
    galaxyGroup.add(ring);
  }

  // === Palabras flotantes (150 POR GALAXIA) ===
  function makeWordTexture(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = color;
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  }

  const COLORS = ["#ff66ff", "#66ccff", "#ffd36b", "#ff9966", "#8df59a", "#ffa0f8", "#c6a7ff", "#ff4444", "#44ff99", "#99ccff"];
  const textGroup = new THREE.Group();

  // Crear 150 palabras flotantes por galaxia
  for (let i = 0; i < 150; i++) {
    const word = ALL_WORDS[i % ALL_WORDS.length];
    const texture = makeWordTexture(word, COLORS[i % COLORS.length]);
    const material = new THREE.SpriteMaterial({
      map: texture, 
      transparent: true,
      opacity: 0.85
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(55, 18, 1);
    
    // Distribución en esfera más densa
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 120 + 180 * Math.random(); // Más cerca del centro
    
    sprite.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    
    sprite.userData = {
      phi, 
      theta, 
      radius,
      originalRadius: radius,
      speed: 0.0004 + 0.0008 * Math.random(),
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulse: Math.random() * Math.PI * 2
    };
    textGroup.add(sprite);
  }
  galaxyGroup.add(textGroup);

  // === Fotos flotantes (33 por galaxia) ===
  const imageGroup = new THREE.Group();
  const startIndex = galaxyIndex * photosPerGalaxy;
  const endIndex = Math.min(startIndex + photosPerGalaxy, totalPhotos);
  const galaxyPhotos = shuffledPhotos.slice(startIndex, endIndex);

  const imgLoader = new THREE.TextureLoader();
  galaxyPhotos.forEach(photoNum => {
    const path = `https://jrenjm.github.io/amorlili/recuerdos/f${photoNum}.jpg`;
    imgLoader.load(
      path,
      texture => {
        const mat = new THREE.SpriteMaterial({
          map: texture, 
          transparent: true,
          opacity: 0.9
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(45, 45, 1);
        
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 160 + 140 * Math.random();
        
        sprite.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        
        sprite.userData = {
          phi, 
          theta, 
          radius,
          originalRadius: radius,
          speed: 0.0003 + 0.0006 * Math.random(),
          pulseSpeed: 0.008 + Math.random() * 0.015,
          pulse: Math.random() * Math.PI * 2
        };
        imageGroup.add(sprite);
      },
      undefined,
      error => console.error(`Error loading image f${photoNum}.jpg:`, error)
    );
  });
  galaxyGroup.add(imageGroup);

  scene.add(galaxyGroup);

  return {
    group: galaxyGroup,
    heart: heartMesh,
    heartGlow: heartGlow,
    text: centerSprite,
    rings: rings,
    textGroup: textGroup,
    imageGroup: imageGroup,
    light: light
  };
}

// Crear las 3 galaxias
for (let i = 0; i < galaxyPositions.length; i++) {
  const pos = galaxyPositions[i];
  const galaxy = createGalaxy(pos, pos.color, i, pos.name);
  galaxies.push(galaxy);
}

// 🎮 CONTROLES DE MOVIMIENTO LIBRE
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let dragging = false, lastX = 0, lastY = 0;

canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mouseleave", () => dragging = false);
canvas.addEventListener("mousemove", e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  cameraRotation.yaw -= dx * 0.003;
  cameraRotation.pitch -= dy * 0.003;
  cameraRotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.pitch));
  lastX = e.clientX;
  lastY = e.clientY;
});

// 📱 Controles táctiles
canvas.addEventListener("touchstart", e => {
  dragging = true;
  const touch = e.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
}, {passive: true});

canvas.addEventListener("touchend", () => dragging = false, {passive: true});

canvas.addEventListener("touchmove", e => {
  if (!dragging) return;
  const touch = e.touches[0];
  const dx = touch.clientX - lastX;
  const dy = touch.clientY - lastY;
  cameraRotation.yaw -= dx * 0.003;
  cameraRotation.pitch -= dy * 0.003;
  cameraRotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.pitch));
  lastX = touch.clientX;
  lastY = touch.clientY;
}, {passive: true});

// 🔍 Zoom con scroll
canvas.addEventListener("wheel", e => {
  const forward = new THREE.Vector3(
    Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
    Math.sin(cameraRotation.pitch),
    Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
  );
  const zoomSpeed = e.deltaY * 0.5;
  cameraPos.x += forward.x * zoomSpeed;
  cameraPos.y += forward.y * zoomSpeed;
  cameraPos.z += forward.z * zoomSpeed;
});

// 💓 Animación de latidos MEJORADA
let heartPulse = 0;
function animateHearts() {
  heartPulse += 0.04;
  galaxies.forEach(galaxy => {
    // Latido del corazón
    const heartScale = 10 + Math.sin(heartPulse) * 0.8;
    galaxy.heart.scale.set(heartScale, heartScale, heartScale);
    
    // Glow pulsante
    const glowScale = 1 + Math.sin(heartPulse * 1.5) * 0.3;
    galaxy.heartGlow.scale.set(glowScale, glowScale, glowScale);
    galaxy.heartGlow.material.opacity = 0.15 + Math.sin(heartPulse * 2) * 0.1;
    
    // Texto pulsante
    const textScaleX = 150 + Math.sin(heartPulse) * 12;
    const textScaleY = 45 + Math.sin(heartPulse) * 8;
    galaxy.text.scale.set(textScaleX, textScaleY, 1);
    galaxy.text.material.opacity = 0.8 + Math.sin(heartPulse * 1.2) * 0.2;
    
    // Luz pulsante
    galaxy.light.intensity = 1.5 + Math.sin(heartPulse * 1.8) * 0.8;
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// === Loop de animación principal MEJORADO ===
let t = 0;
function tick() {
  requestAnimationFrame(tick);
  t += 0.01;

  // 🎮 Movimiento de cámara con teclado (WASD + Flechas)
  const moveSpeed = 6;
  const forward = new THREE.Vector3(
    Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
    Math.sin(cameraRotation.pitch),
    Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
  );
  const right = new THREE.Vector3(
    Math.sin(cameraRotation.yaw + Math.PI / 2),
    0,
    Math.cos(cameraRotation.yaw + Math.PI / 2)
  );

  if (keys['w'] || keys['arrowup']) {
    cameraPos.x += forward.x * moveSpeed;
    cameraPos.y += forward.y * moveSpeed;
    cameraPos.z += forward.z * moveSpeed;
  }
  if (keys['s'] || keys['arrowdown']) {
    cameraPos.x -= forward.x * moveSpeed;
    cameraPos.y -= forward.y * moveSpeed;
    cameraPos.z -= forward.z * moveSpeed;
  }
  if (keys['a'] || keys['arrowleft']) {
    cameraPos.x -= right.x * moveSpeed;
    cameraPos.z -= right.z * moveSpeed;
  }
  if (keys['d'] || keys['arrowright']) {
    cameraPos.x += right.x * moveSpeed;
    cameraPos.z += right.z * moveSpeed;
  }
  if (keys[' ']) cameraPos.y += moveSpeed;
  if (keys['shift']) cameraPos.y -= moveSpeed;

  // Actualizar posición de cámara
  camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
  
  const lookAt = new THREE.Vector3(
    cameraPos.x + forward.x * 100,
    cameraPos.y + forward.y * 100,
    cameraPos.z + forward.z * 100
  );
  camera.lookAt(lookAt);

  // Animar cada galaxia MEJORADO
  galaxies.forEach(galaxy => {
    // Anillos dinámicos con pulsación
    galaxy.rings.forEach((ring, index) => {
      // Rotación
      if (index % 2 === 0) {
        ring.rotation.z += ring.userData.speed;
      } else {
        ring.rotation.x += ring.userData.speed;
      }
      
      // Pulsación
      ring.userData.pulse += ring.userData.pulseSpeed;
      const pulseScale = 1 + Math.sin(ring.userData.pulse) * 0.15;
      ring.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Opacidad dinámica
      ring.material.opacity = 0.3 - index * 0.05 + Math.sin(ring.userData.pulse * 1.5) * 0.1;
    });

    // Palabras flotantes con movimiento orbital mejorado
    galaxy.textGroup.children.forEach(sprite => {
      sprite.userData.theta += sprite.userData.speed;
      sprite.userData.pulse += sprite.userData.pulseSpeed;
      
      // Movimiento orbital con pulsación
      const currentRadius = sprite.userData.originalRadius + Math.sin(sprite.userData.pulse) * 15;
      
      sprite.position.x = currentRadius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = currentRadius * Math.cos(sprite.userData.phi);
      sprite.position.z = currentRadius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      // Pulsación de opacidad y escala
      sprite.material.opacity = 0.7 + 0.3 * Math.sin(sprite.userData.pulse * 2);
      const spriteScale = 1 + Math.sin(sprite.userData.pulse * 1.5) * 0.1;
      sprite.scale.set(55 * spriteScale, 18 * spriteScale, 1);
      
      // Siempre mirar a la cámara
      sprite.lookAt(camera.position);
    });

    // Fotos flotantes con comportamiento similar
    galaxy.imageGroup.children.forEach(sprite => {
      sprite.userData.theta += sprite.userData.speed;
      sprite.userData.pulse += sprite.userData.pulseSpeed;
      
      const currentRadius = sprite.userData.originalRadius + Math.sin(sprite.userData.pulse) * 12;
      
      sprite.position.x = currentRadius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = currentRadius * Math.cos(sprite.userData.phi);
      sprite.position.z = currentRadius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      sprite.material.opacity = 0.8 + 0.2 * Math.sin(sprite.userData.pulse * 1.5);
      const photoScale = 1 + Math.sin(sprite.userData.pulse) * 0.05;
      sprite.scale.set(45 * photoScale, 45 * photoScale, 1);
      
      sprite.lookAt(camera.position);
    });
  });

  renderer.render(scene, camera);
}
tick();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
