# Chatbot

## What This Subsystem Does
The chatbot is a customer-facing shop assistant mounted on non-admin pages. It greets the shopper, requires login for uploads, collects outfit context, and returns product suggestions from the live catalog. AI Try-On is deliberately shown as unavailable until Atomesus documents an image generation/editing API.

## How It Is Structured
- Frontend widget: `FrontEnd/src/Component/ChatbotWidget.jsx`
- Frontend API helper: `FrontEnd/src/utils/chatbotApi.js`
- Frontend styles: `FrontEnd/src/Style/ChatbotWidget.css`
- Backend route: `BackEnd/Routes/Chatbot.Route.js`, mounted at `/v1/chatbot`
- Backend controller: `BackEnd/Controllers/Chatbot.Controller.js`
- AI wrapper: `BackEnd/Services/Atomesus.Services.js`
- Recommendation rules and response validation: `BackEnd/Services/StylistRecommendation.Services.js`
- Upload middleware: `BackEnd/Middleware/chatbotUpload.js`

## Conventions and Rules
- Use Atomesus only for AI text reasoning. Do not add Gemini/OpenAI fallback providers.
- Store the API key only in environment variable `ATOMESUS_API_KEY`.
- Optional env defaults are `ATOMESUS_BASE_URL=https://api.atomesus.com`, `ATOMESUS_MODEL=cipher`, and `ATOMESUS_TIMEOUT_MS=20000`.
- Do not persist chatbot transcripts.
- Do not persist raw clothing uploads. Uploaded files go to the OS temp directory and are deleted in the controller `finally` block.
- The AI may only rank products supplied by the backend candidate list. Backend validation discards fake or duplicate product IDs.
- AI Try-On remains disabled unless `AI_TRY_ON_ENABLED=true` and a documented Atomesus image generation API exists.

## Known Gotchas
- The user pasted an Atomesus key in chat during planning. Treat that key as compromised and rotate it before production use.
- Atomesus public docs currently document text chat completions, not image vision/generation. The widget therefore asks the user to confirm color/style attributes extracted locally from the uploaded image.
- The backend caps AI catalog candidates to 30 products so prompts stay compact.
- The suggestion endpoint returns deterministic fallback products if Atomesus is unavailable or returns invalid IDs.

## How It Is Tested
- Run backend tests with `npm test --prefix BackEnd`.
- `BackEnd/tests/atomesusService.test.js` verifies Atomesus request construction and safe error mapping with a mocked fetch.
- `BackEnd/tests/stylistRecommendation.test.js` verifies product type filtering, ID validation, and fallback top-5 fill.
- Frontend is verified through `npm run lint --prefix FrontEnd` and `npm run build --prefix FrontEnd`.

## Related KB Files
- `architecture.md`
- `decisions.md`
- `testing.md`
- `known-issues.md`
