// Log para confirmar que el script se carga
console.log("Script loaded");

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

// 🎵 Lista de canciones (mantengo exactamente tus rutas)
const songs = [
  { name: "Only", src: "./playlist/Only.mp3" },
  { name: "LIVE FOREVER(Español)-OASIS", src: "./playlist/LIVE FOREVER(Español)-OASIS.mp3" },
  { name: "Be The One (spanish version)", src: "./playlist/Be The One (spanish version).mp3" },
  { name: "Tattoo(Cover Español)", src: "./playlist/Tattoo(Cover Español).mp3" },
  { name: "Baile Inolvidable", src: "./playlist/Baile Inolvidable.mp3" },
  { name: "Enseñame a Bailar", src: "./playlist/Enseñame a Bailar.mp3" },
  { name: "ODESZA-A Moment Apart", src: "./playlist/ODESZA-A Moment Apart.mp3" },
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
    try {
      await audio.play();
      playBtn.textContent = "⏸️";
    } catch (error) {
      console.error("Error playing audio:", error);
    }
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
// canvas y renderer (mejor manejo DPR ya está)
const canvas = document.getElementById("c"),
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);

// escena y cámara
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 20000);

// 🎮 Control de cámara con movimiento libre
let cameraPos = { x: 0, y: 0, z: 2000 };
let cameraVelocity = { x: 0, y: 0, z: 0 };
// La cámara ahora mira hacia -Z (dirección natural en THREE.js)
let cameraRotation = { yaw: 0, pitch: 0 };


// Variables para movimiento suave
let targetCameraPos = { ...cameraPos };
let targetCameraRotation = { ...cameraRotation };
let isMoving = false;

// UNICA DECLARACION SMOOTHNESS (evita redeclaraciones)
const SMOOTHNESS = 0.08;
const ZOOM_SMOOTHNESS = 0.05;
// === CONTROL DE CÁMARA CON MOUSE ===
let isDragging = false;
let lastMouse = { x: 0, y: 0 };

// Sensibilidad adaptada a PC y móvil
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const ZOOM_SENSITIVITY = isMobile ? 10 : 5;
const ROTATION_SENSITIVITY = isMobile ? 0.01 : 0.04;
const MOVE_SPEED = isMobile ? 6 : 4;

// Eventos de mouse / touch
canvas.addEventListener("mousedown", e => {
  isDragging = true;
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
});

canvas.addEventListener("mouseup", () => (isDragging = false));
canvas.addEventListener("mouseleave", () => (isDragging = false));

canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const dx = e.clientX - lastMouse.x;
  const dy = e.clientY - lastMouse.y;
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;

  targetCameraRotation.yaw -= dx * ROTATION_SENSITIVITY;
  targetCameraRotation.pitch -= dy * ROTATION_SENSITIVITY;

  // Limitar el ángulo vertical (pitch)
  targetCameraRotation.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetCameraRotation.pitch));
});

// === Zoom con rueda del mouse ===
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const zoomDir = Math.sign(e.deltaY);
  targetCameraPos.z += zoomDir * ZOOM_SENSITIVITY * 20;
  targetCameraPos.z = Math.max(300, Math.min(5000, targetCameraPos.z));
});

// === Soporte táctil (móvil) ===
let lastTouchDistance = 0;

canvas.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    isDragging = true;
    lastMouse.x = e.touches[0].clientX;
    lastMouse.y = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    lastTouchDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
});

canvas.addEventListener("touchmove", e => {
  if (e.touches.length === 1 && isDragging) {
    const touch = e.touches[0];
    const dx = touch.clientX - lastMouse.x;
    const dy = touch.clientY - lastMouse.y;
    lastMouse.x = touch.clientX;
    lastMouse.y = touch.clientY;

    targetCameraRotation.yaw -= dx * ROTATION_SENSITIVITY;
    targetCameraRotation.pitch -= dy * ROTATION_SENSITIVITY;
    targetCameraRotation.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetCameraRotation.pitch));
  } else if (e.touches.length === 2) {
    const newDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const zoomDir = lastTouchDistance - newDistance;
    targetCameraPos.z += zoomDir * 0.5;
    targetCameraPos.z = Math.max(300, Math.min(5000, targetCameraPos.z));
    lastTouchDistance = newDistance;
  }
});

canvas.addEventListener("touchend", () => (isDragging = false));

