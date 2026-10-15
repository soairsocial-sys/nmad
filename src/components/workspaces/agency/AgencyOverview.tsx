import React, { useEffect, useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  MapPin,
  RefreshCw,
  ShieldAlert,
  FileSpreadsheet,
  Wrench,
  Compass,
  Check,
  User,
  ExternalLink,
} from 'lucide-react';
import { KPICard } from '../../shared/KPICard';
import { StatusBadge } from '../../shared/StatusBadge';
import { KPISkeleton } from '../../shared/LoadingSkeleton';
import { MapFirstExplorer, MapExplorerItem } from '../../common/MapFirstExplorer';
import { useBillboards } from '../../../context/BillboardContext';

interface AgencyOverviewProps {
  onNavigateTab: (tabId: string, params?: any) => void;
  onOpenCampaignDetail?: (campaignId: string) => void;
}

export const AgencyOverview: React.FC<AgencyOverviewProps> = ({
  onNavigateTab,
  onOpenCampaignDetail,
}) => {
  const { billboards } = useBillboards();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [operationsData, setOperationsData] = useState<any>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adgrid_access_token') || '';
      const [overviewRes, opsRes] = await Promise.all([
        fetch('/api/agency/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/agency/operations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const json = await overviewRes.json();
      if (!overviewRes.ok || !json.success) {
        throw new Error(json.error || 'Failed to load agency overview');
      }
      setData(json);

      if (opsRes.ok) {
        const opsJson = await opsRes.json();
        if (opsJson.success) {
          setOperationsData(opsJson.operations);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const kpis = data?.kpis || {};
  const healthCounts = data?.healthCounts || { Healthy: 0, 'Needs Attention': 0, 'At Risk': 0, Critical: 0 };
  const attentionItems = data?.attentionItems || [];
  const recentCampaigns = data?.recentCampaigns || [];
  const assignedLocations = operationsData?.locations || [];
  const workOrders = operationsData?.jobs || [];

  // Map explorer items for Agency Dashboard Map
  const agencyMapItems: MapExplorerItem[] = useMemo(() => {
    if (assignedLocations.length > 0) {
      return assignedLocations.map((loc: any) => ({
        id: loc.id,
        name: loc.siteName,
        code: loc.billboardId || loc.id,
        location: loc.corridor ? `${loc.corridor}, ${loc.metro}` : loc.metro,
        metro: loc.metro,
        corridor: loc.corridor,
        format: loc.format,
        lat: loc.lat,
        lng: loc.lng,
        status: loc.status,
        previewUrl: loc.previewUrl,
        campaignId: loc.campaign?.id,
        campaignName: loc.campaign?.name,
        luxScore: loc.luxScore,
      }));
    }

    // Fallback to billboards context
    return billboards.slice(0, 12).map((b) => ({
      id: b.id,
      name: b.name,
      code: b.id,
      location: b.location,
      metro: b.metroName.split(',')[0].trim(),
      corridor: b.corridor,
      format: b.format,
      lat: b.lat,
      lng: b.lng,
      status: b.availabilityStatus,
      previewUrl: b.previewUrl,
      dailyTraffic: b.dailyTrafficVehicles,
    }));
  }, [assignedLocations, billboards]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPISkeleton />
          <KPISkeleton />
          <KPISkeleton />
          <KPISkeleton />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-extrabold text-red-900 text-sm">Failed to Load Agency Command Center</h3>
        <p className="text-xs text-red-700">{error}</p>
        <button
          onClick={fetchOverview}
          className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Action-First Header Banner (Uber-inspired Simplicity & Direct Actions) */}
      <div className="rounded-3xl bg-[#181716] text-white p-6 sm:p-8 shadow-xl border border-zinc-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Agency Operations Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Agency Command & Live Field Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Manage client billboard flights, assign contractor work orders, inspect corridor health and track proof of display.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Primary Action 1: View Assigned Jobs */}
            <button
              onClick={() => onNavigateTab('operations')}
              className="px-6 py-3.5 rounded-2xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-lg shadow-[#ef5a24]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>View Assigned Jobs</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Primary Action 2: Inspect Flight Map */}
            <button
              onClick={() => onNavigateTab('live-map')}
              className="px-5 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Flight Radar Map</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('inventory')}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-orange-400" />
              <span>Import Inventory Spreadsheet</span>
            </button>

            <button
              onClick={() => onNavigateTab('campaigns')}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Manage Campaigns</span>
            </button>
          </div>

          <button
            onClick={fetchOverview}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Workspace</span>
          </button>
        </div>
      </div>

      {/* Primary 4 Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          label="Active Campaigns"
          value={`${kpis.activeCampaignsCount || 0}`}
          subValue={`${kpis.totalCampaignsCount || 0} total on platform`}
          icon={Layers}
          onClick={() => onNavigateTab('campaigns')}
        />
        <KPICard
          label="Client Billed Revenue"
          value={`$${(kpis.totalRevenueUSD || 0).toLocaleString()}`}
          subValue={`Est. Profit: $${(kpis.estimatedProfitUSD || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: '100% Escrow Protected', isPositive: true }}
          onClick={() => onNavigateTab('finance')}
        />
        <KPICard
          label="Live Network Locations"
          value={`${kpis.liveLocationsCount || assignedLocations.length}`}
          subValue={`${kpis.verificationRate || 100}% PoP verified`}
          icon={MapPin}
          onClick={() => onNavigateTab('operations')}
        />
        <KPICard
          label="Upcoming Flight Expiries"
          value={`${kpis.upcomingExpiriesCount || 0}`}
          subValue={`${kpis.openIssuesCount || 0} open field issues`}
          icon={Clock}
          badge={
            kpis.openIssuesCount > 0 ? (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            ) : undefined
          }
          onClick={() => onNavigateTab('renewals')}
        />
      </div>

      {/* MAP-FIRST INTERACTION: Assigned Network Locations Map */}
      <div className="space-y-3">
        <MapFirstExplorer
          title="Assigned Billboard Network & Flight Map"
          subtitle="Real-time geographic coverage and sensor health across active client flights."
          items={agencyMapItems}
          defaultViewMode="map"
          primaryActionLabel="View Flight / Asset Operations"
          onPrimaryAction={(item) => {
            if (item.campaignId && onOpenCampaignDetail) {
              onOpenCampaignDetail(item.campaignId);
            } else {
              onNavigateTab('operations');
            }
          }}
        />
      </div>

      {/* Outstanding Tasks & Work Orders Section */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#181716] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#ef5a24]" />
              <span>Outstanding Tasks & Work Orders</span>
            </h3>
            <p className="text-xs text-zinc-500">Active mounting, print runs, and field audit tasks.</p>
          </div>
          <button
            onClick={() => onNavigateTab('operations')}
            className="text-xs font-bold text-[#ef5a24] hover:underline"
          >
            Manage all ({workOrders.length}) →
          </button>
        </div>

        {workOrders.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#faf9f6] text-center border border-[#eae7e1]">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-xs text-[#181716]">No pending work order delays</p>
            <p className="text-[11px] text-zinc-500">All contractor jobs are completed or on schedule.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eae7e1] border border-[#eae7e1] rounded-xl overflow-hidden bg-white">
            {workOrders.slice(0, 4).map((job: any) => (
              <div
                key={job.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#181716]">{job.title}</h4>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                      {job.serviceType}
                    </span>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Location: <strong className="text-zinc-700">{job.siteName}</strong> · Due: {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-zinc-800">${job.payoutUSD?.toLocaleString() || 0}</span>
                  <button
                    onClick={() => onNavigateTab('operations')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-[#ef5a24] hover:text-white text-xs font-bold text-[#181716] transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fleet Health Distribution Matrix */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#181716]">Fleet Health Distribution</h3>
            <p className="text-xs text-zinc-500">
              Aggregated across delivery pace, optical verification, sensor uptime, and contractor SLA compliance.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="text-xs font-semibold text-[#ef5a24] hover:underline self-start sm:self-auto"
          >
            Filter by health →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Healthy
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{healthCounts.Healthy || 0}</div>
            <p className="text-[10px] text-emerald-800 mt-0.5">Uptime &gt;98%, 0 block issues</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs text-amber-800 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Needs Attention
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">{healthCounts['Needs Attention'] || 0}</div>
            <p className="text-[10px] text-amber-800 mt-0.5">Minor inspection delay</p>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200">
            <span className="text-xs text-orange-800 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              At Risk
            </span>
            <div className="text-2xl font-black text-orange-950 mt-1">{healthCounts['At Risk'] || 0}</div>
            <p className="text-[10px] text-orange-800 mt-0.5">Sightline or sensor alert</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <span className="text-xs text-rose-800 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Critical
            </span>
            <div className="text-2xl font-black text-rose-950 mt-1">{healthCounts.Critical || 0}</div>
            <p className="text-[10px] text-rose-800 mt-0.5">Immediate crew required</p>
          </div>
        </div>
      </div>

      {/* Actionable "Needs Attention" Center */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ef5a24]" />
            <h3 className="font-bold text-sm text-[#181716]">Needs Attention Action Center</h3>
          </div>
          <span className="text-xs text-zinc-500">
            {attentionItems.length} actionable item{attentionItems.length === 1 ? '' : 's'}
          </span>
        </div>

        {attentionItems.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#faf9f6] text-center border border-[#eae7e1]">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-xs text-[#181716]">All campaigns operating nominal</p>
            <p className="text-[11px] text-zinc-500">No open blockers, upcoming critical expiries, or unresolved field alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eae7e1] border border-[#eae7e1] rounded-xl overflow-hidden bg-white">
            {attentionItems.map((item: any) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.severity === 'critical'
                          ? 'bg-rose-600'
                          : item.severity === 'high'
                          ? 'bg-orange-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <h4 className="font-bold text-xs text-[#181716]">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-zinc-500 pl-4">{item.description}</p>
                </div>

                <button
                  onClick={() => {
                    if (item.targetRoute.includes('/campaigns/')) {
                      const id = item.targetRoute.split('/campaigns/')[1];
                      onOpenCampaignDetail?.(id);
                    } else if (item.targetRoute.includes('/operations')) {
                      onNavigateTab('operations');
                    } else {
                      onNavigateTab('renewals');
                    }
                  }}
                  className="self-end sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#181716] font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Recent Campaigns Stream */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#181716]">Active High-Impact Campaigns</h3>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="text-xs font-semibold text-[#ef5a24] hover:underline"
          >
            View all ({kpis.totalCampaignsCount || 0}) →
          </button>
        </div>

        <div className="divide-y divide-[#eae7e1] border border-[#eae7e1] rounded-xl overflow-hidden bg-white">
          {recentCampaigns.map((c: any) => (
            <div
              key={c.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#faf9f6] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-[#181716]">{c.name}</h4>
                  <StatusBadge status={c.status} size="sm" />
                  <StatusBadge status={c.health} size="sm" />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Client: <strong className="text-zinc-700">{c.clientName}</strong> · Flight:{' '}
                  {new Date(c.startDate).toLocaleDateString()} – {new Date(c.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-zinc-400 font-semibold block text-[10px]">Pacing</span>
                  <span className="font-extrabold text-zinc-800">{c.deliveryRate}%</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-semibold block text-[10px]">PoP Rate</span>
                  <span className="font-extrabold text-emerald-800">{c.verificationRate}%</span>
                </div>
                <div>
                  <span className="text-zinc-400 font-semibold block text-[10px]">Spend</span>
                  <span className="font-black text-[#181716]">${c.spendUSD?.toLocaleString() || 0}</span>
                </div>

                {onOpenCampaignDetail && (
                  <button
                    onClick={() => onOpenCampaignDetail(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#181716] font-bold text-xs"
                  >
                    Flight →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
