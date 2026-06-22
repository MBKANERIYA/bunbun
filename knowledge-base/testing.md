# Testing

## Test Frameworks in Use
- Backend chatbot service tests use Node.js built-in `node:test`.
- Frontend currently has ESLint and Vite build scripts, but no component test framework.

## How to Run Tests
| Command | What it runs |
|---|---|
| `npm test --prefix BackEnd` | Backend service tests once the chatbot test script exists |
| `npm run lint --prefix FrontEnd` | Frontend ESLint |
| `npm run build --prefix FrontEnd` | Frontend production build |

## Test File Conventions
- Backend tests live next to the behavior they cover or under `BackEnd/tests/`.
- Test files use the `*.test.js` suffix.

## What Must Be Tested
- Chatbot recommendation parsing must reject fake product IDs and fall back safely.
- Chatbot product-type filtering must only return eligible catalog products.
- Atomesus failures must map to safe user-facing errors.

## Mocks, Fakes, and Fixtures
- Mock outbound Atomesus calls by injecting a fake HTTP client into the service.
- Do not call the live Atomesus API in automated tests.

## Known Flaky Tests
None — keep it that way.
