FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh
EXPOSE 5173
# entrypoint.sh rewrites dist/config.js with the runtime VITE_API_URL value
# before handing off to `npm run preview`, so the backend URL is resolved at
# container startup rather than baked in at build time.
CMD ["/app/entrypoint.sh"]