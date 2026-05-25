export function compact(value: number, offset: number, min: number, max: number) {
  return Math.min(Math.max(value + offset, min), max)
}

export function scaleSpacing(value: number, factor: number, min: number, max: number) {
  return Math.min(Math.max(value * factor, min), max)
}
