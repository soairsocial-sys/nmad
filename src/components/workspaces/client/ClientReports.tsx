import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, Calendar, Filter, ExternalLink, Printer, Sparkles } from 'lucide-react';
import { WhiteLabelReportModal } from '../../reports/WhiteLabelReportModal';
import { ProofOfDisplayReportModal, ProofOfDisplayReportData } from '../../common/ProofOfDisplayReportModal';
import { useAuth } from '../../../context/AuthContext';

export const ClientReports: React.FC = () => {
  const { currentUser } = useAuth();
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ProofOfDisplayReportData | null>(null);

  const reportsList = [
    {
      id: 'POD-2025-06-LOS',
      title: 'Summer Sales Campaign — Mid-Flight Audit Report',
      period: 'June 1, 2025 – June 15, 2025',
      corridor: 'Lekki Expressway & Victoria Island DOOH',
      verificationScore: '99.4%',
      status: 'Certified Audit',
      generatedDate: 'June 15, 2025',
      sitesCount: 4,
      impressions: '1,420,000 Verified Views',
      samplePhoto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'POD-2025-05-LOS',
      title: 'Product Launch Campaign — Final Proof-of-Performance Report',
      period: 'May 5, 2025 – June 5, 2025',
      corridor: 'Ikoyi Link Bridge & Allen Avenue Mega Corridors',
      verificationScore: '100%',
      status: 'Certified Audit',
      generatedDate: 'June 6, 2025',
      sitesCount: 3,
      impressions: '2,890,000 Verified Views',
      samplePhoto: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'POD-2025-04-LOS',
      title: 'Q2 Brand Campaign — Comprehensive Flight Closeout Report',
      period: 'April 10, 2025 – May 10, 2025',
      corridor: 'Third Mainland Gantry & Maryland Arterial',
      verificationScore: '98.8%',
      status: 'Certified Audit',
      generatedDate: 'May 11, 2025',
      sitesCount: 5,
      impressions: '3,450,000 Verified Views',
      samplePhoto: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleOpenDetailedReport = (item: (typeof reportsList)[0]) => {
    const reportData: ProofOfDisplayReportData = {
      reportId: item.id,
      generatedAt: new Date().toISOString(),
      campaign: item.title.split('—')[0].trim(),
      client: currentUser?.organization || 'GreenTech Solutions',
      billboard: item.corridor,
      billboardId: 'LOS-REG-01',
      metro: 'Lagos',
      corridor: item.corridor,
      agent: 'Certified Field Operative (GPS Validated)',
      timestamp: item.generatedDate,
      verificationResult: 'Full optical and physical presence verified. Zero sightline obstruction.',
      verificationState: 'VERIFIED',
      registeredCoordinates: { lat: 6.4474, lng: 3.4723 },
      capturedCoordinates: { lat: 6.4475, lng: 3.4722 },
      distanceMeters: 14,
      gpsAccuracyMeters: 4,
      acceptableRadiusMeters: 50,
      locationStatus: 'LOCATION_VERIFIED',
      luxScore: 1420,
      evidence: {
        primaryPhoto: item.samplePhoto,
        allPhotos: [item.samplePhoto],
      },
      auditSignals: {
        networkNodeIp: '197.210.84.12 (Audited Node)',
        deviceFingerprint: 'Mobile Field OS Hardware Stamped',
      },
    };
    setSelectedReport(reportData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#181716] tracking-tight">
              Proof-of-Performance & Audit Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audit Certified
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Download certified PDF proof reports, white-label client decks, optical verification records, and escrow certificates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWhiteLabelOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate White-Label PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#eae7e1] shadow-2xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PoP Compliance</span>
          <strong className="text-2xl font-black text-[#181716] block mt-1">99.7%</strong>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Audit benchmark passed</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#eae7e1] shadow-2xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Audited Flights</span>
          <strong className="text-2xl font-black text-[#181716] block mt-1">3 Completed</strong>
          <span className="text-[11px] text-zinc-500 font-medium mt-0.5 block">1 Active ongoing</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#eae7e1] shadow-2xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Verified Impressions</span>
          <strong className="text-2xl font-black text-[#181716] block mt-1">7.76M</strong>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Corridor vehicular counts</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#eae7e1] shadow-2xs">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Proof Certificates</span>
          <strong className="text-2xl font-black text-[#181716] block mt-1">8 Signed</strong>
          <span className="text-[11px] text-zinc-500 font-medium mt-0.5 block">Cryptographically stamped</span>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-[#eae7e1] overflow-hidden shadow-2xs divide-y divide-[#eae7e1]">
        {reportsList.map((item) => (
          <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ef5a24]/10 text-[#ef5a24] flex items-center justify-center shrink-0 border border-[#ef5a24]/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-[#181716]">{item.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.verificationScore} Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                    {item.id}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  Corridor: <strong className="text-zinc-800">{item.corridor}</strong> · Period: <strong>{item.period}</strong>
                </p>
                <p className="text-[11px] text-zinc-400">
                  {item.sitesCount} Sites Audited · {item.impressions} · Certified Date: {item.generatedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleOpenDetailedReport(item)}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-[#181716] transition-colors cursor-pointer"
              >
                Inspect Certificate
              </button>
              <button
                onClick={() => setIsWhiteLabelOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#181716] hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#ef5a24]" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Modal */}
      <ProofOfDisplayReportModal
        isOpen={Boolean(selectedReport)}
        report={selectedReport}
        defaultTier="enterprise"
        onClose={() => setSelectedReport(null)}
      />

      {/* White Label Modal */}
      <WhiteLabelReportModal
        isOpen={isWhiteLabelOpen}
        onClose={() => setIsWhiteLabelOpen(false)}
        campaignData={{
          id: 'cmp-summer',
          name: 'Summer Sales Campaign',
          clientName: currentUser?.organization || 'GreenTech Solutions',
          budgetUSD: 18200,
          spendUSD: 18200,
          deliveryRate: 99.7,
          verificationRate: 100,
          startDate: '2025-06-01',
          endDate: '2025-07-12',
          locations: [],
        }}
      />
    </div>
  );
};
