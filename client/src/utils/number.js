export function toNumberOrNull(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null
  }

  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

export function safeNumber(value, fallback = 0) {
  return toNumberOrNull(value) ?? fallback
}

export function clamp(value, min, max) {
  const numberValue = safeNumber(value, min)
  return Math.min(Math.max(numberValue, min), max)
}

export function roundTo(value, digits = 0) {
  const numberValue = safeNumber(value, 0)
  return Number(numberValue.toFixed(digits))
}
