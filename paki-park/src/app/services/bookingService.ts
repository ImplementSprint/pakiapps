import { api } from './api';

export interface Booking {
  _id: string;
  reference: string;
  spot: string;
  date: string;
  timeSlot: string;
  type: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  amount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'refunded';
  userId?: { _id: string; name: string; email: string; phone?: string };
  vehicleId?: { _id: string; brand: string; model: string; plateNumber: string; type: string };
  locationId?: { _id: string; name: string; address: string };
  createdAt: string;
}

export interface TimeSlot {
  slot: string;
  booked: number;
  available: number;
  isFull: boolean;
}

export interface CreateBookingPayload {
  vehicleId: string;
  locationId: string;
  spot: string;
  date: string;
  timeSlot: string;
  amount: number;
  paymentMethod: string;
}

export const bookingService = {
  async getMyBookings(params?: { status?: string; search?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    const res = await api.get<{ bookings: Booking[]; total: number; page: number; totalPages: number }>(
      `/bookings/my?${query.toString()}`
    );
    return res.data!;
  },

  async getAllBookings(params?: { status?: string; search?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    const res = await api.get<{ bookings: Booking[]; total: number; page: number; totalPages: number }>(
      `/bookings?${query.toString()}`
    );
    return res.data!;
  },

  async createBooking(payload: CreateBookingPayload) {
    const res = await api.post<Booking>('/bookings', payload);
    return res.data!;
  },

  async cancelBooking(bookingId: string, reason?: string) {
    const res = await api.patch<Booking>(`/bookings/${bookingId}/cancel`, { reason });
    return res.data!;
  },

  async getAvailableSlots(locationId: string, date: string) {
    const res = await api.get<TimeSlot[]>(`/bookings/slots/${locationId}?date=${date}`);
    return res.data!;
  },
};
