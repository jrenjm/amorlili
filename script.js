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

// 🎵 Lista de canciones - RUTAS ABSOLUTAS para GitHub Pages
const songs = [
  { name: "Only", src: "https://jrenjm.github.io/amorlili/playlist/Only.mp3" },
  { name: "LIVE FOREVER(Español)-OASIS", src: "https://jrenjm.github.io/amorlili/playlist/LIVE FOREVER(Español)-OASIS.mp3" },
  { name: "Be The One (spanish version)", src: "https://jrenjm.github.io/amorlili/playlist/Be The One (spanish version).mp3" },
  { name: "Tattoo(Cover Español)", src: "https://jrenjm.github.io/amorlili/playlist/Tattoo(Cover Español).mp3" },
  { name: "Baile Inolvidable", src: "https://jrenjm.github.io/amorlili/playlist/Baile Inolvidable.mp3" },
  { name: "Enseñame a Bailar", src: "https://jrenjm.github.io/amorlili/playlist/Enseñame a Bailar.mp3" },
  { name: "ODESZA-A Moment Apart", src: "https://jrenjm.github.io/amorlili/playlist/ODESZA-A Moment Apart.mp3" },
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
let cameraPos = { x: 0, y: 0, z: 1200 }; // Más cerca para ver mejor las galaxias
let cameraVelocity = { x: 0, y: 0, z: 0 };
let cameraRotation = { yaw: Math.PI, pitch: 0 };

// === Iluminación global mejorada ===
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// Luz direccional para mejor realismo
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, 100, 50);
scene.add(directionalLight);

// === Fondo espacial con fallback mejorado ===
const loader = new THREE.TextureLoader();
loader.load(
  "https://jrenjm.github.io/amorlili/space.jpg",
  texture => { 
    console.log("✅ Background loaded successfully");
    scene.background = texture; 
  },
  undefined,
  error => {
    console.error("❌ Error loading background:", error);
    console.log("🔄 Using fallback background");
    scene.background = new THREE.Color(0x000011);
  }
);

// === ESTRELLAS DE FONDO MEJORADAS (más realistas) ===
(function createRealisticStars() {
  const starCount = 8000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    // Distribución más realista en forma de disco galáctico
    const spiralArm = Math.floor(Math.random() * 4);
    const angle = (spiralArm * Math.PI / 2) + (Math.random() - 0.5) * 0.8;
    const distance = 5000 + Math.random() * 7000;
    const height = (Math.random() - 0.5) * 800; // Disco más plano
    
    positions[3 * i + 0] = Math.cos(angle) * distance;
    positions[3 * i + 1] = height;
    positions[3 * i + 2] = Math.sin(angle) * distance;
    
    // Colores estelares realistas
    const starType = Math.random();
    let r, g, b;
    if (starType < 0.75) { // Estrellas amarillas/blancas (como el Sol)
      r = 1; g = 0.95; b = 0.9;
    } else if (starType < 0.90) { // Estrellas azules (más calientes)
      r = 0.7; g = 0.8; b = 1;
    } else { // Estrellas rojas
      r = 1; g = 0.7; b = 0.6;
    }
    
    colors[3 * i + 0] = r;
    colors[3 * i + 1] = g;
    colors[3 * i + 2] = b;
    
    // Tamaños variados más realistas
    sizes[i] = 0.8 + Math.random() * 3.5;
  }
  
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  
  const starMaterial = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
    transparent: true,
    opacity: 0.9
  });
  
  const stars = new THREE.Points(geometry, starMaterial);
  scene.add(stars);
  console.log("⭐ Realistic stars created");
})();

