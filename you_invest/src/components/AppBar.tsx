import React, { useState } from "react";
import "../styles/AppBar.css";
import logo from '../assets/images/logo_2.png';

const AppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="app-bar">
            <button
                className="burger-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
                aria-expanded={menuOpen}
            >
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
                <span className="burger-bar"></span>
            </button>
            <img src={logo} className="app-bar-logo" alt="Logo" />
            <nav className={`app-bar-nav ${menuOpen ? 'open' : ''}`}>
                <a href="/home">Home</a>
                <a href="/investimentos">Investimentos</a>
                <a href="/perfil">Perfil</a>
            </nav>
            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </header>
    );
};

export default AppBar;