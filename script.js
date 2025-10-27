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
  {name:"ODESZA - A Moment Apart",src:"playlist/ODESZA-A Moment Apart.mp3"},
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
let cameraPos = {x: 0, y: 0, z: 600};
let cameraVelocity = {x: 0, y: 0, z: 0};
let cameraRotation = {yaw: 0, pitch: 0};

// === Fondo espacial ===
const loader = new THREE.TextureLoader();
const nebulaTex = loader.load("https://jrenjm.github.io/amorlili/space.jpg");
scene.background = nebulaTex;

// === Estrellas de fondo ===
(function(count = 8000, spread = 12000) {
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
  {x: 0, y: 0, z: 0, color: 0xff3366, name: "TE AMO LILIANA"},
  {x: 2000, y: 400, z: -1200, color: 0xff66ff, name: "ERES MI TODO"},
  {x: -1800, y: -500, z: 1500, color: 0x66ccff, name: "MI PRINCESA"}
];

// === Función para crear una galaxia ===
function createGalaxy(position, colorHex, galaxyIndex, textContent) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.set(position.x, position.y, position.z);
  
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

  // === Texto central ===
  function makeTextTexture(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 4096;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 500px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowColor = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowBlur = 60;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
  }

  const centerTex = makeTextTexture(textContent);
  const centerMat = new THREE.SpriteMaterial({map: centerTex, transparent: true, depthTest: false});
  const centerSprite = new THREE.Sprite(centerMat);
  centerSprite.scale.set(120, 50, 1);
  centerSprite.position.set(0, 50, 0);
  galaxyGroup.add(centerSprite);

  // === Luz ===
  const light = new THREE.PointLight(colorHex, 1.5, 800);
  galaxyGroup.add(light);

  // === Anillos giratorios con efecto 3D ===
  const ring1 = new THREE.Mesh(
    new THREE.RingGeometry(80, 100, 128),
    new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: 0.5, side: THREE.DoubleSide})
  );
  const ring2 = new THREE.Mesh(
    new THREE.RingGeometry(110, 130, 128),
    new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: 0.3, side: THREE.DoubleSide})
  );
  const ring3 = new THREE.Mesh(
    new THREE.RingGeometry(140, 160, 128),
    new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: 0.2, side: THREE.DoubleSide})
  );
  ring1.rotation.x = ring2.rotation.x = ring3.rotation.x = Math.PI / 2;
  galaxyGroup.add(ring1);
  galaxyGroup.add(ring2);
  galaxyGroup.add(ring3);

  // === Palabras flotantes (mínimo 200) ===
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

  // Crear mínimo 200 palabras flotantes girando
  for (let i = 0; i < 200; i++) {
    const word = ALL_WORDS[i % ALL_WORDS.length];
    const texture = makeWordTexture(word, COLORS[i % COLORS.length]);
    const material = new THREE.SpriteMaterial({map: texture, transparent: true});
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
    sprite.userData = {phi, theta, radius, speed: 0.0008 + 0.0012 * Math.random()};
    textGroup.add(sprite);
  }
  galaxyGroup.add(textGroup);

  // === Fotos flotantes (aleatorias, sin repetir) ===
  const imageGroup = new THREE.Group();
  const startIndex = galaxyIndex * photosPerGalaxy;
  const endIndex = Math.min(startIndex + photosPerGalaxy, totalPhotos);
  const galaxyPhotos = shuffledPhotos.slice(startIndex, endIndex);

  const imgLoader = new THREE.TextureLoader();
  galaxyPhotos.forEach(photoNum => {
    const path = `https://jrenjm.github.io/amorlili/recuerdos/f${photoNum}.jpg`;
    const img = new Image();
    img.onload = () => {
      const texture = imgLoader.load(path);
      const mat = new THREE.SpriteMaterial({map: texture, transparent: true});
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
      sprite.userData = {phi, theta, radius, speed: 0.0008 + 0.0012 * Math.random()};
      imageGroup.add(sprite);
    };
    img.src = path;
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
    imageGroup
  };
}

