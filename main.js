// === 🎵 Reproductor automático ===
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
let songs = [];

// 🔍 Detectar automáticamente archivos MP3 en /playlist/
async function loadSongs() {
  try {
    const res = await fetch("playlist/");
    const text = await res.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");
    songs = [...html.querySelectorAll("a[href$='.mp3']")].map(a => ({
      name: decodeURIComponent(a.href.split("/").pop().replace(".mp3", "")),
      src: "playlist/" + decodeURIComponent(a.href.split("/").pop())
    }));
    if (songs.length === 0) {
      songName.textContent = "No hay canciones en playlist/";
    } else {
      loadSong(0);
    }
  } catch (err) {
    console.error("⚠️ No se pudieron cargar las canciones automáticamente:", err);
    songName.textContent = "Error al cargar canciones";
  }
}

// Cargar canción
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songName.textContent = song.name;
  progressBar.style.width = "0%";
  timeDisplay.textContent = "0:00 / 0:00";
}

// Convertir segundos a mm:ss
function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ▶️ Pausar/Reanudar
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

// Actualizar barra de progreso
audio.addEventListener("timeupdate", () => {
  const p = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = (isFinite(p) ? p : 0) + "%";
  timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

// Cambiar manualmente el punto de reproducción
progress.addEventListener("click", e => {
  const rect = progress.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  if (isFinite(audio.duration)) audio.currentTime = percent * audio.duration;
});

// Botones de cambio
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

// === Inicializar ===
loadSongs();


// === 💫 Todo tu código Three.js original ===
// (Aquí va TODO el bloque del efecto galaxia + corazón + texto + rotación + zoom)
// 👇 Copia y pega tu código completo de efectos aquí (sin modificar nada)
