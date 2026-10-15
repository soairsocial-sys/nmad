import React, { useState } from 'react';
import { ClientOverview } from './ClientOverview';
import { ClientLiveMap } from './ClientLiveMap';
import { ClientCampaigns } from './ClientCampaigns';
import { ClientInvoices } from './ClientInvoices';
import { ClientEvidence } from './ClientEvidence';
import { ClientBillboardsView } from './ClientBillboardsView';
import { ClientReports } from './ClientReports';
import { ClientSettings } from './ClientSettings';
import { MarketplaceBillboard, VerificationItem } from '../../../types';

interface ClientWorkspaceProps {
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
  onOpenProof?: (item: VerificationItem) => void;
  onSelectBillboard?: (b: MarketplaceBillboard) => void;
  onPurchaseBillboard?: (b: MarketplaceBillboard) => void;
}

export const ClientWorkspace: React.FC<ClientWorkspaceProps> = ({
  activeTab,
  onNavigateTab,
  onOpenProof,
  onSelectBillboard,
  onPurchaseBillboard,
}) => {
  const [isViewingMap, setIsViewingMap] = useState(false);

  // If user explicitly requested full radar map view
  if (isViewingMap || activeTab === 'live-map') {
    return <ClientLiveMap onBack={() => setIsViewingMap(false)} />;
  }

  switch (activeTab) {
    case 'dashboard':
    case 'overview':
      return (
        <ClientOverview
          onOpenLiveMap={() => setIsViewingMap(true)}
          onOpenProofModal={onOpenProof}
          onNavigateTab={onNavigateTab}
          onSelectBillboard={onSelectBillboard}
          onPurchaseBillboard={onPurchaseBillboard}
        />
      );

    case 'campaigns':
      return (
        <ClientCampaigns
          onOpenLiveMap={() => setIsViewingMap(true)}
        />
      );

    case 'billboards':
    case 'locations':
      return (
        <ClientBillboardsView
          onOpenLiveMap={() => setIsViewingMap(true)}
          onOpenProofModal={onOpenProof}
          onSelectBillboard={onSelectBillboard}
          onPurchaseBillboard={onPurchaseBillboard}
        />
      );

    case 'evidence':
      return <ClientEvidence onOpenProofModal={onOpenProof} />;

    case 'reports':
      return <ClientReports />;

    case 'invoices':
      return <ClientInvoices />;

    case 'settings':
    case 'profile':
      return <ClientSettings />;

    case 'live-tracker':
      return <ClientLiveMap onBack={() => setIsViewingMap(false)} />;

    default:
      return (
        <ClientOverview
          onOpenLiveMap={() => setIsViewingMap(true)}
          onOpenProofModal={onOpenProof}
          onNavigateTab={onNavigateTab}
          onSelectBillboard={onSelectBillboard}
          onPurchaseBillboard={onPurchaseBillboard}
        />
      );
  }
};

export default ClientWorkspace;
