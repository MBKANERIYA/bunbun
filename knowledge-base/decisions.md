## Decision: React and Express Monorepo
**Date**: 2026-06-22
**Status**: Accepted
**Context**: Bunbun runs a Vite React storefront with an Express/MongoDB API and Vercel serverless routing.
**Decision**: Keep frontend code under `FrontEnd/`, backend code under `BackEnd/`, and Vercel API entry points under `api/`.
**Alternatives Considered**: A separate frontend/backend deployment could reduce coupling, but the current Vercel setup already routes `/v1/*` to the backend and expects root dependencies for serverless packaging.
**Consequences**: Backend dependencies used by serverless routes must also exist in root `package.json`.
**Superseded By**: None

## Decision: Atomesus-Only Chatbot AI
**Date**: 2026-06-22
**Status**: Accepted
**Context**: The chatbot needs shop-assistant product suggestions and the user provided an Atomesus API key/source.
**Decision**: Use Atomesus as the only AI provider for chatbot text reasoning. Do not use Gemini, OpenAI, or any fallback provider.
**Alternatives Considered**: Gemini was considered for image understanding and try-on generation, but the user selected Atomesus only.
**Consequences**: Product suggestions can be AI-reasoned from text attributes and catalog data. True generated AI Try-On remains disabled until Atomesus documents image generation/editing APIs.
**Superseded By**: None

## Decision: Chatbot Session Privacy
**Date**: 2026-06-22
**Status**: Accepted
**Context**: The chatbot accepts clothing uploads for styling context, but the user does not want chat history or uploaded user photos stored.
**Decision**: Keep chatbot conversation state only in the frontend session and delete temporary upload files after each request.
**Alternatives Considered**: Persisting chat transcripts or photo history would support later review, but conflicts with the requested privacy posture.
**Consequences**: Users lose chatbot conversation state after the browser session ends. Saved AI Try-On history is not implemented until image generation exists.
**Superseded By**: None

## Decision: Testing Conventions for Chatbot
**Date**: 2026-06-22
**Status**: Accepted
**Context**: The project did not have an automated backend test script before the chatbot work.
**Decision**: Add focused Node.js tests for backend chatbot services using the built-in `node:test` runner so no new backend test dependency is required.
**Alternatives Considered**: Jest or Vitest would provide richer helpers, but would add dependency and configuration churn for a narrow service test surface.
**Consequences**: Backend chatbot service tests can run with `node --test` and stay dependency-light.
**Superseded By**: None
