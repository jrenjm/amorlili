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

// 🎵 Lista de canciones
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
const canvas = document.getElementById("c"),
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 20000);

// 🎮 Control de cámara con movimiento libre
let cameraPos = { x: 0, y: 0, z: 2000 };
let cameraVelocity = { x: 0, y: 0, z: 0 };
let cameraRotation = { yaw: Math.PI, pitch: 0 };

// Variables para movimiento suave
let targetCameraPos = { ...cameraPos };
let targetCameraRotation = { ...cameraRotation };
let isMoving = false;
const SMOOTHNESS = 0.1;
const ZOOM_SMOOTHNESS = 0.05;

// === Iluminación global ===
const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

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
  scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 2.5,
    color: 0xffffff,
    depthWrite: false,
    transparent: true,
    opacity: 0.8
  })));
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
  stars.userData = { originalPositions: [...positions], velocities: [...velocities] };
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

// 🎮 CONTROLES DE MOVIMIENTO LIBRE UNIFICADOS
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let dragging = false, lastX = 0, lastY = 0;

// Variables para zoom unificado
let touchStartDistance = 0;
let initialFov = camera.fov;
let isZooming = false;

// === DETECCIÓN DE DISPOSITIVO ===
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Configuración unificada para todos los dispositivos
const ZOOM_SENSITIVITY = isMobile ? 10 : 5; // Más sensible en móvil
const ROTATION_SENSITIVITY = isMobile ? 2 : 1; // Similar sensibilidad
const MOVE_SPEED = isMobile ? 10 : 7; // Velocidad similar

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
  
  // Movimiento suave de rotación
  targetCameraRotation.yaw -= dx * ROTATION_SENSITIVITY;
  targetCameraRotation.pitch -= dy * ROTATION_SENSITIVITY;
  targetCameraRotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetCameraRotation.pitch));
  isMoving = true;
  
  lastX = e.clientX;
  lastY = e.clientY;
});

// === CONTROLES TÁCTILES UNIFICADOS ===
canvas.addEventListener("touchstart", e => {
  if (e.touches.length === 1) {
    // Un dedo: rotar cámara
    dragging = true;
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
  } else if (e.touches.length === 2) {
    // Dos dedos: zoom
    isZooming = true;
    touchStartDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    initialFov = camera.fov;
  }
}, { passive: true });

canvas.addEventListener("touchend", () => {
  dragging = false;
  isZooming = false;
  touchStartDistance = 0;
}, { passive: true });

canvas.addEventListener("touchmove", e => {
  if (e.touches.length === 1 && dragging) {
    // Un dedo: rotar cámara
    const touch = e.touches[0];
    const dx = touch.clientX - lastX;
    const dy = touch.clientY - lastY;
    
    // Movimiento suave de rotación
    targetCameraRotation.yaw -= dx * ROTATION_SENSITIVITY;
    targetCameraRotation.pitch -= dy * ROTATION_SENSITIVITY;
    targetCameraRotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetCameraRotation.pitch));
    isMoving = true;
    
    lastX = touch.clientX;
    lastY = touch.clientY;
  } else if (e.touches.length === 2 && isZooming) {
    // Dos dedos: zoom con pellizco - SIN LÍMITES
    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    
    if (touchStartDistance > 0) {
      const zoomFactor = touchStartDistance / currentDistance;
      
      // Zoom mediante movimiento de cámara en lugar de FOV - SIN LÍMITES
      const forward = new THREE.Vector3(
        Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
        Math.sin(cameraRotation.pitch),
        Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
      );
      
      const zoomAmount = (zoomFactor - 1) * 50 * ZOOM_SENSITIVITY;
      targetCameraPos.x += forward.x * zoomAmount;
      targetCameraPos.y += forward.y * zoomAmount;
      targetCameraPos.z += forward.z * zoomAmount;
      isMoving = true;
    }
    
    touchStartDistance = currentDistance;
  }
}, { passive: true });

// === ZOOM CON RUEDA UNIFICADO - SIN LÍMITES ===
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  
  const forward = new THREE.Vector3(
    Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
    Math.sin(cameraRotation.pitch),
    Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
  );
  
  // Zoom mediante movimiento de cámara - SIN LÍMITES
  const zoomSpeed = e.deltaY * ZOOM_SENSITIVITY;
  targetCameraPos.x += forward.x * zoomSpeed;
  targetCameraPos.y += forward.y * zoomSpeed;
  targetCameraPos.z += forward.z * zoomSpeed;
  isMoving = true;
}, { passive: false });