// Crear todas las galaxias
for (let i = 0; i < galaxyPositions.length; i++) {
  const pos = galaxyPositions[i];
  const galaxy = createGalaxy(pos, pos.color, i, pos.name);
  galaxies.push(galaxy);
}

// 🪐 CREAR PLANETAS Y OBJETOS CELESTIALES DECORATIVOS
const celestialObjects = [];

// Planeta 1: Saturno rosa con anillos
const saturn = new THREE.Group();
saturn.position.set(1200, -800, 800);
const saturnGeometry = new THREE.SphereGeometry(50, 32, 32);
const saturnMaterial = new THREE.MeshPhongMaterial({
  color: 0xff88cc,
  emissive: 0xff44aa,
  emissiveIntensity: 0.2,
  shininess: 100
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.add(saturnMesh);
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(70, 90, 64),
  new THREE.MeshBasicMaterial({color: 0xffaaee, transparent: true, opacity: 0.6, side: THREE.DoubleSide})
);
saturnRing.rotation.x = Math.PI / 2.5;
saturn.add(saturnRing);
scene.add(saturn);
celestialObjects.push({mesh: saturn, type: 'saturn', speed: 0.001});

// Planeta 2: Júpiter azul con textura de bandas
const jupiter = new THREE.Group();
jupiter.position.set(-1500, 600, -900);
const jupiterGeometry = new THREE.SphereGeometry(80, 32, 32);
const jupiterMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  emissive: 0x2244aa,
  emissiveIntensity: 0.3,
  shininess: 80
});
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.add(jupiterMesh);
scene.add(jupiter);
celestialObjects.push({mesh: jupiter, type: 'jupiter', speed: 0.0008});

// Planeta 3: Planeta con anillo vertical
const uranus = new THREE.Group();
uranus.position.set(800, 900, -1400);
const uranusGeometry = new THREE.SphereGeometry(40, 32, 32);
const uranusMaterial = new THREE.MeshPhongMaterial({
  color: 0x66ffcc,
  emissive: 0x33aa88,
  emissiveIntensity: 0.25,
  shininess: 120
});
const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.add(uranusMesh);
const uranusRing = new THREE.Mesh(
  new THREE.RingGeometry(55, 65, 64),
  new THREE.MeshBasicMaterial({color: 0x88ffdd, transparent: true, opacity: 0.5, side: THREE.DoubleSide})
);
uranusRing.rotation.y = Math.PI / 2;
uranus.add(uranusRing);
scene.add(uranus);
celestialObjects.push({mesh: uranus, type: 'uranus', speed: 0.0012});

