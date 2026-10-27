import React, { createContext, useContext, useState, useEffect } from 'react';

interface MedicalReport {
  id: string;
  name: string;
  date: string;
  type: string;
  summary?: string;
}

interface Prescription {
  id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  doctor: string;
  notes?: string;
}

interface PillReminder {
  id: string;
  medicine: string;
  dosage: string;
  time: string;
  taken: boolean;
  date: string;
}

interface CycleEntry {
  date: string;
  flow: 'light' | 'medium' | 'heavy' | 'none';
  symptoms: string[];
  mood: string;
  notes: string;
}

interface UserProfile {
  name: string;
  email: string;
  age: number;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: string;
}

interface AppContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  reports: MedicalReport[];
  addReport: (report: MedicalReport) => void;
  prescriptions: Prescription[];
  addPrescription: (rx: Prescription) => void;
  pillReminders: PillReminder[];
  addPillReminder: (pill: PillReminder) => void;
  togglePillTaken: (id: string) => void;
  cycleEntries: CycleEntry[];
  addCycleEntry: (entry: CycleEntry) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useApp = () => useContext(AppContext);

const defaultUser: UserProfile = {
  name: 'Priya Sharma',
  email: 'priya@shecare.app',
  age: 26,
  bloodGroup: 'B+',
  allergies: ['Penicillin', 'Pollen'],
  conditions: ['Mild Anemia'],
  emergencyContact: '+91 98765 43210',
};

const defaultReports: MedicalReport[] = [
  { id: '1', name: 'Complete Blood Count', date: '2025-01-15', type: 'Blood Test', summary: 'Hemoglobin slightly low at 11.2 g/dL. All other values within normal range.' },
  { id: '2', name: 'Thyroid Panel', date: '2025-01-10', type: 'Hormone Test', summary: 'TSH, T3, T4 all within normal limits. No thyroid dysfunction detected.' },
  { id: '3', name: 'Vitamin D Test', date: '2024-12-20', type: 'Vitamin Test', summary: 'Vitamin D at 18 ng/mL — below optimal. Supplementation recommended.' },
];

const defaultPrescriptions: Prescription[] = [
  { id: '1', medicine: 'Iron Supplement', dosage: '65mg', frequency: 'Once daily', startDate: '2025-01-15', doctor: 'Dr. Meera Kapoor', notes: 'Take with orange juice for better absorption' },
  { id: '2', medicine: 'Vitamin D3', dosage: '60000 IU', frequency: 'Once weekly', startDate: '2024-12-20', doctor: 'Dr. Meera Kapoor', notes: 'Take after meals' },
];

const defaultPills: PillReminder[] = [
  { id: '1', medicine: 'Iron Supplement', dosage: '65mg', time: '08:00', taken: false, date: new Date().toISOString().split('T')[0] },
  { id: '2', medicine: 'Vitamin D3', dosage: '60000 IU', time: '13:00', taken: false, date: new Date().toISOString().split('T')[0] },
  { id: '3', medicine: 'Calcium', dosage: '500mg', time: '21:00', taken: false, date: new Date().toISOString().split('T')[0] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('shecare-user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem('shecare-reports');
    return saved ? JSON.parse(saved) : defaultReports;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('shecare-prescriptions');
    return saved ? JSON.parse(saved) : defaultPrescriptions;
  });

  const [pillReminders, setPillReminders] = useState<PillReminder[]>(() => {
    const saved = localStorage.getItem('shecare-pills');
    return saved ? JSON.parse(saved) : defaultPills;
  });

  const [cycleEntries, setCycleEntries] = useState<CycleEntry[]>(() => {
    const saved = localStorage.getItem('shecare-cycle');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('shecare-notifications') !== 'false';
  });

  useEffect(() => { localStorage.setItem('shecare-user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('shecare-reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('shecare-prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('shecare-pills', JSON.stringify(pillReminders)); }, [pillReminders]);
  useEffect(() => { localStorage.setItem('shecare-cycle', JSON.stringify(cycleEntries)); }, [cycleEntries]);
  useEffect(() => { localStorage.setItem('shecare-notifications', String(notifications)); }, [notifications]);

  const addReport = (report: MedicalReport) => setReports(prev => [report, ...prev]);
  const addPrescription = (rx: Prescription) => setPrescriptions(prev => [rx, ...prev]);
  const addPillReminder = (pill: PillReminder) => setPillReminders(prev => [...prev, pill]);
  const togglePillTaken = (id: string) => setPillReminders(prev => prev.map(p => p.id === id ? { ...p, taken: !p.taken } : p));
  const addCycleEntry = (entry: CycleEntry) => setCycleEntries(prev => [...prev, entry]);

  return (
    <AppContext.Provider value={{
      user, setUser, reports, addReport, prescriptions, addPrescription,
      pillReminders, addPillReminder, togglePillTaken, cycleEntries, addCycleEntry,
      notifications, setNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
};
