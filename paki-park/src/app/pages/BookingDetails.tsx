import { X, MapPin, Calendar, Car, CreditCard, Download, Share2, Navigation, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// Define the interface for the booking data
interface BookingDetailsProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetails({ booking, isOpen, onClose }: BookingDetailsProps) {
  // If the modal isn't open or there's no booking, render nothing
  if (!isOpen || !booking) return null;

  const handleDownloadReceipt = () => toast.success('📄 Receipt downloaded!');
  const handleShare = () => toast.success('🔗 Booking link copied to clipboard!');
  const handleGetDirections = () => toast.info('🗺️ Opening maps...');
  const handleContactSupport = () => toast.info('📞 Connecting to support...');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1e3d5a]/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gray-50 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Sticky Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-[#1e3d5a]">Booking Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Status Banner */}
          <div className={`rounded-2xl p-5 shadow-sm ${
            booking.status === 'upcoming' 
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : booking.status === 'completed'
              ? 'bg-gradient-to-r from-gray-500 to-gray-600'
              : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Status</p>
                <p className="text-xl font-black capitalize">{booking.status}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest">Ref No.</p>
                <p className="text-lg font-mono font-bold">{booking.reference}</p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1e3d5a]">{booking.location}</h3>
                <p className="text-xs text-gray-500">{booking.address}</p>
              </div>
              <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase bg-orange-50 text-[#ee6b20]`}>
                {booking.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Spot Number</p>
                <p className="font-black text-[#ee6b20]">{booking.spot}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Schedule</p>
                <p className="font-bold text-[#1e3d5a] text-xs">{booking.date} • {booking.time}</p>
              </div>
            </div>
          </div>

          {/* Vehicle & Payment Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Car size={14} className="text-[#ee6b20]" /> Vehicle
              </h4>
              <p className="text-lg font-black text-[#1e3d5a] font-mono tracking-wider">{booking.licensePlate}</p>
              <p className="text-xs text-gray-500 capitalize">{booking.vehicleType}</p>
            </div>

            <div className="bg-[#1e3d5a] rounded-2xl p-5 shadow-md text-white">
              <h4 className="text-[10px] font-bold opacity-60 uppercase mb-3 flex items-center gap-2">
                <CreditCard size={14} /> Amount Paid
              </h4>
              <p className="text-2xl font-black">₱{booking.amount}</p>
              <p className="text-[10px] text-green-400 font-bold uppercase mt-1 tracking-widest">Transaction Success</p>
            </div>
          </div>

          {/* Entry Pass Section */}
          <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Digital Entry Pass</p>
            <div className="inline-block bg-white p-4 border rounded-xl shadow-sm mb-4">
              <div className="text-4xl font-mono tracking-tighter text-black">
                ||| || ||| ||| | ||
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">{booking.reference}</p>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed max-w-[250px] mx-auto">
              Scan this barcode at the parking kiosk or present it to the security personnel.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <ActionButton icon={<Download size={14} />} label="Receipt" onClick={handleDownloadReceipt} />
            <ActionButton icon={<Share2 size={14} />} label="Share" onClick={handleShare} />
            <ActionButton icon={<Navigation size={14} />} label="Maps" onClick={handleGetDirections} isPrimary />
            <ActionButton icon={<Phone size={14} />} label="Support" onClick={handleContactSupport} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper component for the actions
function ActionButton({ icon, label, onClick, isPrimary = false }: { icon: any, label: string, onClick: () => void, isPrimary?: boolean }) {
  return (
    <Button 
      onClick={onClick}
      className={`h-10 text-[11px] font-bold rounded-xl gap-2 shadow-sm ${
        isPrimary 
          ? 'bg-[#ee6b20] hover:bg-[#d55f1c] text-white' 
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </Button>
  );
}