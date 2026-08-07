import { Children, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

interface HomeCarouselProps {
  children: ReactNode
  className: string
  ariaLabel: string
}

export function HomeCarousel({ children, className, ariaLabel }: HomeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const itemCount = Children.count(children)

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current
    if (!track || track.children.length === 0) return

    const viewportCenter = track.scrollLeft + track.clientWidth / 2
    const items = Array.from(track.children) as HTMLElement[]
    const closestIndex = items.reduce((closest, item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2
      const closestItem = items[closest]
      const closestCenter = closestItem.offsetLeft + closestItem.offsetWidth / 2
      return Math.abs(itemCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closest
    }, 0)

    setActiveIndex(closestIndex)
  }, [])

  const handleScroll = () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(updateActiveIndex)
  }

  const goToItem = (index: number) => {
    const track = trackRef.current
    const item = track?.children[index] as HTMLElement | undefined
    const firstItem = track?.children[0] as HTMLElement | undefined
    if (!track || !item || !firstItem) return

    track.scrollTo({ left: item.offsetLeft - firstItem.offsetLeft, behavior: 'smooth' })
  }

  useEffect(() => {
    updateActiveIndex()
    const track = trackRef.current
    if (!track) return

    const observer = new ResizeObserver(updateActiveIndex)
    observer.observe(track)
    return () => {
      observer.disconnect()
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [itemCount, updateActiveIndex])

  return (
    <div className="home-carousel-shell">
      <div
        ref={trackRef}
        className={`${className} home-carousel`}
        aria-label={ariaLabel}
        aria-roledescription="carrusel"
        onScroll={handleScroll}
      >
        {children}
      </div>
      {itemCount > 1 && (
        <div className="home-carousel__indicators" aria-label={`Navegación de ${ariaLabel}`}>
          {Array.from({ length: itemCount }, (_, index) => (
            <button
              type="button"
              key={index}
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`Mostrar elemento ${index + 1} de ${itemCount}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goToItem(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
