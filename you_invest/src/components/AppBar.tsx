import React, { useState } from "react";
import { Link } from "react-router-dom";
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
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/monitor" onClick={() => setMenuOpen(false)}>Monitor</Link>
                <Link to="/indicadores" onClick={() => setMenuOpen(false)}>indicadores</Link>
            </nav>
            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </header>
    );
};

export default AppBar;