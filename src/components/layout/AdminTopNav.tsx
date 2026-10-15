import React, { useState } from 'react';
import { Bell, Globe, ExternalLink, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminTopNavProps {
  onNavigatePublicMarketplace: () => void;
  onOpenHelp?: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  onNavigatePublicMarketplace,
  onOpenHelp,
}) => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-[#eae7e1] px-4 py-3 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Organization & Role Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0" />

      {/* Center/Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Help & Guide Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/70 hover:bg-orange-100/80 border border-[#ef5a24]/20 text-xs font-bold text-[#ef5a24] transition-all shadow-2xs cursor-pointer"
            title="Open Help & Interactive Guides"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help & Guide</span>
          </button>
        )}

        {/* Public Marketplace Button */}
        <button
          onClick={onNavigatePublicMarketplace}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#eae7e1] text-xs font-bold text-[#181716] hover:text-[#ef5a24] hover:border-[#ef5a24] transition-all shadow-2xs cursor-pointer"
          title="Browse live inventory as a public customer"
        >
          <Globe className="w-3.5 h-3.5 text-[#ef5a24]" />
          <span className="hidden sm:inline">Public Marketplace</span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => alert('Flight Update: Lekki Expressway telemetry synced at 10:24 AM · Optical verification passed.')}
          className="w-9 h-9 rounded-xl bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-700 relative border border-[#eae7e1] transition-colors cursor-pointer shadow-2xs"
          title="Telemetry and flight notifications"
        >
          <Bell className="w-4 h-4 text-zinc-600" />
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#ef5a24] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
            1
          </span>
        </button>

        {/* Client Account Dropdown (Matching Reference UI) */}
        {currentUser.role === 'Customer / Client Company' && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#ef5a24] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentUser.organization.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'GT'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#eae7e1] p-2 z-30 animate-in fade-in duration-150">
                <div className="p-2 border-b border-[#eae7e1] mb-1">
                  <p className="text-xs font-extrabold text-[#181716] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ef5a24]/10 text-[#ef5a24]">
                    Brand Client Portal
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigatePublicMarketplace();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Public Marketplace</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 mt-1"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
