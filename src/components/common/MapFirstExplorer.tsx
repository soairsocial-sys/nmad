import React, { useState, useMemo } from 'react';
import {
  MapPin,
  List,
  Compass,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Car,
  Layers,
  ChevronDown,
  X,
  Maximize2,
  Navigation,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { GoogleInteractiveMap } from './GoogleInteractiveMap';

export interface MapExplorerItem {
  id: string;
  name: string;
  code?: string;
  location: string;
  metro: string;
  corridor?: string;
  format: string;
  lat: number;
  lng: number;
  status: string; // 'Available Now', 'Live', 'Verified', 'Scheduled', etc.
  previewUrl?: string;
  dimensions?: string;
  dailyTraffic?: number;
  client?: string;
  healthScore?: number;
  luxScore?: number;
  campaignId?: string;
  campaignName?: string;
}

interface MapFirstExplorerProps {
  title?: string;
  subtitle?: string;
  items: MapExplorerItem[];
  defaultViewMode?: 'map' | 'list';
  primaryActionLabel?: string;
  onSelectItem?: (item: MapExplorerItem) => void;
  onPrimaryAction?: (item: MapExplorerItem) => void;
  heightClass?: string;
  showFilters?: boolean;
}

export const MapFirstExplorer: React.FC<MapFirstExplorerProps> = ({
  title = 'Interactive Corridor Map & Inventory Discovery',
  subtitle = 'Inspect real physical and digital billboard assets across Africa.',
  items,
  defaultViewMode = 'map',
  primaryActionLabel = 'Inspect Site Details',
  onSelectItem,
  onPrimaryAction,
  heightClass = 'h-[440px] sm:h-[480px]',
  showFilters = true,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>(defaultViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetro, setSelectedMetro] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Extract unique metros and formats from real data
  const uniqueMetros = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.metro) set.add(it.metro);
    });
    return Array.from(set);
  }, [items]);

  const uniqueFormats = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.format) set.add(it.format);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        it.name.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q) ||
        (it.corridor && it.corridor.toLowerCase().includes(q)) ||
        (it.code && it.code.toLowerCase().includes(q)) ||
        (it.id && it.id.toLowerCase().includes(q));

      const matchMetro = selectedMetro === 'ALL' || it.metro === selectedMetro;
      const matchFormat = selectedFormat === 'ALL' || it.format === selectedFormat;

      return matchSearch && matchMetro && matchFormat;
    });
  }, [items, searchQuery, selectedMetro, selectedFormat]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return filteredItems[0] || null;
    return filteredItems.find((it) => it.id === selectedId) || filteredItems[0] || null;
  }, [selectedId, filteredItems]);

  const mapPins = useMemo(() => {
    return filteredItems.map((it) => {
      let status: 'live' | 'audit' | 'alert' | 'mounting' | 'crew' = 'live';
      const norm = it.status.toLowerCase();
      if (norm.includes('alert') || norm.includes('issue')) status = 'alert';
      else if (norm.includes('mounting') || norm.includes('pending')) status = 'mounting';
      else if (norm.includes('audit')) status = 'audit';
      else if (norm.includes('crew')) status = 'crew';

      return {
        id: it.id,
        name: it.name,
        code: it.code || it.id,
        status,
        type: it.format,
        client: it.client || it.campaignName,
        lat: it.lat,
        lng: it.lng,
        x: 50,
        y: 50,
      };
    });
  }, [filteredItems]);

  const handleMarkerSelect = (id: string) => {
    setSelectedId(id);
    setIsMobileSheetOpen(true);
    const item = items.find((i) => i.id === id);
    if (item && onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#eae7e1] p-4 sm:p-6 shadow-2xs space-y-4">
      {/* Header with Title & List/Map Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eae7e1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-extrabold text-sm sm:text-base text-[#181716] tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
        </div>

        {/* List / Map Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-[#ef5a24] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#ef5a24] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View ({filteredItems.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by billboard name, corridor, or asset code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#ef5a24]/20 focus:border-[#ef5a24]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Metro & Format Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMetro}
              onChange={(e) => setSelectedMetro(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-[#ef5a24]"
            >
              <option value="ALL">All Metros ({uniqueMetros.length})</option>
              {uniqueMetros.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-[#ef5a24]"
            >
              <option value="ALL">All Formats</option>
              {uniqueFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center space-y-2 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <MapPin className="w-8 h-8 text-zinc-300 mx-auto" />
          <h4 className="font-extrabold text-sm text-[#181716]">No matching billboard locations found</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search query, or clear metro and format filters to see all available inventory.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedMetro('ALL');
              setSelectedFormat('ALL');
            }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
          {/* Map canvas */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-[#eae7e1] relative">
            <GoogleInteractiveMap
              pins={mapPins}
              selectedPinId={selectedId || undefined}
              onSelectPin={handleMarkerSelect}
              heightClass={heightClass}
              corridorName={selectedItem?.corridor || selectedItem?.location || 'Pan-African Commuter Corridors'}
              metroName={selectedItem?.metro || 'African Metros'}
              showHotspotBanner={false}
            />

            {/* Quick stats floating tag */}
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-[#eae7e1] text-[11px] font-bold text-zinc-700 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{filteredItems.length} locations mapped</span>
            </div>
          </div>

          {/* Desktop Detail Panel (Side) */}
          <div className="hidden lg:block lg:col-span-4 space-y-3">
            {selectedItem ? (
              <div className="rounded-2xl border border-[#eae7e1] bg-[#faf9f6] p-4 space-y-3 shadow-2xs">
                {selectedItem.previewUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-[#eae7e1]">
                    <img
                      src={selectedItem.previewUrl}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {selectedItem.format}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedItem.status}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#181716] mt-0.5">
                    {selectedItem.name}
                  </h4>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{selectedItem.location}</span>
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-white border border-[#eae7e1]">
                    <span className="text-zinc-400 font-semibold block text-[10px]">Metro</span>
                    <span className="font-bold text-zinc-800">{selectedItem.metro}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#eae7e1]">
                    <span className="text-zinc-400 font-semibold block text-[10px]">Traffic / Day</span>
                    <span className="font-bold text-zinc-800">
                      {selectedItem.dailyTraffic ? `${selectedItem.dailyTraffic.toLocaleString()}` : 'High Volume'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onPrimaryAction) onPrimaryAction(selectedItem);
                      else if (onSelectItem) onSelectItem(selectedItem);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{primaryActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-zinc-400 italic rounded-2xl border border-dashed border-zinc-200">
                Tap any pin on the map to inspect location details.
              </div>
            )}
          </div>

          {/* Mobile Bottom-Sheet Overlay when Marker is selected */}
          {selectedItem && (
            <div className="lg:hidden mt-2 p-4 rounded-2xl border border-[#ef5a24]/30 bg-[#fffdfb] shadow-md space-y-3 animate-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-[#ef5a24]">Selected Site</span>
                  <h4 className="font-extrabold text-xs text-[#181716] truncate">{selectedItem.name}</h4>
                  <p className="text-[11px] text-zinc-500 truncate">{selectedItem.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  {selectedItem.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onPrimaryAction) onPrimaryAction(selectedItem);
                    else if (onSelectItem) onSelectItem(selectedItem);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black text-center cursor-pointer"
                >
                  {primaryActionLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List Mode View */
        <div className="divide-y divide-[#eae7e1] border border-[#eae7e1] rounded-2xl overflow-hidden bg-white">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem?.(item)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf9f6] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#eae7e1] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#fff5f2] border border-[#ef5a24]/20 text-[#ef5a24] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-xs text-[#181716] truncate group-hover:text-[#ef5a24] transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {item.location} · {item.metro}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {item.status}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPrimaryAction) onPrimaryAction(item);
                    else if (onSelectItem) onSelectItem(item);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-[#ef5a24] hover:text-white text-xs font-bold text-[#181716] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>{primaryActionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
