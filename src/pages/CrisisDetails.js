import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { crisisService } from '../services/api';
import Navbar from '../components/Navbar';

function CrisisDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crisis, setCrisis] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCrisisDetails = useCallback(async () => {
        try {
            const response = await crisisService.getCrisisById(id);
            if (response.success) {
                setCrisis(response.data.crisis_request);
                setMatches(response.data.matches || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCrisisDetails();
    }, [fetchCrisisDetails]);

    if (loading) return <div><Navbar /><div style={{padding: '20px'}}>Loading...</div></div>;
    if (!crisis) return <div><Navbar /><div style={{padding: '20px'}}>Crisis not found</div></div>;

    return (
        <div>
            <Navbar />
            <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
                <button onClick={() => navigate('/')} style={{marginBottom: '20px'}}>← Back</button>
                <h1>Crisis Request #{crisis.id}</h1>
                <div style={{background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
                    <p><strong>Message:</strong> "{crisis.original_message}"</p>
                    <p><strong>Status:</strong> {crisis.status}</p>
                    <p><strong>Urgency:</strong> {crisis.urgency_level} ({crisis.urgency_score}/10)</p>
                    <p><strong>Need:</strong> {crisis.need_type || 'N/A'}</p>
                    <p><strong>Location:</strong> {crisis.location_text || 'N/A'}</p>
                </div>
                <h2>Matched Resources ({matches.length})</h2>
                {matches.map((match, i) => (
                    <div key={i} style={{background: '#fff', border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px'}}>
                        <h3>{match.ngo_name}</h3>
                        <p><strong>Resource:</strong> {match.resource_name}</p>
                        <p><strong>Score:</strong> {match.match_score}%</p>
                        <p><strong>Distance:</strong> {match.distance_km?.toFixed(1)} km</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CrisisDetails;
