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
  DollarSign,
  Plus,
  CalendarCheck,
  Building2,
  Clock,
  Eye,
  Lock,
} from 'lucide-react';
import { useBillboards } from '../../../context/BillboardContext';
import { useAuth } from '../../../context/AuthContext';
import { AddBillboardModal } from '../../modals/AddBillboardModal';
import { MetroCode } from '../../../types';

interface OwnerOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onOpenAddBillboardModal?: () => void;
}

export const OwnerOnboardingWizard: React.FC<OwnerOnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  onOpenAddBillboardModal,
}) => {
  const { addBillboard } = useBillboards();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Step 2 Form: Business & Identity Details
  const [companyName, setCompanyName] = useState(currentUser?.organization || 'Continental Outdoor Concession');
  const [licenseNumber, setLicenseNumber] = useState('LASAA/OOH/VOL.4/2024-REG');
  const [country, setCountry] = useState('Nigeria');
  const [metro, setMetro] = useState<MetroCode>('LOS');
  const [contactName, setContactName] = useState(currentUser?.name || 'Folashade Adeleke');
  const [contactPhone, setContactPhone] = useState('+234 1 295 8820');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || 'fadeleke@continentaloutdoor.ng');
  const [payoutBank, setPayoutBank] = useState('Access Bank Plc (Escrow Direct)');
  const [accountNumber, setAccountNumber] = useState('0129384756');

  // Step 4 Quick First Billboard Draft
  const [bbName, setBbName] = useState('');
  const [bbLocation, setBbLocation] = useState('');
  const [bbCorridor, setBbCorridor] = useState('');
  const [bbLat, setBbLat] = useState('6.4474');
  const [bbLng, setBbLng] = useState('3.4723');
  const [bbFormat, setBbFormat] = useState('Digital Billboard (LED)');
  const [bbRate, setBbRate] = useState<number>(3500);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleQuickSubmitBillboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bbName.trim() || !bbLocation.trim() || !bbCorridor.trim()) return;

    try {
      addBillboard({
        name: bbName.trim(),
        metro,
        location: bbLocation.trim(),
        corridor: bbCorridor.trim(),
        lat: Number(bbLat),
        lng: Number(bbLng),
        format: bbFormat,
        dimensions: '20m x 8m (160 sq.m)',
        priceMonthlyUSD: Number(bbRate),
        mediaOwnerCompany: companyName,
        licenseNumber,
        contactPerson: contactName,
        contactEmail,
        contactPhone,
        status: 'Live & Verified',
      });
      setIsSubmitted(true);
      setStep(5);
    } catch {
      // handled
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#eae7e1] shadow-2xl overflow-hidden my-8">
        {/* Wizard Header with Progress */}
        <div className="bg-[#181716] text-white p-6 pb-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef5a24] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                Billboard Owner Onboarding & Verification
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-2">
            <span>Step {step} of 5</span>
            <span className="text-zinc-400">
              {step === 1 && 'Welcome & Benefits'}
              {step === 2 && 'Concession Details'}
              {step === 3 && 'Verification Policy'}
              {step === 4 && 'Add First Billboard'}
              {step === 5 && 'Activation & Review'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ef5a24] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Steps Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* STEP 1: Welcome & Benefits */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-[#ef5a24]/10 text-[#ef5a24] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#181716] tracking-tight">
                  Welcome to ADGRID for Billboard Owners
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
                  Monetize your outdoor advertising concession with pre-vetted marketing agencies, instant RFQ booking requests, and guaranteed escrow clearing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ef5a24] flex items-center justify-center mx-auto font-black text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#181716]">Fleet Control</h4>
                  <p className="text-[11px] text-zinc-500">
                    Manage static unipoles, digital LEDs, and gantry displays with real-time card rates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-black text-xs">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#181716]">Escrow Payouts</h4>
                  <p className="text-[11px] text-zinc-500">
                    No chasing receivables. Bookings are funded up front in platform escrow before printing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto font-black text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-xs text-[#181716]">Verified Network</h4>
                  <p className="text-[11px] text-zinc-500">
                    Approve or decline inbound flight applications from top regional and international agencies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Concession Details */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="font-extrabold text-base text-[#181716]">Concession & Business Profile</h3>
                <p className="text-xs text-zinc-500">
                  Confirm your operating entity and regulatory concession credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Concessionaire Entity Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Regulatory License / Permit Number *
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. LASAA/OOH/VOL.4/2024"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Primary Regional Metro *
                  </label>
                  <select
                    value={metro}
                    onChange={(e) => setMetro(e.target.value as MetroCode)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  >
                    <option value="LOS">Lagos, Nigeria (LOS)</option>
                    <option value="ABJ">Abuja (FCT), Nigeria (ABJ)</option>
                    <option value="PHC">Port Harcourt, Nigeria (PHC)</option>
                    <option value="IBD">Ibadan, Nigeria (IBD)</option>
                    <option value="KAN">Kano, Nigeria (KAN)</option>
                    <option value="ACC">Accra, Ghana (ACC)</option>
                    <option value="NBO">Nairobi, Kenya (NBO)</option>
                    <option value="JNB">Johannesburg, South Africa (JNB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Authorized Commercial Representative *
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Operations Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Settlement Bank & Account *
                  </label>
                  <input
                    type="text"
                    value={`${payoutBank} · ${accountNumber}`}
                    onChange={(e) => setPayoutBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Policy */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <h3 className="font-extrabold text-base text-[#181716]">Verification & Marketplace Standards</h3>
                <p className="text-xs text-zinc-500">
                  How ADGRID protects your concession rights and maintains trust with multinational advertisers.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-amber-950">Concession Exclusivity Rule</h4>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Only the legal owner or concessionaire of a site may publish rate cards and accept bookings. Agencies representing clients book inventory through your approved listings.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
                  <Camera className="w-5 h-5 text-zinc-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-zinc-900">Physical Site Audit & GPS Precision</h4>
                    <p className="text-[11px] text-zinc-600 leading-relaxed">
                      All new billboard listings are verified using high-precision GNSS coordinates and sightline photos. Listings without valid coordinates are placed in pending status.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-950">Escrow Protected Contracts</h4>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Funds are held securely when an agency confirms a flight. Payouts are triggered immediately upon field verification without delays or renegotiation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Add First Billboard Listing */}
          {step === 4 && (
            <form onSubmit={handleQuickSubmitBillboard} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#181716]">List Your First Billboard Asset</h3>
                  <p className="text-xs text-zinc-500">
                    Add one site now to initialize your live concession inventory.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-[#ef5a24]/30 text-xs font-bold text-[#ef5a24] cursor-pointer"
                >
                  Advanced Form
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Billboard Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bbName}
                    onChange={(e) => setBbName(e.target.value)}
                    placeholder="e.g. Lekki Toll Plaza High-Impact DOOH"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Format *
                  </label>
                  <select
                    value={bbFormat}
                    onChange={(e) => setBbFormat(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  >
                    <option value="Digital Billboard (LED)">Digital Billboard (LED)</option>
                    <option value="Iconic 3D LED Monolith">Iconic 3D LED Monolith</option>
                    <option value="Static Unipole">Static Unipole</option>
                    <option value="Gantry Monolith">Gantry Monolith</option>
                    <option value="Static Wallscape">Static Wallscape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={bbLocation}
                    onChange={(e) => setBbLocation(e.target.value)}
                    placeholder="e.g. Lekki-Epe Expressway, KM 14"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Traffic Corridor *
                  </label>
                  <input
                    type="text"
                    required
                    value={bbCorridor}
                    onChange={(e) => setBbCorridor(e.target.value)}
                    placeholder="e.g. Lekki Coastal Expressway"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-semibold text-zinc-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Monthly Card Rate ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={bbRate}
                    onChange={(e) => setBbRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-black text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    GPS Coordinates (Lat / Lng)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={bbLat}
                      onChange={(e) => setBbLat(e.target.value)}
                      placeholder="Lat"
                      className="w-full px-2.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-medium focus:bg-white focus:outline-none"
                    />
                    <input
                      type="number"
                      step="any"
                      value={bbLng}
                      onChange={(e) => setBbLng(e.target.value)}
                      placeholder="Lng"
                      className="w-full px-2.5 py-2 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-xs font-medium focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save & Submit Site
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Activation & Review Status */}
          {step === 5 && (
            <div className="text-center max-w-lg mx-auto space-y-4 animate-in fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Concession Activated & Verified
                </span>
                <h3 className="text-2xl font-black text-[#181716] tracking-tight mt-2">
                  You're Ready to Receive RFQs!
                </h3>
                <p className="text-xs text-zinc-500 font-normal leading-relaxed mt-1">
                  Your concession console is now fully configured. Inbound booking requests from certified advertising agencies will appear directly on your dashboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-600 font-medium">
                  <span>Concession Entity:</span>
                  <strong className="text-zinc-900">{companyName}</strong>
                </div>
                <div className="flex items-center justify-between text-zinc-600 font-medium">
                  <span>Permit Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified ({licenseNumber})
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600 font-medium">
                  <span>Marketplace Listing:</span>
                  <span className="text-sky-700 font-bold">Live for Agency Discovery</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-5 border-t border-[#eae7e1] bg-[#faf9f6] flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              Skip For Now
            </button>
          )}

          <div className="flex items-center gap-2">
            {step < 4 && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
              >
                Skip to Summary
              </button>
            )}

            {step === 5 && (
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-md shadow-[#ef5a24]/20 transition-all cursor-pointer"
              >
                Go to My Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Modal for advanced full Add Billboard */}
        <AddBillboardModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultCompany={companyName}
          onSuccess={() => {
            setIsAddModalOpen(false);
            setStep(5);
          }}
        />
      </div>
    </div>
  );
};
