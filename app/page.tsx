/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useCallback } from 'react'

type ServiceKey = 'extensiones' | 'lifting' | 'unas' | 'capilar'

const serviceFotos: Record<ServiceKey, { src: string; titulo: string }[]> = {
  extensiones: [
    { src: '/ext1.jpeg', titulo: 'Extensiones · Clásicas' },
    { src: '/ext2.jpg',  titulo: 'Extensiones · Volumen Ruso' },
    { src: '/ext3.jpg',  titulo: 'Extensiones · Mega Volumen' },
  ],
  lifting: [
    { src: '/lifting.jpeg',  titulo: 'Lash Lifting' },
    { src: '/lifting2.jpeg', titulo: 'Lash Lifting' },
    { src: '/lifting3.jpeg', titulo: 'Lash Lifting' },
    { src: '/lifting4.jpeg', titulo: 'Lash Lifting' },
  ],
  unas: [
    { src: '/unas1.jpeg', titulo: 'Diseño de Uñas' },
    { src: '/unas2.jpeg', titulo: 'Diseño de Uñas' },
    { src: '/unas3.jpeg', titulo: 'Diseño de Uñas' },
    { src: '/unas4.jpeg', titulo: 'Diseño de Uñas' },
    { src: '/unas5.jpeg', titulo: 'Diseño de Uñas' },
    { src: '/unas6.jpeg', titulo: 'Diseño de Uñas' },
  ],
  capilar: [
    { src: '/capilar.jpeg', titulo: 'Tratamientos Capilares' },
  ],
}

const CAL_SERVICIOS = [
  { slug: 'jmstudio/extensiones-de-pestanas', label: 'Extensiones de Pestañas' },
  { slug: 'jmstudio/lash-lifting',            label: 'Lash Lifting' },
  { slug: 'jmstudio/laminado-ceja',           label: 'Laminado de Ceja' },
  { slug: 'jmstudio/diseno-de-unas',          label: 'Diseño de Uñas' },
  { slug: 'jmstudio/tratamientos-capilares',  label: 'Tratamientos Capilares' },
  { slug: 'jmstudio/masajes',                 label: 'Masajes' },
]

