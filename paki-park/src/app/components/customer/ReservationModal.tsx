import { X, Clock, Zap } from "lucide-react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBooking: (type: "fixed" | "flexible") => void;
}

export function ReservationModal({
  isOpen,
  onClose,
  onStartBooking,
}: ReservationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e3d5a]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black text-[#1e3d5a]">
                Select Booking Type
              </h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Choose how you want to reserve your parking space.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => onStartBooking("fixed")}
              className="group relative w-full text-left bg-white border-2 border-gray-100 hover:border-[#1e3d5a] rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 opacity-5 group-hover:scale-[2] group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                <Clock size={120} className="text-[#1e3d5a]" />
              </div>

              <div className="relative z-10 flex items-center gap-5">
                <div className="p-4 bg-slate-50 text-[#1e3d5a] rounded-xl group-hover:bg-[#1e3d5a] group-hover:text-white transition-colors shadow-sm border border-gray-100 group-hover:border-transparent">
                  <Clock size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1e3d5a] mb-0.5">
                    Fixed Booking
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Reserve a specific date and time in advance.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onStartBooking("flexible")}
              className="group relative w-full text-left bg-white border-2 border-gray-100 hover:border-[#ee6b20] rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 opacity-5 group-hover:scale-[2] group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                <Zap size={120} className="text-[#ee6b20]" />
              </div>

              <div className="relative z-10 flex items-center gap-5">
                <div className="p-4 bg-orange-50/50 text-[#ee6b20] rounded-xl group-hover:bg-[#ee6b20] group-hover:text-white transition-colors shadow-sm border border-orange-100 group-hover:border-transparent">
                  <Zap size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#1e3d5a] mb-0.5">
                    Flexible Booking
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Arrive anytime and pay for your actual stay.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
