import { App as AntApp } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import Navbar from './components/Navbar/Navbar';
import Authpage from './EntryComponent/Authpage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import FindPartnersPage from './pages/FindPartnersPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import VerificationModal from './components/VerificationModal/VerificationModal';
import { useState } from 'react';

import './App.css';

function ProtectedRoute({ children }) {
  const [verificationOpen, setVerificationOpen] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser')) || {};
      return (user.profileCompletion || 20) < 75 && localStorage.getItem('verificationSkipped') !== 'true';
    } catch { return false; }
  });
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;
  const handleClose = () => { localStorage.setItem('verificationSkipped', 'true'); setVerificationOpen(false); };
  const handleSaved = () => { localStorage.setItem('verificationSkipped', 'true'); setVerificationOpen(false); };
  return <><Navbar /><VerificationModal open={verificationOpen} onClose={handleClose} onSaved={handleSaved} />{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AntApp>
        <Breadcrumbs />
        <Routes>
          <Route path="/login" element={<Authpage initialMode="login" />} />

          <Route path="/register" element={<Authpage initialMode="register" />} />

          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/find-partners" element={<ProtectedRoute><FindPartnersPage /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/home" : "/login"} replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AntApp>
    </BrowserRouter>
  );
}

export default App;