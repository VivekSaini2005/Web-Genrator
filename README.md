# 🚀 AI Web Generator (Cursor-style + Claude UI)

## 🧠 Project Overview

This project is a **full-stack AI-powered web generator** that allows users to:

* Enter prompts like ChatGPT / Claude
* Generate frontend code (HTML, CSS, JS)
* Instantly preview the output
* Save projects (chat sessions)
* Manage history and iterations

The system is designed to behave like:

> Cursor + ChatGPT + Claude UI combined

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Axios (API layer)
* Context API (Auth + Global State)

### 🔹 Backend

* Node.js (Express)
* PostgreSQL (pg)
* JWT Authentication
* Google OAuth

### 🔹 AI Integration

* Google Gemini (via `@google/genai`)
* Agent-based execution system (command runner)

---

## 📂 Project Structure

### 🔹 Backend

```
Backend/
├── src/
│   ├── config/         # DB + AI configs
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── services/       # Business logic (AI agent, commands)
│   ├── utils/          # Helpers (OS detection etc.)
│
├── .env
├── index.js
```

### 🔹 Frontend

```
Frontend/
├── src/
│   ├── components/     # UI components (Editor, Sidebar, Chat, etc.)
│   ├── api/            # API layer (axios)
│   ├── context/        # Auth context
│   ├── pages/          # Views (Login, Dashboard)
│
├── .env
```

---

## 🔐 Authentication System

### Features:

* Email + Password login
* Google OAuth login
* JWT-based authentication
* Refresh token system
* Protected routes

### Flow:

1. User logs in → receives access token
2. Token stored in localStorage
3. Axios interceptor attaches token
4. Backend verifies token via middleware

---

## 🗄️ Database Schema (PostgreSQL)

### Tables:

#### users

* id (UUID)
* name
* email (unique)
* password (nullable)
* provider (local/google)
* avatar_url
* created_at

#### sessions

* id (UUID)
* user_id
* refresh_token
* expires_at

#### generations (chat history & projects)

* id (UUID)
* user_id (optional)
* prompt
* current_code
* output_code (TEXT)
* created_at

---

## ⚙️ Core Features

### 💬 Chat-Based Prompt System

* Each project = chat session
* Prompts stored in DB
* Responses linked to prompts

### 🧠 AI Code Generation

* User sends prompt
* Backend processes via AI agent
* Executes commands (file generation)
* Returns structured output

### 🖥️ Live Preview

* Generated code rendered in preview panel
* Supports HTML/CSS/JS
* Auto-refresh on new generation

---

## 🔄 Request Flow

### Prompt → Code Generation

1. Frontend sends:

```
POST /api/generate
{
  prompt,
  projectId
}
```

2. Backend:

* Stores prompt
* Sends to AI agent
* Executes commands
* Generates code

3. Response:

```
{
  success: true,
  output: "<html>...</html>"
}
```

4. Frontend:

* Updates chat
* Updates preview

---

## 🔌 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* POST `/api/auth/logout`
* POST `/api/auth/google`
* GET `/api/auth/me`

### User Profile & History

* GET `/api/user/profile`
* PUT `/api/user/profile`
* GET `/api/user/generations` (Lists past projects/history)
* GET `/api/user/generations/:id` (Loads specific past project)

### AI Generation

* POST `/api/generate`

---

## 🧩 Architecture Philosophy

This project follows:

* Modular structure (MVC + services)
* Clean separation of concerns
* Scalable API design
* Reusable frontend components
* Centralized API handling

---

## 🎯 Design Philosophy

Inspired by:

* Claude (minimal, readable UI)
* ChatGPT (interaction flow)
* Cursor (developer experience)

Principles:

* Clean UI
* Focus on content
* Smooth UX
* Developer-first tooling

---

## 🚀 How to Run

### Backend

```
cd Backend
npm install
npm run dev
```

### Frontend

```
cd Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=

JWT_SECRET=

GOOGLE_CLIENT_ID=
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

---

## ⚠️ Important Notes for AI / Developers

When modifying this project:

* Do NOT break existing structure
* Maintain separation between:

  * controllers
  * services
  * routes
* Follow async/await pattern
* Keep UI minimal (Claude-style)
* Avoid unnecessary libraries
* Maintain consistency in API responses

---

## 🔥 Future Enhancements

* Streaming responses (like ChatGPT)
* WebSocket / SSE
* File system preview (multi-file projects)
* Deployment (Vercel + Railway)
* Team collaboration

---

## 🧠 Context Summary (For AI)

This is a **full-stack AI SaaS project** where:

* Frontend = Chat UI + Code Preview
* Backend = AI Agent + API + Auth
* Database = Stores users, chats, code
* Goal = Generate websites from prompts

Focus areas:

* UI/UX improvement
* AI accuracy
* Performance optimization
* Scalable architecture

---

## 💀 Final Note

This is not just a project —
This is a **foundation for a real AI product**.

Treat it like production software.


## Reset Password add this in production level
To reset passward click on reset and go in backend terminal click on link then change your pass...