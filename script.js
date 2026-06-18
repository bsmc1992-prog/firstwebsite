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

// ===== LIGHTBOX EXTENSIONES =====
const lbFotos = [
  { src: 'ext1.jpeg', titulo: 'Extensiones · Clásicas' },
  { src: 'ext2.jpg', titulo: 'Extensiones · Volumen Ruso' },
  { src: 'ext3.jpg', titulo: 'Extensiones · Mega Volumen' },
];
let lbIndex = 0;

function openLightbox(i) {
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

// Fecha mínima = hoy
const fechaInput = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
fechaInput.setAttribute('min', hoy);

// Formulario de citas
const citaForm = document.getElementById('citaForm');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

citaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  modal.classList.add('active');
  citaForm.reset();
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});
