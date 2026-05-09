#!/bin/sh
# Inject the runtime API URL into the pre-built static asset so the browser
# picks it up without a rebuild.  VITE_API_URL is the Railway env var; fall
# back to an empty string so api.js can use its own default.
API_URL="${VITE_API_URL:-}"

cat > /app/dist/config.js <<EOF
// Runtime configuration injected at container startup by entrypoint.sh
window.RUNTIME_API_URL = '${API_URL}';
EOF

exec npm run preview