// ===== Mejoras añadidas =====
// inercia de rotación para suavizar arrastres
let rotInertia = { yaw: 0, pitch: 0 };
// factor de amortiguamiento (0..1)
const INERTIA_DAMP = 0.86;
// limite para evitar NaN/inf
const SAFE_MIN = 1e-6;

// FPS limiter: no forzamos cambios, pero permitimos un delta adaptativo
let lastFrameTime = performance.now();
const MAX_DELTA = 0.04; // evita saltos si tab inactivo (40ms)


// === Iluminación global ===
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// luz dinámica adicional para efecto visual
const dynLight = new THREE.PointLight(0xffffff, 0.6, 5000);
dynLight.position.set(0, 200, 500);
scene.add(dynLight);

// === Fondo espacial ===
const loader = new THREE.TextureLoader();
loader.load(
  "https://jrenjm.github.io/amorlili/space.jpg",
  texture => { scene.background = texture; },
  undefined,
  error => {
    console.error("Error loading background:", error);
    scene.background = new THREE.Color(0x111111);
  }
);

// === Estrellas de fondo optimizadas ===
(function (count = 6000, spread = 10000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(3 * count);
  for (let i = 0; i < count; i++) {
    const radius = spread * (0.3 + 0.7 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[3 * i + 0] = radius * Math.sin(phi) * Math.cos(theta);
    positions[3 * i + 1] = radius * Math.cos(phi);
    positions[3 * i + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // material para fondo de estrellas con slight twinkle posible
  const starMat = new THREE.PointsMaterial({
    size: 2.5,
    color: 0xffffff,
    depthWrite: false,
    transparent: true,
    opacity: 0.8
  });
  const starField = new THREE.Points(geometry, starMat);
  // guardamos referencia para animar pulso sutil
  starField.userData = { baseOpacity: 0.8, twinkleOffset: Math.random() * 1000 };
  scene.add(starField);
})();

// 🌌 PALABRAS BONITAS DUPLICADAS (400 por galaxia)
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
  // Palabras duplicadas para mayor densidad
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
  "⭐ Constelación", "🎨 Pincel", "🌊 Marea", "🔥 Fogata", "💎 Cristal", "🌄 Horizonte"
];

// 🌌 CONFIGURACIÓN DE 3 GALAXIAS
const galaxies = [];
const totalPhotos = 200; // Duplicado de 100 a 200 fotos
const photosPerGalaxy = 66; // Duplicado de 33 a 66 fotos por galaxia

// Mezclar fotos aleatoriamente
const shuffledPhotos = [];
for (let i = 1; i <= totalPhotos; i++) shuffledPhotos.push(i);
for (let i = shuffledPhotos.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffledPhotos[i], shuffledPhotos[j]] = [shuffledPhotos[j], shuffledPhotos[i]];
}

// Posiciones de las 3 galaxias (más cercanas entre sí)
const galaxyPositions = [
  { x: 0, y: 0, z: 0, color: 0xff3366, name: "TE AMO LILIANA" },
  { x: 1000, y: 200, z: -600, color: 0xff66ff, name: "ERES MI TODO LILIANA" }, // Reducidas las distancias
  { x: -900, y: -250, z: 750, color: 0x66ccff, name: "MI PRINCESA LILIANA" } // Reducidas las distancias
];

// === Función para crear estrellas alrededor de una galaxia ===
function createGalaxyStars(position, count = 300, radius = 400) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Posición aleatoria en esfera
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.3 + 0.7 * Math.random());
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    
    positions[i * 3] = x + position.x;
    positions[i * 3 + 1] = y + position.y;
    positions[i * 3 + 2] = z + position.z;
    
    // Color blanco con variaciones sutiles
    colors[i * 3] = 0.8 + 0.2 * Math.random(); // R
    colors[i * 3 + 1] = 0.8 + 0.2 * Math.random(); // G
    colors[i * 3 + 2] = 0.9 + 0.1 * Math.random(); // B
    
    // Tamaño aleatorio
    sizes[i] = 1 + Math.random() * 3;
    
    // Velocidad de movimiento orbital
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(geometry, material);
  stars.userData = { originalPositions: [...positions], velocities: [...velocities], twinkleOffset: Math.random() * 1000 };
  return stars;
}

