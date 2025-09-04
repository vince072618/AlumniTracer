export type UserRole = 'alumni';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  graduationYear: number;
  course: string;
  currentJob?: string;
  company?: string;
  location?: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  graduationYear: number;
  course: string;
  phoneNumber?: string;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  graduationYear: number;
  course: string;
  currentJob?: string;
  company?: string;
  location?: string;
  phoneNumber?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Database types for Supabase
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  graduation_year: number;
  course: string;
  current_job?: string;
  company?: string;
  location?: string;
  phone_number?: string;
  created_at: string;
  updated_at?: string;
}