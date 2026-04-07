# AI Web Generator

An intelligent, full-stack web application that empowers users to generate, preview, and edit website code instantly using natural language prompts powered by AI.

## 🚀 Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Context API
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **AI Integration:** Google Gemini API
* **Authentication:** Custom JWT-based Auth + Google OAuth Provider

---

## 🗄️ Database Architecture
The application utilizes a highly optimized PostgreSQL relational database consisting of **4 core tables**, designed for speed, data integrity, and scalable chat storage.

### 1. Users (`users`)
Stores registered accounts (local and Google OAuth).
* **Connections:** One-to-many relationships to `sessions` and `chats`.
* **Performance:** Indexed on `email` (`idx_users_email`) for immediate authentication lookups.

### 2. Authentication (`sessions`)
Manages long-lived JWT refresh tokens to maintain active sessions.
* **Data Integrity:** Employs `ON DELETE CASCADE`. Deleting a user instantly invalidates and purges all their active sessions.

### 3. Chat Threads (`chats`)
Stores the metadata for individual conversation threads (similar to folders or projects).
* **Connections:** Belongs to a single `user_id`.
* **Performance:** Indexed on `user_id` (`idx_chats_user_id`), allowing the frontend sidebar to load a user's entire chat history almost instantly. Contains an auto-cleaning mechanism for empty chats.

### 4. Chat Content (`messages`)
Stores both user prompts and the heavy AI-generated code payloads for a specific chat session.
* **Connections:** Linked to `chats` via `chat_id`. 
* **Performance:** Indexed by `chat_id` (`idx_messages_chat_id`). When a user opens a chat, the database fetches only the relevant messages without scanning the entire table. Constrained to accept only 'user' and 'ai' roles.

---

## 🔌 Backend API Reference

A robust Express API powers the application's backend routes.

### Auth Routes (`/api/auth`)
* `POST /register`: Register a new local account.
* `POST /login`: Authenticate and issue temporary Access Tokens & long-lived Refresh Tokens.
* `POST /google`: Authenticate or register an account via Google OAuth.
* `POST /logout`: Destroy the current session.
* `POST /refresh`: Refresh the JWT Access Token invisibly.

### User Routes (`/api/user`)
* `GET /profile`: Fetch the authenticated user's profile details.
* `PUT /profile`: Update the user's name or avatar URL.

### Chat Routes (`/api/chat`)
* `POST /`: Create a new empty chat thread instance for an authenticated user.
* `GET /`: Retrieve all active chat threads for the sidebar.
* `GET /:id/messages`: Retrieve chronological messages (prompts & raw code) for a specific chat context.
* `DELETE /:id`: Delete a chat and trigger a cascade delete on all its nested messages.

### Generation Route (`/api/generate`)
* `POST /generate`: Sends the user's prompt (with existing code context if tweaking) directly to the Gemini AI. Automatically appends a 'user' log and an 'ai' payload log into the database if a `chatId` is passed, then returns the fresh HTML/CSS/JS payload.

---

## 🖥️ Frontend Architecture

The React frontend is built for a seamless, IDE-like application experience using modular components.

### Key Pages
* **`Home.jsx` (`/`)**: The main workspace. Includes the chat interface, real-time preview window, and code editor.
* **`Login.jsx` & `Register.jsx`**: Robust authentication screens with form error handling.
* **`Profile.jsx`**: User account management and avatar configuration dashboard.
* **`ForgotPassword.jsx` & `ResetPassword.jsx`**: Secure account recovery workflows.

### Core Components
* **`Sidebar.jsx`**: A navigation pane displaying chronological chat history, managing active threads, and exposing settings.
* **`ChatHistory.jsx`**: Renders the interactive conversation between the user and the AI dynamically in the `Home` view.
* **`PromptBar.jsx`**: The main input area anchoring the screen for users to type their natural language requests.
* **`Preview.jsx`**: An iframe-based sandbox that securely executes and natively renders the AI-generated HTML/CSS/JS in real-time.
* **`Editor.jsx`**: A raw code representation allowing users to manually construct or tweak the AI-generated structural code before finalizing.

### State Management
* **`AuthContext.jsx`**: Globally manages the user state, JWT tokens, auto-refresh intervals, and login/logout UI flows.
* **`ChatContext.jsx`**: Manages the currently selected chat iteration, loads message history organically, and handles the loading states of active AI code generations.

---

## 💡 Practical Example: Detailed Application Data Flow

Let's trace how the full stack manages a user's web generation request flawlessly.

**1. The User Starts a Workspace Iteration**
* **Action:** The authenticated user clicks "New Chat" and types: *"Create an interactive portfolio website for a graphic designer."*
* **Database Operation:** A new record (`chat_id = 101`) is initialized in `chats`. Instantly, a `user` role message is appended to the `messages` table housing the prompt.

**2. AI Code Generation & Backend Processing**
* **Action:** The frontend dispatches a request to `POST /api/generate`. The Node server marshals the prompt syntax to Gemini.
* **Database Operation:** After Google Gemini spins up the requested layout, the backend injects the huge HTML/CSS markup string straight into the `messages` table as an `ai` role message tagged under `chat_101`.

**3. Real-Time Frontend Rendering**
* **Action:** The backend responds positively to the React fetch layer. 
* **UI Update:** The raw structural data is piped into context. The `Preview.jsx` component springs to life with the functional graphic designer site, while `Editor.jsx` loads up the background source code if the user wants to tweak a `<div>`.

**4. Conversational History (Follow-Up Prompts)**
* **Action:** The user replies in the PromptBar: *"Make the background dark slate and use a bold Roboto font."*
* **Execution:** Because the frontend tracks that we are locked in `chat_101`, the backend passes the previous code block back to Gemini. The new prompt and the revised dark mode output code are neatly sequenced into the `messages` table under the same `chat_101` ID constraint, establishing perfect conversational chronological history for lightning-fast sidebar retrieval.