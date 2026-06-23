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
- Shopper-facing color fields must use plain language such as "olive", "charcoal", or "cream"; raw hex values are only internal metadata for swatches and AI context.
- Clothing type is a custom free text field, not a fixed dropdown, because users may upload sarees, kurtis, dupattas, gowns, blouse pieces, or other clothing items.
- Results must not be a dead end. After suggestions, the widget should offer Show More, Change Details, Start Over, and Main Menu actions.
- The "Suggest Products" flow is a paged multi-step wizard, not one long scrolling form: Step 1 product type, Step 2 clothing photo, Step 3 style details, then a dedicated results screen. One step renders at a time with a progress bar (`.chatbot-stepper`) and a fixed Back/Next footer (`.chatbot-footer`); the final input step's primary button is "Show Matches". The step model lives in `SUGGEST_STEPS`/`step` state in `ChatbotWidget.jsx`. Keep per-step gating (product type before photo, photo before details) and keep the results screen's continuation controls.

## Recommendation Logic
- The product type button first narrows the catalog to one supported product group: plain blouse, kalamkari blouse, or shapewear.
- The backend sends Atomesus a compact candidate list with product ID, name, category, subcategory, color, price, fabric, and work.
- The uploaded clothing photo is not sent to Atomesus as image/vision input. The frontend extracts approximate color swatches locally and sends color names/hex hints as text metadata.
- Atomesus can only rank IDs from the supplied candidate list. If it returns invalid, duplicate, or too few IDs, deterministic catalog fallback fills the list.
- "Show More" sends already-shown product IDs back to the backend so the next request excludes them where fresh catalog matches exist.

## Known Gotchas
- The user pasted an Atomesus key in chat during planning. Treat that key as compromised and rotate it before production use.
- Atomesus public docs currently document text chat completions, not image vision/generation. The widget therefore asks the user to confirm color/style attributes extracted locally from the uploaded image.
- Local image color extraction is approximate. The swatches can use exact CSS colors, but the editable form should describe them in human-friendly terms.
- The backend caps AI catalog candidates to 30 products so prompts stay compact.
- The suggestion endpoint returns deterministic fallback products if Atomesus is unavailable or returns invalid IDs.
- "Show More" can run out of fresh matches if the selected product type has a small catalog. In that case the widget should say no more fresh matches and offer changing details or starting over.

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
