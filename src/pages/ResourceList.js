import React, { useState, useEffect } from 'react';
import { resourceService } from '../services/api';
import Navbar from '../components/Navbar';

function ResourceList() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await resourceService.getAllResources();
            if (response.success) setResources(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
                <h1>Available Resources</h1>
                {loading ? <p>Loading...</p> : (
                    <div style={{display: 'grid', gap: '15px'}}>
                        {resources.map(resource => (
                            <div key={resource.id} style={{background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                                <h3>{resource.resource_name}</h3>
                                <p><strong>NGO:</strong> {resource.ngo_name}</p>
                                <p><strong>Type:</strong> {resource.resource_type}</p>
                                <p><strong>Available:</strong> {resource.quantity_available} {resource.unit}</p>
                                <p><strong>Location:</strong> {resource.location_city}, {resource.location_state}</p>
                                <p><strong>Contact:</strong> {resource.contact_phone}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResourceList;
