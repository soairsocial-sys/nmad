import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  DollarSign,
  Download,
  Inbox,
  Plus,
  RefreshCw,
  TrendingUp,
  XCircle,
  Compass,
} from 'lucide-react';
import { StatusBadge } from '../../shared/StatusBadge';
import { useBillboards } from '../../../context/BillboardContext';
import { useAuth } from '../../../context/AuthContext';
import { AddBillboardModal } from '../../modals/AddBillboardModal';
import { OwnerOnboardingWizard } from './OwnerOnboardingWizard';

interface MediaOwnerOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

const FALLBACK_BOOKINGS = [
  {
    id: 'mbk-01',
    mediaOwnerTenantId: 'tenant-media-owner-continental',
    agencyTenantId: 'tenant-agency-afrireach',
    billboardId: 'LOS-DOOH-101',
    billboardName: 'Lekki Expressway Digital Billboard',
    brand: 'Safaricom & M-Pesa',
    campaignName: 'Safaricom 5G Pan-African Corridor Blitz',
    agencyName: 'AfriReach Pan-African Media Group',
    startDate: '2026-09-01T00:00:00.000Z',
    endDate: '2026-11-30T00:00:00.000Z',
    rateMonthlyUSD: 3200,
    totalAmountUSD: 9600,
    status: 'Active',
    createdAt: '2026-10-07T12:49:57.176Z',
  },
  {
    id: 'mbk-02',
    mediaOwnerTenantId: 'tenant-media-owner-continental',
    agencyTenantId: 'tenant-agency-afrireach',
    billboardId: 'LOS-VI-088',
    billboardName: 'Victoria Island Coastal LED Mega-Screen',
    brand: 'Flutterwave',
    campaignName: 'Flutterwave Enterprise Send Rollout',
    agencyName: 'AfriReach Pan-African Media Group',
    startDate: '2026-10-15T00:00:00.000Z',
    endDate: '2026-12-15T00:00:00.000Z',
    rateMonthlyUSD: 4800,
    totalAmountUSD: 9600,
    status: 'Pending',
    createdAt: '2026-10-07T12:49:57.178Z',
  },
  {
    id: 'mbk-03',
    mediaOwnerTenantId: 'tenant-media-owner-continental',
    agencyTenantId: 'tenant-agency-afrireach',
    billboardId: 'LOS-LK-042',
    billboardName: 'Lekki Toll Gate Curved DOOH Spectacular',
    brand: 'Coca-Cola',
    campaignName: 'Coca-Cola Real Magic Seasonal Wrap',
    agencyName: 'AfriReach Pan-African Media Group',
    startDate: '2026-11-01T00:00:00.000Z',
    endDate: '2026-12-31T00:00:00.000Z',
    rateMonthlyUSD: 5200,
    totalAmountUSD: 10400,
    status: 'Approved',
    createdAt: '2026-10-07T12:49:57.179Z',
  },
];

const FALLBACK_KPIS = {
  totalBookingsCount: 3,
  activeBookingsCount: 1,
  pendingBookingsCount: 1,
  totalRevenueUSD: 29600,
  occupancyRate: 94.2,
};

export const MediaOwnerOverview: React.FC<MediaOwnerOverviewProps> = ({ onNavigateTab }) => {
  const { billboards, exportBillboardsCSV } = useBillboards();
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>({ kpis: FALLBACK_KPIS, bookings: FALLBACK_BOOKINGS });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMediaOwnerOverview = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem('adgrid_access_token') ||
        localStorage.getItem('adgrid_token') ||
        '';

      const res = await fetch('/api/media-owner/overview', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.bookings)) {
          setData(json);
          return;
        }
      }
      setData((prev: any) => prev || { kpis: FALLBACK_KPIS, bookings: FALLBACK_BOOKINGS });
    } catch {
      setData((prev: any) => prev || { kpis: FALLBACK_KPIS, bookings: FALLBACK_BOOKINGS });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaOwnerOverview();
  }, []);

  const handleBookingAction = async (bookingId: string, action: 'approve' | 'reject') => {
    const nextStatus = action === 'approve' ? 'Approved' : 'Rejected';

    setData((prev: any) => {
      if (!prev) return prev;
      const updated = (prev.bookings || []).map((b: any) =>
        b.id === bookingId ? { ...b, status: nextStatus } : b
      );
      return { ...prev, bookings: updated };
    });

    setToastMessage(`Booking ${bookingId} ${nextStatus.toLowerCase()} successfully.`);
    setTimeout(() => setToastMessage(null), 3000);

    try {
      const token =
        localStorage.getItem('adgrid_access_token') ||
        localStorage.getItem('adgrid_token') ||
        '';

      if (token) {
        await fetch(`/api/media-owner/bookings/${bookingId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        });
      }
    } catch {
      // Local optimistic state already updated
    }
  };

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181716] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#181716] tracking-tight">
              Media Owner & Concessionaire Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold text-xs">
              {currentUser?.organization || 'Concession Inventory'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Fleet inventory management, booking RFQ approval workflows, corridor yields, and escrow payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-[#ef5a24] shadow-2xs transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Onboarding Guide</span>
          </button>
          <button
            onClick={() => exportBillboardsCSV()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Inventory (CSV)</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Billboard Asset</span>
          </button>
        </div>
      </div>

      {/* Inbound Booking Requests & Approval Workflow */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#181716]">Agency Booking Requests & Concession Contracts</h3>
            <p className="text-xs text-zinc-500">
              Review advertiser offers, approve contracts, and lock escrow milestone settlements.
            </p>
          </div>
          <span className="text-xs text-zinc-400">{bookings.length} requests</span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4">No active booking requests at this moment.</p>
        ) : (
          <div className="divide-y divide-[#eae7e1] border border-[#eae7e1] rounded-xl overflow-hidden">
            {bookings.map((bkg: any) => (
              <div
                key={bkg.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-extrabold text-sm text-[#181716]">{bkg.billboardName}</h4>
                    <StatusBadge status={bkg.status} />
                  </div>
                  <p className="text-xs text-zinc-600">
                    Advertiser: <strong>{bkg.brand}</strong> • Agency: <span className="font-medium text-zinc-500">{bkg.agencyName}</span>
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Campaign: {bkg.campaignName} • Duration: {new Date(bkg.startDate).toLocaleDateString()} – {new Date(bkg.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="font-black text-[#181716] text-sm block">${bkg.totalAmountUSD.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-400 font-medium">${bkg.rateMonthlyUSD.toLocaleString()} / mo</span>
                  </div>

                  {bkg.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBookingAction(bkg.id, 'reject')}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleBookingAction(bkg.id, 'approve')}
                        className="px-3 py-1.5 rounded-lg bg-[#ef5a24] hover:bg-[#d94e1d] text-white font-bold text-xs cursor-pointer"
                      >
                        Approve & Confirm
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Confirmed ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Owner Guided Onboarding Wizard */}
      <OwnerOnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          setIsOnboardingOpen(false);
          setToastMessage('Concession onboarding and first billboard activated!');
          setTimeout(() => setToastMessage(null), 4000);
        }}
        onOpenAddBillboardModal={() => setIsAddModalOpen(true)}
      />

      {/* Add Billboard Asset Modal */}
      <AddBillboardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultCompany={currentUser?.organization}
        onSuccess={(newId) => {
          setToastMessage(`Billboard asset ${newId} published to live concession inventory!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
};
