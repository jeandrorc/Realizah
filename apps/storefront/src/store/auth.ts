import { create } from 'zustand';

interface Customer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
}

interface AuthState {
  customer: Customer | null;
  isLoading: boolean;
  setCustomer: (customer: Customer | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  customer: null,
  isLoading: true,
  setCustomer: (customer) => set({ customer }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
