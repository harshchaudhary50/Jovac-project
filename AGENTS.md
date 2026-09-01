# AGENTS.md — AI Agent Operating System & Repository Guidelines

Welcome to **ExamNotesAI (NoteX)**. This document establishes guidelines, architecture boundaries, coding standards, and behavioral constraints for any AI coding assistant or autonomous agent interacting with this codebase.

---

## 1. Project Overview & Architecture

ExamNotesAI is an enterprise-grade AI-powered study companion and exam preparation platform built using a modern decoupled architecture:

```
ExamNotesAI/
├── client/          # Vite + React 19 Single Page Application (SPA)
│   ├── src/
│   │   ├── assets/     # Optimized media and Lottie vector animations
│   │   ├── components/ # Modular UI components and administrative tabs
│   │   ├── config/     # Centralized app configuration & environment constants
│   │   ├── lib/        # Shared frontend utilities (e.g., Tailwind merge `cn`)
│   │   ├── pages/      # Route-level views (Dashboard, Notes, Auth, Admin, etc.)
│   │   ├── redux/      # Global state store (userSlice, generatorSlice)
│   │   ├── services/   # Axios API client functions
│   │   └── utils/      # Client-side PDF export & Firebase OAuth helpers
│   └── vite.config.js  # Vite bundler configuration with `@` path alias
├── server/          # Node.js + Express 5 REST API (ES Modules)
│   ├── controllers/ # Request validation and business logic
│   ├── middleware/  # Authentication (`isAuth`), authorization (`isAdmin`)
│   ├── models/      # MongoDB Mongoose schemas (User, Notes, Payment, Admin)
│   ├── routes/      # REST API route handlers
│   ├── services/    # Multi-LLM provider integrations (Gemini, Groq, Ollama)
│   └── utils/       # DB connection, JWT tokens, AI JSON repair, prompt builders
├── AGENTS.md        # AI Agent developer rules & operational guidelines
├── SKILLS.md        # Catalog of repository skills, workflows & API protocols
└── README.md        # Technical documentation, setup & architectural specs
```

---

## 2. Core Operational Rules for AI Agents

### 🛡️ Rule 1: Zero Regressions & Backward Compatibility
- **Never delete or break existing features.**
- If renaming or moving files/routes (e.g., updating routes or endpoints), **always provide backward compatibility layers or re-exports** so older imports and active deployments remain 100% operational.

### 🧩 Rule 2: Clean Separation of Concerns
- **Frontend**: Keep API calls in `client/src/services/api.js` or dedicated service modules. Do not write raw, unhandled `axios` calls directly inside presentation components when a service helper can be used.
- **Backend**: Respect the **Controller - Service - Model** pattern:
  - `routes/` define endpoints and apply middlewares (`isAuth`, `isAdmin`).
  - `controllers/` validate request payload and return HTTP responses.
  - `services/` handle external API integrations (AI providers, LLMs).
  - `models/` define strict Mongoose schemas and indexes.

### 🔐 Rule 3: Security First
- **Never commit or log plain text secrets.** All API keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `JWT_SECRET`, `RAZORPAY_KEY_SECRET`) must be retrieved exclusively via `process.env`.
- Keep session tokens in HTTP-only, secure, same-site cookies or verified Bearer headers.
- Sanitize AI prompts and external inputs to prevent injection or malformed data storage.

### 🎨 Rule 4: Frontend Design & UI Standards
- Use **Tailwind CSS v4** utilities with CSS variables for dynamic dark/light theming.
- Preserve responsive breakpoints across mobile, tablet, and desktop screens.
- Keep micro-interactions and transitions fluid using `motion` (Framer Motion) and `lottie-react`.

---

## 3. Technology Stack Reference

| Layer | Primary Technologies | Key Libraries |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 7 | `react-router-dom`, `@reduxjs/toolkit`, `axios`, `motion`, `lucide-react`, `recharts`, `mermaid`, `html2pdf.js` |
| **Backend** | Node.js (ESM), Express 5 | `mongoose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `helmet`, `express-rate-limit`, `pdfkit`, `jsonrepair` |
| **Database** | MongoDB | Mongoose 9 ODM |
| **AI / LLMs** | Google Gemini 2.5 Flash | Groq Cloud (`llama-3.1-8b-instant`), Ollama (`llama3.2:3b`) |
| **Payments** | Razorpay | Razorpay Node SDK + Frontend Checkout Modal |

---

## 4. Common Developer Workflows

### Starting Development Servers
```bash
# Backend (from server directory)
cd server && npm run dev    # Starts on http://localhost:8000 via nodemon

# Frontend (from client directory)
cd client && npm run dev    # Starts on http://localhost:5173 via Vite
```

### Production Build Verification
```bash
cd client && npm run build  # Validates JSX syntax and production bundling
```

### Backend Syntax Verification
```bash
node -c server/index.js server/controllers/*.js server/routes/*.js server/services/*.js server/utils/*.js
```

---

## 5. Definition of Done for Agents
Before completing any task:
1. Ensure the code compiles cleanly (`npm run build --prefix client`).
2. Verify all server files pass node syntax validation.
3. Keep git working tree clean of temporary, orphaned, or debug files.
