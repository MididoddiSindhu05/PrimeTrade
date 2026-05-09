// Resolve the API base URL at call time so we pick up the value injected by
// entrypoint.sh into window.RUNTIME_API_URL, which is set after the build.
// Priority: runtime window variable → build-time env var → localhost fallback.
function getApiBase() {
  return (
    (typeof window !== 'undefined' && window.RUNTIME_API_URL) ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:4000/api/v1'
  );
}

export async function apiRequest(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${getApiBase()}/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'API request failed');
  }
  return data;
}
