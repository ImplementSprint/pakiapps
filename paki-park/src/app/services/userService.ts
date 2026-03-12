import { api } from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  profilePicture?: string | null;
  address?: { street?: string; city?: string; province?: string };
  dateOfBirth?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: { street?: string; city?: string; province?: string };
  profilePicture?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  async getProfile() {
    const res = await api.get<UserProfile>('/users/profile');
    return res.data!;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const res = await api.put<UserProfile>('/users/profile', payload);
    return res.data!;
  },

  async changePassword(payload: ChangePasswordPayload) {
    const res = await api.put('/users/password', payload);
    return res;
  },
};
