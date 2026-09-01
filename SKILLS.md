# SKILLS.md — ExamNotesAI Capability Catalog & Agent Skills

This document defines the specialized operational capabilities, workflows, and protocols implemented across the **ExamNotesAI (NoteX)** codebase. Agents and engineers can reference these skills to quickly execute, debug, or extend core features.

---

## Skill 1: Multi-LLM Notes & Revision Generation

### Overview
Handles multi-provider AI prompt execution with automatic JSON structure repair and fallback resilience.

### Code Locations
- Service: `server/services/gemini.services.js` (Google Gemini 2.5 Flash)
- Fast Alternative: `server/services/groq.services.js` (Groq Llama 3.1)
- Local Engine: `server/services/ollama.services.js` (Ollama Llama 3.2:3b)
- Controller: `server/controllers/generate.controller.js`
- JSON Repair: `server/utils/parseAiJson.js`

### Operational Protocol
1. User submits topic, subject, exam type, and custom instructions.
2. `promptBuilder.js` structures the prompt with an exact JSON schema requiring:
   - Summary and key takeaways
   - Detailed conceptual explanation in markdown
   - Practice questions & answers with difficulty ratings
   - Valid Mermaid diagram syntax (`graph TD` or `flowchart TD`)
   - Exam weightage analysis numbers
3. Native `fetch` sends request to the designated LLM provider.
4. Response text passes through `jsonrepair` to prevent parsing crashes if markdown fences or truncated braces exist.
5. Notes are saved to MongoDB and returned to client.

---

## Skill 2: Dual-Engine PDF Generation & Export

### Client-Side Engine (`html2pdf.js`)
- **Location**: `client/src/utils/pdfExport.js`
- **Use Case**: Instant client-side download without incurring server compute load.
- **Workflow**:
  1. Sanitizes markdown and emojis.
  2. Converts tables and sections into styled, print-friendly HTML container.
  3. Uses `html2pdf.js` with canvas rendering and smart page-break controls (`avoid-all` on cards and tables).

### Server-Side Engine (`pdfkit`)
- **Location**: `server/controllers/pdf.controller.js`
- **Use Case**: Headless generation, programmatic downloads, watermarked institution notes.
- **Workflow**:
  1. Creates Node.js `PDFDocument` stream with custom headers, margins, and typography.
  2. Computes table column widths dynamically and wraps text across page bounds.
  3. Pipes document directly to HTTP response stream (`Content-Type: application/pdf`).

---

## Skill 3: Authentication & Role-Based Access Control

### Code Locations
- Client Auth View: `client/src/pages/Auth.jsx`
- Firebase OAuth: `client/src/utils/firebase.js`
- Server Controller: `server/controllers/auth.controller.js`
- Auth Middleware: `server/middleware/isAuth.js`
- Admin Middleware: `server/middleware/isAdmin.js`

### Protocol
- **Google OAuth**: Client signs in via Firebase Google Popup, sends profile credentials to `POST /api/auth/google`.
- **Email/Password**: Passwords salted and hashed via `bcryptjs` (cost factor 10).
- **Session Token**: `jsonwebtoken` issues JWT signed with `JWT_SECRET`, stored in `token` HTTP-only cookie with same-site security and 7-day expiration.
- **Route Protection**: `isAuth` validates token and attaches `req.userId`; `isAdmin` validates administrative privileges.

---

## Skill 4: Payment Processing & Webhook Verification

### Code Locations
- Client Checkout: `client/src/services/api.js` (`createRazorpayOrder`, `verifyPayment`)
- Server Controller: `server/controllers/payment.controller.js`
- Routes: `server/routes/payment.route.js`
- Model: `server/models/payment.model.js`

### Protocol
1. Client requests order via `POST /api/payment/create-order` with target amount and plan.
2. Server uses official `razorpay` SDK instance to generate an Order ID.
3. Client opens Razorpay Checkout modal.
4. On payment completion, client submits payment response:
   - `razorpay_order_id`
   - `razorpay_payment_id`
   - `razorpay_signature`
5. Server generates HMAC SHA-256 hash using `RAZORPAY_KEY_SECRET` and verifies cryptographic equality.
6. Upon valid signature, credits are immediately added to the user's account balance.

---

## Skill 5: Interactive Visualizations (Mermaid & Recharts)

### Code Locations
- Diagram Renderer: `client/src/components/MermaidSetup.jsx`
- Analytics Visuals: `client/src/components/RechartSetUp.jsx`
- Markdown Notes: `client/src/components/FinalResult.jsx`

### Protocol
- **Mermaid Flowcharts**: Takes raw Mermaid code strings from AI notes (`graph TD ...`), renders dynamic SVG with pan/zoom capability, handles syntax errors gracefully with fallback code block.
- **Recharts Analytics**: Visualizes exam topic weightage and difficulty breakdown via responsive SVG Radar and Bar charts.
- **Markdown & Tables**: Renders rich text with GFM tables, syntax-highlighted code blocks, and copy-to-clipboard functionality.

---

## Skill 6: Administrative Operations & Content Moderation

### Code Locations
- Admin Page: `client/src/pages/Admin.jsx`
- Admin Sub-Tabs: `client/src/components/admin/`
- Admin Controller: `server/controllers/admin.controller.js`
- Admin Routes: `server/routes/admin.route.js`

### Capabilities
- **Overview Metrics**: Total users, total notes generated, active subscriptions, revenue aggregates.
- **User Management**: Search users, toggle roles, view credit history, adjust credits manually.
- **Content Moderation**: Flagged topic detection, offensive keyword filtering, notes review.
- **System Settings**: Global LLM temperature, free credit allocations, maintenance mode toggles.
