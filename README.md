# Coding Mentor AI

A full-stack, beginner-friendly ed-tech app. Students can:
- Register/login (JWT authentication)
- Save and manage their code snippets
- Get instant AI feedback on their code using **Groq's free API**
- Follow structured **Learning Paths**: DSA, Machine Learning, Java Developer,
  and MERN Full Stack — and tick off topics as they finish them (saved to
  their account)

Stack: **M**ongoDB, **E**xpress, **R**eact, **N**ode — plus JWT auth and the
Groq AI API. The code is written simply on purpose (plain functions, clear
comments, no fancy patterns) so it's easy to read and extend.

---

## Project Structure

```
coding-mentor-ai/
├── backend/          # Express API server
│   ├── config/        # Database connection
│   ├── models/        # Mongoose schemas (User, Code, Progress)
│   ├── middleware/     # JWT auth middleware
│   ├── routes/        # API routes (auth, code, progress)
│   ├── utils/          # Groq AI helper
│   ├── data/           # Static learning path topics
│   └── server.js       # App entry point
└── frontend/          # React (Vite) app
    └── src/
        ├── api/         # Axios instance
        ├── context/     # Auth state (login/logout)
        ├── pages/       # Login, Register, Dashboard, LearningPaths, Home
        └── components/  # Navbar, CodeEditor, SnippetList, PathCard
```

---

## 1. Prerequisites

- [Node.js](https://nodejs.org) v18 or newer
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) database
  (or a local MongoDB install)
- A free [Groq API key](https://console.groq.com/keys)

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. generate one at
  https://randomkeygen.com)
- `GROQ_API_KEY` — your key from https://console.groq.com/keys
- `GROQ_MODEL` — leave as `llama-3.1-8b-instant` (free-tier friendly) or pick
  another model from your Groq console

Run the server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

---

## 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` already points at `http://localhost:5000/api`, which
matches the backend above — no changes needed for local development.

Run the app:

```bash
npm run dev
```

Visit the URL shown in the terminal (usually `http://localhost:5173`).

---

## 4. How It Works

1. **Register / Login** → the backend hashes passwords with bcrypt and
   returns a JWT token, which the frontend stores in `localStorage` and
   attaches to every future request.
2. **Save Code** → the student writes code in the Dashboard; it's saved to
   MongoDB under their account.
3. **Analyze with AI** → clicking "Analyze with AI" sends the saved code to
   the backend, which forwards it to Groq's free LLM with a prompt telling it
   to give a **hint**, not the full answer, if there's a bug. The feedback is
   saved and shown under the snippet.
4. **Learning Paths** → each path (DSA, ML, Java Developer, MERN Full Stack)
   has a fixed topic list (`backend/data/learningPaths.js`). Ticking a topic
   calls `PUT /api/progress/toggle`, which saves that topic as completed for
   that specific student. Progress bars update automatically.

---

## 5. Deployment

**Frontend (Vercel):**
1. Push this project to GitHub.
2. In Vercel, import the repo and set the **Root Directory** to `frontend`.
3. Add an environment variable `VITE_API_URL` pointing to your deployed
   backend URL (e.g. `https://your-backend.onrender.com/api`).
4. Deploy.

**Backend (Render, Railway, or similar — recommended for a plain Express
server):**
1. Import the repo, set the **Root Directory** to `backend`.
2. Set the Start Command to `npm start`.
3. Add the same environment variables from `backend/.env` in the host's
   dashboard (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `GROQ_MODEL`).
4. Deploy, then copy the live URL into your frontend's `VITE_API_URL`.

> Note: Vercel is built for frontend/serverless functions. A standard
> always-on Express server (like this one) is simplest to host on Render or
> Railway's free tier. You can still deploy the frontend on Vercel as
> planned.

---

## 6. Ideas to Extend

- Add a code editor with syntax highlighting (e.g. Monaco or CodeMirror)
  instead of a plain textarea
- Let students earn badges when they finish a full learning path
- Add pagination or search to the saved code list
- Add password reset via email
- Add an admin view to edit learning path topics without touching code
