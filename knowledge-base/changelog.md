# Changelog

## 2026-05-28 — Fix Vercel Serverless Deployment
**What**: Configured Vercel deployment correctly to serve backend API and added root package.json
**Why**: The data was not fetching on the live Vercel website because serverless functions were failing to build and environment variables were missing.
**Files Changed**: `vercel.json`, `api/v1/[...path].js`, `api/images/[...path].js`, `package.json`
- Reverted to Vercel's zero-config deployment by simplifying `vercel.json`
- Created a root `package.json` with the necessary backend dependencies so Vercel can compile the `api/` serverless functions.
- Added `build` and `postinstall` scripts to the root `package.json` so Vercel natively builds the frontend.
- Updated `req.url` manipulation inside serverless functions to ensure Express routing resolves `/v1/...` and `/images/...` paths correctly.
- Created `knowledge-base` folder according to standard procedure.
- Updated \ercel.json\ SPA fallback rewrite to explicitly exclude \/api/\, \/v1/\, and \/images/\ routes using regex \((?!api/|v1/|images/).*)\, preventing the React index.html from shadowing the backend serverless functions.
