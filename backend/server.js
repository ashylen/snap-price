const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

const PORT = Number(process.env.PORT || 8080);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_API_AI_KEY;
const RATE_LIMIT_PER_MINUTE = Number(process.env.OCR_RATE_LIMIT_PER_MINUTE || 30);

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY env variable");
}

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!admin.apps.length) {
  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson);
    admin.initializeApp({ credential: admin.credential.cert(parsed) });
  } else {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
  }
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: "8mb" }));

const userBuckets = new Map();

const getUserBucket = (uid) => {
  const now = Date.now();
  const minuteWindow = 60_000;
  const bucket = userBuckets.get(uid);

  if (!bucket || now - bucket.startedAt >= minuteWindow) {
    const fresh = { startedAt: now, count: 0 };
    userBuckets.set(uid, fresh);
    return fresh;
  }

  return bucket;
};

const parseGeminiProducts = (responseText) => {
  if (!responseText || responseText.trim() === "null") {
    throw new Error("No products found");
  }

  const parsed = JSON.parse(responseText);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.products)) return parsed.products;

  throw new Error("Invalid Gemini response format");
};

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing bearer token" });
    }

    const idToken = authHeader.slice("Bearer ".length).trim();
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid };

    const bucket = getUserBucket(decoded.uid);
    if (bucket.count >= RATE_LIMIT_PER_MINUTE) {
      return res.status(429).json({ message: "Rate limit exceeded. Try again in a minute." });
    }

    bucket.count += 1;
    next();
  } catch (error) {
    console.error("Token verification error", error);
    return res.status(401).json({ message: "Invalid auth token" });
  }
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/ocr/extract", verifyFirebaseToken, async (req, res) => {
  try {
    const { prompt, image } = req.body || {};

    if (!prompt || !image?.data || !image?.mimeType) {
      return res
        .status(400)
        .json({ message: "Invalid payload. Expected prompt + image{mimeType,data}" });
    }

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: image.mimeType, data: image.data } }
    ]);

    const response = await result.response;
    const text = await response.text();
    const products = parseGeminiProducts(text);

    return res.json({ products });
  } catch (error) {
    console.error("OCR extract error", error);
    return res.status(500).json({ message: "OCR processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`OCR backend listening on http://localhost:${PORT}`);
});
