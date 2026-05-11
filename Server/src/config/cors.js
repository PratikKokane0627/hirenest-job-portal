const fallbackOrigins = [
  "http://localhost:5173",
  "http://localhost:6027",
  "https://hirenestjobs.vercel.app",
  "https://stjobs.vercel.app"
];

function listFromEnv(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAllowedOrigins() {
  return Array.from(new Set([
    ...fallbackOrigins,
    ...listFromEnv(process.env.CLIENT_URL),
    ...listFromEnv(process.env.CLIENT_URLS)
  ]));
}

export function corsOrigin(origin, callback) {
  if (!origin || getAllowedOrigins().includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked origin: ${origin}`));
}
