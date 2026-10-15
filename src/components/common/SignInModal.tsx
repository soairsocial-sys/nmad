import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  reason?: string;
  targetRole?: string;
  onSuccess?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  title = 'Sign In to ADGRID',
  reason,
  targetRole = 'Agency Admin',
  onSuccess,
}) => {
  const { login, signupAgency } = useAuth();

  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('agency@adgrid.test');
  const [password, setPassword] = useState('AdGrid2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Agency Registration state
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('Lagos');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccountSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('AdGrid2026!');
    setErrorMessage(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regAgencyName || !regFullName || !regEmail || !regPassword) {
      setErrorMessage('Please complete all agency registration fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signupAgency({
        agencyName: regAgencyName,
        ownerFullName: regFullName,
        email: regEmail,
        password: regPassword,
        city: regCity,
      });

      if (result.success) {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(result.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to register agency.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-[#fbfaf7] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#181716] text-[#ef5a24] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              {reason && reason.toLowerCase().includes('alert') ? (
                <BellRing className="w-5 h-5 text-[#ef5a24]" />
              ) : (
                <Lock className="w-5 h-5 text-[#ef5a24]" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {reason || 'Sign in with your enterprise account to access verified OOH corridor intelligence.'}
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

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setAuthTab('signin');
              setErrorMessage(null);
            }}
            className={`pb-3 text-xs font-black transition-all cursor-pointer relative mr-6 ${
              authTab === 'signin'
                ? 'text-[#ef5a24] border-b-2 border-[#ef5a24]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('register');
              setErrorMessage(null);
            }}
            className={`pb-3 text-xs font-black transition-all cursor-pointer relative ${
              authTab === 'register'
                ? 'text-[#ef5a24] border-b-2 border-[#ef5a24]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register New Agency
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authTab === 'signin' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agency@adgrid.test"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ef5a24] focus:ring-1 focus:ring-[#ef5a24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#ef5a24] focus:ring-1 focus:ring-[#ef5a24]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 1-Click Demo Accounts */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Quick Evaluation Accounts (1-Click Fill)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Agency Admin', email: 'agency@adgrid.test' },
                    { label: 'Brand Client', email: 'client@adgrid.test' },
                    { label: 'Media Owner', email: 'mediaowner@adgrid.test' },
                    { label: 'Platform Admin', email: 'admin@adgrid.test' },
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickAccountSelect(acc.email)}
                      className={`text-left px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        email === acc.email
                          ? 'bg-[#181716] text-white border-[#181716]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{acc.label}</span>
                      <Zap className="w-3 h-3 text-[#ef5a24]" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-lg shadow-[#ef5a24]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Agency Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={regAgencyName}
                    onChange={(e) => setRegAgencyName(e.target.value)}
                    placeholder="e.g. Apex Global Media"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ef5a24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Sarah Oladipo"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ef5a24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Agency Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sarah@agency.com"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ef5a24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Lagos, Nairobi..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ef5a24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#ef5a24]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-lg shadow-[#ef5a24]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <span>Registering Agency...</span> : <span>Create Agency Account & Continue</span>}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 / ISO 20560 Encrypted</span>
            </span>
            <span>Zero Spam Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
