export interface ImagePosition {
  zoom: number
  positionX: number
  positionY: number
}

export const DEFAULT_IMAGE_POSITION: ImagePosition = {
  zoom: 1,
  positionX: 50,
  positionY: 50,
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum))

export function normalizeImagePosition(value?: Partial<ImagePosition> | null): ImagePosition {
  return {
    zoom: clamp(value?.zoom ?? DEFAULT_IMAGE_POSITION.zoom, 1, 2.5),
    positionX: clamp(value?.positionX ?? DEFAULT_IMAGE_POSITION.positionX, 0, 100),
    positionY: clamp(value?.positionY ?? DEFAULT_IMAGE_POSITION.positionY, 0, 100),
  }
}