// Planeta 4: Luna pequeña brillante
const moon = new THREE.Group();
moon.position.set(-800, -600, 1200);
const moonGeometry = new THREE.SphereGeometry(30, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff88,
  emissive: 0xffff00,
  emissiveIntensity: 0.4,
  shininess: 150
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moon.add(moonMesh);
const moonLight = new THREE.PointLight(0xffff88, 0.8, 400);
moon.add(moonLight);
scene.add(moon);
celestialObjects.push({mesh: moon, type: 'moon', speed: 0.002});

// Planeta 5: Planeta rocoso rojo
const mars = new THREE.Group();
mars.position.set(1600, 200, 1100);
const marsGeometry = new THREE.SphereGeometry(35, 32, 32);
const marsMaterial = new THREE.MeshPhongMaterial({
  color: 0xff6633,
  emissive: 0xaa3311,
  emissiveIntensity: 0.2,
  shininess: 60
});
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
mars.add(marsMesh);
scene.add(mars);
celestialObjects.push({mesh: mars, type: 'mars', speed: 0.0015});

// Nebulosa 1: Nube de partículas púrpura
const nebula1 = new THREE.Group();
nebula1.position.set(-1000, 300, -1600);
const nebulaGeometry1 = new THREE.BufferGeometry();
const nebulaPositions1 = new Float32Array(1000 * 3);
for (let i = 0; i < 1000; i++) {
  nebulaPositions1[i * 3] = (Math.random() - 0.5) * 200;
  nebulaPositions1[i * 3 + 1] = (Math.random() - 0.5) * 200;
  nebulaPositions1[i * 3 + 2] = (Math.random() - 0.5) * 200;
}
nebulaGeometry1.setAttribute("position", new THREE.BufferAttribute(nebulaPositions1, 3));
const nebulaMaterial1 = new THREE.PointsMaterial({
  size: 4,
  color: 0xaa66ff,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});
const nebulaPoints1 = new THREE.Points(nebulaGeometry1, nebulaMaterial1);
nebula1.add(nebulaPoints1);
scene.add(nebula1);
celestialObjects.push({mesh: nebula1, type: 'nebula', speed: 0.0005});

// Nebulosa 2: Nube de partículas verde
const nebula2 = new THREE.Group();
nebula2.position.set(1400, -400, -1300);
const nebulaGeometry2 = new THREE.BufferGeometry();
const nebulaPositions2 = new Float32Array(800 * 3);
for (let i = 0; i < 800; i++) {
  nebulaPositions2[i * 3] = (Math.random() - 0.5) * 180;
  nebulaPositions2[i * 3 + 1] = (Math.random() - 0.5) * 180;
  nebulaPositions2[i * 3 + 2] = (Math.random() - 0.5) * 180;
}
nebulaGeometry2.setAttribute("position", new THREE.BufferAttribute(nebulaPositions2, 3));
const nebulaMaterial2 = new THREE.PointsMaterial({
  size: 3,
  color: 0x66ffaa,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});
const nebulaPoints2 = new THREE.Points(nebulaGeometry2, nebulaMaterial2);
nebula2.add(nebulaPoints2);
scene.add(nebula2);
celestialObjects.push({mesh: nebula2, type: 'nebula', speed: 0.0006});

// Asteroide 1: Forma irregular con rotación
const asteroid1 = new THREE.Group();
asteroid1.position.set(-600, -900, -1100);
const asteroidGeometry1 = new THREE.DodecahedronGeometry(25, 0);
const asteroidMaterial1 = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x333333,
  emissiveIntensity: 0.1,
  shininess: 20
});
const asteroidMesh1 = new THREE.Mesh(asteroidGeometry1, asteroidMaterial1);
asteroid1.add(asteroidMesh1);
scene.add(asteroid1);
celestialObjects.push({mesh: asteroid1, type: 'asteroid', speed: 0.003});

// Asteroide 2: Octaedro
const asteroid2 = new THREE.Group();
asteroid2.position.set(500, 700, 1400);
const asteroidGeometry2 = new THREE.OctahedronGeometry(20, 0);
const asteroidMaterial2 = new THREE.MeshPhongMaterial({
  color: 0x996633,
  emissive: 0x443322,
  emissiveIntensity: 0.15,
  shininess: 30
});
const asteroidMesh2 = new THREE.Mesh(asteroidGeometry2, asteroidMaterial2);
asteroid2.add(asteroidMesh2);
scene.add(asteroid2);
celestialObjects.push({mesh: asteroid2, type: 'asteroid', speed: 0.0025});

// Planeta hueco (anillo de toro)
const torusPlanet = new THREE.Group();
torusPlanet.position.set(-1300, 800, 600);
const torusGeometry = new THREE.TorusGeometry(50, 20, 16, 100);
const torusMaterial = new THREE.MeshPhongMaterial({
  color: 0xff9966,
  emissive: 0xaa5533,
  emissiveIntensity: 0.3,
  shininess: 100,
  transparent: true,
  opacity: 0.9
});
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusPlanet.add(torusMesh);
scene.add(torusPlanet);
celestialObjects.push({mesh: torusPlanet, type: 'torus', speed: 0.001});

