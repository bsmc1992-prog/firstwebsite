'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'

interface Attendee {
  name: string
  email: string
  timeZone: string
}

interface Booking {
  uid: string
  title: string
  startTime: string
  endTime: string
  status: 'ACCEPTED' | 'PENDING' | 'CANCELLED' | 'REJECTED'
  attendees: Attendee[]
}

const STATUS_LABELS: Record<string, string> = {
  ACCEPTED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  REJECTED: 'Rechazada',
}

const STATUS_CLASS: Record<string, string> = {
  ACCEPTED: styles.statusConfirmada,
  PENDING: styles.statusPendiente,
  CANCELLED: styles.statusCancelada,
  REJECTED: styles.statusCancelada,
}

const FILTROS = [
  { val: 'all',       label: 'Todas' },
  { val: 'ACCEPTED',  label: 'Confirmadas' },
  { val: 'PENDING',   label: 'Pendientes' },
  { val: 'CANCELLED', label: 'Canceladas' },
]

export default function AdminPage() {
  const [autenticado, setAutenticado]   = useState(false)
  const [password, setPassword]         = useState('')
  const [loginError, setLoginError]     = useState('')
  const [citas, setCitas]               = useState<Booking[]>([])
  const [apiWarning, setApiWarning]     = useState('')
  const [cargando, setCargando]         = useState(false)
  const [filtro, setFiltro]             = useState('all')
  const [checkedSession, setCheckedSession] = useState(false)

  // Habilitar scroll en la página de admin (globals.css la deshabilita)
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    return () => {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    }
  }, [])

  const cargarCitas = useCallback(async () => {
    setCargando(true)
    try {
      const res  = await fetch('/api/bookings')
      const data = await res.json()
      const sorted = (data.bookings ?? []).sort(
        (a: Booking, b: Booking) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      setCitas(sorted)
      setApiWarning(data.warning ?? data.error ?? '')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('jm_admin') === '1') {
      setAutenticado(true)
      cargarCitas()
    }
    setCheckedSession(true)
  }, [cargarCitas])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('jm_admin', '1')
      setAutenticado(true)
      cargarCitas()
    } else {
      setLoginError('Contraseña incorrecta')
    }
  }

  const logout = () => {
    sessionStorage.removeItem('jm_admin')
    setAutenticado(false)
    setCitas([])
  }

  if (!checkedSession) return null

  /* ──────────────── LOGIN ──────────────── */
  if (!autenticado) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>JM <em>LASHES</em></div>
          <p className={styles.loginSub}>Panel de Administración</p>
          <form onSubmit={login} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.loginInput}
              autoFocus
            />
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button type="submit" className={styles.loginBtn}>Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  /* ──────────────── PANEL ──────────────── */
  const citasFiltradas = filtro === 'all'
    ? citas
    : citas.filter(c =>
        filtro === 'CANCELLED'
          ? c.status === 'CANCELLED' || c.status === 'REJECTED'
          : c.status === filtro
      )

  const stats = {
    total:       citas.length,
    confirmadas: citas.filter(c => c.status === 'ACCEPTED').length,
    pendientes:  citas.filter(c => c.status === 'PENDING').length,
    canceladas:  citas.filter(c => c.status === 'CANCELLED' || c.status === 'REJECTED').length,
  }

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>JM <em>LASHES</em></div>
        <div className={styles.headerActions}>
          <button onClick={cargarCitas} className={styles.btnRefresh} disabled={cargando}>
            {cargando ? 'Cargando…' : '↻ Actualizar'}
          </button>
          <button onClick={logout} className={styles.btnLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1>Citas Agendadas</h1>
          <p>Gestión de reservas · JM Studio</p>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={`${styles.statCard} ${styles.statConfirmada}`}>
            <span className={styles.statNum}>{stats.confirmadas}</span>
            <span className={styles.statLabel}>Confirmadas</span>
          </div>
          <div className={`${styles.statCard} ${styles.statPendiente}`}>
            <span className={styles.statNum}>{stats.pendientes}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
          <div className={`${styles.statCard} ${styles.statCancelada}`}>
            <span className={styles.statNum}>{stats.canceladas}</span>
            <span className={styles.statLabel}>Canceladas</span>
          </div>
        </div>

        {/* Aviso si falta la API key */}
        {apiWarning && (
          <div className={styles.warning}>
            ⚠ {apiWarning}
          </div>
        )}

        {/* Filtros */}
        <div className={styles.filtros}>
          {FILTROS.map(({ val, label }) => (
            <button
              key={val}
              className={`${styles.filtroBtn}${filtro === val ? ` ${styles.filtroBtnActive}` : ''}`}
              onClick={() => setFiltro(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargando ? (
          <div className={styles.empty}>Cargando citas…</div>
        ) : citasFiltradas.length === 0 ? (
          <div className={styles.empty}>No hay citas para mostrar.</div>
        ) : (
          <div className={styles.citasList}>
            {citasFiltradas.map(cita => {
              const inicio  = new Date(cita.startTime)
              const fin     = new Date(cita.endTime)
              const cliente = cita.attendees?.[0]
              const servicio = cita.title.split(' between ')[0]

              return (
                <div key={cita.uid} className={styles.citaCard}>
                  <div className={styles.citaFecha}>
                    <span className={styles.citaDia}>
                      {inicio.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className={styles.citaHora}>
                      {inicio.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={styles.citaHoraFin}>
                      — {fin.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <p className={styles.citaServicio}>{servicio}</p>
                    {cliente && (
                      <>
                        <p className={styles.citaCliente}>{cliente.name}</p>
                        <p className={styles.citaEmail}>{cliente.email}</p>
                      </>
                    )}
                  </div>

                  <span className={`${styles.statusBadge} ${STATUS_CLASS[cita.status] ?? ''}`}>
                    {STATUS_LABELS[cita.status] ?? cita.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
