// === 🎵 Reproductor de música ===

// Detectar automáticamente archivos .mp3 de la carpeta "playlist/"
async function fetchSongs() {
  try {
    const response = await fetch('playlist/');
    const text = await response.text();
    const matches = [...text.matchAll(/href="([^"]+\.mp3)"/g)];
    return matches.map(m => ({
      name: decodeURIComponent(m[1].replace(/\.mp3$/, "")),
      src: "playlist/" + m[1]
    }));
  } catch {
    // Si GitHub Pages no permite listar archivos, usar lista manual
    return [
      { name: "Only - LILIANA", src: "playlist/Only.mp3" },
      { name: "LIVE FOREVER (Español) - OASIS", src: "playlist/LIVE FOREVER (Español) - OASIS.mp3" },
      { name: "Be The One (spanish version)", src: "playlist/Be The One (spanish version).mp3" },
      { name: "Tattoo (Cover Español)", src: "playlist/Tattoo (Cover Español).mp3" },
      { name: "Baile Inolvidable", src: "playlist/Baile Inolvidable.mp3" },
      { name: "Enseñame a Bailar", src: "playlist/Enseñame a Bailar.mp3" },
    ];
  }
}

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const timeDisplay = document.getElementById("time");
const songName = document.getElementById("song-name");

let songs = [];
let isPlaying = false;
let currentSong = 0;

// Formato mm:ss
function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songName.textContent = song.name;
  progressBar.style.width = "0%";
  timeDisplay.textContent = "0:00 / 0:00";
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

audio.addEventListener("ended", () => nextBtn.click());

// Cargar canciones
(async () => {
  songs = await fetchSongs();
  loadSong(currentSong);
})();


// === 🌌 Escena 3D completa ===
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Luz ambiental
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);

// Fondo de estrellas
const starsGeometry = new THREE.BufferGeometry();
const starCount = 8000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) starPositions[i] = (Math.random() - 0.5) * 2000;
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xff6600, size: 0.9 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Corazón 3D
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.bezierCurveTo(0, 0.5, -0.8, 0.5, -0.8, 0);
shape.bezierCurveTo(-0.8, -0.6, 0, -1, 0, -1.5);
shape.bezierCurveTo(0, -1, 0.8, -0.6, 0.8, 0);
shape.bezierCurveTo(0.8, 0.5, 0, 0.5, 0, 0);
const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 };
const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshPhongMaterial({ color: 0xff0033, shininess: 100 });
const heart = new THREE.Mesh(geometry, material);
scene.add(heart);

// Textos
const loader = new THREE.TextureLoader();
const textures = [
  'f0.jpg',
  'f1.jpg',
  'f2.jpg',
  'f3.jpg',
  'f4.jpg',
  'f5.jpg',
].map(img => loader.load('fotos/' + img));

const planes = textures.map((tex, i) => {
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
  const geo = new THREE.PlaneGeometry(1.5, 1.5);
  const plane = new THREE.Mesh(geo, mat);
  const angle = (i / textures.length) * Math.PI * 2;
  plane.position.set(Math.cos(angle) * 5, Math.sin(angle) * 3, -i * 0.2);
  scene.add(plane);
  return plane;
});

// Animación
let rotY = 0;
function animate() {
  requestAnimationFrame(animate);
  rotY += 0.003;
  stars.rotation.y += 0.0005;
  heart.rotation.y += 0.02;
  heart.rotation.x = Math.sin(rotY) * 0.2;

  planes.forEach((p, i) => {
    p.rotation.y += 0.002;
    p.rotation.x = Math.sin(rotY + i) * 0.1;
  });

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
