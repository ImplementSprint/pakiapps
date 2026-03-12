import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CustomerSettings } from "./CustomerSettings";
import { MyBookings } from "./MyBookings";
import { CustomerHeader } from "../components/customer/CustomerHeader";
import { VehicleManagement } from "../components/customer/VehicleManagement";
import { QuickActionsMenu } from "../components/customer/QuickActionsMenu";
import { RecentBookings } from "../components/customer/RecentBookings";
import { RateAndReview } from "../components/customer/RateAndReview";
import { LocationModal } from "../components/customer/LocationModal";
import { VehicleModal } from "../components/customer/VehicleModal";
import { CustomerTutorial } from "../components/customer/CustomerTutorial";
import { vehicleService } from "../services/vehicleService";
import { bookingService } from "../services/bookingService";
import { locationService } from "../services/locationService";
import { reviewService } from "../services/reviewService";

export function CustomerHome() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orInputRef = useRef<HTMLInputElement>(null);
  const crInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"home" | "bookings" | "settings">("home");
  const [activeSettingsPage, setActiveSettingsPage] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

   // --- TUTORIAL STATE ---
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // --- DATA ---
  const mockLocations = [
    { id: 1, name: "Ayala Center", address: "Makati Central Business District", distance: "3.5 km away" },
    { id: 2, name: "Robinsons Galleria", address: "EDSA cor. Ortigas Avenue, Quezon City", distance: "5.0 km away" },
    { id: 3, name: "SM North EDSA", address: "North Avenue cor. EDSA, Quezon City", distance: "6.8 km away" },
    { id: 4, name: "SM San Lazaro", address: "Felix Huertas cor. A.H. Lacson St., Manila", distance: "8.4 km away" },
    { id: 5, name: "SM Mall of Asia (MOA)", address: "Seaside Blvd, Pasay City", distance: "11.5 km away" },
  ];
  const [availableLocations, setAvailableLocations] = useState(mockLocations);

  // Fetch locations from API
  useEffect(() => {
    locationService.getLocations({ status: 'active' }).then((data) => {
      if (data && data.length > 0) {
        setAvailableLocations(data.map((loc: any) => ({
          id: loc._id,
          name: loc.name,
          address: loc.address,
          distance: "",
        })));
      }
    }).catch(() => { /* fallback to mock data */ });
  }, []);

  // --- USER DATA SYNC ---
  const [profile, setProfile] = useState({
    name: localStorage.getItem("userName") || "Guest User",
    profilePic:
      localStorage.getItem("customerProfilePicture") ||
      localStorage.getItem("userProfilePic") ||
      null,
  });

  useEffect(() => {
    const handleStorageSync = () => {
      setProfile({
        name: localStorage.getItem("userName") || "Guest User",
        profilePic:
          localStorage.getItem("customerProfilePicture") ||
          localStorage.getItem("userProfilePic") ||
          null,
      });
    };
    window.addEventListener("storage", handleStorageSync);
    handleStorageSync();
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) setShowTutorial(true);
  }, []);

  const handleProfilePicUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile((prev) => ({ ...prev, profilePic: base64 }));
        localStorage.setItem("userProfilePic", base64);
        localStorage.setItem("customerProfilePicture", base64);
        window.dispatchEvent(new Event("storage"));
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  // --- VEHICLES STATE ---
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCarIndex, setEditingCarIndex] = useState<number | null>(null);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const defaultCars = [
    { brand: "Toyota", model: "Vios", color: "Silver", plateNumber: "ABC 1234", type: "sedan" },
    { brand: "Honda", model: "Civic", color: "Black", plateNumber: "XYZ 7890", type: "sedan" },
  ];
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem("userCars");
    return savedCars ? JSON.parse(savedCars) : defaultCars;
  });

  // Fetch vehicles from API on mount
  useEffect(() => {
    vehicleService.getMyVehicles().then((data) => {
      if (data && data.length > 0) {
        setCars(data);
        localStorage.setItem("userCars", JSON.stringify(data));
      }
    }).catch(() => { /* fallback to localStorage/mock data */ });
  }, []);

  const [carFormData, setCarFormData] = useState({
    brand: "",
    model: "",
    color: "",
    plateNumber: "",
    type: "sedan",
    orDoc: null as string | null,
    crDoc: null as string | null,
  });

  const mockRecentBookings = [
    { loc: "SM City Mall", date: "Oct 24, 2023 • 02:30 PM", price: "150" },
    { loc: "Ayala Center", date: "Oct 22, 2023 • 10:15 AM", price: "200" },
  ];
  const [recentBookings, setRecentBookings] = useState(mockRecentBookings);

  // Fetch recent bookings from API on mount
  useEffect(() => {
    bookingService.getMyBookings({ page: 1 }).then((data) => {
      if (data?.bookings && data.bookings.length > 0) {
        setRecentBookings(data.bookings.slice(0, 3).map((b: any) => ({
          loc: b.locationId?.name || b.spot || "Parking",
          date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " • " + (b.timeSlot || ""),
          price: String(b.amount || 0),
        })));
      }
    }).catch(() => { /* fallback to mock data */ });
  }, []);

  const handleDocUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "orDoc" | "crDoc"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      setCarFormData({ ...carFormData, [field]: file.name });
      toast.success(`${field === "orDoc" ? "OR" : "CR"} selected.`);
    }
  };

  const handleSaveCar = async () => {
    const cleanPlate = carFormData.plateNumber.trim().toUpperCase();
    const plateRegex = /^[A-Z0-9]{2,4}[ ]?[0-9]{3,4}$|^[A-Z0-9]{1,8}$/;
    if (!cleanPlate || cleanPlate.length < 4 || cleanPlate.length > 8 || !plateRegex.test(cleanPlate)) {
      toast.error("Invalid Plate Number.");
      return;
    }

    const finalData = { ...carFormData, plateNumber: cleanPlate };

    try {
      if (editingCarIndex !== null && cars[editingCarIndex]?._id) {
        // Update existing vehicle via API
        await vehicleService.updateVehicle(cars[editingCarIndex]._id, finalData);
      } else {
        // Add new vehicle via API
        await vehicleService.addVehicle(finalData);
      }
      // Re-fetch vehicles from API
      const freshVehicles = await vehicleService.getMyVehicles();
      setCars(freshVehicles);
      localStorage.setItem("userCars", JSON.stringify(freshVehicles));
    } catch {
      // Fallback to localStorage
      const updatedCars = [...cars];
      if (editingCarIndex !== null) {
        updatedCars[editingCarIndex] = finalData;
      } else {
        updatedCars.push(finalData);
      }
      setCars(updatedCars);
      localStorage.setItem("userCars", JSON.stringify(updatedCars));
    }

    setShowCarModal(false);
    setEditingCarIndex(null);
    setCarFormData({ brand: "", model: "", color: "", plateNumber: "", type: "sedan", orDoc: null, crDoc: null });
    toast.success("Vehicle saved successfully!");
  };

  const handleDeleteVehicle = async (index: number) => {
    if (cars.length <= 1) {
      toast.error("You must have at least one vehicle.");
      return;
    }

    try {
      if (cars[index]?._id) {
        await vehicleService.deleteVehicle(cars[index]._id);
        const freshVehicles = await vehicleService.getMyVehicles();
        setCars(freshVehicles);
        localStorage.setItem("userCars", JSON.stringify(freshVehicles));
      } else {
        throw new Error("No _id");
      }
    } catch {
      const updatedCars = cars.filter((_: any, i: number) => i !== index);
      setCars(updatedCars);
      localStorage.setItem("userCars", JSON.stringify(updatedCars));
    }
    if (selectedCarIndex >= cars.length - 1) setSelectedCarIndex(0);
    toast.success("Vehicle deleted.");
  };

  const handleSelectLocation = (locationName: string) => {
    setSelectedLocation(locationName);
    setShowLocationModal(false);
    // Navigate directly to unified booking
    const activeCar = cars[selectedCarIndex];
    navigate('/customer/booking/reserve', {
      state: {
        vehicle: activeCar,
        location: locationName,
      },
    });
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    try {
      await reviewService.createReview({ rating: data.rating, comment: data.comment });
    } catch {
      console.log("Review saved locally (backend unavailable):", data);
    }
    toast.success("Thank you for your feedback!");
    setShowReviewModal(false);
  };

  // --- TUTORIAL CONTENT ---
  const tutorialSteps = [
    {
      title: "Welcome to PakiPark",
      description:
        "This tutorial will guide you through the main features of PakiPark. Ready to start?",
      mascot: "https://imgur.com/eX4KbNU.png",
      targetId: null,
    },
    {
      title: "Manage Your Vehicles",
      description:
        "Click 'Add New' to register your vehicles. Select a vehicle from your list to make it the active one.",
      mascot: "https://i.imghippo.com/files/Simn6284nDw.png",
      targetId: "btn-add-vehicle",
    },
    {
      title: "Find a Location",
      description:
        "Ready to park? Click the orange 'Reserve Now' button to search and select your preferred parking location.",
      mascot: "https://i.imghippo.com/files/VBli4411JXI.png",
      targetId: "btn-reserve-now",
    },
    {
      title: "Reserve a 1-Hour Slot",
      description:
        "Pick a date and choose a 1-hour time slot. Arrive anytime within your window — stay longer and pay for extra time used.",
      mascot: "https://i.imghippo.com/files/HRp1324MPc.png",
      targetId: null,
    },
  ];

  const getHighlightStyle = (id: string) => {
    if (showTutorial && tutorialSteps[tutorialStep].targetId === id) {
      return "relative z-[301] ring-4 ring-[#ee6b20] ring-offset-4 ring-offset-[#f9fafb] pointer-events-none transition-all duration-300";
    }
    return "";
  };

  const finishTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    localStorage.setItem("hasSeenTutorial", "true");
  };

  const openTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const [coords, setCoords] = useState({
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });

  useEffect(() => {
    if (showTutorial) {
      const step = tutorialSteps[tutorialStep];
      if (step.targetId) {
        const element = document.getElementById(step.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const boxWidth = 340;

          let leftPos = rect.left + rect.width / 2;

          if (step.targetId === "btn-reserve-now") {
            leftPos = leftPos - 130;
          }

          leftPos = Math.max(
            boxWidth / 2 + 20,
            Math.min(window.innerWidth - (boxWidth / 2 + 20), leftPos)
          );

          setCoords({
            top: `${rect.bottom + 20}px`,
            left: `${leftPos}px`,
            transform: "translateX(-50%)",
          });
        }
      } else {
        setCoords({
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });
      }
    }
  }, [showTutorial, tutorialStep]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePicUpdate}
        accept="image/png, image/jpeg"
        className="hidden"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "home" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <CustomerHeader
              userName={profile.name}
              profilePicture={profile.profilePic}
              onProfilePicClick={() => fileInputRef.current?.click()}
              onGuideClick={openTutorial}
              onReserveClick={() => setShowLocationModal(true)}
              reserveHighlightClass={getHighlightStyle("btn-reserve-now")}
            />

            <VehicleManagement
              cars={cars}
              selectedCarIndex={selectedCarIndex}
              setSelectedCarIndex={setSelectedCarIndex}
              onAddVehicle={() => {
                setEditingCarIndex(null);
                setCarFormData({
                  brand: "",
                  model: "",
                  color: "",
                  plateNumber: "",
                  type: "sedan",
                  orDoc: null,
                  crDoc: null,
                });
                setShowCarModal(true);
              }}
              onEditVehicle={(index) => {
                setEditingCarIndex(index);
                setCarFormData(cars[index]);
                setShowCarModal(true);
              }}
              onDeleteVehicle={handleDeleteVehicle}
              highlightClass={getHighlightStyle("btn-add-vehicle")}
            />

            <QuickActionsMenu 
              onReserveClick={() => setShowLocationModal(true)} // Opens the location picker you already have
              onMyBookingsClick={() => setActiveTab("bookings")} // Switches to the Bookings tab internally
              onRateReviewClick={() => setShowReviewModal(true)} // Opens the full-screen review
            />

            <RecentBookings
              bookings={recentBookings}
              onViewAll={() => navigate("/customer/bookings")}
            />
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="animate-in fade-in duration-500">
            <MyBookings />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in duration-500">
            <CustomerSettings
              activeSettingsPage={activeSettingsPage}
              setActiveSettingsPage={setActiveSettingsPage}
            />
          </div>
        )}
      </main>

      <CustomerTutorial
        isOpen={showTutorial}
        onClose={finishTutorial}
        currentStep={tutorialStep}
        onNext={() => setTutorialStep((prev) => prev + 1)}
        onBack={() => setTutorialStep((prev) => prev - 1)}
        steps={tutorialSteps}
        coords={coords}
      />

      <VehicleModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        onSave={handleSaveCar}
        formData={carFormData}
        setFormData={setCarFormData}
        isEditing={editingCarIndex !== null}
        orInputRef={orInputRef}
        crInputRef={crInputRef}
        onDocUpload={handleDocUpload}
      />

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleSelectLocation}
        locations={availableLocations}
      />

      {/* 1. RATE & REVIEW FULL SCREEN */}
      <RateAndReview
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)} 
        onSubmit={handleReviewSubmit} 
      />
    </div>
  );
}