// 💓 Animación de latidos
let heartPulse = 0;
function animateHearts() {
  heartPulse += 0.05;
  galaxies.forEach(galaxy => {
    const heartScale = 8 + Math.sin(heartPulse) * 0.5;
    galaxy.heart.scale.set(heartScale, heartScale, heartScale);

    const textScaleX = 120 + Math.sin(heartPulse) * 8;
    const textScaleY = 50 + Math.sin(heartPulse) * 4;
    galaxy.text.scale.set(textScaleX, textScaleY, 1);
    galaxy.text.material.opacity = 0.85 + Math.sin(heartPulse) * 0.15;
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// === Loop de animación principal optimizado ===
let t = 0;
function tick() {
  requestAnimationFrame(tick);
  t += 0.01;

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

  // Controles de teclado con movimiento suave
  if (keys['w'] || keys['arrowup']) {
    targetCameraPos.x += forward.x * MOVE_SPEED;
    targetCameraPos.y += forward.y * MOVE_SPEED;
    targetCameraPos.z += forward.z * MOVE_SPEED;
    isMoving = true;
  }
  if (keys['s'] || keys['arrowdown']) {
    targetCameraPos.x -= forward.x * MOVE_SPEED;
    targetCameraPos.y -= forward.y * MOVE_SPEED;
    targetCameraPos.z -= forward.z * MOVE_SPEED;
    isMoving = true;
  }
  if (keys['a'] || keys['arrowleft']) {
    targetCameraPos.x -= right.x * MOVE_SPEED;
    targetCameraPos.z -= right.z * MOVE_SPEED;
    isMoving = true;
  }
  if (keys['d'] || keys['arrowright']) {
    targetCameraPos.x += right.x * MOVE_SPEED;
    targetCameraPos.z += right.z * MOVE_SPEED;
    isMoving = true;
  }
  if (keys[' ']) {
    targetCameraPos.y += MOVE_SPEED;
    isMoving = true;
  }
  if (keys['shift']) {
    targetCameraPos.y -= MOVE_SPEED;
    isMoving = true;
  }

  // Aplicar movimiento suave a la cámara
  if (isMoving) {
    cameraPos.x += (targetCameraPos.x - cameraPos.x) * SMOOTHNESS;
    cameraPos.y += (targetCameraPos.y - cameraPos.y) * SMOOTHNESS;
    cameraPos.z += (targetCameraPos.z - cameraPos.z) * SMOOTHNESS;
    
    cameraRotation.yaw += (targetCameraRotation.yaw - cameraRotation.yaw) * SMOOTHNESS;
    cameraRotation.pitch += (targetCameraRotation.pitch - cameraRotation.pitch) * SMOOTHNESS;
    
    // Si estamos muy cerca del objetivo, detener el movimiento
    if (Math.abs(targetCameraPos.x - cameraPos.x) < 0.1 &&
        Math.abs(targetCameraPos.y - cameraPos.y) < 0.1 &&
        Math.abs(targetCameraPos.z - cameraPos.z) < 0.1 &&
        Math.abs(targetCameraRotation.yaw - cameraRotation.yaw) < 0.001 &&
        Math.abs(targetCameraRotation.pitch - cameraRotation.pitch) < 0.001) {
      isMoving = false;
    }
  }

  camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

  const lookAt = new THREE.Vector3(
    cameraPos.x + forward.x * 100,
    cameraPos.y + forward.y * 100,
    cameraPos.z + forward.z * 100
  );
  camera.lookAt(lookAt);

  // Animación de galaxias
  galaxies.forEach(galaxy => {
    galaxy.ring1.rotation.z += 0.003;
    galaxy.ring2.rotation.z -= 0.0025;
    galaxy.ring3.rotation.z += 0.002;

    galaxy.ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    galaxy.ring2.rotation.x = Math.PI / 2 + Math.cos(t * 0.6) * 0.12;
    galaxy.ring3.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.08;

    // Animación de palabras con efectos mejorados
    galaxy.textGroup.children.forEach(sprite => {
      const pulse = Math.sin(t * sprite.userData.pulseSpeed + sprite.userData.pulseOffset) * 0.25;
      sprite.material.opacity = 0.75 + 0.25 * Math.sin(2 * t) + pulse;
      sprite.userData.theta += sprite.userData.speed;
      sprite.position.x = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = sprite.userData.radius * Math.cos(sprite.userData.phi);
      sprite.position.z = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      // Efecto de escala sutil
      const scaleEffect = 1 + Math.sin(t * 2 + sprite.userData.pulseOffset) * 0.1;
      sprite.scale.set(45 * scaleEffect, 14 * scaleEffect, 1);
    });

    // Animación de fotos con efectos mejorados
    galaxy.imageGroup.children.forEach(sprite => {
      const pulse = Math.sin(t * sprite.userData.pulseSpeed + sprite.userData.pulseOffset) * 0.15;
      sprite.material.opacity = 0.85 + 0.15 * Math.sin(2 * t) + pulse;
      sprite.userData.theta += sprite.userData.speed;
      sprite.position.x = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = sprite.userData.radius * Math.cos(sprite.userData.phi);
      sprite.position.z = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      // Rotación suave de las fotos
      sprite.rotation.z += 0.001;
    });

    // Animación de estrellas alrededor de la galaxia
    if (galaxy.stars) {
      const positions = galaxy.stars.geometry.attributes.position.array;
      const velocities = galaxy.stars.userData.velocities;
      const originalPositions = galaxy.stars.userData.originalPositions;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Movimiento orbital suave
        positions[i] += velocities[i] * Math.sin(t * 0.5);
        positions[i + 1] += velocities[i + 1] * Math.cos(t * 0.3);
        positions[i + 2] += velocities[i + 2] * Math.sin(t * 0.4);
        
        // Efecto de pulsación sutil
        const pulse = Math.sin(t * 2 + i * 0.01) * 0.5;
        positions[i] = originalPositions[i] + pulse;
        positions[i + 1] = originalPositions[i + 1] + pulse;
        positions[i + 2] = originalPositions[i + 2] + pulse;
      }
      
      galaxy.stars.geometry.attributes.position.needsUpdate = true;
    }

    // Hacer que elementos miren a la cámara
    galaxy.group.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
        if (child.geometry && child.geometry.type !== "RingGeometry") {
          child.lookAt(camera.position);
        }
      }
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
