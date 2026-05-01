const NEON_REST_URL = process.env.NEON_REST_URL || process.env.NEXT_PUBLIC_NEON_REST_URL;
const NEON_REST_API_KEY = process.env.NEON_REST_API_KEY;

export function neonRequiredUrl(): string {
  if (!NEON_REST_URL) throw new Error("Missing NEON_REST_URL / NEXT_PUBLIC_NEON_REST_URL");
  return NEON_REST_URL;
}

export function neonHeaders(preferRepresentation = false): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (preferRepresentation) {
    headers.Prefer = "return=representation";
  }

  if (NEON_REST_API_KEY) {
    headers.apikey = NEON_REST_API_KEY;
    headers.Authorization = `Bearer ${NEON_REST_API_KEY}`;
  }

  return headers;
}
