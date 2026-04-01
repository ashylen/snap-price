# Agent Base Context

Goal: detect shop overcharge. Flow: scan shelf labels while shopping -> OCR product+price -> store in in-memory shopping list -> scan final receipt -> OCR receipt lines -> compare vs shelf list -> flag mismatch/overcharge.

Stack: Expo Router + React Native + TypeScript + React Query + React Native Paper + Gemini OCR/extraction.

Run: `npm run start` | `npm run android` | `npm run ios` | `npm run web`
Check: `npm run ts:check` | `npm run lint` | `npm run test`

Key files: `app/index.tsx` (shopping flow), `app/receipt.tsx` (receipt flow), `app/context/appContext.tsx` (global state), `app/queries/gemini.ts` (AI calls), `app/utils/camera.ts` (camera helper).

Env: requires `EXPO_PUBLIC_GOOGLE_API_AI_KEY` (never hardcode secrets).

Agent rules: keep diffs small; follow existing patterns; do not refactor unrelated code; after edits run typecheck + focused tests.
