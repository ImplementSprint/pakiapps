import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Clock, CheckCircle, MapPin, Ticket, Printer, ShieldCheck, CreditCard, Share2, Image as ImageIcon, Car } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

import logo from 'figma:asset/430f6b7df4e30a8a6fddb7fbea491ba629555e7c.png';

type Step = 'datetime' | 'payment' | 'confirmation';

export function FixedBooking() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  
  const [userData, setUserData] = useState({ 
    name: localStorage.getItem('userName') || '' 
  });
  
  // Initialize state by checking navigation state immediately
  const [activeVehicle, setActiveVehicle] = useState({ 
    model: routerLocation.state?.vehicle ? `${routerLocation.state.vehicle.brand} ${routerLocation.state.vehicle.model}` : 'No Vehicle Selected', 
    plate: routerLocation.state?.vehicle?.plateNumber || '---',
    type: routerLocation.state?.vehicle?.type || 'Vehicle'
  });

  const [currentStep, setCurrentStep] = useState<Step>('datetime');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    paymentMethod: 'GCash',
    location: routerLocation.state?.location || 'Manila City Central Lot' 
  });

  // SYNC LOGIC: Consistency with dashboard selection
  useEffect(() => {
    const syncAllData = () => {
      const savedName = localStorage.getItem('userName');
      if (savedName) setUserData({ name: savedName });

      if (routerLocation.state?.vehicle) {
        const v = routerLocation.state.vehicle;
        setActiveVehicle({
          model: `${v.brand} ${v.model}`,
          plate: v.plateNumber,
          type: v.type || 'Sedan'
        });
        return;
      }

      const savedVehicles = localStorage.getItem('userVehicles');
      if (savedVehicles) {
        const vehicles = JSON.parse(savedVehicles);
        const active = vehicles.find((v: any) => v.isActive) || vehicles[0];
        if (active) {
          setActiveVehicle({
            model: `${active.brand} ${active.model}`,
            plate: active.plateNumber,
            type: active.type || 'Sedan'
          });
        }
      }
    };

    const getDurationString = () => {
    const hours = calculateHours();
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
  };

    syncAllData();
    window.addEventListener('storage', syncAllData);
    return () => window.removeEventListener('storage', syncAllData);
  }, [routerLocation.state]); 

  const calculateHours = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0;
    const diff = new Date(`2000-01-01T${bookingData.endTime}`).getTime() - new Date(`2000-01-01T${bookingData.startTime}`).getTime();
    return Math.max(0, diff / 3600000);
  };

  const calculateSubtotal = () => Math.round(calculateHours() * 50);

  const handleDownloadImage = () => {
    setNotification("Generating your E-Ticket JPEG...");
    setTimeout(() => {
      setNotification("Ticket successfully saved to your gallery!");
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  const handleShare = async () => {
    const shareText = `PakiPark Reservation: ${activeVehicle.plate}\nVehicle: ${activeVehicle.model}\nLocation: ${bookingData.location}\nTime: ${bookingData.startTime} - ${bookingData.endTime}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PakiPark E-Ticket', text: shareText, url: window.location.href });
        setNotification("Ticket shared successfully!");
      } catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(shareText);
      setNotification("Ticket details copied to clipboard!");
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-800 print:bg-white relative">
      
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#1e3d5a] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 print:hidden">
          <div className="size-2 bg-[#ee6b20] rounded-full animate-pulse" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-8 py-4 flex justify-between items-center w-full print:hidden">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/customer/home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="size-6" />
          </button>
          <img src={logo} alt="PakiPark" className="h-7 w-auto" />
        </div>
        <nav className="hidden lg:flex items-center gap-10">
          {['Schedule', 'Payment', 'Confirm'].map((step, i) => {
            const stepKey = ['datetime', 'payment', 'confirmation'][i];
            const isActive = currentStep === stepKey;
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${isActive ? 'bg-[#ee6b20] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-[#1e3d5a]' : 'text-gray-300'}`}>{step}</span>
                {i < 2 && <div className="w-8 h-[1px] bg-gray-200 mx-2" />}
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl max-w-[240px]">
          <MapPin className="size-4 text-[#ee6b20] shrink-0" />
          <span className="text-xs font-bold text-[#1e3d5a] truncate">{bookingData.location}</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-8">
        
        {/* STEP 1: DATETIME */}
        {currentStep === 'datetime' && (
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[70vh]">
              <div className="lg:col-span-7 space-y-8">
                <h2 className="text-5xl lg:text-6xl font-bold text-[#1e3d5a] leading-tight">
                  Plan your <span className="text-[#ee6b20]">parking</span> <br/>ahead of time.
                </h2>
                
                <div className="flex items-center gap-3 bg-white w-fit px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <Car className="text-[#ee6b20] size-5" />
                  <span className="text-sm font-bold text-[#1e3d5a]">
                    Booking for: {activeVehicle.plate} ({activeVehicle.model})
                  </span>
                </div>

                <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                  Secure your slot in seconds. No more circling the block—just arrive and park with confidence at {bookingData.location}.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-50 p-10 lg:p-12 relative overflow-hidden">
                  <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('payment'); }} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Arrival Date</label>
                      <Input type="date" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} required className="h-14 bg-gray-50 border-none rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Check-in</label>
                        <Input type="time" value={bookingData.startTime} onChange={e => setBookingData({...bookingData, startTime: e.target.value})} required className="h-14 bg-gray-50 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Check-out</label>
                        <Input type="time" value={bookingData.endTime} onChange={e => setBookingData({...bookingData, endTime: e.target.value})} required className="h-14 bg-gray-50 border-none rounded-xl" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#ee6b20] hover:bg-[#d95a10] h-14 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all hover:translate-y-[-2px]">
                      Next: Payment
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {currentStep === 'payment' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="lg:col-span-4 bg-[#1e3d5a] rounded-3xl p-8 text-white space-y-6 shadow-xl">
               <h3 className="text-xl font-bold">Order Summary</h3>
               <div className="space-y-3 opacity-80 text-sm">
                 <div className="flex justify-between"><span>Vehicle</span><span className="font-bold">{activeVehicle.plate}</span></div>
                 <div className="flex justify-between"><span>Base Rate</span><span>₱50.00/hr</span></div>
                 <div className="flex justify-between"><span>Location</span><span className="max-w-[120px] text-right truncate">{bookingData.location}</span></div>
               </div>
               <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                 <span className="font-bold text-[10px] uppercase opacity-60">Total Amount</span>
                 <span className="text-4xl font-bold text-[#ee6b20]">₱{calculateSubtotal()}</span>
               </div>
            </div>
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
              <h3 className="font-bold text-2xl text-[#1e3d5a] mb-8">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {['GCash', 'Maya', 'Visa'].map((method) => (
                  <button key={method} onClick={() => setBookingData({...bookingData, paymentMethod: method})}
                    className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${bookingData.paymentMethod === method ? 'border-[#ee6b20] bg-orange-50' : 'border-gray-50 hover:border-gray-100'}`}>
                    <CreditCard className={`size-6 ${bookingData.paymentMethod === method ? 'text-[#ee6b20]' : 'text-gray-300'}`} />
                    <span className="font-bold text-xs uppercase">{method}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep('datetime')} className="h-14 px-8 rounded-xl font-bold">Back</Button>
                <Button onClick={() => setCurrentStep('confirmation')} className="flex-1 bg-[#1e3d5a] h-14 rounded-xl text-white font-bold uppercase tracking-widest shadow-lg">Review Reservation</Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION (TICKET) */}
        {currentStep === 'confirmation' && (
          <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-8 print:hidden">
                <div>
                  <h2 className="text-4xl font-bold text-[#1e3d5a] leading-tight">Confirm Your <br/><span className="text-[#ee6b20]">Reservation</span></h2>
                  <p className="text-lg text-gray-500 mt-4 leading-relaxed">Review your E-Ticket details for your {activeVehicle.model}.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleShare} variant="outline" className="h-16 rounded-2xl border-2 font-bold group hover:border-[#1e3d5a]">
                    <Share2 className="mr-2 size-5 transition-transform group-hover:scale-110" /> Share Ticket
                  </Button>
                  <Button onClick={handleDownloadImage} variant="outline" className="h-16 rounded-2xl border-2 font-bold group hover:border-[#1e3d5a]">
                    <ImageIcon className="mr-2 size-5 transition-transform group-hover:rotate-12" /> Download Image
                  </Button>
                </div>

                {/* INSTRUCTIONAL MESSAGE OUTSIDE */}
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm">
                  <div className="size-10 bg-[#ee6b20] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                    <CheckCircle className="size-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#1e3d5a] text-sm uppercase tracking-wider">Upon Arrival</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Please <span className="font-bold text-[#ee6b20]">show the barcode</span> on your E-Pass to the parking attendant at the desk for validation.
                    </p>
                  </div>
                </div>
                
                {/* RESTORED: BACK TO PAYMENT BUTTON */}
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep('payment')} 
                  className="w-full h-14 text-gray-400 hover:text-[#1e3d5a] font-bold"
                >
                  <ArrowLeft className="mr-2 size-4" /> Change Payment Method
                </Button>
              </div>

              {/* TICKET PASS */}
              <div className="lg:col-span-7 bg-white rounded-[3rem] border border-gray-200 shadow-2xl overflow-hidden relative max-w-[460px] mx-auto print:shadow-none print:border-none">
                <div className="bg-[#1e3d5a] p-8 text-white relative">
                   <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.3em] mb-1">PakiPark E-Pass</p>
                   <h3 className="text-2xl font-bold text-[#ee6b20]">Fixed Reservation</h3>
                </div>
                <div className="p-8 space-y-6 relative">
                  <div className="absolute -left-4 top-0 -translate-y-1/2 size-8 bg-[#f8fafc] rounded-full border border-gray-200" />
                  <div className="absolute -right-4 top-0 -translate-y-1/2 size-8 bg-[#f8fafc] rounded-full border border-gray-200" />
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-b border-gray-100 pb-6 text-sm">
                    <div className="col-span-2 space-y-0.5">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Location</div>
                      <p className="font-bold text-[#1e3d5a] text-lg leading-tight">{bookingData.location}</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Customer</div>
                      <p className="font-bold text-[#1e3d5a] truncate">{userData.name}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Plate Number</div>
                      <p className="font-bold text-[#ee6b20]">{activeVehicle.plate}</p>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Vehicle Model</div>
                      <p className="font-bold text-[#1e3d5a]">{activeVehicle.model}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <div className="text-[9px] font-bold text-gray-400 uppercase">Time Slot</div>
                      <p className="font-bold text-[#1e3d5a]">{bookingData.startTime} - {bookingData.endTime}</p>
                    </div>
                  </div>

                  <div className="py-2 flex flex-col items-center gap-2">
                    <div className="w-full h-14 bg-white flex items-center justify-center px-4 overflow-hidden">
                       {Array.from({ length: 60 }).map((_, i) => (
                         <div key={i} className="bg-black shrink-0" style={{ width: `${Math.floor(Math.random() * 3) + 1}px`, height: '100%', marginLeft: '1px', opacity: Math.random() > 0.1 ? 1 : 0 }} />
                       ))}
                    </div>
                    <p className="text-[9px] font-mono text-gray-400 tracking-[0.6em] uppercase">PKP-FIXED-{activeVehicle.plate.replace(/\s/g, '')}</p>
                  </div>

                  <Button onClick={() => setShowSuccessModal(true)} className="w-full bg-[#1e3d5a] hover:bg-[#152b40] h-16 rounded-2xl text-white font-bold text-lg uppercase tracking-[0.1em] shadow-xl print:hidden">
                    Confirm Reservation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1e3d5a]/40 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
          {/* Adjusted to max-w-xs (square-ish feel) and rounded-3xl */}
          <div className="bg-white w-full max-w-xs aspect-square flex flex-col items-center justify-center p-10 rounded-[2rem] border border-gray-100 shadow-2xl text-center">
            
            <div className="size-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="size-8 text-emerald-500" />
            </div>
            
            <div className="space-y-2 mb-8">
              <h2 className="text-xl font-bold text-[#1e3d5a]">Booking Confirmed</h2>
              <p className="text-gray-500 text-xs leading-relaxed px-2">
                Reserved for <span className="font-bold text-gray-900">{activeVehicle.plate}</span> at {bookingData.location}.
              </p>
            </div>

            <Button 
              onClick={() => navigate('/customer/home')} 
              className="w-full h-12 bg-[#ee6b20] hover:bg-[#d95a10] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}