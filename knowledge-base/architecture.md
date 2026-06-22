# Architecture

## System Overview
Bunbun Clothing is a React/Vite storefront backed by an Express API and MongoDB/Mongoose models. Vercel serves the frontend and routes `/v1/*` API calls to backend serverless handlers.

## Architecture Diagram
```text
Customer Browser
  -> Vite React storefront in FrontEnd/
  -> /v1/* API requests
  -> Vercel api/v1/[...path].js
  -> BackEnd/App.js + BackEnd/Routes/
  -> Mongoose models
  -> MongoDB Atlas
  -> Cloudinary for product media
```

## Layers & Responsibilities
| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React, Vite, React Router | Storefront, cart/wishlist UI, checkout, chatbot widget |
| Backend/API | Express | REST endpoints under `/v1` |
| Database | MongoDB, Mongoose | Product, user, order, cart, wishlist, address, blog data |
| Auth | JWT + Firebase phone login | Login and API authorization |
| Storage | Cloudinary | Product and blog images |
| Hosting | Vercel | Frontend hosting and serverless API routing |
| Testing | Node test, ESLint, Vite build | Service tests and build/lint gates |

## Data Flow
Product catalog data is stored in MongoDB and served through `/v1/product/*` endpoints. Frontend calls API URLs through `FrontEnd/src/utils/apiConfig.js`, which also attaches the `auth` bearer token from local storage.

## Key Design Patterns
- REST API grouped by route modules in `BackEnd/Routes/`.
- Mongoose models are reused through `mongoose.models` to avoid hot-reload/serverless model overwrite errors.
- Frontend routes are lazy-loaded through React Router in `FrontEnd/src/App.jsx`.

## External Dependencies
- MongoDB Atlas: required for catalog, users, orders, and related state.
- Cloudinary: required for product/blog image storage.
- Firebase Auth: required for phone OTP login.
- Razorpay: required for online checkout payment.
- Atomesus: selected AI text-reasoning provider for the chatbot.

## Scalability & Limits
The current app is a compact monorepo. Serverless packaging depends on root dependencies matching backend runtime needs. Chatbot catalog prompts must keep candidate lists compact to avoid oversized AI requests.

## What NOT to Do
- Do not add backend-only dependencies only to `BackEnd/package.json` if Vercel serverless functions need them; add them to root as well.
- Do not persist chatbot uploaded clothing photos or full chat transcripts.
- Do not fake AI Try-On without a documented image generation/editing API from Atomesus.
