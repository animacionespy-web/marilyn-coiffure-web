import { useEffect, useState } from 'react'

export function FloatingConsultationButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > Math.min(window.innerHeight * 0.72, 720))
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <a className={`floating-consultation ${visible ? 'is-visible' : ''}`} href="/consulta" aria-label="Reservar turno">
      <span aria-hidden="true">✦</span>
      Reservar turno
    </a>
  )
}
