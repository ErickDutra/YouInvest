import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/AppBar.css";
import logo from '../assets/images/logo_2.png';

const AppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

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
                {isAuthenticated ? (
                    <>
                        <Link to="/monitor" onClick={() => setMenuOpen(false)}>Monitor</Link>
                        <Link to="/aprendizado" onClick={() => setMenuOpen(false)}>Aprendizado</Link>
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                        <Link to="/carteira" onClick={() => setMenuOpen(false)}>Carteira</Link>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/registro" onClick={() => setMenuOpen(false)}>Registro</Link>
                    </>
                )}
            </nav>
            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
        </header>
    );
};

export default AppBar;