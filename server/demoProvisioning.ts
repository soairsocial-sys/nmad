import { prisma } from './db';
import { hashPassword } from './auth';

export const SHARED_DEMO_PASSWORD = 'AdGrid2026!';

export interface DemoAccountDefinition {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
  tenantId: string;
  tenantName: string;
  tenantType: string;
  authorizedDashboard: string;
  avatarUrl: string;
  city: string;
  country: string;
}

export const DEMO_ACCOUNTS: DemoAccountDefinition[] = [
  {
    id: 'usr-test-platform-admin',
    email: 'admin@adgrid.test',
    name: 'Platform Administrator',
    firstName: 'Admin',
    lastName: 'AdGrid',
    role: 'Platform Admin',
    title: 'Platform Chief Infrastructure Architect',
    tenantId: 'tenant-platform-afriooh',
    tenantName: 'ADGRID Governance & Trust Protocol',
    tenantType: 'AGENCY',
    authorizedDashboard: '/admin/platform',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    city: 'Johannesburg',
    country: 'South Africa',
  },
  {
    id: 'usr-test-agency-admin',
    email: 'agency@adgrid.test',
    name: 'Agency Managing Director',
    firstName: 'Agency',
    lastName: 'Admin',
    role: 'Agency Admin',
    title: 'Managing Director & Partner',
    tenantId: 'tenant-test-agency',
    tenantName: 'AdGrid Test Agency Alpha',
    tenantType: 'AGENCY',
    authorizedDashboard: '/admin/agency',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    id: 'usr-test-campaign-mgr',
    email: 'campaigns@adgrid.test',
    name: 'Campaign Pacing Lead',
    firstName: 'Campaign',
    lastName: 'Manager',
    role: 'Campaign Manager',
    title: 'Pan-African Traffic & Pacing Director',
    tenantId: 'tenant-test-agency',
    tenantName: 'AdGrid Test Agency Alpha',
    tenantType: 'AGENCY',
    authorizedDashboard: '/admin/agency',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    id: 'usr-test-ops-mgr',
    email: 'operations@adgrid.test',
    name: 'Regional Operations Lead',
    firstName: 'Operations',
    lastName: 'Manager',
    role: 'Operations Manager',
    title: 'Regional Logistics Hub Director',
    tenantId: 'tenant-test-agency',
    tenantName: 'AdGrid Test Agency Alpha',
    tenantType: 'AGENCY',
    authorizedDashboard: '/admin/agency',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    id: 'usr-test-client',
    email: 'client@adgrid.test',
    name: 'Enterprise Brand Executive',
    firstName: 'Brand',
    lastName: 'Client',
    role: 'Customer / Client Company',
    title: 'Head of Brand Experience & OOH Investments',
    tenantId: 'tenant-test-client',
    tenantName: 'AdGrid Test Advertiser Beta',
    tenantType: 'CLIENT',
    authorizedDashboard: '/admin/client',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'Nairobi',
    country: 'Kenya',
  },
  {
    id: 'usr-test-mediaowner',
    email: 'mediaowner@adgrid.test',
    name: 'Concessionaire Director',
    firstName: 'Media',
    lastName: 'Owner',
    role: 'Media Owner',
    title: 'Managing Director & Concessionaire',
    tenantId: 'tenant-media-owner-continental',
    tenantName: 'Continental Outdoor & Alliance Media Concession',
    tenantType: 'MEDIA_OWNER',
    authorizedDashboard: '/admin/media-owner',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    id: 'usr-test-vendor',
    email: 'vendor@adgrid.test',
    name: 'Print & Rigging Principal',
    firstName: 'Vendor',
    lastName: 'Contractor',
    role: 'Vendor',
    title: 'Tier-1 Technical Contractor & Print Principal',
    tenantId: 'tenant-vendor-arclight',
    tenantName: 'Arclight Fabrication & Grand-Format Printing Ltd',
    tenantType: 'VENDOR',
    authorizedDashboard: '/admin/vendor',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
  {
    id: 'usr-test-fieldagent',
    email: 'fieldagent@adgrid.test',
    name: 'Senior Field Operative',
    firstName: 'Field',
    lastName: 'Agent',
    role: 'Field Agent',
    title: 'Senior Field Operative & Drone Auditor',
    tenantId: 'tenant-field-lagos',
    tenantName: 'Lagos Rapid Audit Unit (Mobile OS)',
    tenantType: 'FIELD_UNIT',
    authorizedDashboard: '/admin/field-agent',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    city: 'Lagos',
    country: 'Nigeria',
  },
];

const DEMO_EMAILS_SET = new Set(DEMO_ACCOUNTS.map((a) => a.email.toLowerCase()));

/**
 * Server-side flag evaluation for DEMO_AUTH_ENABLED.
 * Disabled by default in real production unless DEMO_AUTH_ENABLED is explicitly 'true' or '1'.
 * Always enabled in local development or Vercel preview environments.
 */
export function isDemoAuthEnabled(): boolean {
  if (process.env.DEMO_AUTH_ENABLED !== undefined) {
    return process.env.DEMO_AUTH_ENABLED === 'true' || process.env.DEMO_AUTH_ENABLED === '1';
  }

  // Preview deployments or non-production runtimes default to enabled
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview') {
    return true;
  }

  // Real production defaults to disabled for security
  return false;
}

