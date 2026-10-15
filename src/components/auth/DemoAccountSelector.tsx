import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export interface DemoAccountItem {
  email: string;
  role: string;
  label: string;
  name: string;
  organization: string;
  dashboard: string;
  avatarUrl?: string;
}

interface DemoConfigResponse {
  enabled: boolean;
  sharedPasswordHint: string | null;
  accounts: DemoAccountItem[];
}

interface DemoAccountSelectorProps {
  onSelectAccount: (account: { email: string; password: string; role: string }) => void;
  selectedEmail?: string;
  className?: string;
}

export const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({
  onSelectAccount,
  selectedEmail,
  className = '',
}) => {
  const [demoConfig, setDemoConfig] = useState<DemoConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDemoConfig = async () => {
      try {
        const res = await fetch('/api/auth/demo-config');
        if (res.ok) {
          const data: DemoConfigResponse = await res.json();
          if (isMounted) {
            setDemoConfig(data);
          }
        }
      } catch {
        if (isMounted) {
          setDemoConfig(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDemoConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  // Do not render anything if demo mode is not explicitly enabled on the server
  if (isLoading || !demoConfig || !demoConfig.enabled || !demoConfig.accounts || demoConfig.accounts.length === 0) {
    return null;
  }

  const defaultPassword = demoConfig.sharedPasswordHint || 'AdGrid2026!';

  return (
    <div className={`border border-[#eae7e1] rounded-2xl p-3.5 bg-[#faf9f6] space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ef5a24]" />
          <span className="text-[11px] font-black text-[#181716] uppercase tracking-wider">
            Demo Accounts / Test Logins
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
          <KeyRound className="w-3 h-3 text-zinc-400" />
          <span>Pass: <code className="font-mono font-bold text-zinc-700 bg-zinc-200/60 px-1 py-0.5 rounded text-[9px]">{defaultPassword}</code></span>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 leading-snug">
        Select a role below to populate credentials, then submit through the server-side login flow.
      </p>

      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        {demoConfig.accounts.map((acc) => {
          const isSelected = selectedEmail?.toLowerCase() === acc.email.toLowerCase();
          return (
            <button
              key={acc.email}
              type="button"
              onClick={() =>
                onSelectAccount({
                  email: acc.email,
                  password: defaultPassword,
                  role: acc.role,
                })
              }
              className={`text-left p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-[#fff5f2] border-[#ef5a24] shadow-xs'
                  : 'bg-white border-[#eae7e1] hover:border-[#ef5a24]/60 hover:bg-[#fffcfb]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-[#ef5a24]' : 'text-[#181716] group-hover:text-[#ef5a24]'}`}>
                  {acc.label}
                </span>
                {isSelected && <UserCheck className="w-3 h-3 text-[#ef5a24] shrink-0 ml-1" />}
              </div>
              <span className="text-[9px] text-zinc-400 font-mono truncate mt-0.5">
                {acc.email}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-[9.5px] text-zinc-500 pt-0.5">
        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Credentials are securely verified against hashed passwords on the server.</span>
      </div>
    </div>
  );
};

export default DemoAccountSelector;
