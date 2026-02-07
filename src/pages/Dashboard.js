import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crisisService, authService } from '../services/api';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [crises, setCrises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: '',
        urgency_level: '',
        need_type: ''
    });

    useEffect(() => {
        fetchCrises();
    }, [filter]);

    const fetchCrises = async () => {
        setLoading(true);
        try {
            const response = await crisisService.getAllCrises(filter);
            if (response.success) {
                setCrises(response.data);
            }
        } catch (error) {
            console.error('Error fetching crises:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyClass = (level) => {
        switch(level) {
            case 'critical': return 'urgency-critical';
            case 'high': return 'urgency-high';
            case 'medium': return 'urgency-medium';
            case 'low': return 'urgency-low';
            default: return '';
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'completed': return 'status-completed';
            case 'dispatched': return 'status-dispatched';
            case 'matched': return 'status-matched';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="dashboard">
            <Navbar />
            
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Crisis Dashboard</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/create-crisis')}
                    >
                        ➕ New Crisis Request
                    </button>
                </div>

                <div className="filters">
                    <select 
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="matched">Matched</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select 
                        value={filter.urgency_level}
                        onChange={(e) => setFilter({...filter, urgency_level: e.target.value})}
                    >
                        <option value="">All Urgency</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <select 
                        value={filter.need_type}
                        onChange={(e) => setFilter({...filter, need_type: e.target.value})}
                    >
                        <option value="">All Types</option>
                        <option value="medical">Medical</option>
                        <option value="food">Food</option>
                        <option value="water">Water</option>
                        <option value="shelter">Shelter</option>
                        <option value="blankets">Blankets</option>
                        <option value="rescue">Rescue</option>
                    </select>

                    <button className="btn-secondary" onClick={fetchCrises}>
                        🔄 Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading crises...</div>
                ) : crises.length === 0 ? (
                    <div className="empty-state">
                        <p>No crisis requests found</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/create-crisis')}
                        >
                            Create First Crisis Request
                        </button>
                    </div>
                ) : (
                    <div className="crisis-list">
                        {crises.map((crisis) => (
                            <div 
                                key={crisis.id} 
                                className="crisis-card"
                                onClick={() => navigate(`/crisis/${crisis.id}`)}
                            >
                                <div className="crisis-header">
                                    <div className="crisis-meta">
                                        <span className={`urgency-badge ${getUrgencyClass(crisis.urgency_level)}`}>
                                            {crisis.urgency_level?.toUpperCase()} ({crisis.urgency_score}/10)
                                        </span>
                                        <span className={`status-badge ${getStatusClass(crisis.status)}`}>
                                            {crisis.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="crisis-id">ID: {crisis.id}</span>
                                </div>

                                <div className="crisis-message">
                                    "{crisis.original_message}"
                                </div>

                                <div className="crisis-details">
                                    <div className="detail-item">
                                        <strong>Need:</strong> {crisis.need_type || 'N/A'}
                                    </div>
                                    {crisis.quantity && (
                                        <div className="detail-item">
                                            <strong>Quantity:</strong> {crisis.quantity} {crisis.quantity_unit}
                                        </div>
                                    )}
                                    <div className="detail-item">
                                        <strong>Location:</strong> {crisis.location_text || 'Not specified'}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Created:</strong> {formatDate(crisis.created_at)}
                                    </div>
                                </div>

                                <div className="crisis-footer">
                                    <span className="created-by">By: {crisis.created_by_name || 'System'}</span>
                                    <button className="btn-link">View Details →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