export function isDemoEmail(email: string): boolean {
  return DEMO_EMAILS_SET.has(email.trim().toLowerCase());
}

/**
 * Idempotently provisions the 8 demo accounts and their associated tenant organizations.
 * Safe to execute repeatedly without duplicating users or corrupting existing data.
 */
export async function ensureDemoAccountsProvisioned(): Promise<void> {
  const passwordHash = await hashPassword(SHARED_DEMO_PASSWORD);

  // 1. Ensure Tenants exist
  const tenantMap = new Map<string, { id: string; name: string; type: string; city: string; country: string }>();
  for (const acc of DEMO_ACCOUNTS) {
    if (!tenantMap.has(acc.tenantId)) {
      tenantMap.set(acc.tenantId, {
        id: acc.tenantId,
        name: acc.tenantName,
        type: acc.tenantType,
        city: acc.city,
        country: acc.country,
      });
    }
  }

  for (const tenantData of tenantMap.values()) {
    try {
      const existingTenant = await prisma.tenant.findUnique({ where: { id: tenantData.id } });
      if (!existingTenant) {
        await prisma.tenant.create({
          data: {
            id: tenantData.id,
            name: tenantData.name,
            type: tenantData.type,
            status: 'ACTIVE',
            city: tenantData.city,
            country: tenantData.country,
            setupCompleted: true,
          },
        });
      }
    } catch (err) {
      console.warn(`[Demo Provisioning] Tenant ${tenantData.id} creation check:`, err);
    }
  }

  // 2. Ensure each Demo User exists with valid credentials
  for (const acc of DEMO_ACCOUNTS) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: acc.email.toLowerCase() },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: acc.id,
            email: acc.email.toLowerCase(),
            name: acc.name,
            firstName: acc.firstName,
            lastName: acc.lastName,
            role: acc.role,
            title: acc.title,
            passwordHash,
            status: 'ACTIVE',
            tenantId: acc.tenantId,
            avatarUrl: acc.avatarUrl,
            emailVerifiedAt: new Date(),
            mfaEnabled: false,
          },
        });
      } else {
        // Ensure status is ACTIVE and tenant is linked
        if (existingUser.status !== 'ACTIVE' || !existingUser.tenantId) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              status: 'ACTIVE',
              tenantId: existingUser.tenantId || acc.tenantId,
              emailVerifiedAt: existingUser.emailVerifiedAt || new Date(),
            },
          });
        }
      }
    } catch (err) {
      console.warn(`[Demo Provisioning] User ${acc.email} check:`, err);
    }
  }
}

/**
 * Returns public demo configuration for the frontend UI.
 * Does NOT expose passwords, password hashes, or sensitive server credentials.
 */
export function getDemoConfigPayload() {
  const enabled = isDemoAuthEnabled();

  if (!enabled) {
    return {
      enabled: false,
      accounts: [],
      sharedPasswordHint: null,
    };
  }

  return {
    enabled: true,
    sharedPasswordHint: 'AdGrid2026!',
    accounts: DEMO_ACCOUNTS.map((acc) => ({
      email: acc.email,
      role: acc.role,
      label: acc.role === 'Customer / Client Company' ? 'Client' : acc.role,
      name: acc.name,
      organization: acc.tenantName,
      dashboard: acc.authorizedDashboard,
      avatarUrl: acc.avatarUrl,
    })),
  };
}
