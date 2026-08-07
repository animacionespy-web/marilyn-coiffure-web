export function scrollToElement(getElement: () => HTMLElement | null) {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      getElement()?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}
