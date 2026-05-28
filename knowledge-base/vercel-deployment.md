# Vercel Deployment Architecture

This project is deployed as a single Vercel project utilizing **Vercel Serverless Functions**.

## How it works

1. **Frontend:** The frontend is a standard Vite React application (`/FrontEnd`). Vercel's zero-config system automatically detects Vite and builds the application.
2. **Backend / API:** The Express backend (`/BackEnd`) is connected to Vercel via Serverless Functions.
   - Vercel automatically exposes any javascript file inside the `/api` directory as an endpoint.
   - We have `/api/v1/[...path].js` which catches all requests to `/api/v1/*` and forwards them to our Express `app` instance.
   - A `vercel.json` file dictates that standard requests to `/v1/*` are rewritten to `/api/v1/*` behind the scenes, ensuring the React app seamlessly interacts with the backend endpoints.

## Important Gotcha: Dependencies
For Vercel to successfully compile the serverless functions in the `/api` folder, it must trace all `require()` statements (such as `express`, `mongoose`, etc.). Because our application is structured like a monorepo, Vercel looks for a `package.json` at the root directory to find these dependencies. 
**Rule:** The root `package.json` must always contain the production dependencies needed by the backend.

## Environment Variables
Environment variables (`DB_URL`, `JWT_SECRET`, etc.) are only loaded from the local `.env` file during development (`npm start`). **In production, they are not committed to Git**. You MUST enter them manually via the Vercel Dashboard (Settings > Environment Variables) for the API to connect to MongoDB and Cloudinary.