// === CONSTELACIONES REALISTAS ===
function createConstellations() {
  const constellations = [
    {
      name: "ORION",
      stars: [
        { x: -500, y: 200, z: 400, size: 6 },
        { x: -300, y: 250, z: 300, size: 5 },
        { x: -100, y: 150, z: 450, size: 7 },
        { x: -350, y: 300, z: 250, size: 4 },
        { x: -380, y: 280, z: 230, size: 4 },
        { x: -410, y: 260, z: 210, size: 4 }
      ],
      lines: [[0,1], [1,2], [3,4], [4,5], [3,5]]
    },
    {
      name: "OSA_MAYOR",
      stars: [
        { x: 600, y: 150, z: -300, size: 5 },
        { x: 750, y: 130, z: -250, size: 4 },
        { x: 900, y: 100, z: -200, size: 4 },
        { x: 850, y: 50, z: -100, size: 3 },
        { x: 700, y: 30, z: -50, size: 3 },
        { x: 550, y: 40, z: -80, size: 4 },
        { x: 500, y: 80, z: -150, size: 4 }
      ],
      lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0]]
    }
  ];

  constellations.forEach(constellation => {
    const constellationGroup = new THREE.Group();
    
    // Crear estrellas de la constelación
    constellation.stars.forEach(starData => {
      const starGeometry = new THREE.SphereGeometry(starData.size, 12, 12);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        emissive: 0xffffcc,
        emissiveIntensity: 0.4
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(starData.x, starData.y, starData.z);
      constellationGroup.add(star);
    });
    
    // Crear líneas de conexión
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.6,
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
  console.log("🔭 Constellations created");
}

createConstellations();

// === NEBULOSAS DECORATIVAS ===
function createNebulae() {
  // Nebulosa 1
  const nebulaGeometry1 = new THREE.BufferGeometry();
  const nebulaPositions1 = new Float32Array(800 * 3);
  for (let i = 0; i < 800; i++) {
    nebulaPositions1[i * 3] = (Math.random() - 0.5) * 300 + 800;
    nebulaPositions1[i * 3 + 1] = (Math.random() - 0.5) * 200 + 100;
    nebulaPositions1[i * 3 + 2] = (Math.random() - 0.5) * 300 - 600;
  }
  nebulaGeometry1.setAttribute("position", new THREE.BufferAttribute(nebulaPositions1, 3));
  const nebula1 = new THREE.Points(nebulaGeometry1, new THREE.PointsMaterial({
    size: 8,
    color: 0xaa66ff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  }));
  scene.add(nebula1);

  // Nebulosa 2
  const nebulaGeometry2 = new THREE.BufferGeometry();
  const nebulaPositions2 = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    nebulaPositions2[i * 3] = (Math.random() - 0.5) * 250 - 900;
    nebulaPositions2[i * 3 + 1] = (Math.random() - 0.5) * 180 - 200;
    nebulaPositions2[i * 3 + 2] = (Math.random() - 0.5) * 280 + 700;
  }
  nebulaGeometry2.setAttribute("position", new THREE.BufferAttribute(nebulaPositions2, 3));
  const nebula2 = new THREE.Points(nebulaGeometry2, new THREE.PointsMaterial({
    size: 6,
    color: 0x66ffaa,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  }));
  scene.add(nebula2);
  
  console.log("☁️ Nebulae created");
}

createNebulae();

// 🌌 PALABRAS BONITAS (200 por galaxia)
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

// 🌌 CONFIGURACIÓN DE 3 GALAXIAS (MÁS CERCANAS)
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

