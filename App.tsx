import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { ScanBill } from './pages/ScanBill';
import { EditBill } from './pages/EditBill';
import { AssignDiners } from './pages/AssignDiners';
import { Confirmation } from './pages/Confirmation';
import { BillDetail } from './pages/BillDetail';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { HistoryDetail } from './pages/HistoryDetail';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanBill />} />
          <Route path="/edit" element={<EditBill />} />
          <Route path="/assign" element={<AssignDiners />} />
          <Route path="/confirm" element={<Confirmation />} />
          <Route path="/bill/:dinerId" element={<BillDetail />} />
          <Route path="/history/:historyId" element={<HistoryDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;