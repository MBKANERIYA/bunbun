# Bunbun Clothing

E-commerce platform for women's clothing, specifically sarees and related apparel.

## Tech Stack
- **Frontend:** React, Vite, Redux, React Router, TailwindCSS/Bootstrap
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Hosting:** Vercel (Frontend + Serverless API functions)
- **Media Storage:** Cloudinary

## Directory Structure
- `/FrontEnd`: React application
- `/BackEnd`: Express.js server logic
- `/api`: Vercel serverless function entry points
- `/knowledge-base`: Project documentation

## Reading Order
| File | Description |
|---|---|
| `README.md` | Core project overview and tech stack (this file) |
| `active-context.md` | Current session status, blockers, and next steps |
| `decisions.md` | Architecture and product decisions that should not be undone casually |
| `known-issues.md` | Current bugs, risks, and accepted workarounds |
| `testing.md` | Test commands and conventions |
| `architecture.md` | System shape and integration boundaries |
| `chatbot.md` | Customer chatbot, Atomesus integration, privacy rules, and tests |
| `changelog.md` | History of changes |
| `vercel-deployment.md` | Details on Vercel configuration and API |

## Critical Rules
- **Environment Variables:** Must be set in `.env` locally (inside BackEnd folder) and configured manually in the Vercel Dashboard for production.
- **Monorepo Setup:** Vercel treats this as a monorepo. Dependencies for the backend must exist in the root `package.json` so Vercel can compile the `/api` serverless functions.
- **API Routing:** All `/v1/*` requests are handled by the Vercel adapter in `/api/index.js`, which forwards into `BackEnd/App.js`.

## Quick Facts
| Category | Detail |
|---|---|
| Domain | E-commerce (Clothing/Sarees) |
| Database | MongoDB Atlas |
| Frontend Port | 5173 (Vite default) |
| Backend Port | 4000 |
