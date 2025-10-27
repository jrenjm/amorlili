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

// === Escena THREE.JS MEJORADA ===
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

// === ILUMINACIÓN MEJORADA ===
function setupEnhancedLighting() {
  // Luz ambiental suave
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  // Luz direccional principal (como luz solar)
  const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
  sunLight.position.set(1000, 500, 1000);
  scene.add(sunLight);

  // Luces de acento para planetas
  const planetLights = [
    { color: 0xFF4444, intensity: 0.5, position: [1200, -800, 800] },
    { color: 0x4444FF, intensity: 0.4, position: [-1500, 600, -900] },
    { color: 0x44FF44, intensity: 0.3, position: [800, 900, -1400] }
  ];

  planetLights.forEach(lightData => {
    const light = new THREE.PointLight(lightData.color, lightData.intensity, 1000);
    light.position.set(...lightData.position);
    scene.add(light);
  });

  // Nebulosa glow
  const nebulaGlow = new THREE.PointLight(0x8A2BE2, 0.6, 2000);
  nebulaGlow.position.set(-1500, 500, -1000);
  scene.add(nebulaGlow);
}

setupEnhancedLighting();

// === FONDO ESPACIAL MEJORADO ===
const loader = new THREE.TextureLoader();
loader.load(
  "https://jrenjm.github.io/amorlili/space.jpg",
  texture => { scene.background = texture; },
  undefined,
  error => {
    console.error("Error loading background:", error);
    scene.background = new THREE.Color(0x000011); // Azul oscuro como fallback
  }
);

// === ESTRELLAS REALISTAS ===
function createRealisticStars() {
  const starCount = 12000;
  const starGeometry = new THREE.BufferGeometry();
  
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    // Distribución más realista (más estrellas cerca del plano galáctico)
    const spiralArm = Math.floor(Math.random() * 4);
    const angle = (spiralArm * Math.PI / 2) + (Math.random() - 0.5) * 0.5;
    const distance = 1500 + Math.random() * 8000;
    const height = (Math.random() - 0.5) * 400;
    
    positions[i * 3] = Math.cos(angle) * distance;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * distance;
    
    // Colores estelares realistas
    const starType = Math.random();
    let r, g, b;
    if (starType < 0.7) { // Estrellas amarillas/blancas
      r = 1; g = 0.9; b = 0.8;
    } else if (starType < 0.85) { // Estrellas azules
      r = 0.7; g = 0.8; b = 1;
    } else if (starType < 0.95) { // Estrellas naranjas
      r = 1; g = 0.7; b = 0.4;
    } else { // Estrellas rojas
      r = 1; g = 0.5; b = 0.4;
    }
    
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
    
    // Tamaños variados
    sizes[i] = 0.3 + Math.random() * 2.5;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
}

createRealisticStars();

