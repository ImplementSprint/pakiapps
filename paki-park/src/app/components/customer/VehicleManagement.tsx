import { Car, Truck, Bike, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";

interface Vehicle {
  brand: string;
  model: string;
  color: string;
  plateNumber: string;
  type: string;
  orDoc?: string | null;
  crDoc?: string | null;
}

interface VehicleManagementProps {
  cars: Vehicle[];
  selectedCarIndex: number;
  setSelectedCarIndex: (index: number) => void;
  onAddVehicle: () => void;
  onEditVehicle: (index: number) => void;
  onDeleteVehicle: (index: number) => void;
  highlightClass?: string;
}

const VehicleIcon = ({ type, size }: { type: string; size: number }) => {
  switch (type.toLowerCase()) {
    case "motorcycle":
    case "motor":
      return <Bike size={size} />;
    case "truck":
      return <Truck size={size} />;
    default:
      return <Car size={size} />;
  }
};

export function VehicleManagement({
  cars,
  selectedCarIndex,
  setSelectedCarIndex,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  highlightClass = "",
}: VehicleManagementProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1e3d5a] rounded-lg text-white">
            <VehicleIcon type={cars[selectedCarIndex].type} size={18} />
          </div>
          <h2 className="text-lg font-bold text-[#1e3d5a]">My Vehicles</h2>
        </div>
        <button
          id="btn-add-vehicle"
          onClick={onAddVehicle}
          className={`text-xs font-bold text-[#ee6b20] flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors ${highlightClass}`}
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 group relative overflow-hidden bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700 text-[#1e3d5a]">
            <VehicleIcon type={cars[selectedCarIndex].type} size={140} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 bg-orange-100 text-[#ee6b20] text-[9px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={10} /> Active Selection
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditVehicle(selectedCarIndex)}
                    className="p-1.5 bg-gray-50 text-gray-400 hover:text-[#1e3d5a] rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(selectedCarIndex)}
                    className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black font-bold text-[#1e3d5a] mt-2 uppercase">
                {cars[selectedCarIndex].brand}{" "}
                <span className="text-[#ee6b20]">
                  {cars[selectedCarIndex].model}
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Plate
                </p>
                <p className="text-sm font-black text-[#1e3d5a] font-mono tracking-wider">
                  {cars[selectedCarIndex].plateNumber}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Color
                </p>
                <p className="text-sm font-black text-[#1e3d5a] capitalize">
                  {cars[selectedCarIndex].color}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase">
                  Type
                </p>
                <p className="text-sm font-black text-[#1e3d5a] capitalize">
                  {cars[selectedCarIndex].type}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-5 flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-2 
          [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-gray-200 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 
          transition-colors"
        >
          {cars.map((car: Vehicle, index: number) => (
            <div
              key={index}
              onClick={() => setSelectedCarIndex(index)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${selectedCarIndex === index ? "border-[#1e3d5a] bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"}`}
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center transition-colors ${selectedCarIndex === index ? "bg-[#1e3d5a] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}
              >
                <VehicleIcon type={car.type} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#1e3d5a] text-xs truncate uppercase">
                  {car.brand} {car.model}
                </h4>
                <p className="text-[9px] font-mono font-bold text-gray-400">
                  {car.plateNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
