## ISSUE-001: Concurrent Worktree Changes
**Status**: Open
**Severity**: Medium
**Discovered**: 2026-06-22
**Resolved**: N/A
**Symptom**: Multiple files are already modified by another agent while chatbot work is in progress.
**Root Cause**: A separate agent is fixing previously reported security/payment/lint issues in the same checkout.
**Workaround**: Check `git status --short` before editing and avoid unrelated dirty files.
**Fix**: Pending
**Regression Test**: Manual git status review before edits.

## ISSUE-002: Atomesus Key Was Exposed In Chat
**Status**: Open
**Severity**: High
**Discovered**: 2026-06-22
**Resolved**: N/A
**Symptom**: A live-looking Atomesus secret was pasted into the agent chat during planning.
**Root Cause**: Secret was shared outside environment/config management.
**Workaround**: Do not commit the key. Store only a rotated replacement in `ATOMESUS_API_KEY`.
**Fix**: Pending
**Regression Test**: Verify no Atomesus secret string appears in tracked files before commit.

## ISSUE-003: Backend Dependency Audit Is Red
**Status**: Open
**Severity**: High
**Discovered**: 2026-06-22
**Resolved**: N/A
**Symptom**: `npm audit --prefix BackEnd --omit=dev --audit-level=high` reports high-severity advisories in packages including `mongoose`, `multer`, `nodemailer`, `lodash`, `validator`, `path-to-regexp`, and related dependencies.
**Root Cause**: Backend dependency versions in the current lockfile include vulnerable transitive packages.
**Workaround**: Keep upload limits/auth guards active and avoid exposing unnecessary backend routes until dependencies are upgraded.
**Fix**: Pending
**Regression Test**: Rerun `npm audit --prefix BackEnd --omit=dev --audit-level=high` after dependency updates.

## ISSUE-004: Backend Dev Server Needs Local DB_URL
**Status**: Open
**Severity**: Medium
**Discovered**: 2026-06-22
**Resolved**: N/A
**Symptom**: `npm run start --prefix BackEnd` exits with `DB_URL is missing from the environment`.
**Root Cause**: There is no local `BackEnd/.env` in the checkout.
**Workaround**: Set `DB_URL`, `JWT_SECRET`, and `ATOMESUS_API_KEY` locally before testing DB-backed chatbot endpoints.
**Fix**: Pending
**Regression Test**: Start backend and verify `GET /health` returns 200.
