import React from "react";
import { Routes, Route } from "react-router-dom";
import AppBar from './components/AppBar'
import MonitorPage from './pages/MonitorPage'
// import VisaoGeral from './components/VisaoGeral'
// import Acoes from './components/Acoes'
import Calculadora from './pages/calculadora.tsx'
import Aprendizado from './pages/aprendizado'
import Profile from './pages/profile'



function App() {
  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<Calculadora />} />
        <Route path="/monitor" element={<MonitorPage />} />
  <Route path="/aprendizado" element={<Aprendizado />} />
  <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default React.memo(App);