// Cristal flotante
const crystal = new THREE.Group();
crystal.position.set(900, -300, -800);
const crystalGeometry = new THREE.TetrahedronGeometry(40, 0);
const crystalMaterial = new THREE.MeshPhongMaterial({
  color: 0x66ccff,
  emissive: 0x3388cc,
  emissiveIntensity: 0.4,
  shininess: 200,
  transparent: true,
  opacity: 0.8
});
const crystalMesh = new THREE.Mesh(crystalGeometry, crystalMaterial);
crystal.add(crystalMesh);
scene.add(crystal);
celestialObjects.push({mesh: crystal, type: 'crystal', speed: 0.002});

// 🌟 ========== 40 ELEMENTOS CÓSMICOS DINÁMICOS ADICIONALES ========== 🌟

// 🌠 COMETAS (5 elementos)
for (let i = 0; i < 5; i++) {
  const comet = new THREE.Group();
  const positions = [
    [400, 500, -600], [-700, -400, 900], [1100, 300, 700], 
    [-500, 800, -1000], [800, -600, -500]
  ];
  const colors = [0xffaa44, 0xff6688, 0x66ddff, 0xffcc66, 0xaa88ff];
  
  comet.position.set(...positions[i]);
  
  // Núcleo brillante
  const cometCore = new THREE.Mesh(
    new THREE.SphereGeometry(15 + i * 2, 16, 16),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.8,
      shininess: 150
    })
  );
  comet.add(cometCore);
  
  // Cola del cometa
  const tailGeometry = new THREE.BufferGeometry();
  const tailPositions = new Float32Array(150 * 3);
  for (let j = 0; j < 150; j++) {
    tailPositions[j * 3] = -j * 0.8 + (Math.random() - 0.5) * 2;
    tailPositions[j * 3 + 1] = (Math.random() - 0.5) * 3;
    tailPositions[j * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  tailGeometry.setAttribute("position", new THREE.BufferAttribute(tailPositions, 3));
  const tail = new THREE.Points(tailGeometry, new THREE.PointsMaterial({
    size: 3,
    color: colors[i],
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  }));
  comet.add(tail);
  
  // Luz
  const cometLight = new THREE.PointLight(colors[i], 0.8, 300);
  comet.add(cometLight);
  
  scene.add(comet);
  celestialObjects.push({mesh: comet, type: 'comet', speed: 0.004 - i * 0.0002, index: i});
}

// ⭐ ESTRELLAS PULSANTES (8 elementos)
for (let i = 0; i < 8; i++) {
  const pulsar = new THREE.Group();
  const positions = [
    [300, 700, 800], [-900, 500, 600], [1300, -200, -700], [-400, -700, 1100],
    [600, 900, -900], [-1100, 300, -400], [900, -500, 1000], [-200, 600, -1200]
  ];
  const colors = [0xffff00, 0xff00ff, 0x00ffff, 0xff6600, 0x66ff00, 0xff0066, 0x0066ff, 0xffaa00];
  
  pulsar.position.set(...positions[i]);
  
  // Estrella central
  const pulsarCore = new THREE.Mesh(
    new THREE.SphereGeometry(18 + i, 20, 20),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 1,
      shininess: 200
    })
  );
  pulsar.add(pulsarCore);
  
  // Anillos de radiación
  for (let j = 0; j < 3; j++) {
    const radiationRing = new THREE.Mesh(
      new THREE.RingGeometry(30 + j * 8, 35 + j * 8, 32),
      new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.3 - j * 0.08,
        side: THREE.DoubleSide
      })
    );
    radiationRing.rotation.x = Math.PI / 2;
    pulsar.add(radiationRing);
  }
  
  // Luz pulsante
  const pulsarLight = new THREE.PointLight(colors[i], 1.5, 400);
  pulsar.add(pulsarLight);
  
  scene.add(pulsar);
  celestialObjects.push({mesh: pulsar, type: 'pulsar', speed: 0.002 + i * 0.0001, index: i});
}

