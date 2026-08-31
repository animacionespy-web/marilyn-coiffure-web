import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site'
import { usePublicContent } from '../hooks/usePublicContent'
import { buildWhatsappUrl } from '../utils/consultation'

export function FloatingConsultationButton() {
  const { settings } = usePublicContent()
  const [visible, setVisible] = useState(false)
  const [nearFinalCta, setNearFinalCta] = useState(false)
  const whatsappUrl = buildWhatsappUrl(
    settings.generalWhatsappNumber,
    siteConfig.consultation.directWhatsappMessage,
  )

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

  if (!whatsappUrl) return null

  return (
    <a
      className={`floating-consultation ${visible && !nearFinalCta ? 'is-visible' : ''}`}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar disponibilidad por WhatsApp"
    >
      <span aria-hidden="true">✦</span>
      Consultar por WhatsApp
    </a>
  )
}
