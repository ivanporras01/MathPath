// Backward-compatible entry point for the full MathHub Sites checks.
process.argv.push('--sites');
await import('./verify-cloudflare.mjs');
