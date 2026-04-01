# PRD: Authenticated OCR Backend Proxy

## Status
Implemented (MVP)

## Context / Problem
Current app used Gemini directly from mobile client, exposing API key risk and unlimited abuse surface.

## Product Goal
Protect OCR/Gemini usage behind authenticated backend requests so:
- app users are authenticated
- backend controls Gemini key
- per-user limits can be enforced

## Scope (This Change)
- Firebase Auth session in app (anonymous sign-in)
- App sends Firebase ID token to backend OCR endpoint
- Backend verifies token using Firebase Admin
- Backend calls Gemini and returns normalized OCR extraction payload
- Per-user in-memory rate limit (requests/minute)
- Client keeps optional insecure fallback for development only

## Out of Scope (Now)
- Persistent quota storage (Redis/DB)
- Billing plan/paywall
- Advanced abuse detection/device fingerprinting
- Multi-region backend deployment

## Functional Requirements
1. App must not require raw Gemini API key for normal flow.
2. OCR request must include Authorization: Bearer <firebase-id-token>.
3. Backend must reject missing/invalid tokens with 401.
4. Backend must rate-limit per user and return 429 on excess.
5. Backend must return extracted products as JSON array-like payload.
6. Client must show backend message when provided.

## API Contract
Endpoint: POST /ocr/extract
Headers:
- Content-Type: application/json
- Authorization: Bearer <firebase-id-token>

Request body:
{
  "prompt": "...",
  "image": {
    "mimeType": "image/jpeg",
    "data": "<base64>"
  }
}

Success 200:
{
  "products": [
    { "label": "Milk", "price": 4.99, "quantity": 1 }
  ]
}

Error examples:
- 400 invalid payload
- 401 invalid/missing token
- 429 rate limit exceeded
- 500 OCR processing failed

## Environment Variables
Client (Expo):
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID
- EXPO_PUBLIC_API_BASE_URL
- EXPO_PUBLIC_ENABLE_INSECURE_CLIENT_GEMINI (optional, dev only)

Backend:
- GEMINI_API_KEY
- GEMINI_MODEL (default gemini-1.5-flash)
- OCR_RATE_LIMIT_PER_MINUTE (default 30)
- FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS

## Security Notes
- Gemini key now intended for backend only.
- Insecure client Gemini fallback must remain disabled in production.
- In-memory rate limit resets on backend restart; use Redis/DB for production.

## Implemented Artifacts
- app/context/authContext.tsx
- app/lib/firebase.ts
- app/_layout.tsx
- app/queries/gemini.ts
- backend/server.js
- package.json (backend:start)
- .env.example

## Acceptance Criteria
- Auth session is created on app start.
- OCR requests succeed only with valid Firebase token.
- Requests above per-user threshold return 429.
- Client receives structured products on success.
- TypeScript check passes.

## Next Iteration
1. Replace in-memory rate limit with Redis.
2. Add per-user daily quota persisted in DB.
3. Add authenticated user model (email/password or social).
4. Add usage analytics + alerting.
5. Remove insecure fallback from production build.
