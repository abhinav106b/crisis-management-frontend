import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <h2>🚨 Crisis Matcher</h2>
            </div>

            <div className="navbar-menu">
                <button 
                    className={`nav-item ${isActive('/')}`}
                    onClick={() => navigate('/')}
                >
                    📊 Dashboard
                </button>
                <button 
                    className={`nav-item ${isActive('/create-crisis')}`}
                    onClick={() => navigate('/create-crisis')}
                >
                    ➕ New Crisis
                </button>
                <button 
                    className={`nav-item ${isActive('/ngos')}`}
                    onClick={() => navigate('/ngos')}
                >
                    🏢 NGOs
                </button>
                <button 
                    className={`nav-item ${isActive('/resources')}`}
                    onClick={() => navigate('/resources')}
                >
                    📦 Resources
                </button>
            </div>

            <div className="navbar-user">
                <span className="user-name">👤 {user?.full_name || 'User'}</span>
                <span className="user-role">{user?.role}</span>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
