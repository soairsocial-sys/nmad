import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  MapPin,
  CheckCircle2,
  FileText,
  Calendar,
  ChevronRight,
  Camera,
  ArrowRight,
  TrendingUp,
  Compass,
  Eye,
  ShieldCheck,
  Video,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useBillboards } from '../../../context/BillboardContext';
import { MarketplaceBillboard, VerificationItem } from '../../../types';

interface ClientOverviewProps {
  onOpenLiveMap: () => void;
  onOpenCampaignDetail?: (id: string) => void;
  onOpenProofModal?: (item: any) => void;
  onNavigateTab?: (tabId: string) => void;
  onSelectBillboard?: (b: MarketplaceBillboard) => void;
  onPurchaseBillboard?: (b: MarketplaceBillboard) => void;
}

export const ClientOverview: React.FC<ClientOverviewProps> = ({
  onOpenLiveMap,
  onOpenCampaignDetail,
  onOpenProofModal,
  onNavigateTab,
  onSelectBillboard,
  onPurchaseBillboard,
}) => {
  const { currentUser } = useAuth();
  const { billboards } = useBillboards();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBillboardPin, setSelectedBillboardPin] = useState<'lekki' | 'vi' | 'ikoyi' | 'maryland'>('lekki');

  const fetchClientOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/client/overview', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adgrid_access_token') || ''}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching client overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientOverview();
  }, []);

  const organizationName = currentUser?.organization || 'GreenTech Solutions';

  // 1. Client Campaigns (matching reference UI)
  const clientCampaigns = [
    {
      id: 'cmp-01',
      name: 'Summer Sales Campaign',
      category: 'Brand Awareness',
      startDate: 'Jun 12, 2025',
      endDate: 'Jul 12, 2025',
      status: 'Active',
      progress: 68,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cmp-02',
      name: 'Product Launch',
      category: 'Product Awareness',
      startDate: 'May 5, 2025',
      endDate: 'Jun 5, 2025',
      status: 'Active',
      progress: 92,
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cmp-03',
      name: 'Q2 Brand Campaign',
      category: 'Brand Awareness',
      startDate: 'Apr 10, 2025',
      endDate: 'May 10, 2025',
      status: 'Completed',
      progress: 100,
      imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // 2. Client Billboards (matching reference UI)
  const clientBillboardsList = [
    {
      key: 'lekki' as const,
      id: 'LOS-DOOH-101',
      name: 'Lekki Expressway',
      format: 'Digital Billboard',
      status: 'Active',
      mapCoords: { x: 74, y: 38 }, // Percentage on stylized map
      photoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      luxScore: 1420,
      corridor: 'Lekki–Epe Expressway Corridor',
      metro: 'Lagos',
    },
    {
      key: 'vi' as const,
      id: 'LOS-DOOH-102',
      name: 'Victoria Island',
      format: 'Digital Billboard',
      status: 'Active',
      mapCoords: { x: 50, y: 55 },
      photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80',
      luxScore: 1390,
      corridor: 'Adeola Odeku Financial District',
      metro: 'Lagos',
    },
    {
      key: 'ikoyi' as const,
      id: 'LOS-MEGA-106',
      name: 'Ikoyi Link Bridge',
      format: 'Static Billboard',
      status: 'Active',
      mapCoords: { x: 62, y: 46 },
      photoUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=400&q=80',
      luxScore: 1480,
      corridor: 'Ikoyi Link Bridge Toll Approach',
      metro: 'Lagos',
    },
    {
      key: 'maryland' as const,
      id: 'LOS-ST-103',
      name: 'Maryland',
      format: 'Digital Billboard',
      status: 'Pending',
      mapCoords: { x: 38, y: 22 },
      photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
      luxScore: 1350,
      corridor: 'Ikorodu Road Arterial',
      metro: 'Lagos',
    },
  ];

  // 3. Recent Proof of Display (matching reference UI)
  const recentProofItems = [
    {
      id: 'proof-01',
      date: 'Jun 14, 2025',
      time: '10:24 AM',
      location: 'Lekki Expressway',
      format: 'Digital Billboard',
      photoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      verified: true,
      luxScore: 1420,
      gpsCoords: '6.4474° N, 3.4723° E',
      corridor: 'Lekki–Epe Expressway',
    },
    {
      id: 'proof-02',
      date: 'Jun 13, 2025',
      time: '02:15 PM',
      location: 'Victoria Island',
      format: 'Digital Billboard',
      photoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      verified: true,
      luxScore: 1390,
      gpsCoords: '6.4281° N, 3.4219° E',
      corridor: 'Adeola Odeku Financial District',
    },
    {
      id: 'proof-03',
      date: 'Jun 12, 2025',
      time: '11:40 AM',
      location: 'Ikoyi Link Bridge',
      format: 'Static Billboard',
      photoUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
      verified: true,
      luxScore: 1480,
      gpsCoords: '6.4378° N, 3.4492° E',
      corridor: 'Ikoyi Link Bridge Approach',
    },
  ];

  // 4. Recent Activity (matching reference UI)
  const recentActivities = [
    {
      id: 'act-01',
      title: 'Proof of display uploaded',
      subtitle: 'Lekki Expressway · Jun 14, 2025 10:24 AM',
      iconType: 'camera',
    },
    {
      id: 'act-02',
      title: 'Campaign status updated',
      subtitle: 'Summer Sales Campaign · Jun 14, 2025 09:12 AM',
      iconType: 'status',
    },
    {
      id: 'act-03',
      title: 'Invoice generated',
      subtitle: 'INV-2025-041 · Jun 12, 2025 04:37 PM',
      iconType: 'invoice',
    },
    {
      id: 'act-04',
      title: 'New billboard activated',
      subtitle: 'Maryland · Jun 10, 2025 11:20 AM',
      iconType: 'billboard',
    },
  ];

  const selectedBillboard =
    clientBillboardsList.find((b) => b.key === selectedBillboardPin) || clientBillboardsList[0];

  const handleOpenProof = (proof: (typeof recentProofItems)[0]) => {
    if (onOpenProofModal) {
      onOpenProofModal({
        id: proof.id,
        siteName: proof.location,
        billboardName: proof.location,
        imageUrl: proof.photoUrl,
        format: proof.format,
        timestamp: `${proof.date} ${proof.time}`,
        luxScore: proof.luxScore,
        corridor: proof.corridor,
        metro: 'Lagos',
        gpsCoords: proof.gpsCoords,
        status: 'Verified',
      });
    }
  };

  const handleSelectBillboardRow = (b: (typeof clientBillboardsList)[0]) => {
    setSelectedBillboardPin(b.key);
    const full = billboards.find((item) => item.id === b.id || item.name.includes(b.name));
    if (full && onSelectBillboard) {
      onSelectBillboard(full);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* 1. TOP WELCOME HERO BANNER */}
      <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#edf3f8] via-[#eaf0f6] to-[#f4f7fb] border border-[#dbe4ed] overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch justify-between">
          {/* Left Greeting Copy */}
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col justify-center flex-1 min-w-0 min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
            <span className="text-xs sm:text-sm font-bold text-[#ef5a24] tracking-tight">
              Welcome back,
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight mt-1 truncate">
              {organizationName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 sm:mt-2 font-normal leading-relaxed max-w-xl">
              Here&apos;s a quick overview of your outdoor advertising campaigns and performance.
            </p>
          </div>

          {/* Right Billboard Graphic Banner (Matches Reference UI) */}
          <div className="relative w-full lg:w-1/2 min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] overflow-hidden flex items-center justify-end">
            <div className="relative w-full h-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px]">
              {/* Background Cityscape & Bridge */}
              <img
                src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80"
                alt="Corridor OOH Billboard"
                className="w-full h-full max-w-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#edf3f8] via-[#edf3f8]/30 to-transparent lg:w-36 pointer-events-none" />

              {/* Highway Billboard Structure Overlay */}
              <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 lg:right-8 w-52 sm:w-64 md:w-72 lg:w-80 rounded-lg bg-[#181716] p-2 sm:p-2.5 shadow-2xl border-2 border-zinc-700/80">
                <div className="relative overflow-hidden rounded bg-gradient-to-br from-[#181716] to-[#252320] p-2.5 sm:p-3 text-white border border-zinc-800">
                  <div className="flex items-center justify-between pb-1 text-[7.5px] sm:text-[8px] font-bold text-zinc-400 border-b border-zinc-800">
                    <span className="text-[#ef5a24] font-black uppercase tracking-wider">ADGRID LIVE</span>
                    <span>LEKKI CORRIDOR</span>
                  </div>
                  <div className="py-1.5 sm:py-2.5">
                    <p className="text-xs sm:text-sm lg:text-base font-black tracking-tight text-white leading-tight uppercase">
                      BIGGER REACH.
                    </p>
                    <p className="text-xs sm:text-sm lg:text-base font-black tracking-tight text-[#ef5a24] leading-tight uppercase">
                      REAL IMPACT.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[7px] sm:text-[8px] font-bold text-zinc-500">
                    <span>18m × 6m DOOH</span>
                    <span className="text-emerald-400 font-mono">100% AUDITED</span>
                  </div>
                </div>
                {/* Billboard Steel Pole Stanchion */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-800 rounded-b" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUR KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
        {/* Card 1: Active Campaigns */}
        <div
          onClick={() => onNavigateTab?.('campaigns')}
          className="bg-white p-3.5 sm:p-4.5 lg:p-5 rounded-2xl border border-[#eae7e1] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer w-full min-h-[105px] sm:min-h-[115px]"
        >
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#ff5b26] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 block truncate">Active Campaigns</span>
              <strong className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] block mt-0.5 leading-tight truncate">
                3
              </strong>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 text-[10.5px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1 since last month</span>
          </div>
        </div>

        {/* Card 2: Billboards Assigned */}
        <div
          onClick={() => onNavigateTab?.('billboards')}
          className="bg-white p-3.5 sm:p-4.5 lg:p-5 rounded-2xl border border-[#eae7e1] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer w-full min-h-[105px] sm:min-h-[115px]"
        >
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#6366f1] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 block truncate">Billboards Assigned</span>
              <strong className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] block mt-0.5 leading-tight truncate">
                8
              </strong>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 text-[10.5px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2 since last month</span>
          </div>
        </div>

        {/* Card 3: Delivery Progress */}
        <div
          onClick={() => onNavigateTab?.('campaigns')}
          className="bg-white p-3.5 sm:p-4.5 lg:p-5 rounded-2xl border border-[#eae7e1] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer w-full min-h-[105px] sm:min-h-[115px]"
        >
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 block truncate">Delivery Progress</span>
              <strong className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] block mt-0.5 leading-tight truncate">
                76%
              </strong>
            </div>
          </div>
          {/* Progress bar matching reference UI */}
          <div className="mt-2.5 sm:mt-3 w-full bg-zinc-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <div className="bg-[#10b981] h-2 sm:h-2.5 rounded-full w-[76%]" />
          </div>
        </div>

        {/* Card 4: Total Spend */}
        <div
          onClick={() => onNavigateTab?.('invoices')}
          className="bg-white p-3.5 sm:p-4.5 lg:p-5 rounded-2xl border border-[#eae7e1] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer w-full min-h-[105px] sm:min-h-[115px]"
        >
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-zinc-500 block truncate">Total Spend (Agency)</span>
              <strong className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111827] block mt-0.5 leading-tight truncate">
                ₦2,450,000
              </strong>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 text-[10.5px] sm:text-xs font-medium text-zinc-400 truncate">
            Across all campaigns
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION (2 COLUMNS: My Campaigns & My Billboards) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {/* LEFT COLUMN: My Campaigns */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 w-full">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">My Campaigns</h2>
            <button
              onClick={() => onNavigateTab?.('campaigns')}
              className="text-xs sm:text-sm font-bold text-[#ef5a24] hover:text-[#d94e1d] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5">
            {clientCampaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => onNavigateTab?.('campaigns')}
                className="p-3.5 sm:p-4 rounded-2xl border border-[#eae7e1] hover:border-zinc-300 hover:shadow-2xs transition-all flex flex-col justify-between gap-3 cursor-pointer group w-full"
              >
                <div className="flex items-start gap-3.5">
                  {/* Thumbnail with overlay icon */}
                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <img
                      src={camp.imageUrl}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-1 right-1 p-0.5 rounded bg-black/60 text-white">
                      <Camera className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#111827] truncate group-hover:text-[#ef5a24] transition-colors">
                        {camp.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shrink-0 ${
                          camp.status === 'Active'
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : 'bg-[#f1f5f9] text-[#64748b]'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{camp.category}</p>

                    <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-400 mt-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>
                        {camp.startDate} — {camp.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 bg-zinc-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#10b981] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${camp.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-700 w-8 text-right">
                    {camp.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: My Billboards */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 w-full">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">My Billboards</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLiveMap}
                className="text-xs sm:text-sm font-semibold text-zinc-500 hover:text-[#111827] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#ef5a24]" />
                <span className="hidden sm:inline">Radar</span>
              </button>
              <button
                onClick={() => onNavigateTab?.('billboards')}
                className="text-xs sm:text-sm font-bold text-[#ef5a24] hover:text-[#d94e1d] transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>
          </div>

          {/* Interactive Lagos Styled Vector Map */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden bg-[#e6edf5] border border-[#d8e2ed] select-none">
            {/* SVG Topography: Lagos waterways, roads, and land masses */}
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 400 180"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Landmass */}
              <rect width="400" height="180" fill="#e9f0f7" />
              {/* Water (Lagos Lagoon & Atlantic Coast) */}
              <path
                d="M0,130 C120,110 200,140 280,120 C340,105 380,125 400,115 L400,180 L0,180 Z"
                fill="#cadbf2"
              />
              <path
                d="M50,0 C90,40 180,30 260,65 C320,80 370,50 400,60 L400,0 Z"
                fill="#d5e4f5"
              />
              {/* Highway Arterials (Lekki-Epe, Third Mainland Bridge, Ikorodu Road) */}
              <path
                d="M0,80 Q150,90 280,75 T400,90"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M160,0 Q180,80 230,130"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M240,60 Q270,100 340,110"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Minor roads */}
              <path d="M40,30 L160,85" stroke="#f1f5f9" strokeWidth="2" />
              <path d="M260,80 L350,40" stroke="#f1f5f9" strokeWidth="2" />
              <path d="M120,110 L220,95" stroke="#f1f5f9" strokeWidth="2" />

              {/* Geographic Label */}
              <text x="290" y="85" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="1">
                Lagos
              </text>
            </svg>

            {/* Pins on the Map */}
            {clientBillboardsList.map((b) => {
              const isSelected = selectedBillboardPin === b.key;
              return (
                <button
                  key={b.key}
                  onClick={() => setSelectedBillboardPin(b.key)}
                  style={{ left: `${b.mapCoords.x}%`, top: `${b.mapCoords.y}%` }}
                  title={`${b.name} (${b.format})`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#ef5a24] text-white ring-4 ring-[#ef5a24]/30 scale-110 shadow-md'
                        : 'bg-[#ef5a24] text-white hover:scale-110 shadow-xs'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </button>
              );
            })}

            {/* Floating Selected Pin Card (Exact Reference UI Design) */}
            <div
              onClick={() => handleSelectBillboardRow(selectedBillboard)}
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl border border-zinc-200/90 shadow-md p-2.5 z-20 flex items-center justify-between gap-3 cursor-pointer hover:border-[#ef5a24] transition-all min-w-[170px]"
            >
              <div>
                <strong className="text-xs font-black text-[#111827] block leading-tight">
                  {selectedBillboard.name}
                </strong>
                <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">
                  {selectedBillboard.format}
                </span>
                <span
                  className={`text-[9.5px] font-extrabold block mt-0.5 ${
                    selectedBillboard.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {selectedBillboard.status}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
            </div>
          </div>

          {/* List of Billboard rows below map */}
          <div className="space-y-2">
            {clientBillboardsList.map((b) => {
              const isSelected = selectedBillboardPin === b.key;
              return (
                <div
                  key={b.key}
                  onClick={() => handleSelectBillboardRow(b)}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer w-full ${
                    isSelected
                      ? 'border-[#ef5a24] bg-orange-50/20 shadow-2xs'
                      : 'border-[#eae7e1] hover:bg-zinc-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={b.photoUrl}
                      alt={b.name}
                      className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#111827] truncate">{b.name}</h4>
                      <p className="text-[11px] sm:text-xs text-zinc-500 font-medium">{b.format}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold ${
                        b.status === 'Active'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#f1f5f9] text-[#64748b]'
                      }`}
                    >
                      {b.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION (2 COLUMNS: Recent Proof of Display & Recent Activity) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {/* LEFT COLUMN: Recent Proof of Display */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 w-full">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">Recent Proof of Display</h2>
            <button
              onClick={() => onNavigateTab?.('evidence')}
              className="text-xs sm:text-sm font-bold text-[#ef5a24] hover:text-[#d94e1d] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full">
            {recentProofItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenProof(item)}
                className="rounded-2xl border border-[#eae7e1] overflow-hidden bg-white hover:border-[#ef5a24]/50 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between w-full"
              >
                <div>
                  <div className="relative aspect-[16/10] sm:aspect-video bg-zinc-100 overflow-hidden">
                    <img
                      src={item.photoUrl}
                      alt={item.location}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 space-y-1">
                    <span className="text-[10px] sm:text-xs text-zinc-400 font-medium block">
                      {item.date}
                    </span>
                    <strong className="text-xs sm:text-sm font-extrabold text-[#111827] block truncate">
                      {item.location}
                    </strong>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 pt-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#dcfce7] text-[#15803d]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4 w-full">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">Recent Activity</h2>
            <button
              onClick={() => onNavigateTab?.('evidence')}
              className="text-xs sm:text-sm font-bold text-[#ef5a24] hover:text-[#d94e1d] transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3.5 sm:gap-4">
                {/* Activity Icon Box */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    act.iconType === 'camera'
                      ? 'bg-emerald-50 text-emerald-600'
                      : act.iconType === 'status'
                      ? 'bg-blue-50 text-blue-600'
                      : act.iconType === 'invoice'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-orange-50 text-orange-600'
                  }`}
                >
                  {act.iconType === 'camera' && <Camera className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {act.iconType === 'status' && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {act.iconType === 'invoice' && <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {act.iconType === 'billboard' && <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>

                {/* Activity Copy */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#111827] leading-tight">
                    {act.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-zinc-500 font-medium mt-0.5 truncate">
                    {act.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