// Posiciones de las 3 galaxias (MÁS CERCANAS ENTRE SÍ)
const galaxyPositions = [
  { x: 0, y: 0, z: 0, color: 0xff3366, name: "TE AMO LILIANA" },
  { x: 800, y: 200, z: -500, color: 0xff66ff, name: "ERES MI TODO LILIANA" },    // Más cerca
  { x: -700, y: -250, z: 600, color: 0x66ccff, name: "MI PRINCESA LILIANA" }    // Más cerca
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
  const heartGlowGeometry = new THREE.SphereGeometry(16, 20, 20);
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
    // Tamaño fijo más grande para texto largo
    canvas.width = 5120;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fuente ajustada para texto largo
    const fontSize = text.length > 15 ? 380 : 420;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowColor = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowBlur = 60;
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
    opacity: 0.92
  });
  const centerSprite = new THREE.Sprite(centerMat);
  
  // Escala ajustada para texto largo
  const scaleX = textContent.length > 15 ? 170 : 140;
  centerSprite.scale.set(scaleX, 50, 1);
  centerSprite.position.set(0, 60, 0);
  galaxyGroup.add(centerSprite);

  // === Luz MEJORADA ===
  const light = new THREE.PointLight(colorHex, 2, 1000);
  galaxyGroup.add(light);

  // === ANILLOS DINÁMICOS MEJORADOS (8 anillos en lugar de 3) ===
  const rings = [];
  const ringCount = 8;
  
  for (let i = 0; i < ringCount; i++) {
    const innerRadius = 60 + i * 20;
    const outerRadius = innerRadius + 15;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, outerRadius, 64),
      new THREE.MeshBasicMaterial({
        color: colorHex, 
        transparent: true, 
        opacity: 0.4 - i * 0.04, 
        side: THREE.DoubleSide
      })
    );
    
    // Orientación variada para efecto 3D
    const orientation = i % 3;
    if (orientation === 0) {
      ring.rotation.x = Math.PI / 2;
    } else if (orientation === 1) {
      ring.rotation.y = Math.PI / 2;
    } else {
      ring.rotation.x = Math.PI / 3;
      ring.rotation.y = Math.PI / 3;
    }
    
    ring.userData = {
      speed: 0.001 + i * 0.0003,
      pulseSpeed: 0.02 + i * 0.005,
      pulse: Math.random() * Math.PI * 2,
      originalScale: 1,
      rotationAxis: orientation
    };
    
    rings.push(ring);
    galaxyGroup.add(ring);
  }

  // === Palabras flotantes (200 por galaxia) MEJORADAS ===
  function makeWordTexture(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 55px Arial";
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

  for (let i = 0; i < 200; i++) {
    const word = ALL_WORDS[i % ALL_WORDS.length];
    const texture = makeWordTexture(word, COLORS[i % COLORS.length]);
    const material = new THREE.SpriteMaterial({ 
      map: texture, 
      transparent: true,
      opacity: 0.88
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(50, 16, 1);
    
    // Distribución más realista en forma de disco
    const angle = Math.random() * Math.PI * 2;
    const radius = 120 + 130 * Math.random();
    const height = (Math.random() - 0.5) * 80; // Disco más plano
    
    sprite.position.set(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );
    
    sprite.userData = { 
      angle, 
      radius,
      height,
      speed: 0.0006 + 0.001 * Math.random(),
      pulseSpeed: 0.01 + Math.random() * 0.02,
      pulse: Math.random() * Math.PI * 2
    };
    textGroup.add(sprite);
  }
  galaxyGroup.add(textGroup);

  // === Fotos flotantes con manejo de errores mejorado ===
  const imageGroup = new THREE.Group();
  const startIndex = galaxyIndex * photosPerGalaxy;
  const endIndex = Math.min(startIndex + photosPerGalaxy, totalPhotos);
  const galaxyPhotos = shuffledPhotos.slice(startIndex, endIndex);

  const imgLoader = new THREE.TextureLoader();
  let loadedImages = 0;
  
  galaxyPhotos.forEach(photoNum => {
    const path = `https://jrenjm.github.io/amorlili/recuerdos/f${photoNum}.jpg`;
    
    imgLoader.load(
      path,
      texture => {
        loadedImages++;
        const mat = new THREE.SpriteMaterial({ 
          map: texture, 
          transparent: true,
          opacity: 0.92
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(42, 42, 1);
        
        // Distribución en disco
        const angle = Math.random() * Math.PI * 2;
        const radius = 140 + 110 * Math.random();
        const height = (Math.random() - 0.5) * 60;
        
        sprite.position.set(
          radius * Math.cos(angle),
          height,
          radius * Math.sin(angle)
        );
        
        sprite.userData = { 
          angle, 
          radius,
          height,
          speed: 0.0005 + 0.0008 * Math.random(),
          pulseSpeed: 0.008 + Math.random() * 0.015,
          pulse: Math.random() * Math.PI * 2
        };
        imageGroup.add(sprite);
      },
      undefined,
      error => {
        console.error(`❌ Failed to load image f${photoNum}.jpg:`, error);
        // Crear placeholder para imagen faltante
        createImagePlaceholder(galaxyGroup, colorHex);
      }
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

// Función para crear placeholder cuando una imagen falla
function createImagePlaceholder(galaxyGroup, colorHex) {
  const placeholderGeometry = new THREE.CircleGeometry(18, 16);
  const placeholderMaterial = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
  
  const angle = Math.random() * Math.PI * 2;
  const radius = 140 + 110 * Math.random();
  const height = (Math.random() - 0.5) * 60;
  
  placeholder.position.set(
    radius * Math.cos(angle),
    height,
    radius * Math.sin(angle)
  );
  
  placeholder.rotation.x = -Math.PI / 2;
  placeholder.userData = { 
    angle, 
    radius,
    height,
    speed: 0.0005 + 0.0008 * Math.random()
  };
  galaxyGroup.add(placeholder);
}

// Crear las 3 galaxias
console.log("🚀 Creating galaxies...");
for (let i = 0; i < galaxyPositions.length; i++) {
  const pos = galaxyPositions[i];
  const galaxy = createGalaxy(pos, pos.color, i, pos.name);
  galaxies.push(galaxy);
}
console.log("✅ All galaxies created!");

// 🎮 CONTROLES DE MOVIMIENTO LIBRE MEJORADOS PARA MÓVIL
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let dragging = false, lastX = 0, lastY = 0;
let touchZoomInitialDistance = 0;

// Controles de mouse
canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
  canvas.style.cursor = 'grab';
});

canvas.addEventListener("mouseleave", () => {
  dragging = false;
  canvas.style.cursor = 'grab';
});

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

// 📱 CONTROLES TÁCTILES MEJORADOS
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    dragging = true;
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
  } else if (e.touches.length === 2) {
    // Zoom con pinch
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    touchZoomInitialDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
  }
}, { passive: false });

canvas.addEventListener("touchend", () => {
  dragging = false;
  touchZoomInitialDistance = 0;
});

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if (e.touches.length === 1 && dragging) {
    const touch = e.touches[0];
    const dx = touch.clientX - lastX;
    const dy = touch.clientY - lastY;
    cameraRotation.yaw -= dx * 0.005; // Más sensible en móvil
    cameraRotation.pitch -= dy * 0.005;
    cameraRotation.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.pitch));
    lastX = touch.clientX;
    lastY = touch.clientY;
  } else if (e.touches.length === 2) {
    // Zoom con pinch
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    
    if (touchZoomInitialDistance > 0) {
      const zoomFactor = (touchZoomInitialDistance - currentDistance) * 0.5;
      const forward = new THREE.Vector3(
        Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
        Math.sin(cameraRotation.pitch),
        Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
      );
      cameraPos.x += forward.x * zoomFactor;
      cameraPos.y += forward.y * zoomFactor;
      cameraPos.z += forward.z * zoomFactor;
    }
    touchZoomInitialDistance = currentDistance;
  }
}, { passive: false });

