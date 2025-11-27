import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import AppBar from './components/AppBar'
import MonitorPage from './pages/MonitorPage'
// import VisaoGeral from './components/VisaoGeral'
// import Acoes from './components/Acoes'
import Calculadora from './pages/calculadora.tsx'
import Aprendizado from './pages/aprendizado'
import Profile from './pages/profile'
import Carteira from './pages/carteira'
import Login from './pages/login'
import Registro from './pages/registro'

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<Calculadora />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        {isAuthenticated && (
          <>
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/aprendizado" element={<Aprendizado />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/carteira" element={<Carteira />} />
          </>
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default React.memo(App);