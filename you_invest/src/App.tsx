import React from "react";
import { Routes, Route } from "react-router-dom";
import AppBar from './components/AppBar'
import MonitorPage from './pages/MonitorPage'
import VisaoGeral from './components/VisaoGeral'
import Acoes from './components/Acoes'



function App() {
  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<VisaoGeral />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/indicadores" element={<Acoes />} />
      </Routes>
    </>
  );
}

export default React.memo(App);