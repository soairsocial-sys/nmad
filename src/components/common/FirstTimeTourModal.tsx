import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Megaphone,
  Wrench,
  ShieldCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Camera,
  Layers,
  Clock,
  CalendarCheck,
  DollarSign,
} from 'lucide-react';
import { UserRole } from '../../types';

export interface TourStep {
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  primaryActionLabel?: string;
  tip?: string;
}

interface FirstTimeTourModalProps {
  isOpen: boolean;
  role: UserRole;
  userName: string;
  organization: string;
  onClose: () => void;
  onFinish: () => void;
  onAction?: (actionId: string) => void;
}

const ROLE_TOUR_CONFIG: Record<string, TourStep[]> = {
  'Customer / Client Company': [
    {
      title: 'Welcome to ADGRID for Brands',
      tagline: 'Discover, book and track out-of-home advertising across African metros.',
      description:
        'Your enterprise brand portal connects directly to verified media owners, providing instant availability, transparent pricing and live proof of display.',
      icon: Megaphone,
      tip: 'Get started in under two minutes with map-first discovery.',
    },
    {
      title: 'Action 1: Find a Billboard on the Map',
      tagline: 'Search verified high-visibility sites along key commuter corridors.',
      description:
        'Use the interactive radar map to explore static unipoles, 3D digital LED monoliths and gantry displays with real traffic impressions and GPS coordinates.',
      icon: MapPin,
      primaryActionLabel: 'Explore Map',
      tip: 'Filter by city, format or availability status.',
    },
    {
      title: 'Action 2: Track Your Campaign Flights',
      tagline: 'Watch live mounting status, inspection schedules and flight dates.',
      description:
        'Every flight features a step-by-step progress tracker that shows exactly when your creative is scheduled, printed, mounted and verified on the street.',
      icon: Compass,
      primaryActionLabel: 'Track Campaigns',
      tip: 'Never guess if your billboard is live — tracking updates are verified.',
    },
    {
      title: 'Action 3: Inspect Verified Proof-of-Play Photos',
      tagline: 'Cryptographically timestamped field photographs from local dispatch crews.',
      description:
        'Audit day and night illumination, sightlines, distance and GPS accuracy with high-resolution evidence captured directly from the physical location.',
      icon: Camera,
      primaryActionLabel: 'View Evidence',
      tip: 'Download proof certificates for your marketing and finance audits.',
    },
    {
      title: 'Action 4: Reports, Invoices & Help Anytime',
      tagline: 'Export consolidated billing and performance summaries.',
      description:
        'Access escrow billing statements, download white-label PDF reports and reach our 24/7 operations desk whenever you need corridor assistance.',
      icon: FileText,
      tip: 'Click the Help & Guide button in the top bar to replay this guide anytime.',
    },
  ],
  'Agency Admin': [
    {
      title: 'Welcome to Agency Command Center',
      tagline: 'The complete operating system for out-of-home media planning and execution.',
      description:
        'Coordinate multiple client accounts, assign mounting contractors, monitor live corridor health and track revenue pacing across the continent.',
      icon: Layers,
      tip: 'All operational tools are accessible from your sidebar and top navigation.',
    },
    {
      title: 'Action 1: View Assigned Jobs & Work Orders',
      tagline: 'Instant visibility over print runs, flight mountings and field audits.',
      description:
        'Keep teams aligned with real-time job queues. Monitor contractor completion dates, review submitted evidence and flag obstructions instantly.',
      icon: Wrench,
      primaryActionLabel: 'View Work Orders',
      tip: 'Jobs update automatically when field agents submit proof.',
    },
    {
      title: 'Action 2: Inspect the Live Corridor Map',
      tagline: 'Visual corridor monitoring with GPS telemetry.',
      description:
        'Inspect your entire billboard network on an interactive map. Pinpoint healthy sites, open sightline issues and live crews on the road.',
      icon: MapPin,
      primaryActionLabel: 'Inspect Flight Map',
      tip: 'Toggle between map and list views for rapid filtering.',
    },
    {
      title: 'Action 3: Campaign Delivery Pacing & Proof',
      tagline: 'Automated Proof-of-Performance (PoP) compliance validation.',
      description:
        'Review optical lux readings, daylight photographs and escrow release milestones without manual phone calls or fragmented messaging threads.',
      icon: ShieldCheck,
      tip: '100% escrow-backed guarantees for client transparency.',
    },
    {
      title: 'Action 4: Inventory Ingestion & Spreadsheets',
      tagline: 'Import your existing billboard fleet in seconds.',
      description:
        'Upload your agency Excel or CSV spreadsheets directly into ADGRID without re-entering assets manually. We map your formats, sizes and corridors.',
      icon: FileText,
      primaryActionLabel: 'Import Inventory',
      tip: 'Supports bulk updates anchored by your unique Billboard IDs.',
    },
  ],
  'Platform Admin': [
    {
      title: 'Platform Governance & Infrastructure',
      tagline: 'Pan-African cluster telemetry, multi-tenant security and subscriptions.',
      description:
        'Govern organizations, manage subscription feature entitlements, monitor API relay health and audit immutable cryptographic proof logs.',
      icon: ShieldCheck,
      tip: 'Centralized control for all tenant workspaces.',
    },
    {
      title: 'Action 1: Operational Cluster Overview',
      tagline: 'Monitor live network performance and priority exceptions.',
      description:
        'Review fleet health distributions, active brand contracts and pending tenant approvals across all regional corridors.',
      icon: Compass,
      primaryActionLabel: 'Platform Overview',
      tip: 'Real-time telemetry from edge nodes and satellite relays.',
    },
    {
      title: 'Action 2: Subscription & Entitlement Management',
      tagline: 'Configure plans, feature gates and quota limits without deployments.',
      description:
        'Control Starter, Professional, and Enterprise tiers with granular feature flags (360° views, comparison matrix, white-label reporting, API access).',
      icon: Layers,
      primaryActionLabel: 'Manage Plans',
      tip: 'Future features can be registered as new entitlement keys dynamically.',
    },
    {
      title: 'Action 3: Tenant Organizations & Audit Stream',
      tagline: 'Review cryptographic logs and enterprise access.',
      description:
        'Inspect SHA-256 proof hashes, manage role-based permissions and provision new agency or media owner concessionaires.',
      icon: FileText,
      tip: 'Every security and escrow action is permanently audited.',
    },
  ],
  'Media Owner': [
    {
      title: 'Welcome to Concession Asset Command',
      tagline: 'Your complete operating portal as a billboard owner & concessionaire.',
      description:
        'Manage your roadside and digital assets, publish card rates, approve inbound agency flight proposals and receive guaranteed escrow payouts.',
      icon: Layers,
      tip: 'Only legal concessionaires can list and monetize inventory here.',
    },
    {
      title: 'Action 1: Add & Manage Billboard Listings',
      tagline: 'Publish your digital LEDs, static unipoles and gantry displays.',
      description:
        'Enter exact coordinates, formats, dimensions, daylight lux ratings and monthly card rates. Your verified inventory becomes instantly bookable by certified agencies.',
      icon: MapPin,
      primaryActionLabel: 'My Billboards',
      tip: 'Upload high-resolution photos to attract top brand spend.',
    },
    {
      title: 'Action 2: Toggle Availability & Prevent Conflicts',
      tagline: 'Set dates and manage availability status in real time.',
      description:
        'Toggle between Available Now, Occupied, and Next 14 Days to prevent double bookings and showcase upcoming flight openings.',
      icon: Clock,
      primaryActionLabel: 'Availability',
      tip: 'Availability updates sync directly to the agency discovery radar.',
    },
    {
      title: 'Action 3: Inbound Booking Requests & RFQs',
      tagline: 'Review advertiser proposals, flight dates and contract budgets.',
      description:
        'Accept or decline flight applications from marketing agencies. Never represent a flight as confirmed until you approve the commercial terms.',
      icon: CalendarCheck,
      primaryActionLabel: 'Bookings & RFQs',
      tip: 'Review brand creative alignment and flight dates before accepting.',
    },
    {
      title: 'Action 4: Escrow Settlements & Earnings',
      tagline: 'Transparent net payouts cleared directly upon verification.',
      description:
        'Track gross contract values, platform commissions, cleared escrow releases and pending payments. Funds are locked up front before printing begins.',
      icon: DollarSign,
      primaryActionLabel: 'Earnings & Reports',
      tip: 'Replay this guide anytime by clicking Help & Guide.',
    },
  ],
};