// 💫 ANILLOS ENERGÉTICOS (6 elementos)
for (let i = 0; i < 6; i++) {
  const energyRing = new THREE.Group();
  const positions = [
    [500, 400, 500], [-800, -300, -800], [1000, 600, -600],
    [-600, 700, 1000], [700, -400, 900], [-1000, 200, -500]
  ];
  const colors = [0xff44aa, 0x44aaff, 0xaaff44, 0xff88ff, 0x88ffaa, 0xffaa88];
  const sizes = [60, 70, 55, 65, 58, 62];
  
  energyRing.position.set(...positions[i]);
  
  // Anillo principal
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(sizes[i], sizes[i] * 0.15, 16, 100),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.6,
      shininess: 150,
      transparent: true,
      opacity: 0.8
    })
  );
  energyRing.add(ring);
  
  // Partículas orbitando
  const particleGeom = new THREE.BufferGeometry();
  const particlePos = new Float32Array(100 * 3);
  for (let j = 0; j < 100; j++) {
    const angle = (j / 100) * Math.PI * 2;
    particlePos[j * 3] = Math.cos(angle) * sizes[i];
    particlePos[j * 3 + 1] = (Math.random() - 0.5) * 10;
    particlePos[j * 3 + 2] = Math.sin(angle) * sizes[i];
  }
  particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  const particles = new THREE.Points(particleGeom, new THREE.PointsMaterial({
    size: 4,
    color: colors[i],
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  }));
  energyRing.add(particles);
  
  scene.add(energyRing);
  celestialObjects.push({mesh: energyRing, type: 'energyRing', speed: 0.0015 - i * 0.0001, index: i});
}

// 💎 ESFERAS DE CRISTAL (7 elementos)
for (let i = 0; i < 7; i++) {
  const crystalSphere = new THREE.Group();
  const positions = [
    [350, 650, -750], [-650, -500, 850], [950, 450, 650], [-450, 750, -950],
    [750, -550, -650], [-950, 350, 750], [550, 850, 950]
  ];
  const colors = [0xaaffff, 0xffaaff, 0xffffaa, 0xaaffaa, 0xffddaa, 0xddaaff, 0xaaddff];
  const sizes = [25, 28, 22, 26, 24, 27, 23];
  
  crystalSphere.position.set(...positions[i]);
  
  // Esfera de cristal
  const sphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(sizes[i], 1),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.4,
      shininess: 250,
      transparent: true,
      opacity: 0.7
    })
  );
  crystalSphere.add(sphere);
  
  // Núcleo interno brillante
  const innerCore = new THREE.Mesh(
    new THREE.SphereGeometry(sizes[i] * 0.4, 16, 16),
    new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0.9
    })
  );
  crystalSphere.add(innerCore);
  
  scene.add(crystalSphere);
  celestialObjects.push({mesh: crystalSphere, type: 'crystalSphere', speed: 0.001 + i * 0.0001, index: i});
}

// 🌀 PORTALES DIMENSIONALES (4 elementos)
for (let i = 0; i < 4; i++) {
  const portal = new THREE.Group();
  const positions = [
    [1200, 700, 400], [-1100, -600, -700], [400, -800, 1100], [-700, 900, -1000]
  ];
  const colors = [0xff00aa, 0x00aaff, 0xaaff00, 0xff66dd];
  const sizes = [80, 75, 85, 78];
  
  portal.position.set(...positions[i]);
  
  // Anillo exterior
  const portalRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(sizes[i], sizes[i] * 0.1, 16, 100),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.8,
      shininess: 200
    })
  );
  portal.add(portalRing1);
  
  // Anillo interior
  const portalRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(sizes[i] * 0.7, sizes[i] * 0.08, 16, 100),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 1,
      shininess: 250
    })
  );
  portal.add(portalRing2);
  
  // Centro del portal
  const vortex = new THREE.Mesh(
    new THREE.CircleGeometry(sizes[i] * 0.6, 64),
    new THREE.MeshBasicMaterial({
      color: colors[i],
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    })
  );
  portal.add(vortex);
  
  // Luz del portal
  const portalLight = new THREE.PointLight(colors[i], 2, 500);
  portal.add(portalLight);
  
  scene.add(portal);
  celestialObjects.push({mesh: portal, type: 'portal', speed: 0.0008 + i * 0.0001, index: i});
}

