import http from 'node:http';
import app from '../server/app';
import { SHARED_DEMO_PASSWORD } from '../server/demoProvisioning';
import { prisma } from '../server/db';

async function runHttpAuthTest() {
  console.log('\n======================================================');
  console.log('ADGRID END-TO-END HTTP INTEGRATION TEST');
  console.log('======================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  try {
    // 1. GET /api/auth/demo-config
    console.log('1. Testing GET /api/auth/demo-config...');
    const configRes = await fetch(`${baseUrl}/auth/demo-config`);
    const configData = await configRes.json();
    if (configRes.status !== 200 || !configData.enabled || configData.accounts.length !== 8) {
      throw new Error(`Demo config endpoint failed: ${JSON.stringify(configData)}`);
    }
    console.log(`  ✓ Demo config returned 200 with 8 accounts (enabled: ${configData.enabled})`);

    // 2. POST /api/auth/login for all 8 accounts
    console.log('\n2. Testing POST /api/auth/login for all 8 accounts...');
    const testAccounts = [
      { email: 'admin@adgrid.test', role: 'Platform Admin', dashboard: '/admin/platform' },
      { email: 'agency@adgrid.test', role: 'Agency Admin', dashboard: '/admin/agency' },
      { email: 'campaigns@adgrid.test', role: 'Campaign Manager', dashboard: '/admin/agency' },
      { email: 'operations@adgrid.test', role: 'Operations Manager', dashboard: '/admin/agency' },
      { email: 'client@adgrid.test', role: 'Customer / Client Company', dashboard: '/admin/client' },
      { email: 'mediaowner@adgrid.test', role: 'Media Owner', dashboard: '/admin/media-owner' },
      { email: 'vendor@adgrid.test', role: 'Vendor', dashboard: '/admin/vendor' },
      { email: 'fieldagent@adgrid.test', role: 'Field Agent', dashboard: '/admin/field-agent' },
    ];

    let platformToken = '';
    let clientToken = '';

    for (const acc of testAccounts) {
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: SHARED_DEMO_PASSWORD }),
      });

      const setCookie = loginRes.headers.get('set-cookie');
      const data = await loginRes.json();

      if (loginRes.status !== 200 || !data.success || !data.token) {
        throw new Error(`Login failed for ${acc.email}: status ${loginRes.status}, data: ${JSON.stringify(data)}`);
      }

      if (data.user.role !== acc.role) {
        throw new Error(`Role mismatch for ${acc.email}: got ${data.user.role}, expected ${acc.role}`);
      }

      if (data.redirectTo !== acc.dashboard) {
        throw new Error(`Dashboard mismatch for ${acc.email}: got ${data.redirectTo}, expected ${acc.dashboard}`);
      }

      // Check cookie
      if (!setCookie || !setCookie.includes('refresh_token')) {
        throw new Error(`Missing refresh_token cookie in login response for ${acc.email}`);
      }

      if (acc.email === 'admin@adgrid.test') platformToken = data.token;
      if (acc.email === 'client@adgrid.test') clientToken = data.token;

      console.log(`  ✓ ${acc.email} logged in -> ${data.user.role} -> ${data.redirectTo} (cookies set)`);
    }

    // 3. Test Invalid Password
    console.log('\n3. Testing invalid credentials...');
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'agency@adgrid.test', password: 'WrongPassword123' }),
    });
    if (badLoginRes.status !== 401) {
      throw new Error(`Expected 401 for wrong password, got ${badLoginRes.status}`);
    }
    console.log('  ✓ Incorrect password successfully rejected with 401 Unauthorized');

    // 4. Test Authenticated Profile (GET /api/auth/me)
    console.log('\n4. Testing GET /api/auth/me...');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${platformToken}` },
    });
    const meData = await meRes.json();
    if (meRes.status !== 200 || !meData.authenticated || meData.user.role !== 'Platform Admin') {
      throw new Error(`auth/me failed: status ${meRes.status}, data: ${JSON.stringify(meData)}`);
    }
    console.log(`  ✓ auth/me returned authenticated user: ${meData.user.name} (${meData.user.role})`);

    // 5. Test Role-Based API Protection
    console.log('\n5. Testing Protected API access & authorization enforcement...');
    // Platform Admin accessing /api/platform/overview -> 200
    const adminOverviewRes = await fetch(`${baseUrl}/platform/overview`, {
      headers: { Authorization: `Bearer ${platformToken}` },
    });
    if (adminOverviewRes.status !== 200) {
      throw new Error(`Platform admin overview returned ${adminOverviewRes.status}`);
    }
    console.log('  ✓ Platform Admin accessed /api/platform/overview (200 OK)');

    // Client attempting to access /api/platform/overview -> 403 Forbidden!
    const clientBlockedRes = await fetch(`${baseUrl}/platform/overview`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    if (clientBlockedRes.status !== 403) {
      throw new Error(`Expected 403 for Client accessing platform overview, got ${clientBlockedRes.status}`);
    }
    console.log('  ✓ Client forbidden from accessing /api/platform/overview (403 Forbidden)');

    // 6. Test Logout
    console.log('\n6. Testing POST /api/auth/logout...');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const logoutCookies = logoutRes.headers.get('set-cookie');
    if (logoutRes.status !== 200 || !logoutCookies || !logoutCookies.includes('refresh_token=')) {
      throw new Error('Logout failed to clear cookies');
    }
    console.log('  ✓ Logout succeeded and cleared session cookies (200 OK)');

    console.log('\n======================================================');
    console.log('ALL HTTP INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

runHttpAuthTest().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});

