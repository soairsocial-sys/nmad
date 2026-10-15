import React from 'react';
import {
  LayoutDashboard,
  Megaphone,
  Building,
  Store,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  Truck,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  Activity,
  MapPin,
  Compass,
  FileText,
  DollarSign,
  Lock,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Briefcase,
  Navigation,
  CheckCircle,
  User,
  Layers,
  Clock,
  Star,
  Building2,
  FileCheck,
  ShieldAlert,
  LogOut,
  Globe,
  HelpCircle,
  Target,
  Image as ImageIcon,
  Headphones,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_NAVIGATION_MAP } from '../../data/authAccounts';
import { useAuth } from '../../context/AuthContext';
import { ContactAccountManagerModal } from '../common/ContactAccountManagerModal';

interface PersistentSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onNavigatePublicMarketplace: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenHelp?: () => void;
}

// Icon dictionary
const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Megaphone,
  Building,
  Store,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  Truck,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  Activity,
  MapPin,
  Compass,
  FileText,
  DollarSign,
  Lock,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Briefcase,
  Navigation,
  CheckCircle,
  User,
  Layers,
  Clock,
  Star,
  Building2,
  FileCheck,
  ShieldAlert,
  Target,
  Image: ImageIcon,
  Headphones,
};

export const PersistentSidebar: React.FC<PersistentSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNavigatePublicMarketplace,
  isMobileOpen = false,
  onCloseMobile,
  onOpenHelp,
}) => {
  const { currentUser, logout } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  if (!currentUser) return null;

  const isClientRole = currentUser.role === 'Customer / Client Company';
  const navItems = ROLE_NAVIGATION_MAP[currentUser.role] || [];
  const clientInitials = currentUser.organization
    ? currentUser.organization.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'GT';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`shrink-0 bg-white text-zinc-900 flex flex-col justify-between border-r border-[#eae7e1] select-none transition-all duration-200 z-50 
        ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl md:static md:w-56 lg:w-64 md:shadow-none'
            : 'hidden md:flex md:w-56 lg:w-64 sticky top-0 min-h-screen'
        }`}
        aria-label="Platform Sidebar Navigation"
      >
        {/* Top Header & Brand */}
        <div className="p-3 md:p-4 border-b border-[#eae7e1]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Logo Mark in orange */}
              <div className="w-8 h-8 rounded-lg bg-[#ef5a24] flex items-center justify-center shrink-0 shadow-xs p-1.5">
                <img
                  src="/branding/adgrid-mark-white.png"
                  alt="ADGRID"
                  className="w-5 h-5 object-contain"
                />
              </div>

              {/* Logo text */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-[#181716] block leading-none">
                    ADGRID
                  </span>
                  {!isClientRole && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ef5a24] text-white font-black uppercase">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[8px] font-extrabold tracking-widest uppercase text-zinc-400 block mt-1 leading-none">
                  OUTDOOR MADE SIMPLE
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                aria-label="Close menu"
              >
                <LogOut className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>

          {/* Tenant Organization Tag / Client Selector */}
          {isClientRole ? (
            <div className="mt-3.5 p-2 rounded-xl bg-white border border-[#eae7e1] flex items-center justify-between gap-2.5 shadow-2xs hover:border-[#ef5a24]/40 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#ef5a24] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {clientInitials || 'GT'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#181716] truncate leading-tight">
                    {currentUser.organization}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium leading-none mt-0.5">
                    Client Portal
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
            </div>
          ) : (
            <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#ef5a24] block">
                Workspace
              </span>
              <p className="text-xs font-bold text-[#181716] truncate" title={currentUser.organization}>
                {currentUser.organization}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Role-Based Navigation Items */}
        <div className="flex-1 py-3 px-2 md:px-3 overflow-y-auto space-y-1 scrollbar-none flex flex-col justify-between">
          <div className="space-y-1">
            {!isClientRole && (
              <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                {currentUser.role} Menu
              </div>
            )}

            {navItems.map((item) => {
              const Icon = ICON_MAP[item.icon] || LayoutDashboard;
              const isActive = activeTab === item.tabId;

              return (
                <button
                  key={item.tabId}
                  onClick={() => {
                    onSelectTab(item.tabId);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={item.label}
                  className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group relative cursor-pointer ${
                    isActive
                      ? isClientRole
                        ? 'bg-[#feece3] text-[#ef5a24] font-bold shadow-2xs'
                        : 'bg-[#fff5f2] text-[#ef5a24] font-black border-l-4 border-[#ef5a24] shadow-xs'
                      : 'text-zinc-600 hover:text-[#181716] hover:bg-zinc-50 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-[#ef5a24]' : 'text-zinc-400 group-hover:text-zinc-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {/* Persistent Help Entry Point in Sidebar */}
            {onOpenHelp && !isClientRole && (
              <div className="pt-2 mt-2 border-t border-[#eae7e1]">
                <button
                  type="button"
                  onClick={() => {
                    onOpenHelp();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title="Help & Guides"
                  className="w-full flex items-center justify-start gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-[#ef5a24] hover:bg-orange-50/70 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 shrink-0 text-[#ef5a24]" />
                  <span className="truncate">Help & Guides</span>
                </button>
              </div>
            )}

            {/* Public Marketplace Quick-Switch Button */}
            {!isClientRole && (
              <div className={onOpenHelp ? 'pt-1' : 'pt-2 mt-2 border-t border-[#eae7e1]'}>
                <button
                  onClick={() => {
                    onNavigatePublicMarketplace();
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title="Public Marketplace"
                  className="w-full flex items-center justify-start gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-[#ef5a24] hover:bg-zinc-50 transition-colors group relative cursor-pointer"
                >
                  <Globe className="w-5 h-5 shrink-0 text-zinc-400 group-hover:text-[#ef5a24]" />
                  <span className="truncate">Public Marketplace</span>
                </button>
              </div>
            )}
          </div>

          {/* Client-Dedicated Bottom "Need Help?" Card */}
          {isClientRole && (
            <div className="pt-4 pb-1">
              <div className="p-3.5 rounded-2xl bg-[#fff4ed] border border-[#fcd6c3] text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-white text-[#ef5a24] shadow-2xs flex items-center justify-center mx-auto ring-2 ring-[#ef5a24]/20">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-[#181716]">Need help?</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Contact your account manager</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="p-2 md:p-3 border-t border-[#eae7e1] bg-zinc-50/60 space-y-2">
          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {isClientRole ? (
                <div className="w-8 h-8 rounded-full bg-[#ef5a24] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {clientInitials || 'GT'}
                </div>
              ) : (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-zinc-200 shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#181716] truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-[#ef5a24] hover:bg-zinc-100 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline text-[10px] font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Account Manager Modal */}
      <ContactAccountManagerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};