// === NEBULOSAS MEJORADAS ===
function createNebulae() {
  // Nebulosa principal
  const nebulaGeometry = new THREE.SphereGeometry(600, 32, 32);
  const nebulaMaterial = new THREE.MeshBasicMaterial({
    color: 0x8A2BE2,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  
  const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  nebula.position.set(-1500, 500, -1000);
  scene.add(nebula);

  // Nebulosa secundaria
  const nebula2Geometry = new THREE.SphereGeometry(400, 24, 24);
  const nebula2Material = new THREE.MeshBasicMaterial({
    color: 0x00BFFF,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide
  });
  
  const nebula2 = new THREE.Mesh(nebula2Geometry, nebula2Material);
  nebula2.position.set(1200, -300, 1500);
  scene.add(nebula2);

  return [nebula, nebula2];
}

const nebulae = createNebulae();

// 🌌 PALABRAS BONITAS (más de 200 por galaxia)
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
  "⭐ Constelación", "🎨 Pincel", "🌊 Marea", "🔥 Fogata", "💎 Cristal", "🌄 Horizonte"
];

// 🌌 CONFIGURACIÓN DE GALAXIAS (solo 3)
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

// Posiciones de las galaxias con textos únicos (solo 3)
const galaxyPositions = [
  { x: 0, y: 0, z: 0, color: 0xff3366, name: "TE AMO LILIANA" },
  { x: 2000, y: 400, z: -1200, color: 0xff66ff, name: "ERES MI TODO" },
  { x: -1800, y: -500, z: 1500, color: 0x66ccff, name: "MI PRINCESA" }
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
    depth: 2,
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

  // Glow alrededor del corazón
  const heartGlowGeometry = new THREE.SphereGeometry(12, 16, 16);
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
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
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
  centerSprite.scale.set(150, 40, 1);
  centerSprite.position.set(0, 60, 0);
  galaxyGroup.add(centerSprite);

  // === Luz MEJORADA ===
  const light = new THREE.PointLight(colorHex, 2, 1000);
  light.position.set(0, 0, 0);
  galaxyGroup.add(light);

  // === Anillos giratorios con efecto 3D MEJORADOS ===
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ringSize = 80 + i * 30;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(ringSize, ringSize + 20, 64),
      new THREE.MeshBasicMaterial({ 
        color: colorHex, 
        transparent: true, 
        opacity: 0.4 - i * 0.1, 
        side: THREE.DoubleSide 
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.userData = { speed: 0.002 + i * 0.001, pulse: 0 };
    rings.push(ring);
    galaxyGroup.add(ring);
  }

  // === Palabras flotantes MEJORADAS ===
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
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  }

  const COLORS = ["#ff66ff", "#66ccff", "#ffd36b", "#ff9966", "#8df59a", "#ffa0f8", "#c6a7ff", "#ff4444", "#44ff99", "#99ccff"];
  const textGroup = new THREE.Group();

  for (let i = 0; i < 200; i++) {
    const word = ALL_WORDS[i % ALL_WORDS.length];
    const texture = makeWordTexture(word, COLORS[i % COLORS.length]);
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      opacity: 0.8
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(50, 16, 1);
    
    // Distribución más realista en forma de esfera
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const radius = 180 + 170 * Math.random();
    
    sprite.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    
    sprite.userData = { 
      phi, 
      theta, 
      radius, 
      speed: 0.0005 + 0.001 * Math.random(),
      originalRadius: radius,
      pulseSpeed: 0.02 + Math.random() * 0.03
    };
    textGroup.add(sprite);
  }
  galaxyGroup.add(textGroup);

  // === Fotos flotantes MEJORADAS ===
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
        const radius = 200 + 150 * Math.random();
        
        sprite.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        
        sprite.userData = { 
          phi, 
          theta, 
          radius, 
          speed: 0.0004 + 0.0008 * Math.random(),
          originalRadius: radius,
          pulseSpeed: 0.015 + Math.random() * 0.025
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

// Crear todas las galaxias
for (let i = 0; i < galaxyPositions.length; i++) {
  const pos = galaxyPositions[i];
  const galaxy = createGalaxy(pos, pos.color, i, pos.name);
  galaxies.push(galaxy);
}

// 🪐 SISTEMA SOLAR MEJORADO
const celestialObjects = [];

// Planeta 1: Saturno con anillos realistas
const saturn = new THREE.Group();
saturn.position.set(1200, -800, 800);
const saturnGeometry = new THREE.SphereGeometry(45, 32, 32);
const saturnMaterial = new THREE.MeshPhongMaterial({
  color: 0xff88cc,
  emissive: 0xff44aa,
  emissiveIntensity: 0.3,
  shininess: 120,
  specular: 0xffaaff
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.add(saturnMesh);

// Anillos de Saturno mejorados
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(65, 85, 64),
  new THREE.MeshPhongMaterial({
    color: 0xffaaee,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    shininess: 100
  })
);
saturnRing.rotation.x = Math.PI / 2.3;
saturn.add(saturnRing);

// Anillo interior
const saturnInnerRing = new THREE.Mesh(
  new THREE.RingGeometry(55, 65, 48),
  new THREE.MeshPhongMaterial({
    color: 0xdd99cc,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
);
saturnInnerRing.rotation.x = Math.PI / 2.4;
saturn.add(saturnInnerRing);

scene.add(saturn);
celestialObjects.push({ 
  mesh: saturn, 
  type: 'saturn', 
  speed: 0.001,
  orbitRadius: 1200,
  orbitSpeed: 0.0002
});

// Planeta 2: Júpiter con detalles
const jupiter = new THREE.Group();
jupiter.position.set(-1500, 600, -900);
const jupiterGeometry = new THREE.SphereGeometry(70, 36, 36);
const jupiterMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  emissive: 0x2244aa,
  emissiveIntensity: 0.4,
  shininess: 90,
  specular: 0x6688ff
});
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.add(jupiterMesh);

// Bandas de Júpiter (simuladas con esferas adicionales)
const jupiterBand1 = new THREE.Mesh(
  new THREE.TorusGeometry(72, 3, 16, 48),
  new THREE.MeshBasicMaterial({ color: 0xaa5533 })
);
jupiterBand1.rotation.x = Math.PI / 2;
jupiter.add(jupiterBand1);

const jupiterBand2 = new THREE.Mesh(
  new THREE.TorusGeometry(72, 2, 16, 48),
  new THREE.MeshBasicMaterial({ color: 0x884422 })
);
jupiterBand2.rotation.x = Math.PI / 2;
jupiterBand2.rotation.z = Math.PI / 3;
jupiter.add(jupiterBand2);

scene.add(jupiter);
celestialObjects.push({ 
  mesh: jupiter, 
  type: 'jupiter', 
  speed: 0.0008,
  orbitRadius: 1500,
  orbitSpeed: 0.00015
});

// Planeta 3: Urano con anillo vertical
const uranus = new THREE.Group();
uranus.position.set(800, 900, -1400);
const uranusGeometry = new THREE.SphereGeometry(35, 28, 28);
const uranusMaterial = new THREE.MeshPhongMaterial({
  color: 0x66ffcc,
  emissive: 0x33aa88,
  emissiveIntensity: 0.35,
  shininess: 140,
  specular: 0x88ffdd
});
const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.add(uranusMesh);

const uranusRing = new THREE.Mesh(
  new THREE.RingGeometry(50, 60, 48),
  new THREE.MeshPhongMaterial({
    color: 0x88ffdd,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
    shininess: 120
  })
);
uranusRing.rotation.y = Math.PI / 2.1;
uranus.add(uranusRing);

scene.add(uranus);
celestialObjects.push({ 
  mesh: uranus, 
  type: 'uranus', 
  speed: 0.0012,
  orbitRadius: 1400,
  orbitSpeed: 0.00018
});

// Planeta 4: Luna con cráteres simulados
const moon = new THREE.Group();
moon.position.set(-800, -600, 1200);
const moonGeometry = new THREE.SphereGeometry(25, 24, 24);
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffcc,
  emissive: 0xffff88,
  emissiveIntensity: 0.5,
  shininess: 160,
  specular: 0xffffff
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moon.add(moonMesh);

const moonLight = new THREE.PointLight(0xffff88, 1, 400);
moon.add(moonLight);

// Cráteres simulados
for (let i = 0; i < 8; i++) {
  const crater = new THREE.Mesh(
    new THREE.CircleGeometry(3 + Math.random() * 4, 8),
    new THREE.MeshBasicMaterial({ 
      color: 0x888888,
      side: THREE.DoubleSide
    })
  );
  const phi = Math.acos(2 * Math.random() - 1);
  const theta = Math.random() * Math.PI * 2;
  crater.position.set(
    26 * Math.sin(phi) * Math.cos(theta),
    26 * Math.cos(phi),
    26 * Math.sin(phi) * Math.sin(theta)
  );
  crater.lookAt(0, 0, 0);
  moon.add(crater);
}

scene.add(moon);
celestialObjects.push({ 
  mesh: moon, 
  type: 'moon', 
  speed: 0.002,
  orbitRadius: 800,
  orbitSpeed: 0.0003
});

// Planeta 5: Marte con superficie rocosa
const mars = new THREE.Group();
mars.position.set(1600, 200, 1100);
const marsGeometry = new THREE.SphereGeometry(30, 24, 24);
const marsMaterial = new THREE.MeshPhongMaterial({
  color: 0xff6633,
  emissive: 0xaa3311,
  emissiveIntensity: 0.25,
  shininess: 70,
  specular: 0xff8866
});
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
mars.add(marsMesh);

scene.add(mars);
celestialObjects.push({ 
  mesh: mars, 
  type: 'mars', 
  speed: 0.0015,
  orbitRadius: 1600,
  orbitSpeed: 0.00025
});

// === CONSTELACIONES REALISTAS ===
function createRealisticConstellations() {
  const constellations = [
    {
      name: "ORION",
      stars: [
        { x: -800, y: 400, z: 600, size: 6, brightness: 0.9 },
        { x: -600, y: 450, z: 500, size: 5, brightness: 0.7 },
        { x: -400, y: 320, z: 650, size: 7, brightness: 1.0 },
        { x: -650, y: 520, z: 450, size: 4, brightness: 0.6 },
        { x: -680, y: 500, z: 430, size: 4, brightness: 0.6 },
        { x: -710, y: 480, z: 410, size: 4, brightness: 0.6 }
      ],
      lines: [[0,1], [1,2], [3,4], [4,5], [3,5]]
    }
  ];

  constellations.forEach(constellation => {
    const constellationGroup = new THREE.Group();
    
    // Crear estrellas
    constellation.stars.forEach((starData, index) => {
      const starGeometry = new THREE.SphereGeometry(starData.size, 12, 12);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFCC,
        emissiveIntensity: starData.brightness * 0.4
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(starData.x, starData.y, starData.z);
      constellationGroup.add(star);
    });
    
    // Crear líneas de conexión
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x88CCFF,
      transparent: true,
      opacity: 0.5,
      linewidth: 1
    });
    
    constellation.lines.forEach(line => {
      const points = [];
      points.push(new THREE.Vector3(
        constellation.stars[line[0]].x,
        constellation.stars[line[0]].y,
        constellation.stars[line[0]].z
      ));
      points.push(new THREE.Vector3(
        constellation.stars[line[1]].x,
        constellation.stars[line[1]].y,
        constellation.stars[line[1]].z
      ));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
      constellationGroup.add(lineMesh);
    });
    
    scene.add(constellationGroup);
  });
}

createRealisticConstellations();

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

canvas.addEventListener("touchstart", e => {
  dragging = true;
  const touch = e.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", () => dragging = false, { passive: true });

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
}, { passive: true });

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
    const textScaleX = 150 + Math.sin(heartPulse) * 10;
    const textScaleY = 40 + Math.sin(heartPulse) * 6;
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

  // Movimiento de cámara
  const moveSpeed = 8;
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

  camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

  const lookAt = new THREE.Vector3(
    cameraPos.x + forward.x * 100,
    cameraPos.y + forward.y * 100,
    cameraPos.z + forward.z * 100
  );
  camera.lookAt(lookAt);

  // Animación de galaxias MEJORADA
  galaxies.forEach(galaxy => {
    // Anillos giratorios con pulsación
    galaxy.rings.forEach((ring, index) => {
      ring.rotation.z += ring.userData.speed;
      ring.userData.pulse += 0.05;
      const ringScale = 1 + Math.sin(ring.userData.pulse + index) * 0.1;
      ring.scale.set(ringScale, ringScale, ringScale);
      ring.material.opacity = 0.4 - index * 0.1 + Math.sin(ring.userData.pulse * 2) * 0.1;
    });

    // Palabras flotantes con movimiento orbital realista
    galaxy.textGroup.children.forEach(sprite => {
      sprite.userData.theta += sprite.userData.speed;
      sprite.userData.pulse += sprite.userData.pulseSpeed;
      
      // Movimiento orbital elíptico
      const currentRadius = sprite.userData.originalRadius + Math.sin(sprite.userData.pulse) * 20;
      
      sprite.position.x = currentRadius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = currentRadius * Math.cos(sprite.userData.phi);
      sprite.position.z = currentRadius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      // Pulsación de opacidad
      sprite.material.opacity = 0.7 + 0.3 * Math.sin(sprite.userData.pulse * 2);
      
      // Siempre mirar a la cámara
      sprite.lookAt(camera.position);
    });

    // Fotos flotantes con comportamiento similar
    galaxy.imageGroup.children.forEach(sprite => {
      sprite.userData.theta += sprite.userData.speed;
      sprite.userData.pulse += sprite.userData.pulseSpeed;
      
      const currentRadius = sprite.userData.originalRadius + Math.sin(sprite.userData.pulse) * 15;
      
      sprite.position.x = currentRadius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = currentRadius * Math.cos(sprite.userData.phi);
      sprite.position.z = currentRadius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
      
      sprite.material.opacity = 0.8 + 0.2 * Math.sin(sprite.userData.pulse * 1.5);
      
      sprite.lookAt(camera.position);
    });
  });

  // Animación de objetos celestes MEJORADA
  celestialObjects.forEach((obj, index) => {
    const time = Date.now() * 0.001;
    
    switch (obj.type) {
      case 'saturn':
        // Rotación y órbita
        obj.mesh.rotation.y += obj.speed;
        obj.mesh.children[1].rotation.z += obj.speed * 1.8; // Anillo exterior
        obj.mesh.children[2].rotation.z += obj.speed * 1.5; // Anillo interior
        
        // Órbita elíptica
        const saturnAngle = time * obj.orbitSpeed;
        obj.mesh.position.x = Math.cos(saturnAngle) * obj.orbitRadius;
        obj.mesh.position.z = Math.sin(saturnAngle) * obj.orbitRadius * 0.8;
        obj.mesh.position.y = Math.sin(saturnAngle * 0.7) * 200;
        break;
        
      case 'jupiter':
        obj.mesh.rotation.y += obj.speed;
        obj.mesh.rotation.x += obj.speed * 0.3;
        
        // Bandas giratorias
        obj.mesh.children[1].rotation.y += obj.speed * 2;
        obj.mesh.children[2].rotation.y += obj.speed * 1.5;
        
        const jupiterAngle = time * obj.orbitSpeed;
        obj.mesh.position.x = Math.cos(jupiterAngle) * obj.orbitRadius;
        obj.mesh.position.z = Math.sin(jupiterAngle) * obj.orbitRadius;
        break;
        
      case 'uranus':
        obj.mesh.rotation.y += obj.speed;
        obj.mesh.children[1].rotation.x += obj.speed * 2;
        
        const uranusAngle = time * obj.orbitSpeed;
        obj.mesh.position.x = Math.cos(uranusAngle) * obj.orbitRadius * 0.9;
        obj.mesh.position.z = Math.sin(uranusAngle) * obj.orbitRadius;
        obj.mesh.position.y = Math.cos(uranusAngle * 1.2) * 150;
        break;
        
      case 'moon':
        obj.mesh.rotation.y += obj.speed;
        obj.mesh.position.y += Math.sin(t * 0.5 + index) * 1.2;
        obj.mesh.children[1].intensity = 0.8 + Math.sin(t * 3) * 0.4;
        
        const moonAngle = time * obj.orbitSpeed;
        obj.mesh.position.x = Math.cos(moonAngle) * obj.orbitRadius;
        obj.mesh.position.z = Math.sin(moonAngle) * obj.orbitRadius;
        break;
        
      case 'mars':
        obj.mesh.rotation.y += obj.speed;
        obj.mesh.rotation.z += obj.speed * 0.4;
        
        const marsAngle = time * obj.orbitSpeed;
        obj.mesh.position.x = Math.cos(marsAngle) * obj.orbitRadius;
        obj.mesh.position.z = Math.sin(marsAngle) * obj.orbitRadius * 0.7;
        obj.mesh.position.y = Math.sin(marsAngle * 0.8) * 100;
        break;
    }
  });

  // Animación de nebulosas
  nebulae.forEach((nebula, index) => {
    nebula.rotation.y += 0.0001 * (index + 1);
    nebula.material.opacity = 0.1 + Math.sin(t * 0.3 + index) * 0.05;
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

console.log("Enhanced constellation scene loaded successfully!");