// ☁️ NUBES DE POLVO ESTELAR (5 elementos)
for (let i = 0; i < 5; i++) {
  const dustCloud = new THREE.Group();
  const positions = [
    [250, 550, -850], [-850, -350, 750], [1050, 250, 550],
    [-550, 850, -1050], [850, -650, -450]
  ];
  const colors = [0xcc88ff, 0x88ffcc, 0xffcc88, 0xcc88aa, 0x88ccff];
  const sizes = [100, 110, 95, 105, 98];
  
  dustCloud.position.set(...positions[i]);
  
  // Nube de partículas
  const dustGeom = new THREE.BufferGeometry();
  const dustPos = new Float32Array(600 * 3);
  for (let j = 0; j < 600; j++) {
    const radius = sizes[i] * Math.random();
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dustPos[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
    dustPos[j * 3 + 1] = radius * Math.cos(phi);
    dustPos[j * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeom, new THREE.PointsMaterial({
    size: 3.5,
    color: colors[i],
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  }));
  dustCloud.add(dust);
  
  scene.add(dustCloud);
  celestialObjects.push({mesh: dustCloud, type: 'dustCloud', speed: 0.0003 + i * 0.0001, index: i});
}

// 🪐 MINI PLANETAS DECORATIVOS (5 elementos)
for (let i = 0; i < 5; i++) {
  const miniPlanet = new THREE.Group();
  const positions = [
    [450, 350, -550], [-750, -450, 650], [1150, 550, 450],
    [-350, 650, -1150], [650, -750, 750]
  ];
  const colors = [0xff9944, 0x44ff99, 0x9944ff, 0xff4499, 0x44ccff];
  const sizes = [30, 35, 28, 32, 33];
  
  miniPlanet.position.set(...positions[i]);
  
  // Planeta pequeño
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(sizes[i], 24, 24),
    new THREE.MeshPhongMaterial({
      color: colors[i],
      emissive: colors[i],
      emissiveIntensity: 0.2,
      shininess: 80
    })
  );
  miniPlanet.add(planet);
  
  // Anillo opcional (cada 2 planetas)
  if (i % 2 === 0) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(sizes[i] * 1.5, sizes[i] * 1.8, 48),
      new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
    );
    ring.rotation.x = Math.PI / 2;
    miniPlanet.add(ring);
  }
  
  scene.add(miniPlanet);
  celestialObjects.push({mesh: miniPlanet, type: 'miniPlanet', speed: 0.0016 - i * 0.0001, index: i});
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

