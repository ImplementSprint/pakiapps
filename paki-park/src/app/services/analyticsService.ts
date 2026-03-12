import { api } from './api';

export interface DashboardStats {
  totalBookings: number;
  activeUsers: number;
  parkingSpots: number;
  totalLocations: number;
  revenue: number;
}

export const analyticsService = {
  async getDashboardStats() {
    const res = await api.get<DashboardStats>('/analytics/dashboard');
    return res.data!;
  },

  async getRevenueData() {
    const res = await api.get('/analytics/revenue');
    return res.data!;
  },

  async getOccupancyData() {
    const res = await api.get('/analytics/occupancy');
    return res.data!;
  },

  async getVehicleTypeDistribution() {
    const res = await api.get('/analytics/vehicle-types');
    return res.data!;
  },
};
