import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarCheck,
  FileText,
  Layers,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
  Compass,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { KPICard } from '../../shared/KPICard';
import { TableSkeleton } from '../../shared/LoadingSkeleton';
import { AfricaCorridorMap } from '../../common/AfricaCorridorMap';

interface PlatformAdminOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const PlatformAdminOverview: React.FC<PlatformAdminOverviewProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/platform/overview', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adgrid_access_token') || ''}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.stats);
      }
    } catch (err) {
      console.error('Error fetching platform admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = data || {};

  return (
    <div className="space-y-6 pb-12">
      {/* Action-First Header Banner (Uber-inspired Simplicity & Direct Operations) */}
      <div className="rounded-3xl bg-[#181716] text-white p-6 sm:p-8 shadow-xl border border-zinc-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Pan-African Multi-Tenant Cluster Nominal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Platform Governance & Infrastructure Command
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Manage multi-tenant organizations, feature entitlements, cryptographic audit trails and real-time corridor telemetry.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Primary Action 1: Manage Subscription Entitlements */}
            <button
              onClick={() => onNavigateTab('subscriptions')}
              className="px-6 py-3.5 rounded-2xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-lg shadow-[#ef5a24]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription & Plans</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Primary Action 2: Inspect Security Logs */}
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="px-5 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Quick Access Bar */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('tenants')}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Organizations ({stats.tenantsCount || 0})</span>
            </button>

            <button
              onClick={() => onNavigateTab('users')}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>User Accounts ({stats.usersCount || 0})</span>
            </button>
          </div>

          <button
            onClick={fetchOverview}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Cluster</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard
          label="Tenants & Organizations"
          value={`${stats.tenantsCount || 0}`}
          subValue="Agencies, owners & brands"
          icon={Building2}
          onClick={() => onNavigateTab('tenants')}
        />
        <KPICard
          label="Provisioned Users"
          value={`${stats.usersCount || 0}`}
          subValue="RBAC secured accounts"
          icon={Users}
          onClick={() => onNavigateTab('users')}
        />
        <KPICard
          label="Active Flight Campaigns"
          value={`${stats.campaignsCount || 0}`}
          subValue="Live contract flights"
          icon={Layers}
        />
        <KPICard
          label="Concession Bookings"
          value={`${stats.bookingsCount || 0}`}
          subValue="Escrow contract records"
          icon={CalendarCheck}
        />
        <KPICard
          label="Security Audit Logs"
          value={`${stats.auditLogsCount || 0}`}
          subValue="SHA-256 tamper-proof"
          icon={ShieldCheck}
          onClick={() => onNavigateTab('audit-logs')}
        />
      </div>

      {/* Map & Corridor Telemetry Section */}
      <div className="bg-white rounded-3xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#181716] tracking-tight">
              Pan-African Optical & Corridor Telemetry
            </h3>
            <p className="text-xs text-zinc-500">
              Active metropolitan corridors across Nigeria, Kenya, South Africa, Ghana and Rwanda.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            All 5 Nodes Online
          </span>
        </div>

        <AfricaCorridorMap />
      </div>

      {/* Priority Exceptions & Governance Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#181716]">Organization Governance</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Audit registered media agencies, concessionaire owners, technical vendors, and enterprise advertisers across African nodes.
          </p>
          <button
            onClick={() => onNavigateTab('tenants')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#ef5a24] hover:underline cursor-pointer pt-1"
          >
            <span>Manage Organizations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ef5a24] flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#181716]">Subscription Plans & Entitlements</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Configure Starter, Professional, and Enterprise tiers, pricing intervals, rate limits, and modular feature entitlements.
          </p>
          <button
            onClick={() => onNavigateTab('subscriptions')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#ef5a24] hover:underline cursor-pointer pt-1"
          >
            <span>Configure Entitlements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#181716]">Audit Trail & Security</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Real-time compliance feed capturing logins, privilege changes, booking approvals, field verifications, and financial releases.
          </p>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#ef5a24] hover:underline cursor-pointer pt-1"
          >
            <span>Inspect Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
