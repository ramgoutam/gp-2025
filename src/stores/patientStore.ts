import { create } from 'zustand';

interface PatientStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));