import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MarketplaceBillboard, ScreenId, VerificationItem } from '../../types';

// Role-Specific Workspaces
import { AgencyWorkspace } from '../workspaces/agency/AgencyWorkspace';
import { ClientWorkspace } from '../workspaces/client/ClientWorkspace';
import { MediaOwnerWorkspace } from '../workspaces/media-owner/MediaOwnerWorkspace';
import { VendorWorkspace } from '../workspaces/vendor/VendorWorkspace';
import { FieldAgentWorkspace } from '../workspaces/field-agent/FieldAgentWorkspace';
import { PlatformAdminWorkspace } from '../workspaces/platform-admin/PlatformAdminWorkspace';

interface RoleDashboardRouterProps {
  activeTab: string;
  onNavigateTab?: (tabId: string) => void;
  onNavigatePublicMarketplace: () => void;
  onSelectBillboard?: (b: MarketplaceBillboard) => void;
  onPurchaseBillboard?: (b: MarketplaceBillboard) => void;
  onOpenProof?: (item: VerificationItem) => void;
  onNavigateLegacy?: (screen: ScreenId) => void;
}

export const RoleDashboardRouter: React.FC<RoleDashboardRouterProps> = ({
  activeTab,
  onNavigateTab = () => {},
  onNavigatePublicMarketplace,
  onSelectBillboard,
  onPurchaseBillboard,
  onOpenProof = () => {},
  onNavigateLegacy = () => {},
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const renderContent = () => {
    // 1. Customer / Client Company Role
    if (currentUser.role === 'Customer / Client Company') {
      return (
        <ClientWorkspace
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
          onOpenProof={onOpenProof}
          onSelectBillboard={onSelectBillboard}
          onPurchaseBillboard={onPurchaseBillboard}
        />
      );
    }

    // 2. Field Agent
    if (currentUser.role === 'Field Agent') {
      return <FieldAgentWorkspace />;
    }

    // 3. Vendor / Contractor
    if (currentUser.role === 'Vendor') {
      return (
        <VendorWorkspace
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
        />
      );
    }

    // 4. Media Owner / Concessionaire
    if (currentUser.role === 'Media Owner') {
      return (
        <MediaOwnerWorkspace
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
        />
      );
    }

    // 5. Platform Admin (Governance console)
    if (currentUser.role === 'Platform Admin') {
      return (
        <PlatformAdminWorkspace
          activeTab={activeTab}
          onNavigateTab={onNavigateTab}
        />
      );
    }

    // 6. Agency Roles (Agency Admin, Campaign Manager, Operations Manager, Account Manager, Finance Manager, Field Manager, Agency Staff)
    return (
      <AgencyWorkspace
        activeTab={activeTab}
        onNavigateTab={onNavigateTab}
        onSelectBillboard={onSelectBillboard}
        onPurchaseBillboard={onPurchaseBillboard}
        onOpenProof={onOpenProof}
      />
    );
  };

  return <>{renderContent()}</>;
};

