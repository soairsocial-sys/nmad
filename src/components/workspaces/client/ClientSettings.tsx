import React, { useState } from 'react';
import { User, Building, Bell, Shield, Mail, Phone, MapPin, Headphones, Save, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ContactAccountManagerModal } from '../../common/ContactAccountManagerModal';

export const ClientSettings: React.FC = () => {
  const { currentUser } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState(currentUser?.organization || 'GreenTech Solutions');
  const [email, setEmail] = useState(currentUser?.email || 'fmutasa@greentech.africa');
  const [phone, setPhone] = useState('+234 803 555 0192');
  const [city, setCity] = useState('Victoria Island, Lagos');
  const [industry, setIndustry] = useState('Clean Energy, Infrastructure & Sustainability');
  const [notifyProofOfPlay, setNotifyProofOfPlay] = useState(true);
  const [notifyFlightPacing, setNotifyFlightPacing] = useState(true);
  const [notifyInvoices, setNotifyInvoices] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#181716] tracking-tight">
              Brand Profile & Portal Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ef5a24] border border-[#ef5a24]/20 text-xs font-bold">
              Client Portal
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage your brand organization profile, notification delivery, assigned account manager, and billing details.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Manager Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#fff8f5] to-[#fef2eb] border border-[#fcd6c3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ef5a24] text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white">
              AO
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ef5a24]">Your Dedicated Account Lead</span>
              <h3 className="font-extrabold text-base text-[#181716]">Adaora Okonkwo</h3>
              <p className="text-xs text-zinc-600 font-medium">Principal Brand Partnerships Manager · ADGRID West Africa</p>
              <p className="text-[11px] text-zinc-500 flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#ef5a24]" /> a.okonkwo@adgrid.africa</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#ef5a24]" /> +234 1 800 234 743</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
          >
            <Headphones className="w-4 h-4" />
            <span>Message Manager</span>
          </button>
        </div>

        {/* Brand Information Section */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#eae7e1]">
            <Building className="w-5 h-5 text-[#ef5a24]" />
            <h3 className="font-extrabold text-sm text-[#181716]">Brand Organization Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#181716] mb-1">Company / Organization</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#eae7e1] bg-zinc-50/50 text-xs text-zinc-800 font-medium outline-none focus:border-[#ef5a24] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#181716] mb-1">Primary Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#eae7e1] bg-zinc-50/50 text-xs text-zinc-800 font-medium outline-none focus:border-[#ef5a24] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#181716] mb-1">Regional Office Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#eae7e1] bg-zinc-50/50 text-xs text-zinc-800 font-medium outline-none focus:border-[#ef5a24] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#181716] mb-1">Corporate Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#eae7e1] bg-zinc-50/50 text-xs text-zinc-800 font-medium outline-none focus:border-[#ef5a24] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Telemetry Section */}
        <div className="bg-white rounded-2xl border border-[#eae7e1] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#eae7e1]">
            <Bell className="w-5 h-5 text-[#ef5a24]" />
            <h3 className="font-extrabold text-sm text-[#181716]">Real-time Telemetry & Verification Notifications</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#181716] block">Proof-of-Play Camera Verification Alerts</span>
                <span className="text-[11px] text-zinc-500">Receive instant push & email updates when certified field operative photos are uploaded.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyProofOfPlay}
                onChange={(e) => setNotifyProofOfPlay(e.target.checked)}
                className="w-4 h-4 accent-[#ef5a24] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#181716] block">Flight Pacing & Milestone Notifications</span>
                <span className="text-[11px] text-zinc-500">Weekly executive digest of impression delivery, vehicular counts, and sightline status.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyFlightPacing}
                onChange={(e) => setNotifyFlightPacing(e.target.checked)}
                className="w-4 h-4 accent-[#ef5a24] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/70 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#181716] block">Invoice & Escrow Settlement Receipts</span>
                <span className="text-[11px] text-zinc-500">Electronic PDF receipts and milestone release notifications.</span>
              </div>
              <input
                type="checkbox"
                checked={notifyInvoices}
                onChange={(e) => setNotifyInvoices(e.target.checked)}
                className="w-4 h-4 accent-[#ef5a24] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Modal */}
      <ContactAccountManagerModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};
