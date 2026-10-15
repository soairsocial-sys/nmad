import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '../server/app';

/**
 * Normalizes request URL in Vercel Serverless environment.
 * Handles cases where Vercel rewrites incoming API requests to /api/index.ts or strips /api prefixes.
 */
export function normalizeRequestUrl(req: IncomingMessage): void {
  const forwardedUri = (req.headers['x-forwarded-uri'] || req.headers['x-original-url']) as string | undefined;
  const matchedPath = (req.headers['x-matched-path'] || req.headers['x-invoke-path']) as string | undefined;
  const incoming = req as IncomingMessage & { query?: Record<string, any> };

  const rawUrl = req.url || '/';
  const isFunctionFileTarget =
    rawUrl.startsWith('/api/index') ||
    rawUrl.startsWith('/api/[...path]') ||
    rawUrl === '/api' ||
    rawUrl === '/api/' ||
    rawUrl === '/' ||
    rawUrl.startsWith('/?');

  if (isFunctionFileTarget) {
    if (forwardedUri && forwardedUri.startsWith('/api')) {
      req.url = forwardedUri;
    } else if (matchedPath && matchedPath.startsWith('/api')) {
      const qIdx = rawUrl.indexOf('?');
      const queryStr = qIdx !== -1 ? rawUrl.slice(qIdx) : '';
      req.url = `${matchedPath}${queryStr}`;
    } else if (incoming.query?.path) {
      const subPath = Array.isArray(incoming.query.path) ? incoming.query.path.join('/') : incoming.query.path;
      const qIdx = rawUrl.indexOf('?');
      const queryStr = qIdx !== -1 ? rawUrl.slice(qIdx) : '';
      req.url = `/api/${subPath}${queryStr}`;
    } else if (forwardedUri) {
      req.url = forwardedUri.startsWith('/') ? `/api${forwardedUri}` : `/api/${forwardedUri}`;
    } else if (matchedPath) {
      req.url = matchedPath.startsWith('/') ? `/api${matchedPath}` : `/api/${matchedPath}`;
    }
  }

  // Ensure request URL preserves the leading /api prefix required by the Express routes
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  normalizeRequestUrl(req);
  return app(req as any, res as any);
}

export { app };

