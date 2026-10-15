import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  MapPin,
  DollarSign,
  Car,
  Image as ImageIcon,
  CheckCircle2,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { useBillboards } from '../../context/BillboardContext';
import { MarketplaceBillboard, MetroCode } from '../../types';

interface EditBillboardModalProps {
  isOpen: boolean;
  billboard: MarketplaceBillboard | null;
  onClose: () => void;
  onSuccess?: (billboardId: string) => void;
}

const PHOTO_PRESETS = [
  {
    name: 'Digital LED Unipole',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: '3D DOOH Curved Monolith',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Urban Gantry Display',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'High-Impact Static Wallscape',
    url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
  },
];

export const EditBillboardModal: React.FC<EditBillboardModalProps> = ({
  isOpen,
  billboard,
  onClose,
  onSuccess,
}) => {
  const { updateBillboard } = useBillboards();

  const [name, setName] = useState('');
  const [metro, setMetro] = useState<MetroCode>('LOS');
  const [location, setLocation] = useState('');
  const [corridor, setCorridor] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [format, setFormat] = useState('Digital LED');
  const [dimensions, setDimensions] = useState('24m x 8m (192 sq.m)');
  const [resolution, setResolution] = useState('1920 x 1080 Full HD');
  const [priceMonthlyUSD, setPriceMonthlyUSD] = useState<number>(4500);
  const [priceDailyUSD, setPriceDailyUSD] = useState<number>(150);
  const [dailyTrafficVehicles, setDailyTrafficVehicles] = useState<number>(320000);
  const [availabilityStatus, setAvailabilityStatus] = useState('Available Now');
  const [audienceType, setAudienceType] = useState('High-Income Commuters');
  const [lightingType, setLightingType] = useState('Active LED Display');
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (billboard) {
      setName(billboard.name || '');
      setMetro((billboard.metro as MetroCode) || 'LOS');
      setLocation(billboard.location || '');
      setCorridor(billboard.corridor || '');
      setLatitude(billboard.lat !== undefined ? String(billboard.lat) : '');
      setLongitude(billboard.lng !== undefined ? String(billboard.lng) : '');
      setFormat(billboard.format || 'Digital LED');
      setDimensions(billboard.dimensions || '20m x 8m (160 sq.m)');
      setResolution(billboard.resolution || '1920 x 1080 Full HD');
      setPriceMonthlyUSD(billboard.priceMonthlyUSD || 3500);
      setPriceDailyUSD(billboard.priceDailyUSD || 120);
      setDailyTrafficVehicles(billboard.dailyTrafficVehicles || 250000);
      setAvailabilityStatus(billboard.availabilityStatus || 'Available Now');
      setAudienceType(billboard.audienceType || 'High-Income Commuters');
      setLightingType(billboard.lightingType || 'Active LED Display');
      setPreviewUrl(billboard.previewUrl || PHOTO_PRESETS[0].url);
      setDescription(billboard.description || '');
      setLicenseNumber(billboard.companyContact?.licenseNumber || 'LASAA/OOH/VOL.4/2024-REG');
    }
  }, [billboard]);

  if (!isOpen || !billboard) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !corridor.trim() || !latitude.trim() || !longitude.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      updateBillboard(billboard.id, {
        name: name.trim(),
        metro,
        location: location.trim(),
        corridor: corridor.trim(),
        lat: Number(latitude),
        lng: Number(longitude),
        format,
        dimensions,
        resolution,
        priceMonthlyUSD: Number(priceMonthlyUSD),
        priceDailyUSD: Number(priceDailyUSD),
        dailyTrafficVehicles: Number(dailyTrafficVehicles),
        dailyReach: `${(Number(dailyTrafficVehicles) * 1.7).toLocaleString()} Impressions`,
        availabilityStatus,
        audienceType,
        lightingType,
        previewUrl,
        description: description.trim(),
      });

      setSuccessNotice(`Billboard "${name}" updated successfully!`);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessNotice(null);
        if (onSuccess) onSuccess(billboard.id);
        onClose();
      }, 900);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#eae7e1] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#181716] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#ef5a24]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Edit Billboard Asset Details
              </h2>
              <p className="text-xs text-zinc-300">
                Update specifications, rate card, location coordinates & live availability for {billboard.id}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Core Identification */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ef5a24]" />
              <span>1. Location & Asset Identity</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Billboard Asset Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Metro / Region *
                </label>
                <select
                  value={metro}
                  onChange={(e) => setMetro(e.target.value as MetroCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                >
                  <option value="LOS">Lagos, Nigeria (LOS)</option>
                  <option value="ABJ">Abuja (FCT), Nigeria (ABJ)</option>
                  <option value="PHC">Port Harcourt, Nigeria (PHC)</option>
                  <option value="IBD">Ibadan, Nigeria (IBD)</option>
                  <option value="KAN">Kano, Nigeria (KAN)</option>
                  <option value="ACC">Accra, Ghana (ACC)</option>
                  <option value="NBO">Nairobi, Kenya (NBO)</option>
                  <option value="JNB">Johannesburg, South Africa (JNB)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Street / Landmark Address *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Traffic Corridor *
                </label>
                <input
                  type="text"
                  required
                  value={corridor}
                  onChange={(e) => setCorridor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  required
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div className="space-y-3 pt-3 border-t border-[#eae7e1]">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Format, Dimensions & Pricing</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Format Category
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                >
                  <option value="Digital Billboard (LED)">Digital Billboard (LED)</option>
                  <option value="Iconic 3D LED Monolith">Iconic 3D LED Monolith</option>
                  <option value="Static Unipole">Static Unipole</option>
                  <option value="Gantry Monolith">Gantry Monolith</option>
                  <option value="Overhead Dual DOOH">Overhead Dual DOOH</option>
                  <option value="Static Wallscape">Static Wallscape</option>
                  <option value="Bus Shelter">Bus Shelter</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Dimensions (Meters)
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 12m x 4m (48 sq.m)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Illumination Type
                </label>
                <select
                  value={lightingType}
                  onChange={(e) => setLightingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                >
                  <option value="Active LED Display">Active LED Display</option>
                  <option value="Solar High-Lumen Backlit">Solar High-Lumen Backlit</option>
                  <option value="Frontlit Halogen Floodlights">Frontlit Halogen Floodlights</option>
                  <option value="Prismatic LED Array">Prismatic LED Array</option>
                  <option value="Non-Illuminated">Non-Illuminated</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Monthly Rate ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={priceMonthlyUSD}
                  onChange={(e) => setPriceMonthlyUSD(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Daily Rate ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={priceDailyUSD}
                  onChange={(e) => setPriceDailyUSD(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Availability Status *
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
                >
                  <option value="Available Now">Available Now (Live Booking)</option>
                  <option value="Occupied (Flight Active)">Occupied (Flight Active)</option>
                  <option value="Next 14 Days">Available Next 14 Days</option>
                  <option value="Under Maintenance">Under Maintenance / Offline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Image and Details */}
          <div className="space-y-3 pt-3 border-t border-[#eae7e1]">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>3. Visual Asset & Description</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Billboard Image URL
              </label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
              />
            </div>

            {/* Photo preset quick select */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setPreviewUrl(preset.url)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-[11px] font-semibold text-zinc-700 cursor-pointer"
                >
                  Use {preset.name}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Asset Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe sightline visibility, commuter dwell times, traffic orientation..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae7e1] bg-[#faf9f6] text-sm text-[#181716] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ef5a24]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#eae7e1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#eae7e1] bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#ef5a24] hover:bg-[#d94e1d] text-white text-xs font-black shadow-md shadow-[#ef5a24]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Billboard Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
