export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json(data)
}

export function sendError(res, statusCode, message, error, extra = {}) {
  const payload = {
    status: 'error',
    message,
    ...extra,
  }

  if (error) {
    payload.error = error.message || String(error)
  }

  return res.status(statusCode).json(payload)
}