export default function Home() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null)
  const [lbService, setLbService]         = useState<ServiceKey>('extensiones')
  const [lbIndex, setLbIndex]             = useState(0)
  const [lbOpen, setLbOpen]               = useState(false)
  const [calSlug, setCalSlug]             = useState<string | null>(null)
  const [menuOpen, setMenuOpen]           = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
    }
  }, [])

  const navLightbox = useCallback((dir: number) => {
    const total = serviceFotos[lbService].length
    setLbIndex(i => (i + dir + total) % total)
  }, [lbService])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lbOpen) return
      if (e.key === 'ArrowRight') navLightbox(1)
      if (e.key === 'ArrowLeft')  navLightbox(-1)
      if (e.key === 'Escape')     setLbOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lbOpen, navLightbox])

  const openOverlay = (id: string) => {
    setActiveOverlay(id)
    setMenuOpen(false)
  }

  const closeAll = () => {
    setActiveOverlay(null)
    setMenuOpen(false)
  }

  const openLightbox = (service: ServiceKey = 'extensiones', index = 0) => {
    setLbService(service)
    setLbIndex(index)
    setLbOpen(true)
  }

  const currentFotos = serviceFotos[lbService]
  const currentFoto  = currentFotos[lbIndex]

  return (
    <>
      {/* NAV */}
      <nav className={`navbar${activeOverlay ? ' scrolled' : ''}`}>
        <div className="nav-logo">JM <span>LASHES</span></div>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          <li>
            <a href="#" onClick={e => { e.preventDefault(); closeAll() }}>Inicio</a>
          </li>
          <li>
            <a href="#" onClick={e => { e.preventDefault(); openOverlay('overlay-servicios') }}>Servicios</a>
          </li>
          <li>
            <a href="#" onClick={e => { e.preventDefault(); openOverlay('overlay-citas') }} className="btn-nav">
              Agendar Cita
            </a>
          </li>
        </ul>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          &#9776;
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="inicio">
        <div className="hero-overlay" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-content">
          <img src="/icon.jpeg" alt="JM Studio Lash" className="hero-logo" />
          <p className="hero-sub">Studio de Belleza</p>
          <h1>JM <span>LASHES</span></h1>
          <p className="hero-desc">
            Realzamos tu belleza natural con técnicas de vanguardia y productos premium.
          </p>
          <a href="#" onClick={e => { e.preventDefault(); openOverlay('overlay-citas') }} className="btn-primary">
            Agenda tu Cita
          </a>
          <a href="#" onClick={e => { e.preventDefault(); openOverlay('overlay-servicios') }} className="btn-secondary">
            Ver Servicios
          </a>
        </div>
      </section>

      {/* OVERLAY: SERVICIOS */}
      <div className={`overlay${activeOverlay === 'overlay-servicios' ? ' active' : ''}`} id="overlay-servicios">
        <div className="overlay-header">
          <div className="nav-logo">JM <span>LASHES</span></div>
          <button className="overlay-close" onClick={closeAll}>&times;</button>
        </div>
        <div className="overlay-body">
          <div className="section-header">
            <p className="section-tag">Lo que ofrecemos</p>
            <h2>Nuestros Servicios</h2>
            <div className="divider" />
          </div>
          <div className="services-grid">

            <div className="service-card service-card--clickable" onClick={() => openLightbox('extensiones')}>
              <h3>Extensiones de Pestañas</h3>
              <p>Clásicas, volumen ruso y mega volumen. Diseñadas para realzar tu mirada con naturalidad y duración.</p>
              <div className="card-photos-preview">
                <img src="/ext1.jpeg" alt="Extensiones 1" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/ext2.jpg"  alt="Extensiones 2" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/ext3.jpg"  alt="Extensiones 3" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <span className="service-tag">&#128247; Ver fotos del servicio</span>
            </div>

            <div className="service-card service-card--clickable" onClick={() => openLightbox('lifting')}>
              <h3>Lash Lifting</h3>
              <p>Levanta tus pestañas naturales. Efecto rizador permanente por semanas sin necesidad de rizo diario.</p>
              <div className="card-photos-preview">
                <img src="/lifting.jpeg"  alt="Lash Lifting 1" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/lifting2.jpeg" alt="Lash Lifting 2" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/lifting3.jpeg" alt="Lash Lifting 3" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <span className="service-tag">&#128247; Ver fotos del servicio</span>
            </div>

            <div className="service-card">
              <h3>Laminado de Ceja</h3>
              <p>Define y disciplina tus cejas con un acabado impecable. El secreto para cejas perfectas todo el día.</p>
              <span className="service-tag">Diseño Personalizado</span>
            </div>

            <div className="service-card service-card--clickable" onClick={() => openLightbox('unas')}>
              <h3>Diseño de Uñas</h3>
              <p>Nail art, semipermanente y acrílicas. Creamos diseños únicos adaptados a tu estilo y personalidad.</p>
              <div className="card-photos-preview">
                <img src="/unas1.jpeg" alt="Uñas 1" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/unas2.jpeg" alt="Uñas 2" onError={e => { e.currentTarget.style.display = 'none' }} />
                <img src="/unas3.jpeg" alt="Uñas 3" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <span className="service-tag">&#128247; Ver fotos del servicio</span>
            </div>

            <div className="service-card service-card--clickable" onClick={() => openLightbox('capilar')}>
              <h3>Tratamientos Capilares</h3>
              <p>Hidratación, keratina, botox capilar y más. Devuelve la vida y brillo a tu cabello con nuestros tratamientos.</p>
              <div className="card-photos-preview">
                <img src="/capilar.jpeg" alt="Tratamiento Capilar" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <span className="service-tag">&#128247; Ver fotos del servicio</span>
            </div>

            <div className="service-card">
              <h3>Masajes</h3>
              <p>Relaja cuerpo y mente con nuestros masajes relajantes y terapéuticos. Un momento solo para ti.</p>
              <span className="service-tag">Bienestar Total</span>
            </div>

          </div>

          <div className="overlay-cta">
            <p>¿Lista para mimarte?</p>
            <a href="#" onClick={e => { e.preventDefault(); openOverlay('overlay-citas') }} className="btn-primary">
              Agenda tu Cita Ahora
            </a>
          </div>
        </div>
      </div>

      {/* OVERLAY: CITAS */}
      <div className={`overlay overlay-dark${activeOverlay === 'overlay-citas' ? ' active' : ''}`} id="overlay-citas">
        <div className="overlay-header">
          <div className="nav-logo">JM <span>LASHES</span></div>
          <button className="overlay-close" onClick={closeAll}>&times;</button>
        </div>
        <div className="overlay-body">
          <div className="section-header">
            <p className="section-tag">Reserva tu momento</p>
            <h2>Agenda tu Cita</h2>
            <div className="divider" />
          </div>

          <div className="servicio-selector">
            <h3 className="selector-titulo">¿Qué servicio necesitas?</h3>
            <p className="selector-sub">Selecciona un servicio para ver la disponibilidad</p>
            <div className="cal-buttons">
              {CAL_SERVICIOS.map(({ slug, label }) => (
                <button
                  key={slug}
                  className={calSlug === slug ? 'active' : ''}
                  onClick={() => setCalSlug(slug)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="cita-wrapper">
            <div className="cita-info">
              <h3>¿Por qué elegirnos?</h3>
              <ul className="beneficios">
                <li><span>&#10003;</span> Profesionales certificadas</li>
                <li><span>&#10003;</span> Productos de alta calidad</li>
                <li><span>&#10003;</span> Ambiente relajante y exclusivo</li>
                <li><span>&#10003;</span> Atención personalizada</li>
                <li><span>&#10003;</span> Resultados garantizados</li>
              </ul>
              <div className="horario">
                <h4>Horario de Atención</h4>
                <p>Lunes a Viernes: 9:00 am – 7:00 pm</p>
                <p>Sábado: 9:00 am – 5:00 pm</p>
                <p>Domingo: Con cita previa</p>
              </div>
              <div className="horario" style={{ marginTop: '1.5rem' }}>
                <h4>Contacto</h4>
                <p>&#128241; <a href="tel:+528661732880">+52 866 173 2880</a></p>
                <p>&#128205; Privada Yucatán 1418, Col. Regina</p>
                <p style={{ marginTop: '0.6rem' }}>
                  <a
                    href="https://www.instagram.com/j_m_lashes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    Instagram @j_m_lashes
                  </a>
                </p>
              </div>
            </div>
            <iframe
              id="cal-frame"
              src={calSlug ? `https://cal.com/${calSlug}` : ''}
              style={{ display: calSlug ? 'block' : 'none' }}
              title="Calendario de citas"
            />
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <div
        className={`lightbox${lbOpen ? ' active' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setLbOpen(false) }}
      >
        <button className="lightbox-close" onClick={() => setLbOpen(false)}>&times;</button>
        <button className="lightbox-arrow lightbox-prev" onClick={() => navLightbox(-1)}>&#8249;</button>
        <div className="lightbox-inner">
          <img src={currentFoto?.src ?? ''} alt={currentFoto?.titulo ?? ''} />
          <div className="lightbox-caption">
            <p>{currentFoto?.titulo}</p>
            <div className="lightbox-dots">
              {currentFotos.map((_, i) => (
                <button
                  key={i}
                  className={`lightbox-dot${i === lbIndex ? ' active' : ''}`}
                  onClick={() => setLbIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
        <button className="lightbox-arrow lightbox-next" onClick={() => navLightbox(1)}>&#8250;</button>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">JM <em>LASHES</em></span>
          <div className="footer-links">
            <a href="tel:+528661732880">+52 866 173 2880</a>
            <span className="footer-dot">·</span>
            <a href="https://www.instagram.com/j_m_lashes/" target="_blank" rel="noopener noreferrer">
              @j_m_lashes
            </a>
            <span className="footer-dot">·</span>
            <span>Privada Yucatán 1418, Col. Regina</span>
          </div>
        </div>
      </footer>
    </>
  )
}
