import crypto from "crypto";

const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function createQrToken() {
  const secret = process.env.QR_SECRET;
  if (!secret) {
    throw new Error("Missing QR_SECRET env var");
  }

  const ts = Date.now().toString();
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${ts}.${nonce}`;
  const sig = base64url(
    crypto.createHmac("sha256", secret).update(payload).digest()
  );
  return `${payload}.${sig}`;
}

export function verifyQrToken(token) {
  const secret = process.env.QR_SECRET;
  if (!secret) return { ok: false, reason: "missing_secret" };
  if (!token) return { ok: false, reason: "missing_token" };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "bad_format" };

  const [ts, nonce, sig] = parts;
  const payload = `${ts}.${nonce}`;
  const expectedSig = base64url(
    crypto.createHmac("sha256", secret).update(payload).digest()
  );

  if (!timingSafeEqual(sig, expectedSig)) {
    return { ok: false, reason: "bad_sig" };
  }

  const ttlMs = Number(process.env.QR_TOKEN_TTL_MS || DEFAULT_TTL_MS);
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false, reason: "bad_ts" };
  if (Date.now() - tsNum > ttlMs) return { ok: false, reason: "expired" };

  return { ok: true };
}