// === Función para crear una galaxia ===
function createGalaxy(position, colorHex, galaxyIndex, textContent) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.set(position.x, position.y, position.z);

  // === Estrellas alrededor de la galaxia ===
  const galaxyStars = createGalaxyStars(position, 400, 500);
  galaxyGroup.add(galaxyStars);

  // === Corazón 3D ===
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 3, -3, 3, -3, 0);
  heartShape.bezierCurveTo(-3, -3, 0, -3.5, 0, -6);
  heartShape.bezierCurveTo(0, -3.5, 3, -3, 3, 0);
  heartShape.bezierCurveTo(3, 3, 0, 3, 0, 0);

  const extrudeSettings = {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: 0.4,
    bevelThickness: 0.4
  };

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  heartGeometry.center();

  const heartMaterial = new THREE.MeshPhongMaterial({
    color: colorHex,
    shininess: 300,
    emissive: colorHex,
    emissiveIntensity: 0.3,
    specular: 0xffffff,
    transparent: true,
    opacity: 1
  });

  const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
  heartMesh.scale.set(8, 8, 8);
  galaxyGroup.add(heartMesh);

  // === Texto central MEJORADO - Versión dinámica ===
function makeTextTexture(text) {
  // Calcular el ancho necesario basado en la longitud del texto
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.font = "bold 450px Arial";
  const textWidth = tempCtx.measureText(text).width;
  
  // Crear canvas con tamaño dinámico
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(4096, textWidth + 800); // Mínimo 4096, más espacio extra
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = "bold 450px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
  ctx.shadowColor = `#${colorHex.toString(16).padStart(6, '0')}`;
  ctx.shadowBlur = 60;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
}

const centerTex = makeTextTexture(textContent);
const centerMat = new THREE.SpriteMaterial({ map: centerTex, transparent: true, depthTest: false });
const centerSprite = new THREE.Sprite(centerMat);

// Escala dinámica basada en el ancho del texto
const scaleX = 120 + (textContent.length * 2); // Ajusta según la longitud del texto
centerSprite.scale.set(scaleX, 50, 1);
centerSprite.position.set(0, 50, 0);
galaxyGroup.add(centerSprite);

  // === Luz ===
  const light = new THREE.PointLight(colorHex, 1.5, 800);
  galaxyGroup.add(light);

  // === Anillos giratorios ===
  const ring1 = new THREE.Mesh(
    new THREE.RingGeometry(80, 100, 128),
    new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  );
  const ring2 = new THREE.Mesh(
    new THREE.RingGeometry(110, 130, 128),
    new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
  );
  const ring3 = new THREE.Mesh(
    new THREE.RingGeometry(140, 160, 128),
    new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  ring1.rotation.x = ring2.rotation.x = ring3.rotation.x = Math.PI / 2;
  galaxyGroup.add(ring1);
  galaxyGroup.add(ring2);
  galaxyGroup.add(ring3);

  // === Palabras flotantes (400 por galaxia - DUPLICADO) ===
  function makeWordTexture(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  }

  const COLORS = ["#ff66ff", "#66ccff", "#ffd36b", "#ff9966", "#8df59a", "#ffa0f8", "#c6a7ff", "#ff4444", "#44ff99", "#99ccff"];
  const textGroup = new THREE.Group();

  for (let i = 0; i < 400; i++) { // Duplicado de 200 a 400
    const word = ALL_WORDS[i % ALL_WORDS.length];
    const texture = makeWordTexture(word, COLORS[i % COLORS.length]);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(45, 14, 1);
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 150 + 150 * Math.random();
    sprite.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    sprite.userData = { 
      phi, 
      theta, 
      radius, 
      speed: 0.0008 + 0.0012 * Math.random(),
      pulseSpeed: 0.5 + Math.random() * 1.5,
      pulseOffset: Math.random() * Math.PI * 2
    };
    textGroup.add(sprite);
  }
  galaxyGroup.add(textGroup);

  // === Fotos flotantes ===
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
        const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(40, 40, 1);
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 180 + 120 * Math.random();
        sprite.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        sprite.userData = { 
          phi, 
          theta, 
          radius, 
          speed: 0.0008 + 0.0012 * Math.random(),
          pulseSpeed: 0.3 + Math.random() * 1.0,
          pulseOffset: Math.random() * Math.PI * 2
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
    text: centerSprite,
    ring1,
    ring2,
    ring3,
    textGroup,
    imageGroup,
    stars: galaxyStars
  };
}

