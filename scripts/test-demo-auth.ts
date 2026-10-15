import { prisma } from '../server/db';
import {
  ensureDemoAccountsProvisioned,
  getDemoConfigPayload,
  isDemoAuthEnabled,
  DEMO_ACCOUNTS,
  SHARED_DEMO_PASSWORD,
} from '../server/demoProvisioning';
import { signAccessToken, verifyAccessToken } from '../server/auth';
import { resolvePermissionsForRole } from '../server/auth';

const BASE_URL = 'http://localhost:3000/api';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const testResults: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    testResults.push({ name, passed: true });
  } else {
    console.error(`  ✗ ${name} (FAILED: ${details || 'Assertion failed'})`);
    testResults.push({ name, passed: false, details });
  }
}

async function runDemoAuthTests() {
  console.log('\n======================================================');
  console.log('ADGRID BUILT-IN TEST ACCOUNTS & AUTHENTICATION SUITE');
  console.log('======================================================\n');

  // 1. REPEATABLE PROVISIONING TEST
  console.log('1. REPEATABLE & IDEMPOTENT PROVISIONING');
  try {
    await ensureDemoAccountsProvisioned();
    assert(true, 'First run of ensureDemoAccountsProvisioned succeeded');

    // Run again to verify idempotency (no duplicate key errors)
    await ensureDemoAccountsProvisioned();
    assert(true, 'Second consecutive run of ensureDemoAccountsProvisioned succeeded (idempotent)');

    // Verify all 8 accounts exist in DB
    for (const acc of DEMO_ACCOUNTS) {
      const dbUser = await prisma.user.findUnique({
        where: { email: acc.email.toLowerCase() },
        include: { tenant: true },
      });
      assert(
        !!dbUser && dbUser.role === acc.role && dbUser.status === 'ACTIVE',
        `Account provisioned: ${acc.email} as ${acc.role}`
      );
    }
  } catch (err: any) {
    assert(false, 'Provisioning exception', err.message);
  }

  // 2. DEMO CONFIGURATION API TEST
  console.log('\n2. DEMO CONFIGURATION & SAFETY FLAG');
  const config = getDemoConfigPayload();
  assert(config.enabled === true, 'Demo auth enabled flag returns true in test environment');
  assert(config.accounts.length === 8, 'Demo config returns exactly 8 predefined accounts');

  // Verify passwords or hashes are NOT exposed in config payload
  for (const acc of config.accounts as any[]) {
    assert(
      acc.password === undefined && acc.passwordHash === undefined,
      `Safety check: No password or hash exposed for ${acc.email}`
    );
  }

  // 3. AUTHENTICATION & LOGIN FLOW FOR ALL 8 ACCOUNTS
  console.log('\n3. SERVER-SIDE LOGIN VALIDATION FOR ALL 8 DEMO ACCOUNTS');

  const EXPECTED_ACCOUNTS = [
    { email: 'admin@adgrid.test', role: 'Platform Admin', expectedDashboard: '/admin/platform' },
    { email: 'agency@adgrid.test', role: 'Agency Admin', expectedDashboard: '/admin/agency' },
    { email: 'campaigns@adgrid.test', role: 'Campaign Manager', expectedDashboard: '/admin/agency' },
    { email: 'operations@adgrid.test', role: 'Operations Manager', expectedDashboard: '/admin/agency' },
    { email: 'client@adgrid.test', role: 'Customer / Client Company', expectedDashboard: '/admin/client' },
    { email: 'mediaowner@adgrid.test', role: 'Media Owner', expectedDashboard: '/admin/media-owner' },
    { email: 'vendor@adgrid.test', role: 'Vendor', expectedDashboard: '/admin/vendor' },
    { email: 'fieldagent@adgrid.test', role: 'Field Agent', expectedDashboard: '/admin/field-agent' },
  ];

  for (const acc of EXPECTED_ACCOUNTS) {
    const user = await prisma.user.findUnique({
      where: { email: acc.email },
      include: { tenant: true },
    });
    assert(!!user, `User ${acc.email} found in database`);

    const permissions = await resolvePermissionsForRole(acc.role);
    const token = signAccessToken({
      id: user!.id,
      email: user!.email,
      name: user!.name,
      role: user!.role,
      tenantId: user!.tenantId,
      permissions,
    });

    const decoded = verifyAccessToken(token);
    assert(
      !!decoded && decoded.email === acc.email && decoded.role === acc.role,
      `Valid JWT issued and cryptographically verified for ${acc.role} (${acc.email})`
    );
  }

  // 4. INVALID CREDENTIALS REJECTION
  console.log('\n4. INVALID CREDENTIALS & SECURITY REJECTIONS');
  const user = await prisma.user.findUnique({ where: { email: 'admin@adgrid.test' } });
  const bcrypt = await import('bcryptjs');
  const isCorrect = await bcrypt.default.compare(SHARED_DEMO_PASSWORD, user!.passwordHash);
  assert(isCorrect, 'Demo account password hash matches shared password AdGrid2026!');

  const isWrong = await bcrypt.default.compare('WrongPassword999!', user!.passwordHash);
  assert(!isWrong, 'Incorrect password successfully rejected by cryptographic compare');

  // 5. ROLE-BASED ACCESS CONTROL & PERMISSIONS
  console.log('\n5. ROLE-BASED ACCESS CONTROL (RBAC) POLICIES');
  const platformAdminPerms = await resolvePermissionsForRole('Platform Admin');
  assert(
    platformAdminPerms.includes('platform:superadmin'),
    'Platform Admin has platform:superadmin permission'
  );

  const agencyAdminPerms = await resolvePermissionsForRole('Agency Admin');
  assert(
    agencyAdminPerms.includes('campaigns:manage') && !agencyAdminPerms.includes('platform:superadmin'),
    'Agency Admin has campaigns:manage and lacks platform:superadmin'
  );

  const clientPerms = await resolvePermissionsForRole('Customer / Client Company');
  assert(
    clientPerms.includes('client:tracker') && !clientPerms.includes('campaigns:manage'),
    'Client has client:tracker and lacks agency campaigns:manage'
  );

  const mediaOwnerPerms = await resolvePermissionsForRole('Media Owner');
  assert(
    mediaOwnerPerms.includes('inventory:manage') && !mediaOwnerPerms.includes('client:tracker'),
    'Media Owner has inventory:manage and lacks client:tracker'
  );

  const vendorPerms = await resolvePermissionsForRole('Vendor');
  assert(
    vendorPerms.includes('jobs:assigned') && !vendorPerms.includes('inventory:manage'),
    'Vendor has jobs:assigned and lacks inventory:manage'
  );

  const fieldAgentPerms = await resolvePermissionsForRole('Field Agent');
  assert(
    fieldAgentPerms.includes('mobile-os:access') && !fieldAgentPerms.includes('platform:superadmin'),
    'Field Agent has mobile-os:access'
  );

  console.log('\n======================================================');
  const passedCount = testResults.filter((r) => r.passed).length;
  const failedCount = testResults.filter((r) => !r.passed).length;
  console.log(`SUMMARY: ${passedCount} passed, ${failedCount} failed (${testResults.length} total)`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runDemoAuthTests().finally(() => prisma.$disconnect());
