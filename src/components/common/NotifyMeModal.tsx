import React, { useState } from 'react';
import {
  X,
  Bell,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  ArrowRight,
  Layers,
  Radio,
} from 'lucide-react';
import { MarketplaceBillboard } from '../../types';
import { useAuth } from '../../context/AuthContext';

export interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  billboard: MarketplaceBillboard | null;
  onSubscribed?: (billboardId: string) => void;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  onClose,
  billboard,
  onSubscribed,
}) => {
  const {
    currentUser,
    isSubscribedToBillboard,
    subscribeToBillboardAlert,
    unsubscribeFromBillboardAlert,
  } = useAuth();

  const isSubscribed = billboard ? isSubscribedToBillboard(billboard.id) : false;

  const [email, setEmail] = useState(currentUser?.email || '');
  const [noticeDays, setNoticeDays] = useState<number>(14);
  const [alertType, setAlertType] = useState<'IMMEDIATE' | 'EXPIRATION_EARLY' | 'RATE_DROP'>('IMMEDIATE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('Email alert activated successfully.');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen || !billboard) return null;

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    setErrorMessage(null);
    try {
      const res = await unsubscribeFromBillboardAlert(billboard.id);
      if (res.success) {
        setSuccessMessage('Unsubscribed from availability alerts for this billboard.');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1800);
      } else {
        setErrorMessage(res.message || 'Failed to unsubscribe.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with alert server.');
    } finally {
      setIsUnsubscribing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please provide a valid agency notification email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await subscribeToBillboardAlert(billboard, {
        billboardName: billboard.name,
        noticeDays,
        alertType,
        email: email.trim(),
      } as any);

      if (res.success) {
        setSuccessMessage(res.message || `Subscribed to email availability alerts for ${billboard.name}.`);
        setIsSuccess(true);
        if (onSubscribed) {
          onSubscribed(billboard.id);
        }
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      } else {
        setErrorMessage(res.message || 'Failed to register notification subscription.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to alert notification rail.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-[#fbfaf7] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ef5a24] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ef5a24]/20 mt-0.5">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Availability Alert Subscription
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                  Active Radar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Get an automatic email notification the moment this prime corridor asset is vacated or unlocked for booking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billboard Teaser Card */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
            <img
              src={billboard.previewUrl}
              alt={billboard.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ef5a24]">
                  {billboard.format}
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] font-bold text-slate-500">{billboard.dimensions}</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 truncate mt-0.5">{billboard.name}</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{billboard.location}</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black">
                {billboard.availabilityStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-3">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">Success!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSubscribed && (
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#ef5a24] shrink-0" />
                    <span className="font-bold">You are subscribed to alerts for this location.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={isUnsubscribing}
                    className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUnsubscribing ? 'Canceling...' : 'Unsubscribe'}
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <X className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Notification Email (Agency Inbox)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="planning@agency.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ef5a24]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Alerts will be addressed to {currentUser?.name || 'Authorized Agency Planner'} ({currentUser?.organization || 'Agency'}).
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Alert Trigger Timing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Instant', days: 0, sub: 'Immediate availability' },
                    { label: '14 Days Early', days: 14, sub: 'Before flight end' },
                    { label: '30 Days Early', days: 30, sub: 'Advance corridor lock' },
                  ].map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setNoticeDays(opt.days)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        noticeDays === opt.days
                          ? 'bg-[#181716] text-white border-[#181716] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-black text-xs">{opt.label}</span>
                      <span className="block text-[9px] opacity-70 mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Alert Triggers
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'IMMEDIATE',
                      title: 'Live Vacancy & Booking Window Opens',
                      desc: 'Alert me immediately when current campaign vacates this location.',
                    },
                    {
                      id: 'EXPIRATION_EARLY',
                      title: 'Pre-Expiration Right of First Refusal',
                      desc: 'Alert me before advertiser contract renews, allowing priority counter-offer.',
                    },
                  ].map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors cursor-pointer ${
                        alertType === t.id
                          ? 'border-[#ef5a24] bg-orange-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === t.id}
                        onChange={() => setAlertType(t.id as any)}
                        className="mt-0.5 text-[#ef5a24] focus:ring-[#ef5a24]"
                      />
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900">{t.title}</span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">{t.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-lg shadow-[#ef5a24]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Alert Subscription...</span>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Activate 'Notify Me' Alert</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Concessionaire Telemetry Relay</span>
            </span>
            <span>You can cancel alerts anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
