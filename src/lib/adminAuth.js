import crypto from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "shishir_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encodeEmail(email) {
  return Buffer.from(email).toString("base64url");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && getSecret());
}

export function isAdminSessionValueValid(value) {
  if (!value || !isAdminConfigured()) return false;

  const [encodedEmail, timestamp, signature] = value.split(".");
  if (!encodedEmail || !timestamp || !signature || Date.now() - Number(timestamp) > 8 * 60 * 60 * 1000) {
    return false;
  }

  const email = Buffer.from(encodedEmail, "base64url").toString();
  const expected = sign(`${encodedEmail}.${timestamp}`);
  if (email !== process.env.ADMIN_EMAIL.trim().toLowerCase() || signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdminRequest() {
  const cookieStore = await cookies();
  return isAdminSessionValueValid(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export function createAdminSessionValue() {
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const encodedEmail = encodeEmail(email);
  const timestamp = Date.now().toString();
  return `${encodedEmail}.${timestamp}.${sign(`${encodedEmail}.${timestamp}`)}`;
}

export function adminCredentialsMatch(email, password) {
  return isAdminConfigured()
    && email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase()
    && password === process.env.ADMIN_PASSWORD;
}