import { App as AntApp } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import Navbar from './components/Navbar/Navbar';
import Authpage from './EntryComponent/Authpage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import FindPartnersPage from './pages/FindPartnersPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MyRequestsPage from './pages/MyRequestsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import VerificationModal from './components/VerificationModal/VerificationModal';
import { useState } from 'react';
import Footer from './components/Footer/Footer';
import InformationPage from './pages/InformationPage';
import HelpPage from './pages/HelpPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReportPage from './pages/ReportPage';
import ContactPage from './pages/ContactPage';

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
  return <><VerificationModal open={verificationOpen} onClose={handleClose} onSaved={handleSaved} />{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AntApp>
        <Breadcrumbs />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Authpage initialMode="login" />} />

          <Route path="/register" element={<Authpage initialMode="register" />} />
          <Route path="/about" element={<InformationPage type="about" />} />
          <Route path="/blog" element={<InformationPage type="blog" />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/find-partners" element={<ProtectedRoute><FindPartnersPage /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/home" : "/login"} replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Footer />
      </AntApp>
    </BrowserRouter>
  );
}

export default App;