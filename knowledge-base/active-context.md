## Current Status
**Last Updated**: 2026-06-22
**Last Agent Session**: Changed the chatbot clothing type control from a fixed dropdown to a custom free text field, after fixing color autofill to show plain color names.
**Test Suite Status**: Verification pending after the clothing-type custom field fix.

## In Progress
- [ ] Rotate the exposed Atomesus API key outside the repo and set the replacement as `ATOMESUS_API_KEY`.
- [ ] Add local `DB_URL`/`JWT_SECRET`/`ATOMESUS_API_KEY` before DB-backed chatbot smoke testing.

## Blocked On
- Production Atomesus key rotation is manual and must happen outside the codebase.
- Backend local server cannot start until `DB_URL` is configured.

## Decisions Needed
- Whether/when to implement real AI Try-On after Atomesus publishes image generation/editing API docs.

## Next Steps (for the next agent session)
1. Confirm `ATOMESUS_API_KEY` is configured in local/prod environment.
2. Perform a browser/API smoke test of `/v1/chatbot/suggestions` with a logged-in user and real catalog data.
3. Keep AI Try-On disabled until Atomesus image API support is documented.
4. Review backend production dependency audit findings before deployment hardening.

## Do Not Touch
- Do not reintroduce Gemini/OpenAI providers for chatbot work unless the user explicitly changes the provider decision.