// === Loop de animación principal ===
let t = 0;
function tick() {
  requestAnimationFrame(tick);
  t += 0.01;

  // 🎮 Movimiento de cámara con teclado (WASD + Flechas)
  const moveSpeed = 5;
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

  // Animar cada galaxia
  galaxies.forEach(galaxy => {
    // Anillos giratorios con movimiento ondulante
    galaxy.ring1.rotation.z += 0.003;
    galaxy.ring2.rotation.z -= 0.0025;
    galaxy.ring3.rotation.z += 0.002;
    
    // Movimiento ondulante de los anillos
    galaxy.ring1.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    galaxy.ring2.rotation.x = Math.PI / 2 + Math.cos(t * 0.6) * 0.12;
    galaxy.ring3.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.08;

    // Palabras girando alrededor de la galaxia
    galaxy.textGroup.children.forEach(sprite => {
      sprite.material.opacity = 0.75 + 0.25 * Math.sin(2 * t);
      sprite.userData.theta += sprite.userData.speed;
      sprite.position.x = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = sprite.userData.radius * Math.cos(sprite.userData.phi);
      sprite.position.z = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
    });

    // Fotos girando alrededor de la galaxia
    galaxy.imageGroup.children.forEach(sprite => {
      sprite.material.opacity = 0.85 + 0.15 * Math.sin(2 * t);
      sprite.userData.theta += sprite.userData.speed;
      sprite.position.x = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.cos(sprite.userData.theta);
      sprite.position.y = sprite.userData.radius * Math.cos(sprite.userData.phi);
      sprite.position.z = sprite.userData.radius * Math.sin(sprite.userData.phi) * Math.sin(sprite.userData.theta);
    });

    // Hacer que corazón y texto miren a la cámara
    galaxy.group.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
        if (child.geometry && child.geometry.type !== "RingGeometry") {
          child.lookAt(camera.position);
        }
      }
    });
  });

  // 🪐 Animar objetos celestiales decorativos
  celestialObjects.forEach((obj, index) => {
    const {mesh, type, speed} = obj;
    
    switch(type) {
      case 'saturn':
        mesh.rotation.y += speed;
        mesh.children[1].rotation.z += speed * 2;
        mesh.position.y += Math.sin(t * 0.3 + index) * 0.5;
        break;
      case 'jupiter':
        mesh.rotation.y += speed;
        mesh.rotation.x += speed * 0.5;
        mesh.position.x += Math.cos(t * 0.2 + index) * 0.3;
        break;
      case 'uranus':
        mesh.rotation.y += speed;
        mesh.children[1].rotation.x += speed * 1.5;
        mesh.position.z += Math.sin(t * 0.25 + index) * 0.4;
        break;
      case 'moon':
        mesh.rotation.y += speed;
        mesh.position.y += Math.sin(t * 0.4 + index) * 0.8;
        mesh.children[0].material.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2;
        break;
      case 'mars':
        mesh.rotation.y += speed;
        mesh.rotation.z += speed * 0.3;
        break;
      case 'nebula':
        mesh.rotation.y += speed * 0.5;
        mesh.rotation.x += speed * 0.3;
        mesh.children[0].material.opacity = 0.4 + Math.sin(t + index) * 0.2;
        break;
      case 'asteroid':
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 1.5;
        mesh.rotation.z += speed * 0.8;
        break;
      case 'torus':
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 0.7;
        mesh.position.y += Math.cos(t * 0.35 + index) * 0.6;
        break;
      case 'crystal':
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 1.2;
        mesh.children[0].material.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.2;
        mesh.position.y += Math.sin(t * 0.5 + index) * 0.7;
        break;
      
      // 🌟 Animaciones de los 40 nuevos elementos cósmicos
      case 'comet':
        mesh.rotation.z += speed;
        mesh.position.x += Math.cos(t * 0.5 + obj.index * 0.1) * 2;
        mesh.position.y += Math.sin(t * 0.3 + obj.index * 0.1) * 1.5;
        if (mesh.children[1]) {
          mesh.children[1].material.opacity = 0.4 + Math.sin(t * 2 + obj.index) * 0.2;
        }
        if (mesh.children[2]) {
          mesh.children[2].intensity = 0.6 + Math.sin(t * 3 + obj.index) * 0.3;
        }
        break;
        
      case 'pulsar':
        mesh.rotation.y += speed * 2;
        const pulseScale = 1 + Math.sin(t * 4 + obj.index) * 0.2;
        mesh.children[0].scale.set(crystalPulse, crystalPulse, crystalPulse);
        mesh.children[0].material.opacity = 0.6 + Math.sin(t * 2 + obj.index) * 0.2;
        if (mesh.children[1]) {
          mesh.children[1].material.opacity = 0.8 + Math.sin(t * 4 + obj.index) * 0.2;
        }
        break;
        
      case 'portal':
        mesh.children[0].rotation.z += speed * 2;
        mesh.children[1].rotation.z -= speed * 3;
        mesh.children[0].material.emissiveIntensity = 0.7 + Math.sin(t * 4 + obj.index) * 0.3;
        mesh.children[1].material.emissiveIntensity = 0.9 + Math.sin(t * 5 + obj.index) * 0.4;
        if (mesh.children[2]) {
          mesh.children[2].rotation.z += speed * 4;
          mesh.children[2].material.opacity = 0.3 + Math.sin(t * 3 + obj.index) * 0.2;
        }
        if (mesh.children[3]) {
          mesh.children[3].intensity = 1.5 + Math.sin(t * 6 + obj.index) * 1;
        }
        break;
        
      case 'dustCloud':
        mesh.rotation.x += speed * 0.3;
        mesh.rotation.y += speed * 0.5;
        mesh.rotation.z += speed * 0.2;
        mesh.position.x += Math.cos(t * 0.2 + obj.index * 0.15) * 0.5;
        mesh.position.y += Math.sin(t * 0.25 + obj.index * 0.15) * 0.4;
        const cloudScale = 1 + Math.sin(t * 0.8 + obj.index) * 0.2;
        mesh.children[0].scale.set(cloudScale, cloudScale, cloudScale);
        mesh.children[0].material.opacity = 0.4 + Math.sin(t * 1.5 + obj.index) * 0.2;
        break;
        
      case 'miniPlanet':
        mesh.rotation.y += speed;
        mesh.rotation.x += speed * 0.4;
        mesh.position.x += Math.cos(t * 0.4 + obj.index * 0.2) * 0.8;
        mesh.position.z += Math.sin(t * 0.35 + obj.index * 0.2) * 0.7;
        mesh.children[0].material.emissiveIntensity = 0.15 + Math.sin(t * 2 + obj.index) * 0.1;
        if (mesh.children[1]) {
          mesh.children[1].rotation.z += speed * 1.5;
          mesh.children[1].material.opacity = 0.4 + Math.sin(t * 3 + obj.index) * 0.15;
        }
        break;
    }
  });

  renderer.render(scene, camera);
}
tick();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});pulseScale, pulseScale, pulseScale);
        mesh.children[0].material.emissiveIntensity = 0.8 + Math.sin(t * 5 + obj.index) * 0.3;
        for (let i = 1; i < 4; i++) {
          if (mesh.children[i]) {
            mesh.children[i].rotation.z += speed * (i + 1);
            mesh.children[i].material.opacity = 0.2 + Math.sin(t * 3 + obj.index + i) * 0.1;
          }
        }
        if (mesh.children[4]) {
          mesh.children[4].intensity = 1 + Math.sin(t * 6 + obj.index) * 0.8;
        }
        break;
        
      case 'energyRing':
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 1.5;
        mesh.rotation.z += speed * 0.8;
        const ringScale = 1 + Math.sin(t * 2 + obj.index) * 0.15;
        mesh.children[0].scale.set(ringScale, ringScale, ringScale);
        mesh.children[0].material.emissiveIntensity = 0.5 + Math.sin(t * 3 + obj.index) * 0.3;
        if (mesh.children[1]) {
          mesh.children[1].rotation.y += speed * 3;
          mesh.children[1].material.opacity = 0.6 + Math.sin(t * 2.5 + obj.index) * 0.3;
        }
        break;
        
      case 'crystalSphere':
        mesh.rotation.x += speed * 1.3;
        mesh.rotation.y += speed * 1.8;
        mesh.rotation.z += speed * 0.9;
        mesh.position.y += Math.sin(t * 0.6 + obj.index * 0.2) * 1.2;
        const crystalPulse = 1 + Math.sin(t * 3 + obj.index) * 0.1;
        mesh.children[0].scale.set(
