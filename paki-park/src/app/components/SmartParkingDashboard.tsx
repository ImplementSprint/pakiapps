import { useState, useEffect } from 'react';
import { CalendarIcon, Send, CreditCard, Clock, User, Car, Phone, Truck, Bus, Settings, X, MapPin, Accessibility, Zap, Crown, Shield, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { AdvancedParkingConfig, type AdvancedParkingConfig as AdvancedParkingConfigType, type SlotCategory } from './AdvancedParkingConfig';
import { addNotification } from './NotificationCenter';

interface ParkingSlotData {
  id: string;
  floor: number;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'occupied';
  category: SlotCategory;
  name?: string;
  carColor?: string;
  plateNumber?: string;
  vehicleType?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  timeLeft?: string;
  paymentStatus?: 'paid' | 'pending' | 'partial';
  totalBalance?: number;
  phoneNumber?: string;
}

// Category styling
const categoryStyles = {
  regular: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-700' },
  pwd: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-700' },
  electric: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-700' },
  vip: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-700' },
  motorcycle: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-700' },
  compact: { bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-700' },
};

const categoryIcons = {
  regular: Grid3x3,
  pwd: Accessibility,
  electric: Zap,
  vip: Crown,
  motorcycle: Shield,
  compact: Grid3x3,
};

// Load saved reservations from localStorage
const loadSavedReservations = (date: string): Map<string, ParkingSlotData> => {
  const saved = localStorage.getItem(`parkingReservations_${date}`);
  if (saved) {
    const data = JSON.parse(saved);
    return new Map(Object.entries(data));
  }
  return new Map();
};

// Save reservations to localStorage
const saveReservations = (date: string, reservations: Map<string, ParkingSlotData>) => {
  const obj = Object.fromEntries(reservations);
  localStorage.setItem(`parkingReservations_${date}`, JSON.stringify(obj));
};

// Generate parking data based on advanced configuration
const generateParkingDataForAdvancedConfig = (
  config: AdvancedParkingConfigType,
  date: string,
  savedReservations: Map<string, ParkingSlotData>
): ParkingSlotData[] => {
  const dateHash = date.split('-').reduce((acc, part) => acc + parseInt(part), 0);
  const variance = dateHash % 10;
  
  const sampleNames = [
    'Juan Dela Cruz', 'Pedro Reyes', 'Carlos Tan', 'Linda Garcia', 'Diego Cruz',
    'Maria Santos', 'Anna Lopez', 'Elena Flores', 'Sofia Ramos', 'Miguel Torres',
    'Roberto Silva', 'Isabella Morales', 'Fernando Diaz', 'Valentina Gomez'
  ];
  
  const sampleColors = [
    'Red', 'White', 'Silver', 'Green', 'Orange', 'Blue', 'Black', 'Pink',
    'Yellow', 'Gray', 'Brown', 'Maroon', 'Navy', 'Teal'
  ];
  
  const vehicleTypes = ['Sedan', 'SUV', 'Van', 'Truck', 'Hatchback', 'Pickup'];
  
  const parkingData: ParkingSlotData[] = [];
  
  if (config.isEvenLayout && config.evenConfig) {
    // Even layout generation
    for (let floor = 1; floor <= config.floors; floor++) {
      for (let rowIndex = 0; rowIndex < config.evenConfig.rows; rowIndex++) {
        const rowLetter = String.fromCharCode(65 + rowIndex);
        
        for (let col = 1; col <= config.evenConfig.columns; col++) {
          const slotId = `${floor}F-${rowLetter}${col}`;
          
          if (savedReservations.has(slotId)) {
            parkingData.push(savedReservations.get(slotId)!);
            continue;
          }
          
          const slotHash = (floor * 100 + rowIndex * 10 + col + variance) % 15;
          const isOccupied = slotHash < 3;
          const isReserved = !isOccupied && slotHash < 5;
          const nameIndex = (floor + rowIndex + col) % sampleNames.length;
          
          const slot: ParkingSlotData = {
            id: slotId,
            floor,
            row: rowLetter,
            number: col,
            status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
            category: 'regular',
          };
          
          if (isOccupied) {
            slot.name = sampleNames[nameIndex];
            slot.carColor = sampleColors[nameIndex % sampleColors.length];
            slot.plateNumber = `${String.fromCharCode(65 + (nameIndex % 26))}${String.fromCharCode(66 + (nameIndex % 25))}${String.fromCharCode(67 + (nameIndex % 24))} ${100 + nameIndex}`;
            slot.vehicleType = vehicleTypes[nameIndex % vehicleTypes.length];
            slot.startTime = ['8:00 AM', '9:00 AM', '10:00 AM', '7:00 AM'][nameIndex % 4];
            slot.endTime = ['5:00 PM', '6:00 PM', '4:00 PM', '3:00 PM'][nameIndex % 4];
            slot.duration = ['9 hours', '8 hours', '6 hours', '7 hours'][nameIndex % 4];
            slot.timeLeft = ['3h 45m', '2h 30m', '1h 15m', '4h 00m'][nameIndex % 4];
            slot.paymentStatus = ['paid', 'partial', 'paid', 'pending'][nameIndex % 4] as 'paid' | 'pending' | 'partial';
            slot.totalBalance = [450, 350, 400, 500][nameIndex % 4];
            slot.phoneNumber = `+63 9${10 + (nameIndex % 89)} ${100 + nameIndex} ${1000 + nameIndex}`;
          } else if (isReserved) {
            slot.name = sampleNames[(nameIndex + 5) % sampleNames.length];
            slot.carColor = sampleColors[(nameIndex + 3) % sampleColors.length];
            slot.plateNumber = `${String.fromCharCode(88 + (nameIndex % 3))}YZ ${200 + nameIndex}`;
            slot.vehicleType = vehicleTypes[(nameIndex + 2) % vehicleTypes.length];
            slot.startTime = '2:00 PM';
            slot.endTime = '6:00 PM';
            slot.duration = '4 hours';
            slot.timeLeft = 'Starts in 1h';
            slot.paymentStatus = 'paid';
            slot.totalBalance = 300;
            slot.phoneNumber = `+63 9${20 + (nameIndex % 79)} ${200 + nameIndex} ${2000 + nameIndex}`;
          }
          
          parkingData.push(slot);
        }
      }
    }
  } else if (!config.isEvenLayout && config.floorConfigs) {
    // Uneven layout generation with categories
    config.floorConfigs.forEach(floorConfig => {
      floorConfig.rows.forEach(rowConfig => {
        for (let slotNum = 1; slotNum <= rowConfig.slotCount; slotNum++) {
          const slotId = `${floorConfig.floor}F-${rowConfig.rowLetter}${slotNum}`;
          
          if (savedReservations.has(slotId)) {
            parkingData.push(savedReservations.get(slotId)!);
            continue;
          }
          
          const category = rowConfig.categories[slotNum] || 'regular';
          const slotHash = (floorConfig.floor * 100 + rowConfig.rowLetter.charCodeAt(0) + slotNum + variance) % 15;
          const isOccupied = slotHash < 3;
          const isReserved = !isOccupied && slotHash < 5;
          const nameIndex = (floorConfig.floor + rowConfig.rowLetter.charCodeAt(0) + slotNum) % sampleNames.length;
          
          const slot: ParkingSlotData = {
            id: slotId,
            floor: floorConfig.floor,
            row: rowConfig.rowLetter,
            number: slotNum,
            status: isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available',
            category,
          };
          
          if (isOccupied) {
            slot.name = sampleNames[nameIndex];
            slot.carColor = sampleColors[nameIndex % sampleColors.length];
            slot.plateNumber = `${String.fromCharCode(65 + (nameIndex % 26))}${String.fromCharCode(66 + (nameIndex % 25))}${String.fromCharCode(67 + (nameIndex % 24))} ${100 + nameIndex}`;
            slot.vehicleType = vehicleTypes[nameIndex % vehicleTypes.length];
            slot.startTime = ['8:00 AM', '9:00 AM', '10:00 AM', '7:00 AM'][nameIndex % 4];
            slot.endTime = ['5:00 PM', '6:00 PM', '4:00 PM', '3:00 PM'][nameIndex % 4];
            slot.duration = ['9 hours', '8 hours', '6 hours', '7 hours'][nameIndex % 4];
            slot.timeLeft = ['3h 45m', '2h 30m', '1h 15m', '4h 00m'][nameIndex % 4];
            slot.paymentStatus = ['paid', 'partial', 'paid', 'pending'][nameIndex % 4] as 'paid' | 'pending' | 'partial';
            slot.totalBalance = [450, 350, 400, 500][nameIndex % 4];
            slot.phoneNumber = `+63 9${10 + (nameIndex % 89)} ${100 + nameIndex} ${1000 + nameIndex}`;
          } else if (isReserved) {
            slot.name = sampleNames[(nameIndex + 5) % sampleNames.length];
            slot.carColor = sampleColors[(nameIndex + 3) % sampleColors.length];
            slot.plateNumber = `${String.fromCharCode(88 + (nameIndex % 3))}YZ ${200 + nameIndex}`;
            slot.vehicleType = vehicleTypes[(nameIndex + 2) % vehicleTypes.length];
            slot.startTime = '2:00 PM';
            slot.endTime = '6:00 PM';
            slot.duration = '4 hours';
            slot.timeLeft = 'Starts in 1h';
            slot.paymentStatus = 'paid';
            slot.totalBalance = 300;
            slot.phoneNumber = `+63 9${20 + (nameIndex % 79)} ${200 + nameIndex} ${2000 + nameIndex}`;
          }
          
          parkingData.push(slot);
        }
      });
    });
  }
  
  return parkingData;
};

export function SmartParkingDashboard() {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [parkingConfig, setParkingConfig] = useState<AdvancedParkingConfigType | null>(() => {
    const saved = localStorage.getItem('advancedParkingConfig');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlotData | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state for reservation
  const [formData, setFormData] = useState({
    driverName: '',
    carColor: '',
    plateNumber: '',
    vehicleType: 'Sedan',
    phoneNumber: '',
    startTime: '',
    endTime: '',
  });
  
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [reservations, setReservations] = useState<Map<string, ParkingSlotData>>(new Map());

  // Show config modal on first load if no config exists
  useEffect(() => {
    if (!parkingConfig) {
      setShowConfigModal(true);
    }
  }, []);

  // Load reservations when date changes
  useEffect(() => {
    const savedReservations = loadSavedReservations(selectedDate);
    setReservations(savedReservations);
  }, [selectedDate]);

  // Generate parking slots when config, date, or reservations change
  useEffect(() => {
    if (parkingConfig) {
      const slots = generateParkingDataForAdvancedConfig(parkingConfig, selectedDate, reservations);
      setParkingSlots(slots);
    }
  }, [parkingConfig, selectedDate, reservations]);

  const handleSaveConfig = (config: AdvancedParkingConfigType) => {
    setParkingConfig(config);
    localStorage.setItem('advancedParkingConfig', JSON.stringify(config));
    setSelectedFloor(1);
    setShowConfigModal(false);
    toast.success('Parking lot configuration saved!');
  };

  const handleSlotClick = (slot: ParkingSlotData) => {
    setSelectedSlot(slot);
    setShowModal(true);
    
    if (slot.status === 'available') {
      setFormData({
        driverName: '',
        carColor: '',
        plateNumber: '',
        vehicleType: 'Sedan',
        phoneNumber: '',
        startTime: '',
        endTime: '',
      });
    }
  };

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '';
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMin - startMin;
    
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    
    if (hours < 0) {
      hours += 24;
    }
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  };

  const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleCreateReservation = () => {
    if (!selectedSlot || !formData.driverName || !formData.plateNumber || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    const updatedSlot: ParkingSlotData = {
      ...selectedSlot,
      status: 'reserved',
      name: formData.driverName,
      carColor: formData.carColor || 'Not specified',
      plateNumber: formData.plateNumber,
      vehicleType: formData.vehicleType,
      phoneNumber: formData.phoneNumber || 'Not provided',
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
      duration,
      timeLeft: 'Upcoming',
      paymentStatus: 'pending',
      totalBalance: 0,
    };

    const newReservations = new Map(reservations);
    newReservations.set(selectedSlot.id, updatedSlot);
    setReservations(newReservations);
    
    saveReservations(selectedDate, newReservations);

    addNotification({
      type: 'booking',
      title: 'New Reservation Created',
      message: `${formData.driverName} reserved slot ${selectedSlot.id} for ${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`,
    });

    toast.success(`Reservation created for slot ${selectedSlot.id}!`);
    setShowModal(false);
    setSelectedSlot(null);
    setFormData({
      driverName: '',
      carColor: '',
      plateNumber: '',
      vehicleType: 'Sedan',
      phoneNumber: '',
      startTime: '',
      endTime: '',
    });
  };

  const handleCancelReservation = () => {
    if (!selectedSlot) return;

    const newReservations = new Map(reservations);
    newReservations.delete(selectedSlot.id);
    setReservations(newReservations);
    
    saveReservations(selectedDate, newReservations);

    addNotification({
      type: 'system',
      title: 'Reservation Cancelled',
      message: `Reservation for slot ${selectedSlot.id} (${selectedSlot.name}) has been cancelled`,
    });

    toast.success(`Reservation for slot ${selectedSlot.id} has been cancelled`);
    setShowModal(false);
    setSelectedSlot(null);
  };

  const handleNotifyDriver = () => {
    if (selectedSlot) {
      toast.success(`Notification sent to ${selectedSlot.name}`);
      addNotification({
        type: 'system',
        title: 'Notification Sent',
        message: `Notification sent to ${selectedSlot.name} for slot ${selectedSlot.id}`,
      });
    }
  };

  const getSlotColorByStatus = (status: string, category: SlotCategory) => {
    if (status === 'available') {
      const style = categoryStyles[category];
      return `bg-green-50 ${style.border} border-2`;
    } else if (status === 'reserved') {
      return 'bg-yellow-50 border-yellow-500 border-2';
    } else {
      return 'bg-red-50 border-red-500 border-2';
    }
  };

  const getSlotIconByCategory = (category: SlotCategory) => {
    const IconComponent = categoryIcons[category];
    return <IconComponent className="size-4 mb-1" />;
  };

  const getModalContent = () => {
    if (!selectedSlot) return null;

    const CloseXButton = (
      <button 
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="size-6" />
      </button>
    );

    const CategoryBadge = ({ category }: { category: SlotCategory }) => {
      const style = categoryStyles[category];
      const Icon = categoryIcons[category];
      return (
        <div className={`flex items-center gap-1 px-2 py-1 ${style.bg} rounded-lg`}>
          <Icon className="size-3 text-white" />
          <span className="text-xs font-bold text-white uppercase">{category}</span>
        </div>
      );
    };

    if (selectedSlot.status === 'available') {
      return (
        <div className="space-y-6">
          {CloseXButton}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-[#1e3d5a]">
                Create Reservation
              </h3>
              <CategoryBadge category={selectedSlot.category} />
            </div>
            <p className="text-gray-600">Slot: <span className="font-semibold text-[#ee6b20]">{selectedSlot.id}</span></p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name *</label>
              <Input type="text" placeholder="Enter driver name" value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Color</label>
              <Input type="text" placeholder="Enter car color" value={formData.carColor} onChange={(e) => setFormData({ ...formData, carColor: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number *</label>
              <Input type="text" placeholder="ABC 123" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select className="w-full border border-gray-300 rounded-xl px-3 py-2" value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Van</option>
                <option>Truck</option>
                <option>Hatchback</option>
                <option>Pickup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input type="tel" placeholder="+63 912 345 6789" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="rounded-xl" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReservation}
              className="flex-1 bg-[#ee6b20] hover:bg-[#d55f1c] text-white rounded-xl"
            >
              Create Reservation
            </Button>
          </div>
        </div>
      );
    }

    if (selectedSlot.status === 'reserved') {
      return (
        <div className="space-y-6">
          {CloseXButton}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-[#1e3d5a]">Reservation Details</h3>
              <CategoryBadge category={selectedSlot.category} />
            </div>
            <p className="text-gray-600">Slot: <span className="font-semibold text-yellow-600">{selectedSlot.id}</span></p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <User className="size-4 text-gray-600" />
                <span className="text-sm text-gray-600">Driver</span>
              </div>
              <span className="font-semibold text-[#1e3d5a]">{selectedSlot.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Car className="size-4 text-gray-600" />
                <span className="text-sm text-gray-600">Car Color</span>
              </div>
              <span className="font-semibold text-[#1e3d5a]">{selectedSlot.carColor}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Plate Number</span>
              <span className="font-semibold text-[#1e3d5a]">{selectedSlot.plateNumber}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Vehicle Type</span>
              <span className="font-semibold text-[#1e3d5a]">{selectedSlot.vehicleType}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-gray-600" />
                <span className="text-sm text-gray-600">Time Slot</span>
              </div>
              <span className="font-semibold text-[#1e3d5a]">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <span className="text-sm font-medium text-yellow-800">Status</span>
              <span className="font-semibold text-yellow-800">Reserved - {selectedSlot.timeLeft}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Close
            </Button>
            <Button
              onClick={handleCancelReservation}
              variant="destructive"
              className="flex-1 rounded-xl"
            >
              Cancel Reservation
            </Button>
          </div>
        </div>
      );
    }

    // Occupied slot
    return (
      <div className="space-y-6">
        {CloseXButton}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-[#1e3d5a]">Vehicle & Parking Information</h3>
            <CategoryBadge category={selectedSlot.category} />
          </div>
          <p className="text-gray-600">Slot: <span className="font-semibold text-red-600">{selectedSlot.id}</span></p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <User className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Driver Name</span>
            </div>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.name}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Car className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Car Color</span>
            </div>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.carColor}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">Plate Number</span>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.plateNumber}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">Vehicle Type</span>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.vehicleType}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Parking Duration</span>
            </div>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.duration}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">Time Left</span>
            <span className="font-semibold text-orange-600">{selectedSlot.timeLeft}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Payment Status</span>
            </div>
            <span className={`font-semibold ${
              selectedSlot.paymentStatus === 'paid' ? 'text-green-600' :
              selectedSlot.paymentStatus === 'partial' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {selectedSlot.paymentStatus === 'paid' ? 'Paid' :
               selectedSlot.paymentStatus === 'partial' ? 'Partial Payment' :
               'Pending'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#1e3d5a]/5 rounded-xl border border-[#1e3d5a]/20">
            <span className="text-sm font-medium text-[#1e3d5a]">Total Balance</span>
            <span className="text-xl font-bold text-[#1e3d5a]">₱{selectedSlot.totalBalance}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-gray-600" />
              <span className="text-sm text-gray-600">Phone Number</span>
            </div>
            <span className="font-semibold text-[#1e3d5a]">{selectedSlot.phoneNumber}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={() => setShowModal(false)}
            variant="outline"
            className="flex-1 rounded-xl"
          >
            Close
          </Button>
          <Button
            onClick={handleNotifyDriver}
            className="flex-1 bg-[#ee6b20] hover:bg-[#d55f1c] text-white rounded-xl"
          >
            <Send className="size-4 mr-2" />
            Notify Now
          </Button>
        </div>
      </div>
    );
  };

  const getRowsForFloor = (floor: number) => {
    if (!parkingConfig) return [];
    
    if (parkingConfig.isEvenLayout && parkingConfig.evenConfig) {
      return Array.from({ length: parkingConfig.evenConfig.rows }, (_, i) => String.fromCharCode(65 + i));
    } else if (!parkingConfig.isEvenLayout && parkingConfig.floorConfigs) {
      const floorConfig = parkingConfig.floorConfigs.find(fc => fc.floor === floor);
      return floorConfig ? floorConfig.rows.map(r => r.rowLetter) : [];
    }
    
    return [];
  };

  if (!parkingConfig) {
    return (
      <>
        <AdvancedParkingConfig
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onSave={handleSaveConfig}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please configure your parking lot to continue.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3d5a] mb-2">Parking Management</h1>
          <p className="text-gray-600">Manage parking slots, reservations, and real-time occupancy</p>
        </div>
      </div>

      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-[#1e3d5a] rounded-lg">
              <CalendarIcon className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Select Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-gray-200 focus:border-[#1e3d5a] rounded-xl h-11"
              />
            </div>
          </div>
          
          <Button
            onClick={() => setShowConfigModal(true)}
            className="bg-[#ee6b20] hover:bg-[#d55f1c] text-white rounded-xl h-11 px-6 font-bold shadow-sm hover:shadow-md transition-all"
          >
            <Settings className="size-4 mr-2" />
            Configure Lot
          </Button>
        </div>
      </div>

      {/* Floor Selection */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-[#1e3d5a] rounded-lg">
            <MapPin className="size-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#1e3d5a]">Floor Selection</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: parkingConfig.floors }, (_, i) => i + 1).map((floor) => {
            const floorSlots = parkingSlots.filter(slot => slot.floor === floor);
            const available = floorSlots.filter(s => s.status === 'available').length;
            const total = floorSlots.length;
            
            return (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`relative group px-5 py-3 rounded-xl border-2 font-bold transition-all ${
                  selectedFloor === floor
                    ? 'bg-[#1e3d5a] border-[#1e3d5a] text-white shadow-md scale-105'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#ee6b20] hover:text-[#ee6b20]'
                }`}
              >
                <div className="text-sm">Floor {floor}</div>
                <div className={`text-xs mt-0.5 ${
                  selectedFloor === floor ? 'text-white/80' : 'text-gray-400'
                }`}>
                  {available}/{total}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parking Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#1e3d5a] rounded-lg">
              <Car className="size-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1e3d5a]">
              Floor {selectedFloor} - Parking Grid
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="size-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(categoryStyles).map(([key, style]) => {
            const Icon = categoryIcons[key as SlotCategory];
            const count = parkingSlots.filter(s => s.category === key && s.floor === selectedFloor).length;
            return (
              <div key={key} className={`flex items-center gap-1 px-2 py-1 ${style.bg} rounded-lg`}>
                <Icon className="size-3 text-white" />
                <span className="text-xs font-bold text-white uppercase">{key}</span>
                <span className="text-xs text-white/80">({count})</span>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {getRowsForFloor(selectedFloor).map((rowLetter) => {
              const rowSlots = parkingSlots.filter(
                slot => slot.floor === selectedFloor && slot.row === rowLetter
              );

              return (
                <div key={rowLetter} className="flex items-center gap-2 mb-3">
                  {/* Row Label */}
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-[#1e3d5a] bg-gray-100 rounded-lg text-sm">
                    {rowLetter}
                  </div>

                  {/* Slots */}
                  <div className="flex gap-2 flex-wrap">
                    {rowSlots.map((slot) => {
                      const Icon = categoryIcons[slot.category];
                      return (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotClick(slot)}
                          onMouseEnter={() => setHoveredSlot(slot.id)}
                          onMouseLeave={() => setHoveredSlot(null)}
                          className={`relative group w-20 h-20 rounded-xl font-bold transition-all ${
                            getSlotColorByStatus(slot.status, slot.category)
                          } ${
                            slot.status === 'available'
                              ? `hover:scale-105 hover:shadow-md ${categoryStyles[slot.category].text}`
                              : slot.status === 'reserved'
                              ? 'text-yellow-700 hover:bg-yellow-100 hover:scale-105 hover:shadow-md'
                              : 'text-red-700 hover:bg-red-100 hover:scale-105 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            {slot.status === 'available' ? (
                              <Icon className="size-6 mb-1" />
                            ) : slot.vehicleType === 'SUV' ? (
                              <Truck className="size-6 mb-1" />
                            ) : slot.vehicleType === 'Van' ? (
                              <Bus className="size-6 mb-1" />
                            ) : (
                              <Car className="size-6 mb-1" />
                            )}
                            <span className="text-xs font-black">{slot.number}</span>
                          </div>

                          {/* Hover Tooltip */}
                          {hoveredSlot === slot.id && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1e3d5a] text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                              <div className="font-bold">{slot.id}</div>
                              <div className="text-white/80 capitalize">{slot.category}</div>
                              {slot.name && (
                                <div className="text-white/80">{slot.name}</div>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['available', 'reserved', 'occupied'].map((status) => {
          const count = parkingSlots.filter(s => s.status === status).length;
          const total = parkingSlots.length;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
          
          return (
            <div key={status} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-600 uppercase">{status}</span>
                <div className={`size-8 rounded-lg flex items-center justify-center ${
                  status === 'available' ? 'bg-green-100 text-green-600' :
                  status === 'reserved' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <Car className="size-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#1e3d5a]">{count}</span>
                <span className="text-sm font-bold text-gray-400 mb-1">slots</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-gray-500">
                {percentage}% of total
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Modal */}
      <AdvancedParkingConfig
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveConfig}
        currentConfig={parkingConfig}
      />

      {/* Slot Details Modal */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              {getModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}