import React from 'react';
import {
  CheckCircle2,
  Clock,
  Camera,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

export interface CampaignProgressStep {
  key: 'assigned' | 'in_progress' | 'proof_submitted' | 'under_review' | 'completed';
  label: string;
  sublabel: string;
  status: 'completed' | 'current' | 'upcoming' | 'alert';
  timestamp?: string | null;
  responsibleParty?: string | null;
  evidenceUrl?: string | null;
  details?: string | null;
}

interface CampaignProgressTrackerProps {
  campaignName: string;
  status: string; // e.g. "Active", "Live", "Verified", "Pending", "Completed", "Needs Attention"
  startDate: string | Date;
  endDate: string | Date;
  responsibleParty?: string;
  deliveryRate?: number;
  verificationRate?: number;
  latestPhotoUrl?: string;
  evidenceCount?: number;
  hasIssue?: boolean;
  issueDescription?: string;
  onOpenProofModal?: (item?: any) => void;
  onOpenLiveMap?: () => void;
}

export const CampaignProgressTracker: React.FC<CampaignProgressTrackerProps> = ({
  campaignName,
  status,
  startDate,
  endDate,
  responsibleParty,
  deliveryRate = 0,
  verificationRate = 0,
  latestPhotoUrl,
  evidenceCount = 0,
  hasIssue = false,
  issueDescription,
  onOpenProofModal,
  onOpenLiveMap,
}) => {
  const normStatus = (status || '').toLowerCase().trim();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Compute truth-based lifecycle steps from real data
  const isCompleted = normStatus === 'completed' || normStatus === 'expired';
  const isVerified = normStatus === 'verified' || verificationRate >= 95;
  const isProofSubmitted = isVerified || (evidenceCount > 0) || Boolean(latestPhotoUrl);
  const isInProgress = isProofSubmitted || normStatus === 'active' || normStatus === 'live' || (now >= start);

  const steps: CampaignProgressStep[] = [
    {
      key: 'assigned',
      label: 'Assigned & Contracted',
      sublabel: 'Flight inventory locked and escrow funded',
      status: 'completed',
      timestamp: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      responsibleParty: responsibleParty || 'Adgrid Media Network',
    },
    {
      key: 'in_progress',
      label: 'In Progress / Mounting',
      sublabel: 'Creative printed, transported & mounted',
      status: hasIssue
        ? 'alert'
        : isProofSubmitted || isCompleted
        ? 'completed'
        : isInProgress
        ? 'current'
        : 'upcoming',
      timestamp: isInProgress ? 'Flight Active' : `Scheduled for ${start.toLocaleDateString()}`,
      responsibleParty: 'Regional Field Crew & Contractor',
      details: hasIssue ? issueDescription || 'Field obstruction flagged' : null,
    },
    {
      key: 'proof_submitted',
      label: 'Proof Submitted',
      sublabel: 'Geo-tagged field photographs & lux sensor data',
      status: isCompleted || isVerified
        ? 'completed'
        : isProofSubmitted
        ? 'current'
        : 'upcoming',
      timestamp: isProofSubmitted ? 'Captured by Field Dispatch' : 'Awaiting Crew Capture',
      evidenceUrl: latestPhotoUrl || null,
      responsibleParty: 'Certified Field Operative',
    },
    {
      key: 'under_review',
      label: 'Verification & PoP Audit',
      sublabel: 'AI line-of-sight & optical compliance test',
      status: isCompleted
        ? 'completed'
        : isVerified
        ? 'completed'
        : isProofSubmitted
        ? 'current'
        : 'upcoming',
      timestamp: isVerified ? `${verificationRate}% PoP Certified` : 'Pending Final Review',
      details: `${verificationRate}% verification compliance score`,
    },
    {
      key: 'completed',
      label: 'Flight Completed',
      sublabel: 'Full contract delivery & audit clearance',
      status: isCompleted ? 'completed' : 'upcoming',
      timestamp: isCompleted
        ? end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : `Expected ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#eae7e1] p-5 sm:p-6 shadow-2xs space-y-6">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Live Lifecycle Tracker
            </span>
            <span className="text-zinc-300">·</span>
            <StatusBadge status={status} size="sm" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#181716] tracking-tight mt-0.5">
            {campaignName}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Flight window: {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} –{' '}
            {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLiveMap && (
            <button
              onClick={onOpenLiveMap}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-[#eae7e1] text-xs font-bold text-[#181716] flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Live Map Radar</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          )}

          {latestPhotoUrl && onOpenProofModal && (
            <button
              onClick={() => onOpenProofModal({ imageUrl: latestPhotoUrl, siteName: campaignName })}
              className="px-3.5 py-2 rounded-xl bg-[#fff5f2] hover:bg-[#ffece6] border border-[#ef5a24]/20 text-xs font-bold text-[#ef5a24] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Inspect Proof</span>
            </button>
          )}
        </div>
      </div>

      {/* Modern Stepper / Progress Track */}
      <div className="relative">
        {/* Desktop Stepper */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-3">
          {steps.map((s, idx) => {
            const isDone = s.status === 'completed';
            const isCurr = s.status === 'current';
            const isAlert = s.status === 'alert';

            return (
              <div
                key={s.key}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurr
                    ? 'border-[#ef5a24] bg-[#fffaf8] shadow-xs'
                    : isAlert
                    ? 'border-rose-300 bg-rose-50/50'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-zinc-200/80 bg-zinc-50/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurr
                          ? 'bg-[#ef5a24] text-white ring-4 ring-[#ef5a24]/15'
                          : isAlert
                          ? 'bg-rose-600 text-white'
                          : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'text-emerald-800 bg-emerald-100'
                          : isCurr
                          ? 'text-[#ef5a24] bg-orange-100'
                          : isAlert
                          ? 'text-rose-800 bg-rose-100'
                          : 'text-zinc-500 bg-zinc-200'
                      }`}
                    >
                      {isDone ? 'Completed' : isCurr ? 'Active Step' : isAlert ? 'Needs Action' : 'Upcoming'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-[#181716] leading-snug">
                    {s.label}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">
                    {s.sublabel}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-200/60 text-[10px]">
                  {s.timestamp && (
                    <div className="text-zinc-600 font-semibold truncate">
                      {s.timestamp}
                    </div>
                  )}
                  {s.responsibleParty && (
                    <div className="text-zinc-400 truncate mt-0.5">
                      By: {s.responsibleParty}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Vertical Timeline */}
        <div className="lg:hidden space-y-4">
          {steps.map((s, idx) => {
            const isDone = s.status === 'completed';
            const isCurr = s.status === 'current';
            const isAlert = s.status === 'alert';

            return (
              <div key={s.key} className="flex items-start gap-3 relative">
                {/* Vertical connecting line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-px ${
                      isDone ? 'bg-emerald-500' : 'bg-zinc-200'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative z-10 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurr
                      ? 'bg-[#ef5a24] text-white ring-4 ring-[#ef5a24]/15'
                      : isAlert
                      ? 'bg-rose-600 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div
                  className={`flex-1 p-3.5 rounded-2xl border ${
                    isCurr
                      ? 'border-[#ef5a24] bg-[#fffaf8]'
                      : isAlert
                      ? 'border-rose-300 bg-rose-50/50'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-zinc-200 bg-zinc-50/40 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-xs text-[#181716]">{s.label}</h4>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'text-emerald-800 bg-emerald-100'
                          : isCurr
                          ? 'text-[#ef5a24] bg-orange-100'
                          : isAlert
                          ? 'text-rose-800 bg-rose-100'
                          : 'text-zinc-500 bg-zinc-200'
                      }`}
                    >
                      {isDone ? 'Completed' : isCurr ? 'Active Step' : isAlert ? 'Attention' : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{s.sublabel}</p>

                  <div className="mt-2 pt-2 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-500">
                    <span>{s.timestamp}</span>
                    {s.responsibleParty && <span>{s.responsibleParty}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Evidence Preview Strip if available */}
      {latestPhotoUrl && (
        <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#eae7e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={latestPhotoUrl}
              alt={campaignName}
              className="w-16 h-12 rounded-xl object-cover border border-[#eae7e1] shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Latest Verified Proof of Play
              </span>
              <p className="text-xs font-bold text-[#181716] mt-0.5">
                On-site camera telemetry verified via GPS accuracy
              </p>
            </div>
          </div>

          {onOpenProofModal && (
            <button
              onClick={() => onOpenProofModal({ imageUrl: latestPhotoUrl, siteName: campaignName })}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-[#eae7e1] text-xs font-bold text-[#181716] transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              Enlarge Photo Proof
            </button>
          )}
        </div>
      )}
    </div>
  );
};
