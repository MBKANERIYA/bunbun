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
| `changelog.md` | History of changes |
| `vercel-deployment.md` | Details on Vercel configuration and API |

## Critical Rules
- **Environment Variables:** Must be set in `.env` locally (inside BackEnd folder) and configured manually in the Vercel Dashboard for production.
- **Monorepo Setup:** Vercel treats this as a monorepo. Dependencies for the backend must exist in the root `package.json` so Vercel can compile the `/api` serverless functions.
- **API Routing:** All `/v1/*` requests are intercepted by Vercel and sent to the serverless function `/api/v1/[...path].js`.

## Quick Facts
| Category | Detail |
|---|---|
| Domain | E-commerce (Clothing/Sarees) |
| Database | MongoDB Atlas |
| Frontend Port | 5173 (Vite default) |
| Backend Port | 4000 |
