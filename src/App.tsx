import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import ReportAnalyzer from './pages/ReportAnalyzer';
import MedicalVault from './pages/MedicalVault';
import Prescriptions from './pages/Prescriptions';
import PillOClock from './pages/PillOClock';
import MyCycle from './pages/MyCycle';
import TalkToDoctor from './pages/TalkToDoctor';
import EmergencySOS from './pages/EmergencySOS';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/reports" element={<ReportAnalyzer />} />
              <Route path="/vault" element={<MedicalVault />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/pill-oclock" element={<PillOClock />} />
              <Route path="/cycle" element={<MyCycle />} />
              <Route path="/doctor" element={<TalkToDoctor />} />
              <Route path="/emergency" element={<EmergencySOS />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
