import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Search, Star, Navigation, Clock, DollarSign, Filter, Map } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import logo from 'figma:asset/430f6b7df4e30a8a6fddb7fbea491ba629555e7c.png';
import { locationService } from '../services/locationService';

export function FindParking() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nearby' | 'available'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const mockLocations = [
    { id: '1', name: 'SM City Mall', address: '123 Main Street, Cebu City', distance: '0.5 km', availableSpots: 45, totalSpots: 100, rating: 4.8, reviews: 234, hourlyRate: 50, type: 'Mall', features: ['Covered', 'Security', '24/7'] },
    { id: '2', name: 'Ayala Center', address: '456 Business Park, Cebu City', distance: '1.2 km', availableSpots: 28, totalSpots: 80, rating: 4.9, reviews: 456, hourlyRate: 60, type: 'Mall', features: ['Covered', 'CCTV', 'Valet'] },
    { id: '3', name: "Robinson's Place", address: '789 Shopping Ave, Cebu City', distance: '2.1 km', availableSpots: 62, totalSpots: 120, rating: 4.7, reviews: 189, hourlyRate: 45, type: 'Mall', features: ['Covered', 'Security'] },
    { id: '4', name: 'IT Park Tower', address: '321 Tech Hub, Cebu City', distance: '0.8 km', availableSpots: 15, totalSpots: 60, rating: 4.6, reviews: 98, hourlyRate: 40, type: 'Office', features: ['Covered', '24/7', 'EV Charging'] },
    { id: '5', name: 'SM Seaside', address: '555 Coastal Road, Cebu City', distance: '3.5 km', availableSpots: 89, totalSpots: 200, rating: 4.9, reviews: 567, hourlyRate: 55, type: 'Mall', features: ['Covered', 'Security', 'CCTV', 'Valet'] },
    { id: '6', name: 'Capitol Plaza', address: '222 Government Center, Cebu City', distance: '1.5 km', availableSpots: 5, totalSpots: 40, rating: 4.5, reviews: 76, hourlyRate: 35, type: 'Public', features: ['Open Air', 'Security'] },
  ];

  const [parkingLocations, setParkingLocations] = useState(mockLocations);

  // Fetch locations from API
  useEffect(() => {
    locationService.getLocations({ search: searchQuery || undefined, status: 'active' }).then((data) => {
      if (data && data.length > 0) {
        setParkingLocations(data.map((loc: any) => ({
          id: loc._id,
          name: loc.name,
          address: loc.address,
          distance: '',
          availableSpots: loc.availableSpots || 0,
          totalSpots: loc.totalSpots || 0,
          rating: 4.7,
          reviews: 0,
          hourlyRate: loc.hourlyRate || 50,
          type: 'Mall',
          features: loc.amenities || [],
        })));
      }
    }).catch(() => { /* fallback to mock data */ });
  }, [searchQuery]);

  const filteredLocations = parkingLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'nearby') {
      return matchesSearch && parseFloat(location.distance) <= 2;
    }
    if (selectedFilter === 'available') {
      return matchesSearch && location.availableSpots > 10;
    }
    return matchesSearch;
  });

  const handleBookNow = (location: any) => {
    navigate('/customer/home');
    toast.success(`Redirecting to book at ${location.name}`);
  };

  const handleViewOnMap = () => {
    if (viewMode === 'list') {
      setViewMode('map');
      toast.info('🗺️ Map view coming soon!');
    } else {
      setViewMode('list');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/customer/home')}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <img src={logo} alt="PakiPark" className="h-8" />
            </div>
            <h1 className="text-xl font-bold text-[#1e3d5a]">Find Parking</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for parking locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleViewOnMap}
              variant="outline"
              className="gap-2"
            >
              <Map className="size-4" />
              {viewMode === 'list' ? 'Map View' : 'List View'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' ? 'bg-[#ee6b20] hover:bg-[#ee6b20]/90' : ''}
              >
                All Locations
              </Button>
              <Button
                variant={selectedFilter === 'nearby' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('nearby')}
                className={selectedFilter === 'nearby' ? 'bg-[#ee6b20] hover:bg-[#ee6b20]/90' : ''}
              >
                Nearby (&lt; 2km)
              </Button>
              <Button
                variant={selectedFilter === 'available' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('available')}
                className={selectedFilter === 'available' ? 'bg-[#ee6b20] hover:bg-[#ee6b20]/90' : ''}
              >
                High Availability
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-bold text-[#1e3d5a]">{filteredLocations.length}</span> parking location{filteredLocations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Parking Locations List */}
        <div className="space-y-4">
          {filteredLocations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="size-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No parking locations found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="bg-[#ee6b20] hover:bg-[#ee6b20]/90"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Location Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-[#1e3d5a]">{location.name}</h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            {location.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-[#ee6b20]">
                            <Navigation className="size-4" />
                            {location.distance}
                          </span>
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Star className="size-4 fill-current" />
                            {location.rating} ({location.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {location.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Available Spots</p>
                        <p className={`text-2xl font-bold ${
                          location.availableSpots < 10 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {location.availableSpots}/{location.totalSpots}
                        </p>
                      </div>
                      <div className="w-full max-w-xs">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              location.availableSpots < 10 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(location.availableSpots / location.totalSpots) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex flex-col justify-between items-end lg:w-48">
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-3xl font-bold text-[#1e3d5a]">₱{location.hourlyRate}</p>
                      <p className="text-sm text-gray-600">/hour</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        onClick={() => handleBookNow(location)}
                        className="w-full bg-[#ee6b20] hover:bg-[#ee6b20]/90 text-white"
                      >
                        Book Now
                      </Button>
                      <Button
                        onClick={() => toast.info('🗺️ Opening directions...')}
                        variant="outline"
                        className="w-full border-[#1e3d5a] text-[#1e3d5a] gap-2"
                      >
                        <Navigation className="size-4" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {filteredLocations.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-[#1e3d5a]">{filteredLocations.length}</p>
              <p className="text-sm text-gray-600">Locations</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredLocations.reduce((sum, loc) => sum + loc.availableSpots, 0)}
              </p>
              <p className="text-sm text-gray-600">Available Spots</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-[#ee6b20]">
                ₱{Math.min(...filteredLocations.map(loc => loc.hourlyRate))}
              </p>
              <p className="text-sm text-gray-600">Lowest Rate</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {(filteredLocations.reduce((sum, loc) => sum + loc.rating, 0) / filteredLocations.length).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}