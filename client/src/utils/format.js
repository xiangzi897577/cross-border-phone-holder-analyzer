import { toNumberOrNull } from './number'

export function formatMoney(value, symbol = '¥', emptyText = '-') {
  const numberValue = toNumberOrNull(value)

  if (numberValue === null) {
    return emptyText
  }

  return `${symbol}${numberValue.toFixed(2)}`
}

export function formatPercent(value, digits = 1, emptyText) {
  const numberValue = toNumberOrNull(value)
  const fallbackText = emptyText ?? `${(0).toFixed(digits)}%`

  if (numberValue === null) {
    return fallbackText
  }

  return `${numberValue.toFixed(digits)}%`
}

export function formatNumber(value, digits = 0, emptyText) {
  const numberValue = toNumberOrNull(value)
  const fallbackText = emptyText ?? (digits === 0 ? '0' : (0).toFixed(digits))

  if (numberValue === null) {
    return fallbackText
  }

  return numberValue.toFixed(digits)
}

export function formatRating(value) {
  return formatNumber(value, 1)
}

export function formatScore(value) {
  return formatNumber(value, 0)
}

export function formatText(value, emptyText = '暂无') {
  if (value === null || value === undefined) {
    return emptyText
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()
    return trimmedValue || emptyText
  }

  return String(value)
}
