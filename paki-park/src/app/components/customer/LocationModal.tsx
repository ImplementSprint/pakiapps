import { X, Search, MapPin } from "lucide-react";
import { useState } from "react";

interface Location {
  id: number;
  name: string;
  address: string;
  distance: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (locationName: string) => void;
  locations: Location[];
}

export function LocationModal({
  isOpen,
  onClose,
  onSelectLocation,
  locations,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#1e3d5a]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#1e3d5a]">Where to?</h3>
              <p className="text-gray-500 text-sm mt-1">
                Select a parking location.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:border-[#ee6b20] focus:ring-1 focus:ring-[#ee6b20]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-gray-500 text-sm">
                  No locations found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-[#ee6b20] text-sm font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.name)}
                  className="w-full flex items-center gap-4 p-3 border border-gray-100 rounded-2xl bg-white hover:border-[#ee6b20] hover:bg-orange-50 transition-all text-left group"
                >
                  <div className="bg-[#1e3d5a]/5 text-[#1e3d5a] p-3 rounded-xl group-hover:bg-[#ee6b20] group-hover:text-white transition-colors duration-200 shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-semibold text-gray-800 group-hover:text-[#ee6b20] transition-colors truncate pr-2">
                        {loc.name}
                      </h4>
                      <span className="text-[10px] font-bold text-[#1e3d5a] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                        {loc.distance}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{loc.address}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
