import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crisisService } from '../services/api';
import Navbar from '../components/Navbar';
import UrgencyBreakdown from '../components/UrgencyBreakdown';
import '../styles/CreateCrisis.css';

function CreateCrisis() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        original_message: '',
        message_source: 'Manual'
    });
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const exampleMessages = [
        "Need 50 blankets urgently in Jayanagar area, temperature dropping fast",
        "EMERGENCY! Doctor needed at MG Road metro station - heart attack patient",
        "100 families stranded in Yelahanka without food or water for 2 days",
        "Building collapsed in Indiranagar, need rescue team and ambulances NOW"
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setResult(null);
    };

    const loadExample = (message) => {
        setFormData({
            ...formData,
            original_message: message
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.original_message.trim()) {
            setError('Please enter a crisis message');
            return;
        }

        setProcessing(true);
        setError('');
        setResult(null);

        try {
            const response = await crisisService.createCrisis(formData);
            
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.message || 'Failed to process crisis request');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process crisis request');
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = () => {
        if (result?.crisis_request?.id) {
            navigate(`/crisis/${result.crisis_request.id}`);
        }
    };

    const createAnother = () => {
        setFormData({
            original_message: '',
            message_source: 'Manual'
        });
        setResult(null);
        setError('');
    };

    return (
        <div className="create-crisis">
            <Navbar />
            
            <div className="create-crisis-content">
                <h1>🆕 Create Crisis Request</h1>
                <p className="subtitle">AI will automatically extract entities and match resources</p>

                <form onSubmit={handleSubmit} className="crisis-form">
                    <div className="form-group">
                        <label htmlFor="original_message">Crisis Message *</label>
                        <textarea
                            id="original_message"
                            name="original_message"
                            value={formData.original_message}
                            onChange={handleChange}
                            placeholder="Enter the crisis message here (e.g., 'Need 50 blankets urgently in Jayanagar area')"
                            rows="5"
                            required
                            disabled={processing || result}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message_source">Message Source</label>
                        <select
                            id="message_source"
                            name="message_source"
                            value={formData.message_source}
                            onChange={handleChange}
                            disabled={processing || result}
                        >
                            <option value="Manual">Manual Entry</option>
                            <option value="SMS">SMS</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Phone">Phone Call</option>
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {!result && (
                        <>
                            <div className="button-group">
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? '🤖 Processing with AI...' : '🚀 Process Crisis Request'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => navigate('/')}
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="examples-section">
                                <h3>💡 Example Crisis Messages:</h3>
                                {exampleMessages.map((msg, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="example-button"
                                        onClick={() => loadExample(msg)}
                                        disabled={processing}
                                    >
                                        {msg}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </form>

                {processing && (
                    <div className="processing-indicator">
                        <div className="spinner"></div>
                        <p>AI is analyzing the crisis message...</p>
                        <p className="processing-detail">Extracting entities, calculating urgency, matching resources...</p>
                    </div>
                )}

                {result && (
                    <div className="result-section">
                        <h2>✅ Crisis Request Created Successfully!</h2>
                        
                        {/* Display Detailed Urgency Breakdown */}
                        <UrgencyBreakdown urgencyData={result.extracted_entities} />
                        
                        <div className="result-card">
                            <h3>📊 Extracted Information</h3>
                            <div className="result-grid">
                                <div className="result-item">
                                    <strong>Request ID:</strong>
                                    <span>{result.crisis_request.id}</span>
                                </div>
                                <div className="result-item">
                                    <strong>Need Type:</strong>
                                    <span>{result.extracted_entities.need_type || 'Not detected'}</span>
                                </div>
                                <div className="result-item">
                                    <strong>Quantity:</strong>
                                    <span>
                                        {result.extracted_entities.quantity 
                                            ? `${result.extracted_entities.quantity} ${result.extracted_entities.quantity_unit || 'units'}`
                                            : 'Not specified'}
                                    </span>
                                </div>
                                <div className="result-item">
                                    <strong>Location:</strong>
                                    <span>{result.extracted_entities.location_text || 'Not detected'}</span>
                                </div>
                                <div className="result-item">
                                    <strong>Processing Time:</strong>
                                    <span>{result.processing_time_ms}ms</span>
                                </div>
                                <div className="result-item">
                                    <strong>Database Search:</strong>
                                    <span>{result.database_stats?.total_matches_found || 0} resources found</span>
                                </div>
                            </div>
                        </div>

                        {result.matches && result.matches.length > 0 && (
                            <div className="matches-section">
                                <h3>🎯 Live Database Matches ({result.matches.length} found)</h3>
                                <p className="matches-subtitle">
                                    These resources were found in real-time from our NGO registry database
                                </p>
                                {result.matches.slice(0, 3).map((match, index) => (
                                    <div key={index} className="match-card">
                                        <div className="match-header">
                                            <h4>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {match.ngo_name}</h4>
                                            <span className="match-score">{match.match_score}% Match</span>
                                        </div>
                                        <div className="match-details">
                                            <p><strong>Resource:</strong> {match.resource_name}</p>
                                            <p><strong>Available:</strong> {match.quantity_available} {match.unit}</p>
                                            <p><strong>Location:</strong> {match.location} ({match.distance_km?.toFixed(1)} km away)</p>
                                            <p><strong>Contact:</strong> {match.contact_phone}</p>
                                        </div>
                                        <div className="match-reasoning">
                                            <strong>💡 Why this match:</strong>
                                            <p>{match.reasoning}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="button-group">
                            <button 
                                className="btn-primary"
                                onClick={viewDetails}
                            >
                                📋 View Full Details
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={createAnother}
                            >
                                ➕ Create Another Request
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                🏠 Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateCrisis;
