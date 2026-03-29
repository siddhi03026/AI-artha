# Artha AI

Artha AI is a full-stack personal finance assistant app with:
- AI chat concierge for finance Q&A
- Financial dashboard and service recommendations
- Simulation and personality insights modules
- MongoDB-backed data and REST APIs

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Framer Motion
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Axios
- dotenv

## Project Structure

```
artha-frontend/   # React app (UI)
artha-backend/    # Express API server
```

## Local Setup

### 1) Clone and install

```bash
git clone <your-repo-url>
cd "ai artha"
```

#### Frontend

```bash
cd artha-frontend
npm install
```

#### Backend

```bash
cd ../artha-backend
npm install
```

### 2) Configure environment variables

#### Backend: artha-backend/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/artha_ai
MONGO_URI_ATLAS=
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.1-8b-instant
NODE_ENV=development
```

#### Frontend: artha-frontend/.env

```env
VITE_API_URL=http://localhost:5000
```

### 3) Run locally

#### Backend

```bash
cd artha-backend
npm run dev
```

#### Frontend

```bash
cd artha-frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Endpoints (Backend)

Base URL: `http://localhost:5000/api`

- `GET /health`
- `GET /health/ai`
- `POST /chat`
- `GET /chat/history`
- `DELETE /chat/history/:sessionId`
- `GET /dashboard`
- `GET /services`
- `POST /services/interact`
- `POST /simulation`
- `GET /personality`
- `GET /ai-plan`

## Deployment Notes

### Backend (Render)
Set these environment variables in your backend service:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL=https://api.groq.com/openai/v1`
- `OPENAI_MODEL=llama-3.1-8b-instant`
- `MONGO_URI_ATLAS`
- `NODE_ENV=production`

Health checks:
- `/api/health`
- `/api/health/ai` (expects `configured: true` for AI)

### Frontend (Vercel/Netlify/Render Static)
Set:

- `VITE_API_URL=https://<your-backend-domain>`

Example:

- `VITE_API_URL=https://ai-artha-dj4r.onrender.com`

## Troubleshooting

### Chat returns fallback/static responses
- Check backend AI health endpoint: `/api/health/ai`
- Ensure `ai.configured` is `true`
- Re-save backend env variables and redeploy

### Cannot GET /api/chat in browser
- This endpoint is primarily `POST /api/chat`
- `GET /api/chat` only returns an informational message

## Security

- Never commit real API keys or database credentials.
- Keep `.env` files out of git.
- Rotate keys immediately if they are exposed.

## License

MIT
