import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// Ensure SQLite database file is accessible and writable in serverless environments like Vercel
function setupDatabaseUrl(): void {
  // If an external database URL is provided (e.g. Postgres, Neon, Supabase), use it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return;
  }

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = '/tmp/dev.db';
    let needsCopy = true;

    if (fs.existsSync(tmpDbPath)) {
      try {
        const stat = fs.statSync(tmpDbPath);
        if (stat.size > 0) {
          needsCopy = false;
        }
      } catch {
        needsCopy = true;
      }
    }

    if (needsCopy) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
        path.join('/var/task', 'prisma', 'dev.db'),
        path.join('/var/task', 'dev.db'),
        path.resolve(__dirname, '../../prisma/dev.db'),
        path.resolve(__dirname, '../../../prisma/dev.db'),
      ];

      let copied = false;
      for (const src of candidates) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath);
            fs.chmodSync(tmpDbPath, 0o666);
            copied = true;
            break;
          } catch (err) {
            console.warn('[Prisma] Failed to copy SQLite db to /tmp:', err);
          }
        }
      }

      if (!copied && !fs.existsSync(tmpDbPath)) {
        console.warn('[Prisma] SQLite dev.db not found in candidates; initializing empty DB file at', tmpDbPath);
        try {
          fs.writeFileSync(tmpDbPath, '');
          fs.chmodSync(tmpDbPath, 0o666);
        } catch (e) {
          console.error('[Prisma] Failed to initialize fallback db at /tmp/dev.db:', e);
        }
      }
    } else {
      // Ensure writable permissions on warm lambda re-invocations
      try {
        fs.chmodSync(tmpDbPath, 0o666);
      } catch {}
    }

    process.env.DATABASE_URL = `file:${tmpDbPath}`;
    return;
  }

  // Local / standard Node runtime default
  if (!process.env.DATABASE_URL) {
    const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    process.env.DATABASE_URL = `file:${localDbPath}`;
  }
}

setupDatabaseUrl();

export const prisma: PrismaClient =
  globalThis.prismaGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Retain global client on Vercel to preserve connection reuse during warm lambda calls
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
  globalThis.prismaGlobal = prisma;
}

export default prisma;

