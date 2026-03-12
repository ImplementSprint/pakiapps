import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';

interface LocationState {
  type: 'Fixed' | 'Flexible';
}

export function BookPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const type = state?.type || 'Fixed'; // Default to 'Fixed' if no state is provided

  // Redirect to customer home if accessed directly without state
  useEffect(() => {
    if (!state) {
      navigate('/customer/home', { replace: true });
    }
  }, [state, navigate]);

  // Show nothing while redirecting
  if (!state) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1e3d5a] mb-4">
        {type} Parking Booking
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="text-gray-600">
          You have selected <strong>{type} Schedule</strong> for your parking booking.
        </p>

        {/* You can add further booking form components or information based on the type */}
        {type === 'Fixed' ? (
          <div>
            <h3 className="text-xl font-semibold text-[#1e3d5a] mt-6">Fixed Booking Details</h3>
            <p>Reserve a parking spot with a fixed date and time.</p>
            {/* Add your Fixed booking form or other related content here */}
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold text-[#1e3d5a] mt-6">Flexible Booking Details</h3>
            <p>Reserve a parking spot with flexible timing.</p>
            {/* Add your Flexible booking form or other related content here */}
          </div>
        )}
      </div>
    </div>
  );
}