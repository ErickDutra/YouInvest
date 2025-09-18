import React, { useState } from "react";
import "../styles/MonitorPage.css";
import VisaoGeral from "../components/VisaoGeral";
import Acoes from "../components/Acoes";
import Fiis from "../components/Fiis";
import Crypto from "../components/Crypto";

const TABS = [
  { label: "Visão Geral", key: "visao-geral" },
  { label: "Ações", key: "acoes" },
  { label: "FIIs", key: "fiis" },
  { label: "Crypto", key: "crypto" },
];
const MonitorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("visao-geral");

  return (
    <div className="monitor-page">
      <div className="monitor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`monitor-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="monitor-content">
        {activeTab === "visao-geral" && (
          <VisaoGeral/>
        )}
        {activeTab === "acoes" && (
         <Acoes/> 
         )}
        {activeTab === "fiis" && (
          <Fiis/>
        )}
        {activeTab === "crypto" && (
          <Crypto/>
        )}
      </div>
    </div>
  );
};

export default MonitorPage;