export const FirstTimeTourModal: React.FC<FirstTimeTourModalProps> = ({
  isOpen,
  role,
  userName,
  organization,
  onClose,
  onFinish,
  onAction,
}) => {
  const steps =
    ROLE_TOUR_CONFIG[role] ||
    ROLE_TOUR_CONFIG['Agency Admin'] ||
    ROLE_TOUR_CONFIG['Customer / Client Company'];

  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#eae7e1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Progress Bar & Header */}
        <div className="p-5 pb-3 border-b border-[#eae7e1] flex items-center justify-between gap-4 bg-[#faf9f6]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef5a24]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
              Welcome Guide · {organization}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Skip guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Dots */}
        <div className="px-6 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-7 bg-[#ef5a24]'
                    : idx < currentStep
                    ? 'w-2 bg-emerald-600'
                    : 'w-2 bg-zinc-200'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-bold text-zinc-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Large Visual Icon Card */}
          <div className="w-14 h-14 rounded-2xl bg-[#fff5f2] border border-[#ef5a24]/20 flex items-center justify-center text-[#ef5a24] shadow-xs">
            <Icon className="w-7 h-7" />
          </div>

          <div>
            <h2
              id="tour-modal-title"
              className="text-xl font-black text-[#181716] tracking-tight"
            >
              {step.title}
            </h2>
            <p className="text-xs font-semibold text-[#ef5a24] mt-1">
              {step.tagline}
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed mt-2.5">
              {step.description}
            </p>
          </div>

          {/* Quick Tip Box */}
          {step.tip && (
            <div className="p-3.5 rounded-2xl bg-[#faf9f6] border border-[#eae7e1] flex items-start gap-2.5 text-xs text-zinc-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-zinc-800">Quick Tip:</strong> {step.tip}
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-[#eae7e1] bg-[#faf9f6] flex items-center justify-between gap-3">
          <div>
            {!isFirst ? (
              <button
                onClick={handleBack}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                Skip intro
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step.primaryActionLabel && onAction && (
              <button
                onClick={() => {
                  onAction(step.primaryActionLabel!);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-[#eae7e1] text-xs font-bold text-[#181716] shadow-2xs transition-colors cursor-pointer"
              >
                {step.primaryActionLabel}
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{isLast ? 'Get Started' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
