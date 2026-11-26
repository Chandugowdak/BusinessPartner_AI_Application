import { Alert, App as AntApp, Button, Result, Spin } from 'antd';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import Navbar from './components/Navbar/Navbar';
import Authpage from './EntryComponent/Authpage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import FindPartnersPage from './pages/FindPartnersPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MyRequestsPage from './pages/MyRequestsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import VerificationModal from './components/VerificationModal/VerificationModal';
import { useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import InformationPage from './pages/InformationPage';
import HelpPage from './pages/HelpPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReportPage from './pages/ReportPage';
import ContactPage from './pages/ContactPage';
import MatchingGuidePage from './pages/MatchingGuidePage';
import EmailConfigurationPage from './pages/EmailConfigurationPage';
import EmailHistoryPage from './pages/EmailHistoryPage';
import EmailSchedulerPage from './pages/EmailSchedulerPage';
import RolesPermissionsPage from './pages/RolesPermissionsPage';
import { getCurrentUser } from './DataProvider/AuthDataProvider';
import { getDefaultFeaturePath, getFirstAvailableFeature, hasFeaturePermission } from './permissions';

import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

function ProtectedRoute({ children, feature, adminOnly = false, currentUser, userLoading, userLoadError }) {
  const [verificationOpen, setVerificationOpen] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser')) || {};
      return (user.profileCompletion || 20) < 75 && localStorage.getItem('verificationSkipped') !== 'true';
    } catch { return false; }
  });
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;
  if (userLoading) return <div className="permission-loading"><Spin size="large" /></div>;
  if (userLoadError) return <Alert className="permission-load-error" type="error" showIcon message="Account access could not be verified" description={userLoadError} />;
  if (adminOnly && currentUser?.accountRole !== 'admin') {
    return <Result status="403" title="Administrator access required" subTitle="This area is available to administrators only." />;
  }
  if (feature && !hasFeaturePermission(currentUser, feature)) {
    const firstAvailableFeature = getFirstAvailableFeature(currentUser);
    const availableFeaturePath = getDefaultFeaturePath(currentUser);
    return <Result
      status="403"
      title="Feature access is restricted"
      subTitle="Your administrator has not enabled this feature for your account."
      extra={firstAvailableFeature ? <Button type="primary" href={availableFeaturePath}>Go to an available feature</Button> : null}
    />;
  }
  const handleClose = () => { localStorage.setItem('verificationSkipped', 'true'); setVerificationOpen(false); };
  const handleSaved = () => { localStorage.setItem('verificationSkipped', 'true'); setVerificationOpen(false); };
  return <><VerificationModal open={verificationOpen} onClose={handleClose} onSaved={handleSaved} />{children}</>;
}

function ApplicationRoutes() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem('token')) && !["/login", "/register"].includes(location.pathname);
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch { return null; }
  });
  const [userLoading, setUserLoading] = useState(Boolean(localStorage.getItem('token')));
  const [userLoadError, setUserLoadError] = useState('');
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(null);
      setUserLoading(false);
      setUserLoadError('');
      return;
    }

    let active = true;
    setUserLoading(true);
    setUserLoadError('');
    getCurrentUser()
      .then((user) => {
        if (!active) return;
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
      })
      .catch((error) => {
        if (!active) return;
        setCurrentUser(null);
        setUserLoadError(error?.response?.data?.message || 'Please check your connection and try again.');
      })
      .finally(() => {
        if (active) setUserLoading(false);
      });

    return () => { active = false; };
  }, [isAuthenticated]);
  const shellClassName = `application-shell${isAuthenticated ? ' has-sidebar' : ''}${sidebarCollapsed ? ' sidebar-collapsed' : ''}`;

  return (
    <div className={shellClassName}>
      <ScrollToTop />
      <Navbar
        isAuthenticated={isAuthenticated}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
        currentUser={currentUser}
      />
      <div className="application-content">
        <Breadcrumbs />
        <Routes>
          <Route path="/login" element={<Authpage initialMode="login" />} />

          <Route path="/register" element={<Authpage initialMode="register" />} />
          <Route path="/about" element={<InformationPage type="about" />} />
          <Route path="/blog" element={<InformationPage type="blog" />} />
          <Route path="/how-matching-works" element={<MatchingGuidePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/home" element={<ProtectedRoute feature="home" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><HomePage /></ProtectedRoute>} />
          <Route path="/find-partners" element={<ProtectedRoute feature="findPartners" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><FindPartnersPage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute feature="jobs" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><JobsPage /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute feature="connections" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><ConnectionsPage /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute feature="requests" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><MyRequestsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><ProfilePage /></ProtectedRoute>} />
          <Route path="/email/configuration" element={<ProtectedRoute feature="emailConfiguration" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><EmailConfigurationPage /></ProtectedRoute>} />
          <Route path="/email/scheduler" element={<ProtectedRoute feature="emailScheduler" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><EmailSchedulerPage /></ProtectedRoute>} />
          <Route path="/email/history" element={<ProtectedRoute feature="emailHistory" currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><EmailHistoryPage /></ProtectedRoute>} />
          <Route path="/admin/roles-permissions" element={<ProtectedRoute adminOnly currentUser={currentUser} userLoading={userLoading} userLoadError={userLoadError}><RolesPermissionsPage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to={localStorage.getItem('token') ? getDefaultFeaturePath(currentUser) : "/login"} replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AntApp>
        <ApplicationRoutes />
      </AntApp>
    </BrowserRouter>
  );
}

export default App;