// 🔍 Zoom con scroll
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const forward = new THREE.Vector3(
    Math.sin(cameraRotation.yaw) * Math.cos(cameraRotation.pitch),
    Math.sin(cameraRotation.pitch),
    Math.cos(cameraRotation.yaw) * Math.cos(cameraRotation.pitch)
  );
  const zoomSpeed = e.deltaY * 0.3;
  cameraPos.x += forward.x * zoomSpeed;
  cameraPos.y += forward.y * zoomSpeed;
  cameraPos.z += forward.z * zoomSpeed;
}, { passive: false });

// Estilo del cursor inicial
canvas.style.cursor = 'grab';

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
    const textScaleX = 140 + Math.sin(heartPulse) * 10;
    const textScaleY = 50 + Math.sin(heartPulse) * 6;
    galaxy.text.scale.set(textScaleX, textScaleY, 1);
    galaxy.text.material.opacity = 0.85 + Math.sin(heartPulse * 1.2) * 0.2;
    
    // Luz pulsante
    galaxy.light.intensity = 1.8 + Math.sin(heartPulse * 1.8) * 0.9;
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// === Loop de animación principal MEJORADO ===
let t = 0;
function tick() {
  requestAnimationFrame(tick);
  t += 0.01;

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

  // Movimiento con teclado
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
    // Anillos dinámicos con pulsación mejorada
    galaxy.rings.forEach((ring, index) => {
      // Rotación según eje asignado
      switch(ring.userData.rotationAxis) {
        case 0:
          ring.rotation.z += ring.userData.speed;
          break;
        case 1:
          ring.rotation.x += ring.userData.speed;
          break;
        case 2:
          ring.rotation.y += ring.userData.speed;
          break;
      }
      
      // Pulsación
      ring.userData.pulse += ring.userData.pulseSpeed;
      const pulseScale = 1 + Math.sin(ring.userData.pulse) * 0.15;
      ring.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Opacidad dinámica
      ring.material.opacity = 0.4 - index * 0.04 + Math.sin(ring.userData.pulse * 1.5) * 0.1;
    });

    // Palabras flotantes con movimiento orbital mejorado
    galaxy.textGroup.children.forEach(sprite => {
      sprite.userData.angle += sprite.userData.speed;
      sprite.userData.pulse += sprite.userData.pulseSpeed;
      
      // Movimiento orbital con pulsación
      const currentRadius = sprite.userData.radius + Math.sin(sprite.userData.pulse) * 10;
      const currentHeight = sprite.userData.height + Math.sin(sprite.userData.pulse * 0.5) * 5;
      
      sprite.position.x = currentRadius * Math.cos(sprite.userData.angle);
      sprite.position.y = currentHeight;
      sprite.position.z = currentRadius * Math.sin(sprite.userData.angle);
      
      // Pulsación de opacidad y escala
      sprite.material.opacity = 0.75 + 0.25 * Math.sin(sprite.userData.pulse * 2);
      const spriteScale = 1 + Math.sin(sprite.userData.pulse * 1.5) * 0.12;
      sprite.scale.set(50 * spriteScale, 16 * spriteScale, 1);
      
      // Siempre mirar a la cámara
      sprite.lookAt(camera.position);
    });

    // Fotos flotantes con comportamiento similar
    galaxy.imageGroup.children.forEach(sprite => {
      if (sprite.userData.angle !== undefined) {
        sprite.userData.angle += sprite.userData.speed;
        sprite.userData.pulse += sprite.userData.pulseSpeed;
        
        const currentRadius = sprite.userData.radius + Math.sin(sprite.userData.pulse) * 8;
        const currentHeight = sprite.userData.height + Math.sin(sprite.userData.pulse * 0.3) * 4;
        
        sprite.position.x = currentRadius * Math.cos(sprite.userData.angle);
        sprite.position.y = currentHeight;
        sprite.position.z = currentRadius * Math.sin(sprite.userData.angle);
        
        sprite.material.opacity = 0.85 + 0.15 * Math.sin(sprite.userData.pulse * 1.8);
        const photoScale = 1 + Math.sin(sprite.userData.pulse) * 0.06;
        sprite.scale.set(42 * photoScale, 42 * photoScale, 1);
        
        sprite.lookAt(camera.position);
      }
    });
  });

  renderer.render(scene, camera);
}

// Iniciar la animación
console.log("🎬 Starting animation...");
tick();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

console.log("🌌 Universe loaded successfully! You can now explore the galaxies.");
