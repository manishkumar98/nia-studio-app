export async function apiFetch(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl) {
    const error = new Error('DEMO_MODE')
    throw error
  }

  const token = window.__NIA_TOKEN__

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}
