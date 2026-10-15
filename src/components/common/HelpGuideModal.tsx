import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Play,
  MapPin,
  Compass,
  Wrench,
  Camera,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  DollarSign,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HelpGuideModalProps {
  isOpen: boolean;
  role: UserRole;
  currentPageTitle?: string;
  onClose: () => void;
  onReplayTour: () => void;
  onNavigateTab?: (tabId: string) => void;
}

interface GuideTopic {
  id: string;
  title: string;
  icon: React.ElementType;
  relevantRoles: string[];
  summary: string;
  steps: string[];
  actionLabel?: string;
  actionTabId?: string;
}

const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'find-billboard',
    title: 'How to Find and Purchase a Billboard',
    icon: MapPin,
    relevantRoles: ['Customer / Client Company', 'Agency Admin', 'Campaign Manager', 'Account Manager'],
    summary: 'Search verified high-visibility locations and request reservations directly on the map.',
    steps: [
      'Open the Radar Map or Marketplace from your top bar or left navigation.',
      'Use metro filters (Lagos, Nairobi, Johannesburg, etc.) or format categories (DOOH, Unipole, Wallscape).',
      'Click any pin on the map to inspect daily traffic, dwell time, lux ratings, and daylight sightlines.',
      'Click "Reserve Site" or "Request Booking" to submit your flight dates.',
      'Review contract terms and proceed into escrow protection.',
    ],
    actionLabel: 'Browse Inventory',
    actionTabId: 'marketplace',
  },
  {
    id: 'track-campaign',
    title: 'How to Track a Campaign in Real Time',
    icon: Compass,
    relevantRoles: ['Customer / Client Company', 'Agency Admin', 'Campaign Manager', 'Operations Manager'],
    summary: 'Monitor flight progress through automated lifecycle milestones and live GPS telemetry.',
    steps: [
      'Navigate to "Campaign Flights" in your main sidebar.',
      'Select any flight to inspect its 5-stage progress tracker (Assigned → In Progress → Proof Submitted → Under Review → Completed).',
      'Inspect verified delivery rates (%) and live contractor dispatch logs.',
      'Examine the live interactive flight map to confirm geographic coverage across commuter corridors.',
      'Check sightline health: green indicates optimal visibility; amber or red alerts our field crew.',
    ],
    actionLabel: 'Track Flights',
    actionTabId: 'campaigns',
  },
  {
    id: 'manage-jobs',
    title: 'How to Manage Assigned Jobs & Work Orders',
    icon: Wrench,
    relevantRoles: ['Agency Admin', 'Operations Manager', 'Field Manager', 'Agency Staff', 'Vendor'],
    summary: 'Coordinate printing, installation and field verification tasks with contractors.',
    steps: [
      'Open the "Operations Hub" tab in your sidebar.',
      'Switch between "Asset Locations", "Flagged Sightline Issues", and "Work Orders".',
      'Assign field verification or mounting jobs to authorized vendors and field agents.',
      'Set deadlines and review contractor SLA turnaround times.',
      'Approve completed work to release milestone payments.',
    ],
    actionLabel: 'View Work Orders',
    actionTabId: 'operations',
  },
  {
    id: 'proof-of-work',
    title: 'How to Submit and Review Proof of Work (PoP)',
    icon: Camera,
    relevantRoles: ['Customer / Client Company', 'Agency Admin', 'Operations Manager', 'Field Agent', 'Vendor'],
    summary: 'Verify physical billboard installations with cryptographically stamped field photographs.',
    steps: [
      'Dispatched field operatives capture on-site photographs and wide-angle video directly from the location.',
      'The ADGRID engine validates sub-meter GNSS coordinates and optical illumination (Lux).',
      'Review proof items under "Proof Gallery" or within campaign flight details.',
      'Click "Inspect Proof" to compare the live photograph against the approved creative baseline.',
      'Mark as "Verified" or request a retake if there is any sightline obstruction.',
    ],
    actionLabel: 'Proof Gallery',
    actionTabId: 'evidence',
  },
  {
    id: 'view-reports',
    title: 'How to View and Export Reports',
    icon: FileText,
    relevantRoles: ['Customer / Client Company', 'Agency Admin', 'Finance Manager', 'Account Manager', 'Platform Admin'],
    summary: 'Download audit certificates, delivery compliance summaries and white-label client reports.',
    steps: [
      'Open any completed or active campaign flight.',
      'Click "Download PoP Audit Certificate" for a certified PDF with SHA-256 validation timestamps.',
      'Enterprise subscribers can generate white-label reports with custom agency and client branding.',
      'Export consolidated invoices and payment receipts from the Invoices tab.',
    ],
    actionLabel: 'View Reports',
    actionTabId: 'campaigns',
  },
  {
    id: 'owner-add-billboard',
    title: 'How to Add a Billboard Asset as an Owner',
    icon: MapPin,
    relevantRoles: ['Media Owner', 'Platform Admin'],
    summary: 'Register static and digital assets with coordinates, dimensions, illumination and card rates.',
    steps: [
      'Open "My Billboards" from your navigation menu.',
      'Click "Add Billboard Asset" or use the Excel/CSV importer to ingest bulk inventory.',
      'Enter the asset name, street location, arterial corridor, and exact GPS coordinates.',
      'Specify dimensions, format (Digital LED, Unipole, Gantry), and monthly asking price in USD.',
      'Submit the listing to publish it to the live network.',
    ],
    actionLabel: 'Add Billboard',
    actionTabId: 'inventory',
  },
  {
    id: 'owner-manage-bookings',
    title: 'How to Review and Confirm Agency Bookings',
    icon: CalendarCheck,
    relevantRoles: ['Media Owner', 'Platform Admin'],
    summary: 'Evaluate inbound RFQ proposals from advertising agencies and lock flight dates.',
    steps: [
      'Navigate to "Bookings & RFQs" to view inbound reservation requests.',
      'Inspect the advertiser brand, campaign flight duration, and proposed gross contract rate.',
      'Check for date overlap against your current inventory occupancy.',
      'Click "Approve & Confirm" to lock the flight and activate platform escrow.',
      'Click "Reject" if dates conflict or if commercial terms require revision.',
    ],
    actionLabel: 'View Bookings',
    actionTabId: 'bookings',
  },
  {
    id: 'owner-earnings-settlements',
    title: 'How to Understand Earnings & Escrow Settlements',
    icon: DollarSign,
    relevantRoles: ['Media Owner', 'Finance Manager', 'Platform Admin'],
    summary: 'Monitor gross contract values, cleared escrow releases and bank payouts.',
    steps: [
      'Open "Earnings & Reports" to review your concession settlement ledger.',
      'Cumulative Contract Value reflects all active and confirmed brand flights.',
      'Cleared Escrow Settlements indicates funds released following installation proof.',
      'Pending Contract Settlement shows funds held safely in milestone escrow.',
      'Click "Export CSV" to download audited payout reports for accounting.',
    ],
    actionLabel: 'View Earnings',
    actionTabId: 'revenue',
  },
];

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  role,
  currentPageTitle,
  onClose,
  onReplayTour,
  onNavigateTab,
}) => {
  const [expandedTopic, setExpandedTopic] = useState<string>('find-billboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const relevantTopics = GUIDE_TOPICS.filter((t) =>
    searchQuery.trim() === ''
      ? true
      : t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#eae7e1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#eae7e1] flex items-center justify-between gap-4 bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ef5a24]/10 text-[#ef5a24] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="help-modal-title"
                className="text-base font-black text-[#181716] tracking-tight"
              >
                Help & Operational Guidance
              </h2>
              <p className="text-xs text-zinc-500">
                Tailored instructions for {role} · {currentPageTitle || 'ADGRID Workspace'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Replay Intro Banner */}
        <div className="p-4 bg-[#fff9f6] border-b border-[#ef5a24]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#ef5a24] shrink-0" />
            <p className="text-xs text-zinc-700 font-semibold">
              Want a quick refresh of your workspace navigation?
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onReplayTour();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Replay Tour</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <input
            type="text"
            placeholder="Search guides, actions and workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#ef5a24]/20 focus:border-[#ef5a24]"
          />
        </div>

        {/* Accordion Topics */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {relevantTopics.map((topic) => {
            const isExpanded = expandedTopic === topic.id;
            const Icon = topic.icon;
            const isRelevantToRole = topic.relevantRoles.includes(role);

            return (
              <div
                key={topic.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-[#ef5a24]/30 bg-[#fffdfb] shadow-2xs'
                    : 'border-[#eae7e1] bg-white hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedTopic(isExpanded ? '' : topic.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isExpanded
                          ? 'bg-[#ef5a24] text-white'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-xs text-[#181716] truncate">
                          {topic.title}
                        </h3>
                        {isRelevantToRole && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {topic.summary}
                      </p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#eae7e1]/60 space-y-3">
                    <ol className="space-y-2 text-xs text-zinc-600 list-decimal list-inside leading-relaxed">
                      {topic.steps.map((s, idx) => (
                        <li key={idx} className="pl-1">
                          <span className="text-zinc-800">{s}</span>
                        </li>
                      ))}
                    </ol>

                    {topic.actionLabel && topic.actionTabId && onNavigateTab && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            onNavigateTab(topic.actionTabId!);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-[#181716] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{topic.actionLabel}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Footer */}
        <div className="p-4 border-t border-[#eae7e1] bg-[#faf9f6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-zinc-800 block">Need custom assistance?</span>
            <span className="text-zinc-500 text-[11px]">
              Our regional operations desk is online 24/7.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:support@adgrid.africa?subject=ADGRID%20Support%20Request"
              className="px-3 py-1.5 rounded-xl bg-white border border-[#eae7e1] hover:bg-zinc-50 font-bold text-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <span>Email Support</span>
            </a>
            <button
              onClick={() => {
                alert('Regional Operations Center: +234 (1) 800-ADGRID / +254 (20) 790-OOH');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#eae7e1] hover:bg-zinc-50 font-bold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Operations Hotline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
