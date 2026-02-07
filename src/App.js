import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateCrisis from './pages/CreateCrisis';
import CrisisDetails from './pages/CrisisDetails';
import NGOList from './pages/NGOList';
import ResourceList from './pages/ResourceList';

// Styles
import './styles/App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/create-crisis" 
                        element={
                            <ProtectedRoute>
                                <CreateCrisis />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/crisis/:id" 
                        element={
                            <ProtectedRoute>
                                <CrisisDetails />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/ngos" 
                        element={
                            <ProtectedRoute>
                                <NGOList />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/resources" 
                        element={
                            <ProtectedRoute>
                                <ResourceList />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
