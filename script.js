// === 🎧 REPRODUCTOR DE MÚSICA AUTOMÁTICO ===

// Elementos del reproductor
const audio = document.getElementById("audio");
let currentSong = 0;
let songs = [];
let isPlaying = false;

// Crear contenedor del reproductor
const player = document.createElement("div");
player.className = "player";
player.innerHTML = `
  <button id="prev">⏮️</button>
  <button id="play">▶️</button>
  <button id="next">⏭️</button>
  <button id="mute">🔇</button>
  <input type="range" id="volume" min="0" max="1" step="0.01" value="1">
  <p id="songName">Cargando canciones...</p>
`;
document.body.appendChild(player);

// Referencias
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const muteBtn = document.getElementById("mute");
const volumeSlider = document.getElementById("volume");
const songName = document.getElementById("songName");

// === 🔍 Detectar automáticamente los archivos mp3 ===
async function loadSongs() {
  try {
    const response = await fetch("playlist/");
    const text = await response.text();

    // Buscar archivos .mp3 en el HTML de la carpeta
    const matches = [...text.matchAll(/href="([^"]+\.mp3)"/g)];
    songs = matches.map(m => {
      const file = decodeURIComponent(m[1]);
      return {
        name: file.replace(".mp3", ""),
        src: "playlist/" + file
      };
    });

    if (songs.length === 0) throw new Error("No se encontraron canciones");
  } catch {
    // Fallback manual (si GitHub no permite listar archivos)
    songs = [
      { name: "Only - LILIANA", src: "playlist/Only.mp3" },
      { name: "LIVE FOREVER (Español) - OASIS", src: "playlist/LIVE FOREVER (Español) - OASIS.mp3" },
      { name: "Be The One (spanish version)", src: "playlist/Be The One (spanish version).mp3" },
      { name: "Tattoo (Cover Español)", src: "playlist/Tattoo (Cover Español).mp3" },
      { name: "Baile Inolvidable", src: "playlist/Baile Inolvidable.mp3" },
      { name: "Enseñame a Bailar", src: "playlist/Enseñame a Bailar.mp3" },
    ];
  }

  loadSong(currentSong);
}

// === 🎶 Funciones del reproductor ===
function loadSong(index) {
  const song = songs[index];
  if (!song) return;
  audio.src = song.src;
  songName.textContent = "🎵 " + song.name;
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸️";
  isPlaying = true;
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
  isPlaying = false;
}

playBtn.addEventListener("click", () => {
  if (isPlaying) pauseSong();
  else playSong();
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔈" : "🔇";
});

volumeSlider.addEventListener("input", e => (audio.volume = e.target.value));

audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  playSong();
});

// Inicia el reproductor al primer clic (por bloqueo automático de audio)
document.body.addEventListener("click", () => {
  if (!isPlaying) playSong();
}, { once: true });

// Cargar canciones al iniciar
loadSongs();


// === 🌌 ESCENA 3D (CÓDIGO ORIGINAL SIN MODIFICAR) ===

const canvas = document.getElementById("c"),
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !0 });
renderer.setSize(window.innerWidth, window.innerHeight),
renderer.setPixelRatio(window.devicePixelRatio),
renderer.setClearColor(0x000000, 1);
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
camera.position.z = 5;
const geometry = new THREE.BufferGeometry(),
  starsCount = 15000,
  positions = new Float32Array(3 * starsCount);
for (let e = 0; e < 3 * starsCount; e++)
  positions[e] = 2000 * (Math.random() - 0.5);
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }),
  stars = new THREE.Points(geometry, material);
scene.add(stars);

// Movimiento cámara
let isDragging = !1,
  previousMousePosition = { x: 0, y: 0 };
canvas.addEventListener("mousedown", e => {
  isDragging = !0;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener("mouseup", () => (isDragging = !1));
canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x,
    deltaY = e.clientY - previousMousePosition.y;
  previousMousePosition = { x: e.clientX, y: e.clientY };
  camera.rotation.y -= deltaX * 0.002;
  camera.rotation.x -= deltaY * 0.002;
});

// Zoom con rueda
canvas.addEventListener("wheel", e => {
  camera.position.z += e.deltaY * 0.01;
  camera.position.z = Math.max(2, Math.min(20, camera.position.z));
});

// Redimensionar
window.addEventListener("resize", () => {
  (camera.aspect = window.innerWidth / window.innerHeight),
    camera.updateProjectionMatrix(),
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación
function animate() {
  requestAnimationFrame(animate),
    (stars.rotation.y += 0.0005),
    renderer.render(scene, camera);
}
animate();
