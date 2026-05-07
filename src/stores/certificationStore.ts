import { create } from 'zustand';

export interface Certification {
  id: string;
  name: string;
  description: string;
  program: string;
  passingScore: number;
  validityPeriod: string;
  validityYears: number;
  status: 'active' | 'draft';
  issued: number;
  pending: number;
  requirements: string[];
  badgeColor: string;
  createdAt: string;
}

interface CertificationStore {
  certifications: Certification[];
  addCertification: (certification: Omit<Certification, 'id' | 'issued' | 'pending' | 'createdAt'>) => Certification;
  getCertification: (id: string) => Certification | undefined;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
}

const initialCertifications: Certification[] = [];

export const useCertificationStore = create<CertificationStore>((set, get) => ({
  certifications: initialCertifications,

  addCertification: (certification) => {
    const newCertification: Certification = {
      ...certification,
      id: Date.now().toString(),
      issued: 0,
      pending: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      certifications: [...state.certifications, newCertification],
    }));
    return newCertification;
  },

  getCertification: (id) => {
    return get().certifications.find((cert) => cert.id === id);
  },

  updateCertification: (id, updates) => {
    set((state) => ({
      certifications: state.certifications.map((cert) =>
        cert.id === id ? { ...cert, ...updates } : cert
      ),
    }));
  },

  deleteCertification: (id) => {
    set((state) => ({
      certifications: state.certifications.filter((cert) => cert.id !== id),
    }));
  },
}));