// Crear las 3 galaxias
for (let i = 0; i < galaxyPositions.length; i++) {
  const pos = galaxyPositions[i];
  const galaxy = createGalaxy(pos, pos.color, i, pos.name);
  galaxies.push(galaxy);
}

// 🎮 CONTROLES DE MOVIMIENTO LIBRE SUAVE UNIVERSAL
const keys = {};
window.addEventListener("keydown", e => (keys[e.key.toLowerCase()] = true));
window.addEventListener("keyup", e => (keys[e.key.toLowerCase()] = false));

let dragging = false, lastX = 0, lastY = 0;

// Variables para zoom y movimiento táctil
let touchStartDistance = 0;
let initialFov = camera.fov;
let isZooming = false;

// Detectar si es móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Sensibilidades y velocidades ajustadas para suavidad
const MOVE_SPEED = 5;
const ROTATION_SENSITIVITY = 0.0035;
const ZOOM_SENSITIVITY = 0.15;

// Objetivos para suavizar la interpolación
let targetPos = { ...cameraPos };
let targetRot = { ...cameraRotation };

// Ajustes para móviles (menos sensibilidad)
const MOBILE_ADJUST = isMobile ? 0.6 : 1.0;

// === Eventos de ratón ===
canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener("mouseup", () => (dragging = false));
canvas.addEventListener("mouseleave", () => (dragging = false));
canvas.addEventListener("mousemove", e => {
  if (!dragging) return;
  const dx = (e.clientX - lastX) * MOBILE_ADJUST;
  const dy = (e.clientY - lastY) * MOBILE_ADJUST;
  // suavizamos aplicando inercia
  rotInertia.yaw += -dx * ROTATION_SENSITIVITY * 0.6;
  rotInertia.pitch += -dy * ROTATION_SENSITIVITY * 0.6;
  targetRot.yaw -= dx * ROTATION_SENSITIVITY;
  targetRot.pitch -= dy * ROTATION_SENSITIVITY;
  targetRot.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.pitch));
  lastX = e.clientX;
  lastY = e.clientY;
});

// === Zoom con rueda ===
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  targetPos.z += e.deltaY * ZOOM_SENSITIVITY * (isMobile ? 0.6 : 1);
  targetPos.z = Math.max(-8000, Math.min(8000, targetPos.z));
});

// === Control táctil (rotación + zoom multitáctil) ===
canvas.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    isZooming = true;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchStartDistance = Math.hypot(dx, dy);
    initialFov = camera.fov;
  }
});
canvas.addEventListener("touchend", () => {
  dragging = false;
  isZooming = false;
});
canvas.addEventListener("touchmove", e => {
  if (isZooming && e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.hypot(dx, dy);
    const delta = (touchStartDistance - distance) * 0.02;
    targetPos.z += delta * 50 * (isMobile ? 0.6 : 1);
    targetPos.z = Math.max(-8000, Math.min(8000, targetPos.z));
  } else if (dragging && e.touches.length === 1) {
    const dx = (e.touches[0].clientX - lastX) * MOBILE_ADJUST;
    const dy = (e.touches[0].clientY - lastY) * MOBILE_ADJUST;
    rotInertia.yaw += -dx * ROTATION_SENSITIVITY * 0.6;
    rotInertia.pitch += -dy * ROTATION_SENSITIVITY * 0.6;
    targetRot.yaw -= dx * ROTATION_SENSITIVITY * 2;
    targetRot.pitch -= dy * ROTATION_SENSITIVITY * 2;
    targetRot.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.pitch));
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
});

