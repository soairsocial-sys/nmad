import React, { useState } from 'react';
import { MapPin, Compass, ShieldCheck, Search, Filter, Layers, ExternalLink, Calendar, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { MapFirstExplorer, MapExplorerItem } from '../../common/MapFirstExplorer';
import { useBillboards } from '../../../context/BillboardContext';
import { MarketplaceBillboard, VerificationItem } from '../../../types';

interface ClientBillboardsViewProps {
  onOpenLiveMap: () => void;
  onOpenProofModal?: (item: VerificationItem) => void;
  onSelectBillboard?: (b: MarketplaceBillboard) => void;
  onPurchaseBillboard?: (b: MarketplaceBillboard) => void;
}

export const ClientBillboardsView: React.FC<ClientBillboardsViewProps> = ({
  onOpenLiveMap,
  onOpenProofModal,
  onSelectBillboard,
  onPurchaseBillboard,
}) => {
  const { billboards } = useBillboards();
  const [selectedMetro, setSelectedMetro] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Pending'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Brand-contracted / assigned billboards
  const assignedBillboards = [
    {
      id: 'LOS-DOOH-101',
      siteName: 'Lekki Expressway Digital Billboard',
      corridor: 'Lekki–Epe Expressway Corridor',
      metro: 'Lagos',
      format: 'Digital Billboard (DOOH)',
      dimensions: '18m × 6m (Landscape)',
      status: 'Active',
      dailyTraffic: '185,000 vehicles/day',
      luxScore: 1420,
      gpsCoords: '6.4474° N, 3.4723° E',
      campaignName: 'Summer Sales Campaign',
      flightDates: 'Jun 12, 2025 – Jul 12, 2025',
      deliveryRate: 68,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'LOS-DOOH-102',
      siteName: 'Victoria Island Digital Billboard',
      corridor: 'Adeola Odeku & Akin Adesola Financial District',
      metro: 'Lagos',
      format: 'Digital Billboard (DOOH)',
      dimensions: '16m × 8m High-Bright Screen',
      status: 'Active',
      dailyTraffic: '142,000 vehicles/day',
      luxScore: 1390,
      gpsCoords: '6.4281° N, 3.4219° E',
      campaignName: 'Summer Sales Campaign',
      flightDates: 'Jun 12, 2025 – Jul 12, 2025',
      deliveryRate: 74,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'LOS-MEGA-106',
      siteName: 'Ikoyi Link Bridge Mega Gantry',
      corridor: 'Lekki Phase 1 Toll Gate & Ikoyi Link Bridge',
      metro: 'Lagos',
      format: 'Static Billboard (Frontlit)',
      dimensions: '24m × 8m Grand Gantry',
      status: 'Active',
      dailyTraffic: '210,000 vehicles/day',
      luxScore: 1480,
      gpsCoords: '6.4378° N, 3.4492° E',
      campaignName: 'Product Launch',
      flightDates: 'May 5, 2025 – Jun 5, 2025',
      deliveryRate: 92,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'LOS-ST-103',
      siteName: 'Maryland Digital Billboard',
      corridor: 'Ikorodu Road & Mobolaji Bank Anthony Way',
      metro: 'Lagos',
      format: 'Digital Billboard (DOOH)',
      dimensions: '15m × 5m Dual Face LED',
      status: 'Pending',
      dailyTraffic: '195,000 vehicles/day',
      luxScore: 1350,
      gpsCoords: '6.5684° N, 3.3667° E',
      campaignName: 'Upcoming Flight Prep',
      flightDates: 'Jul 15, 2025 – Aug 15, 2025',
      deliveryRate: 0,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'LOS-LED-104',
      siteName: 'Allen Avenue Landmark LED',
      corridor: 'Allen Avenue & Ikeja Central Junction',
      metro: 'Lagos',
      format: 'Digital Billboard (DOOH)',
      dimensions: '12m × 6m High-Bright Screen',
      status: 'Active',
      dailyTraffic: '130,000 vehicles/day',
      luxScore: 1410,
      gpsCoords: '6.6018° N, 3.3515° E',
      campaignName: 'Product Launch',
      flightDates: 'May 5, 2025 – Jun 5, 2025',
      deliveryRate: 88,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'LOS-BR-105',
      siteName: 'Third Mainland Bridge Overhead Gantry',
      corridor: 'Third Mainland Expressway Inbound Lagos Island',
      metro: 'Lagos',
      format: 'Static Billboard (Backlit)',
      dimensions: '30m × 7m Highway Cantilever',
      status: 'Active',
      dailyTraffic: '260,000 vehicles/day',
      luxScore: 1510,
      gpsCoords: '6.4950° N, 3.3980° E',
      campaignName: 'Q2 Brand Campaign',
      flightDates: 'Apr 10, 2025 – May 10, 2025',
      deliveryRate: 100,
      latestPhotoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const filteredBillboards = assignedBillboards.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.siteName.toLowerCase().includes(q) || b.corridor.toLowerCase().includes(q);
    }
    return true;
  });

  const mapExplorerItems: MapExplorerItem[] = billboards.map((b) => ({
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
    dimensions: b.dimensions,
    dailyTraffic: b.dailyTrafficVehicles,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#181716] tracking-tight">
              Assigned Billboard Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              8 Sites Contracted
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time optical proof, location telemetry, sightline scores, and live display status for your active sites.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLiveMap}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Open Full Radar Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#eae7e1] shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by site name, highway corridor, or arterial..."
            className="w-full text-xs text-zinc-800 placeholder-zinc-400 outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-500">Status:</span>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            {(['ALL', 'Active', 'Pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === s ? 'bg-white text-[#181716] shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Billboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBillboards.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-[#eae7e1] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo Header */}
              <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                <img
                  src={b.latestPhotoUrl}
                  alt={b.siteName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      b.status === 'Active'
                        ? 'bg-emerald-500/90 text-white backdrop-blur-xs'
                        : 'bg-amber-500/90 text-white backdrop-blur-xs'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {b.status}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ef5a24]" />
                  <span>{b.gpsCoords}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="font-extrabold text-sm text-[#181716] leading-snug group-hover:text-[#ef5a24] transition-colors">
                    {b.siteName}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{b.corridor}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-[#eae7e1] text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Display Format</span>
                    <strong className="text-zinc-800 font-bold">{b.format}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Daily Traffic</span>
                    <strong className="text-zinc-800 font-bold">{b.dailyTraffic}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Flight Pacing</span>
                    <strong className="text-emerald-700 font-bold">{b.deliveryRate}% delivered</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Lux Calibration</span>
                    <strong className="text-zinc-800 font-bold">{b.luxScore} Lux (Clear)</strong>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{b.flightDates}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-zinc-50/70 border-t border-[#eae7e1] flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  onOpenProofModal?.({
                    id: b.id,
                    siteName: b.siteName,
                    imageUrl: b.latestPhotoUrl,
                    billboardName: b.siteName,
                    format: b.format,
                    metro: b.metro,
                    corridor: b.corridor,
                    luxScore: b.luxScore,
                    timestamp: new Date().toISOString(),
                    status: b.status === 'Active' ? 'Verified' : 'Pending',
                  } as any)
                }
                className="flex-1 py-1.5 px-3 rounded-xl bg-white hover:bg-zinc-100 border border-[#eae7e1] text-xs font-bold text-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                <span>View Proof</span>
              </button>

              <button
                onClick={onOpenLiveMap}
                className="py-1.5 px-3 rounded-xl bg-[#181716] hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>Radar</span>
                <Compass className="w-3.5 h-3.5 text-[#ef5a24]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Discovery Explorer Section */}
      <div className="pt-6">
        <MapFirstExplorer
          title="Explore Additional Billboard Corridors"
          subtitle="Inspect available premium OOH sites across Nigeria, Kenya, Ghana, and South Africa for your next flight."
          items={mapExplorerItems}
          defaultViewMode="map"
          primaryActionLabel="Reserve Site"
          onSelectItem={(item) => {
            const full = billboards.find((b) => b.id === item.id);
            if (full && onSelectBillboard) onSelectBillboard(full);
          }}
          onPrimaryAction={(item) => {
            const full = billboards.find((b) => b.id === item.id);
            if (full) {
              if (onPurchaseBillboard) onPurchaseBillboard(full);
              else if (onSelectBillboard) onSelectBillboard(full);
            }
          }}
        />
      </div>
    </div>
  );
};
