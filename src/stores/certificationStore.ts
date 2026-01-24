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

const initialCertifications: Certification[] = [
  {
    id: "1",
    name: "AWS Solutions Architect",
    description: "Validates expertise in designing distributed systems on AWS",
    program: "Cloud Architecture Certificate",
    issued: 45,
    pending: 12,
    validityPeriod: "2 years",
    validityYears: 2,
    status: "active",
    passingScore: 70,
    requirements: ["Complete all modules", "Pass final exam", "Complete capstone project"],
    badgeColor: "#FF9900",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Full Stack Developer",
    description: "Comprehensive certification for full stack web development",
    program: "Full Stack Development Bootcamp",
    issued: 89,
    pending: 23,
    validityPeriod: "Lifetime",
    validityYears: 0,
    status: "active",
    passingScore: 75,
    requirements: ["Complete all courses", "Build 3 projects", "Pass technical interview"],
    badgeColor: "#3B82F6",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    name: "Data Science Professional",
    description: "Professional certification in data science and analytics",
    program: "Data Science Fundamentals",
    issued: 34,
    pending: 8,
    validityPeriod: "3 years",
    validityYears: 3,
    status: "active",
    passingScore: 80,
    requirements: ["Complete coursework", "Submit portfolio", "Pass certification exam"],
    badgeColor: "#10B981",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "DevOps Engineer",
    description: "Certification for DevOps practices and tools",
    program: "DevOps Engineering Path",
    issued: 56,
    pending: 15,
    validityPeriod: "2 years",
    validityYears: 2,
    status: "draft",
    passingScore: 70,
    requirements: ["Complete all modules", "Pass practical assessment"],
    badgeColor: "#8B5CF6",
    createdAt: "2024-01-03",
  },
  {
    id: "5",
    name: "Cybersecurity Analyst",
    description: "Entry-level cybersecurity certification",
    program: "Cybersecurity Essentials",
    issued: 0,
    pending: 0,
    validityPeriod: "1 year",
    validityYears: 1,
    status: "draft",
    passingScore: 85,
    requirements: ["Complete training", "Pass security assessment", "Complete lab exercises"],
    badgeColor: "#EF4444",
    createdAt: "2023-12-15",
  },
];

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