// === Función para interpolar suavemente ===
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ===== Animación principal mejorada =====
function animate() {
  const now = performance.now();
  let delta = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  if (delta > MAX_DELTA) delta = MAX_DELTA; // evita saltos grandes

  requestAnimationFrame(animate);

  // Movimiento WASD suave - (soporte teclas)
  const forward = keys["w"] || keys["W"] ? 1 : keys["s"] || keys["S"] ? -1 : 0;
  const right = keys["d"] || keys["D"] ? 1 : keys["a"] || keys["A"] ? -1 : 0;
  const up = keys[" "] ? 1 : keys["Shift"] ? -1 : 0;

  const speed = MOVE_SPEED * (isMobile ? 0.6 : 1) * delta * 60; // escalado por delta
  const sinY = Math.sin(targetRot.yaw || 0);
  const cosY = Math.cos(targetRot.yaw || 0);

  targetPos.x += (right * cosY - forward * sinY) * speed;
  targetPos.z += (forward * cosY + right * sinY) * speed;
  targetPos.y += up * speed;

  // Interpolación suave de posición y rotación
  cameraPos.x = lerp(cameraPos.x, targetPos.x, SMOOTHNESS);
  cameraPos.y = lerp(cameraPos.y, targetPos.y, SMOOTHNESS);
  cameraPos.z = lerp(cameraPos.z, targetPos.z, SMOOTHNESS);

  cameraRotation.yaw = lerp(cameraRotation.yaw, targetRot.yaw || 0, SMOOTHNESS);
  cameraRotation.pitch = lerp(cameraRotation.pitch, targetRot.pitch || 0, SMOOTHNESS);

  // aplicar rotación con inercia amortiguada
  cameraRotation.yaw += rotInertia.yaw * delta;
  cameraRotation.pitch += rotInertia.pitch * delta;
  rotInertia.yaw *= Math.pow(INERTIA_DAMP, delta * 60);
  rotInertia.pitch *= Math.pow(INERTIA_DAMP, delta * 60);

  // evitar NaN
  if (!isFinite(cameraRotation.yaw)) cameraRotation.yaw = 0;
  if (!isFinite(cameraRotation.pitch)) cameraRotation.pitch = 0;

  // Actualizar posición y orientación
  camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
  // usar lookAt + small rotation offset to keep stable orientation
  const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(cameraRotation.pitch, cameraRotation.yaw, 0, "YXZ"));
  camera.quaternion.slerp(quat, 0.5); // suaviza la orientación

  // Animación de galaxias, estrellas, etc. + efectos visuales
  const t = performance.now() * 0.001;
  galaxies.forEach((g, idx) => {
    // girar anillos si existen (preservando tu lógica)
    if (g.ring1) g.ring1.rotation.z += 0.001 * (1 + idx * 0.2);
    if (g.ring2) g.ring2.rotation.z -= 0.001 * (1 + idx * 0.2);
    if (g.ring3) g.ring3.rotation.z += 0.0005 * (1 + idx * 0.2);

    // twinkle sutil de las estrellas de la galaxia (si existe)
    if (g.stars && g.stars.material) {
      const base = g.stars.userData?.baseOpacity ?? 0.8;
      g.stars.material.opacity = base * (0.75 + 0.25 * Math.sin(t * 1.5 + (g.stars.userData?.twinkleOffset || 0)));
      // opcional: variar tamaño levemente para efecto parpadeo
      // g.stars.material.size = 1.8 + 0.6 * Math.sin(t * 2 + idx);
    }

    // animación texto flotante y fotos (preserva tu lógica)
    if (g.textGroup && g.textGroup.children) {
      g.textGroup.children.forEach(s => {
        s.userData.theta += s.userData.speed;
        s.position.x = s.userData.radius * Math.sin(s.userData.phi) * Math.cos(s.userData.theta);
        s.position.z = s.userData.radius * Math.sin(s.userData.phi) * Math.sin(s.userData.theta);
        const scalePulse = 1 + 0.15 * Math.sin(performance.now() * 0.001 * s.userData.pulseSpeed + s.userData.pulseOffset);
        s.scale.set(45 * scalePulse, 14 * scalePulse, 1);
        // brillo sutil
        if (s.material) s.material.opacity = 0.85 + 0.15 * Math.sin(t * 2 + s.userData.pulseOffset);
      });
    }

    if (g.imageGroup && g.imageGroup.children) {
      g.imageGroup.children.forEach(s => {
        s.userData.theta += s.userData.speed;
        s.position.x = s.userData.radius * Math.sin(s.userData.phi) * Math.cos(s.userData.theta);
        s.position.z = s.userData.radius * Math.sin(s.userData.phi) * Math.sin(s.userData.theta);
        const scalePulse = 1 + 0.2 * Math.sin(performance.now() * 0.001 * s.userData.pulseSpeed + s.userData.pulseOffset);
        s.scale.set(40 * scalePulse, 40 * scalePulse, 1);
        if (s.material) s.material.opacity = 0.85 + 0.15 * Math.sin(t * 1.5 + s.userData.pulseOffset);
      });
    }
  });

  // pulso de la luz dinámica para efecto visual
  dynLight.intensity = 0.45 + 0.15 * Math.sin(t * 0.8);

  // render
  renderer.render(scene, camera);
}

animate();

// === FIN DEL CÓDIGO ===
