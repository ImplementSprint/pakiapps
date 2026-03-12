import { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { BookingDetails } from './BookingDetails'; 
import { bookingService } from '../services/bookingService';

type BookingStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

export function MyBookings() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockBookings = [
    { id: '1', reference: 'PKP-00001234', location: 'SM City Mall', address: '123 Main Street, Cebu City', spot: 'A-12', date: 'Feb 20, 2026', time: '10:00 AM - 11:00 AM', status: 'upcoming', type: '1-Hour Slot', amount: 50, vehicleType: 'Sedan', licensePlate: 'ABC 1234' },
    { id: '2', reference: 'PKP-00001235', location: 'Ayala Center', address: '456 Business Park, Cebu City', spot: 'B-05', date: 'Feb 18, 2026', time: '3:00 PM - 4:00 PM', status: 'completed', type: '1-Hour Slot', amount: 150, vehicleType: 'SUV', licensePlate: 'XYZ 7890' },
    { id: '3', reference: 'PKP-00001236', location: "Robinson's Place", address: '789 Shopping Ave, Cebu City', spot: 'C-23', date: 'Feb 15, 2026', time: '9:00 AM - 10:00 AM', status: 'completed', type: '1-Hour Slot', amount: 180, vehicleType: 'Sedan', licensePlate: 'GHI 4567' },
    { id: '4', reference: 'PKP-00001237', location: 'IT Park Tower', address: '321 Tech Hub, Cebu City', spot: 'D-08', date: 'Feb 22, 2026', time: '8:00 AM - 9:00 AM', status: 'upcoming', type: '1-Hour Slot', amount: 50, vehicleType: 'Van', licensePlate: 'JKL 0123' },
    { id: '5', reference: 'PKP-00001238', location: 'SM Seaside', address: '555 Coastal Road, Cebu City', spot: 'E-15', date: 'Feb 10, 2026', time: '2:00 PM - 3:00 PM', status: 'cancelled', type: '1-Hour Slot', amount: 50, vehicleType: 'Motorcycle', licensePlate: 'MNP 5678' },
  ];

  const [allBookings, setAllBookings] = useState(mockBookings);

  // Fetch bookings from API
  useEffect(() => {
    const statusParam = activeFilter === 'all' ? undefined : activeFilter;
    bookingService.getMyBookings({ status: statusParam, search: searchQuery || undefined }).then((data) => {
      if (data?.bookings && data.bookings.length > 0) {
        setAllBookings(data.bookings.map((b: any) => ({
          id: b._id,
          reference: b.reference || `PKP-${b._id?.slice(-8)?.toUpperCase()}`,
          location: b.locationId?.name || 'Parking Location',
          address: b.locationId?.address || '',
          spot: b.spot,
          date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: b.timeSlot || '',
          status: b.status,
          type: b.type || '1-Hour Slot',
          amount: b.amount,
          vehicleType: b.vehicleId?.type || 'Sedan',
          licensePlate: b.vehicleId?.plateNumber || '',
        })));
      }
    }).catch(() => { /* fallback to mock data */ });
  }, [activeFilter, searchQuery]);

  const filteredBookings = allBookings.filter((booking) => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.location.toLowerCase().includes(searchQuery.toLowerCase()) || booking.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open Popup instead of Navigating
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCancelBooking = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal if clicking cancel button
    toast.loading('Cancelling booking...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Booking cancelled successfully!');
      setIsModalOpen(false); // Close modal if it was open
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3d5a]">My Bookings</h1>
          <p className="text-gray-600">Track and manage your parking reservations</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by location or reference number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:ring-[#ee6b20]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {(['all', 'upcoming', 'completed', 'cancelled'] as BookingStatus[]).map((f) => (
                  <Button
                    key={f}
                    variant={activeFilter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(f)}
                    className={activeFilter === f ? 'bg-[#ee6b20] text-white' : 'text-gray-600'}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <MapPin className="size-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1e3d5a]">No bookings found</h3>
              <Button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="mt-4 bg-[#ee6b20]">Clear Filters</Button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                onClick={() => handleViewDetails(booking)}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-[#ee6b20]/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-[#1e3d5a] group-hover:text-[#ee6b20] transition-colors">{booking.location}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black bg-orange-50 text-[#ee6b20]`}>
                        {booking.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin className="size-3.5" /> {booking.address}</p>
                    <div className="flex gap-6 text-sm font-bold text-[#1e3d5a]">
                      <div><p className="text-[10px] text-gray-400 uppercase">Spot</p>{booking.spot}</div>
                      <div><p className="text-[10px] text-gray-400 uppercase">Date</p>{booking.date}</div>
                      <div><p className="text-[10px] text-gray-400 uppercase">Time</p>{booking.time}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase">Total</p>
                      <p className="text-2xl font-black font-bold text-[#ee6b20]">₱{booking.amount}.00</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-[#1e3d5a] text-[#1e3d5a]">Details</Button>
                      {booking.status === 'upcoming' && (
                        <Button onClick={handleCancelBooking} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">Cancel</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RENDER THE MODAL COMPONENT HERE */}
      <BookingDetails 
        booking={selectedBooking} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}