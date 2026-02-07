import React, { useState, useEffect } from 'react';
import { ngoService } from '../services/api';
import Navbar from '../components/Navbar';

function NGOList() {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNGOs();
    }, []);

    const fetchNGOs = async () => {
        try {
            const response = await ngoService.getAllNGOs();
            if (response.success) setNgos(response.data);
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
                <h1>NGO Directory</h1>
                {loading ? <p>Loading...</p> : (
                    <div style={{display: 'grid', gap: '15px'}}>
                        {ngos.map(ngo => (
                            <div key={ngo.id} style={{background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px'}}>
                                <h3>{ngo.ngo_name}</h3>
                                <p><strong>Darpan ID:</strong> {ngo.darpan_id}</p>
                                <p><strong>Location:</strong> {ngo.city}, {ngo.state}</p>
                                <p><strong>Sectors:</strong> {ngo.sectors?.join(', ')}</p>
                                <p><strong>Contact:</strong> {ngo.phone}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NGOList;
