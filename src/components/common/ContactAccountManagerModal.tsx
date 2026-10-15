import React, { useState } from 'react';
import { Headphones, Mail, Phone, Clock, Send, CheckCircle2, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ContactAccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactAccountManagerModal: React.FC<ContactAccountManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('Campaign Inquiry');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#eae7e1] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#181716] to-[#262422] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ef5a24] flex items-center justify-center text-white shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Dedicated Account Manager</h3>
              <p className="text-xs text-zinc-400">Direct hotline for {currentUser?.organization || 'GreenTech Solutions'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#181716]">Dispatch Transmitted</h4>
                <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                  Your message has been assigned ticket <strong>#AG-{(Math.random() * 90000 + 10000).toFixed(0)}</strong>. Your dedicated account lead will reply within 30 minutes.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold transition-all shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Manager Card */}
              <div className="p-3.5 rounded-2xl bg-[#fff8f5] border border-[#fbd8c7] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#ef5a24] text-white font-bold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                    AO
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-[#181716]">Adaora Okonkwo</h5>
                    <p className="text-[11px] text-[#ef5a24] font-semibold">Principal Brand Partner Lead</p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> a.okonkwo@adgrid.africa</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> &lt;30m SLA</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Subject selector */}
              <div>
                <label className="block text-xs font-bold text-[#181716] mb-1">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#eae7e1] bg-white text-xs font-medium text-zinc-800 outline-none focus:border-[#ef5a24]"
                >
                  <option value="Campaign Inquiry">Campaign Flight Adjustment & Pacing</option>
                  <option value="New Billboard Booking">New Corridor Billboard Reservation</option>
                  <option value="Proof of Performance">Proof-of-Performance / Lux Verification Request</option>
                  <option value="Billing & Invoicing">Invoice & Payment Settlement Inquiry</option>
                  <option value="Emergency Creative Swap">Urgent Creative Replacement Request</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-[#181716]">Priority:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('normal')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      priority === 'normal'
                        ? 'bg-[#181716] text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('urgent')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      priority === 'urgent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Urgent Flight Dispatch
                  </button>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#181716] mb-1">Direct Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your request, target site (e.g. Lekki Expressway, Victoria Island), or creative update..."
                  className="w-full p-3 rounded-xl border border-[#eae7e1] text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-[#ef5a24] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#eae7e1]">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escrow & SLA Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-5 py-2 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {sending ? (
                      <span>Dispatching...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
