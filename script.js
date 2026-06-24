// Abrir pantalla (overlay)
function openOverlay(id) {
  closeAll();
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('navbar').classList.add('scrolled');
}

// Cerrar pantalla específica
function closeOverlay(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('navbar').classList.remove('scrolled');
}

// Cerrar todas las pantallas (volver al inicio)
function closeAll() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('active'));
  document.body.style.overflow = 'hidden';
  document.getElementById('navbar').classList.remove('scrolled');
}

// ===== LIGHTBOX =====
const serviceFotos = {
  extensiones: [
    { src: 'ext1.jpeg', titulo: 'Extensiones · Clásicas' },
    { src: 'ext2.jpg',  titulo: 'Extensiones · Volumen Ruso' },
    { src: 'ext3.jpg',  titulo: 'Extensiones · Mega Volumen' },
  ],
  lifting: [
    { src: 'lifting.jpeg',  titulo: 'Lash Lifting' },
    { src: 'lifting2.jpeg', titulo: 'Lash Lifting' },
    { src: 'lifting3.jpeg', titulo: 'Lash Lifting' },
    { src: 'lifting4.jpeg', titulo: 'Lash Lifting' },
  ],
  unas: [
    { src: 'unas1.jpeg', titulo: 'Diseño de Uñas' },
    { src: 'unas2.jpeg', titulo: 'Diseño de Uñas' },
    { src: 'unas3.jpeg', titulo: 'Diseño de Uñas' },
    { src: 'unas4.jpeg', titulo: 'Diseño de Uñas' },
    { src: 'unas5.jpeg', titulo: 'Diseño de Uñas' },
    { src: 'unas6.jpeg', titulo: 'Diseño de Uñas' },
  ],
  capilar: [
    { src: 'capilar.jpeg', titulo: 'Tratamientos Capilares' },
  ],
};

let lbFotos = [];
let lbIndex = 0;

function openLightbox(servicio, i) {
  lbFotos = serviceFotos[servicio] || serviceFotos.extensiones;
  lbIndex = i || 0;
  renderLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

function closeLightboxIfBg(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function lightboxNav(dir) {
  lbIndex = (lbIndex + dir + lbFotos.length) % lbFotos.length;
  renderLightbox();
}

function renderLightbox() {
  const foto = lbFotos[lbIndex];
  document.getElementById('lightbox-img').src = foto.src;
  document.getElementById('lightbox-title').textContent = foto.titulo;
  const dotsEl = document.getElementById('lightbox-dots');
  dotsEl.innerHTML = lbFotos.map((_, i) =>
    `<button class="lightbox-dot ${i === lbIndex ? 'active' : ''}" onclick="lbIndex=${i}; renderLightbox()"></button>`
  ).join('');
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
  if (e.key === 'Escape')     closeLightbox();
});

// ===== PWA =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

// ===== CAL.COM =====
function loadCal(service, btn) {
  const frame = document.getElementById('cal-frame');
  frame.src = 'https://cal.com/' + service;
  frame.style.display = 'block';
  document.querySelectorAll('.cal-buttons button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ===== MENÚ HAMBURGUESA (móvil) =====
// Menú hamburguesa (móvil)
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

