import React from 'react';
import {
  Compass,
  MapPin,
  Megaphone,
  Wrench,
  Camera,
  Layers,
  HelpCircle,
  Menu,
  LayoutDashboard,
  ShieldAlert,
  CalendarCheck,
  DollarSign,
  Clock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface MobileBottomNavProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenHelp: () => void;
  onOpenSidebarDrawer: () => void;
  onNavigateMarketplace?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  role,
  activeTab,
  onSelectTab,
  onOpenHelp,
  onOpenSidebarDrawer,
  onNavigateMarketplace,
}) => {
  // Define 4 primary actions tailored to the user's role
  const getPrimaryActions = () => {
    if (role === 'Customer / Client Company') {
      return [
        {
          id: 'dashboard',
          label: 'Overview',
          icon: LayoutDashboard,
          onClick: () => onSelectTab('dashboard'),
          isActive: activeTab === 'dashboard' || activeTab === 'overview',
        },
        {
          id: 'find',
          label: 'Find Sites',
          icon: MapPin,
          onClick: () => {
            if (onNavigateMarketplace) onNavigateMarketplace();
            else onSelectTab('live-tracker');
          },
          isActive: activeTab === 'live-tracker' || activeTab === 'marketplace',
        },
        {
          id: 'campaigns',
          label: 'Track',
          icon: Megaphone,
          onClick: () => onSelectTab('campaigns'),
          isActive: activeTab === 'campaigns',
        },
        {
          id: 'evidence',
          label: 'Proof',
          icon: Camera,
          onClick: () => onSelectTab('evidence'),
          isActive: activeTab === 'evidence',
        },
      ];
    }

    if (role === 'Platform Admin') {
      return [
        {
          id: 'platform-overview',
          label: 'Overview',
          icon: LayoutDashboard,
          onClick: () => onSelectTab('platform-overview'),
          isActive: activeTab === 'platform-overview',
        },
        {
          id: 'subscriptions',
          label: 'Plans',
          icon: Compass,
          onClick: () => onSelectTab('subscriptions'),
          isActive: activeTab === 'subscriptions',
        },
        {
          id: 'tenants',
          label: 'Tenants',
          icon: Layers,
          onClick: () => onSelectTab('tenants'),
          isActive: activeTab === 'tenants',
        },
        {
          id: 'audit-logs',
          label: 'Audit',
          icon: ShieldAlert,
          onClick: () => onSelectTab('audit-logs'),
          isActive: activeTab === 'audit-logs',
        },
      ];
    }

    if (role === 'Media Owner') {
      return [
        {
          id: 'dashboard',
          label: 'Overview',
          icon: LayoutDashboard,
          onClick: () => onSelectTab('dashboard'),
          isActive: activeTab === 'dashboard' || activeTab === 'overview',
        },
        {
          id: 'inventory',
          label: 'Billboards',
          icon: Layers,
          onClick: () => onSelectTab('inventory'),
          isActive: activeTab === 'inventory',
        },
        {
          id: 'bookings',
          label: 'Bookings',
          icon: CalendarCheck,
          onClick: () => onSelectTab('bookings'),
          isActive: activeTab === 'bookings',
        },
        {
          id: 'revenue',
          label: 'Earnings',
          icon: DollarSign,
          onClick: () => onSelectTab('revenue'),
          isActive: activeTab === 'revenue',
        },
      ];
    }

    // Agency Roles default
    return [
      {
        id: 'command-center',
        label: 'Command',
        icon: LayoutDashboard,
        onClick: () => onSelectTab('command-center'),
        isActive: activeTab === 'command-center' || activeTab === 'overview',
      },
      {
        id: 'operations',
        label: 'Work Orders',
        icon: Wrench,
        onClick: () => onSelectTab('operations'),
        isActive: activeTab === 'operations',
      },
      {
        id: 'campaigns',
        label: 'Campaigns',
        icon: Megaphone,
        onClick: () => onSelectTab('campaigns'),
        isActive: activeTab === 'campaigns',
      },
      {
        id: 'live-map',
        label: 'Map Radar',
        icon: Compass,
        onClick: () => onSelectTab('live-map'),
        isActive: activeTab === 'live-map',
      },
    ];
  };

  const primaryActions = getPrimaryActions();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eae7e1] px-2 py-1 shadow-lg"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`flex-1 flex flex-col items-center justify-center h-full px-1 min-w-[56px] transition-colors ${
                action.isActive ? 'text-[#ef5a24]' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold truncate tracking-tight">
                {action.label}
              </span>
            </button>
          );
        })}

        {/* Persistent Help Entry Trigger */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex-1 flex flex-col items-center justify-center h-full px-1 min-w-[56px] text-zinc-500 hover:text-[#ef5a24] transition-colors"
          title="Help & Guides"
        >
          <HelpCircle className="w-5 h-5 mb-0.5 text-[#ef5a24]" />
          <span className="text-[10px] font-bold truncate tracking-tight text-[#ef5a24]">
            Help
          </span>
        </button>

        {/* Secondary Menu Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenSidebarDrawer}
          className="flex-1 flex flex-col items-center justify-center h-full px-1 min-w-[56px] text-zinc-500 hover:text-zinc-900 transition-colors"
          title="All Menu Items"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold truncate tracking-tight">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
