import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Authpage from './EntryComponent/Authpage.jsx';
import HomePage from './pages/HomePage.jsx';

import './App.css';

function ProtectedHome() {
  return localStorage.getItem('token') ? <HomePage /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authpage initialMode="login" />} />

        <Route path="/register" element={<Authpage initialMode="register" />} />

        <Route path="/home" element={<ProtectedHome />} />

        <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/home" : "/login"} replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;