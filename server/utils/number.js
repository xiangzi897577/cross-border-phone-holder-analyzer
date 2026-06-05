export function getValidNumber(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null
  }

  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

export function roundTo(value, digits = 0) {
  const numberValue = getValidNumber(value) ?? 0
  return Number(numberValue.toFixed(digits))
}

export function clamp(value, min, max) {
  const numberValue = getValidNumber(value) ?? min
  return Math.min(Math.max(numberValue, min), max)
}

export function parsePositiveInteger(value) {
  const numberValue = getValidNumber(value)

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null
  }

  return numberValue
}
