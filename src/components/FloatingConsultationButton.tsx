import { useEffect, useState } from 'react'

export function FloatingConsultationButton() {
  const [visible, setVisible] = useState(false)
  const [nearFinalCta, setNearFinalCta] = useState(false)

  useEffect(() => {
    const finalCta = document.querySelector('#contacto')
    const updateVisibility = () => {
      setVisible(window.scrollY > Math.min(window.innerHeight * 0.72, 720))
      setNearFinalCta(Boolean(finalCta && finalCta.getBoundingClientRect().top <= window.innerHeight + 100))
    }
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <a className={`floating-consultation ${visible && !nearFinalCta ? 'is-visible' : ''}`} href="/consulta" aria-label="Reservar turno">
      <span aria-hidden="true">✦</span>
      Reservar turno
    </a>
  )
}
