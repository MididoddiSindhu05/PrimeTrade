# Primetrade Backend + Frontend Assignment

A scalable REST API project with authentication, role-based access, and a supporting React frontend.

## Project structure

- `backend/` – Express API with PostgreSQL, JWT, role-based authorization, and Swagger docs
- `frontend/` – React UI using Vite for user registration, login, and task management
- `docker-compose.yml` – optional local deployment with Postgres, backend, and frontend

## Backend

### Run locally

1. Copy `backend/.env.example` to `backend/.env`
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start Postgres and backend via Docker Compose:
   ```bash
   docker compose up --build
   ```
4. The API will be available at `http://localhost:4000`

### Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `GET /api/v1/admin/users` (admin only)
- `GET /api/v1/docs` for Swagger UI

### Backend features

- JWT authentication with role-based authorization
- Password hashing with bcrypt
- PostgreSQL / SQLite support via Sequelize
- Auto-generated Swagger API docs
- Error handling and request validation

## Frontend

### Run locally

1. Copy `frontend/.env.example` to `frontend/.env` and update `VITE_API_URL` if needed.
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the UI:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`

### Frontend features

- Professional modern UI for auth and task workflow
- JWT persistence using localStorage
- Authenticated dashboard with task create/update/delete
- Admin user listing panel for admin accounts
- Smooth responsive layout suitable for demos

## Notes on scalability

- API is versioned under `/api/v1` to enable future expansions without breaking changes.
- Authentication uses JWT with a dedicated secret and expiration.
- Database models are separated into modules to support microservice extraction.
- Docker Compose provides a reproducible deployment stack for the database and API.
- Future improvements: Redis caching, request queueing, centralized logging, and horizontal scaling behind a load balancer.
