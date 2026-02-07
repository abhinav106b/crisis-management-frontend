import React from 'react';
import '../styles/UrgencyBreakdown.css';

/**
 * UrgencyBreakdown Component
 * 
 * Displays transparent breakdown of urgency scoring to dispatchers
 * Shows all factors, weights, scores, and reasoning
 */
function UrgencyBreakdown({ urgencyData }) {
    if (!urgencyData || !urgencyData.urgency_breakdown) {
        return null;
    }

    const { factors, reasoning, recommendation } = urgencyData.urgency_breakdown;
    const score = urgencyData.urgency_score;
    const level = urgencyData.urgency_level;

    // Get urgency color
    const getUrgencyColor = (level) => {
        switch(level) {
            case 'critical': return '#d32f2f';
            case 'high': return '#f57c00';
            case 'medium': return '#fbc02d';
            case 'low': return '#388e3c';
            default: return '#757575';
        }
    };

    const urgencyColor = getUrgencyColor(level);

    // Calculate total weighted score for verification
    const totalWeighted = Object.values(factors).reduce((sum, factor) => sum + factor.weightedScore, 0);

    return (
        <div className="urgency-breakdown-container">
            <div className="urgency-header">
                <h2>🎯 Urgency Analysis - Transparent Scoring</h2>
                <p className="urgency-subtitle">
                    Understanding why this request scored <strong>{score}/10</strong> ({level.toUpperCase()})
                </p>
            </div>

            {/* Overall Score Display */}
            <div className="urgency-overall" style={{ borderLeftColor: urgencyColor }}>
                <div className="urgency-score-circle" style={{ borderColor: urgencyColor }}>
                    <div className="score-value" style={{ color: urgencyColor }}>
                        {score}
                    </div>
                    <div className="score-max">/10</div>
                </div>
                <div className="urgency-summary">
                    <h3 style={{ color: urgencyColor }}>{level.toUpperCase()} PRIORITY</h3>
                    <p>{urgencyData.urgency_reasoning}</p>
                </div>
            </div>

            {/* Recommendation Box */}
            {recommendation && (
                <div className="recommendation-box">
                    <h3>📋 Recommended Action</h3>
                    <div className="recommendation-content">
                        <div className="recommendation-item">
                            <strong>Action:</strong>
                            <span className="action-required" style={{ color: urgencyColor }}>
                                {recommendation.action}
                            </span>
                        </div>
                        <div className="recommendation-item">
                            <strong>Timeline:</strong>
                            <span>{recommendation.timeline}</span>
                        </div>
                        <div className="recommendation-item">
                            <strong>Priority Level:</strong>
                            <span>{recommendation.priority}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Scoring Factors Breakdown */}
            <div className="factors-section">
                <h3>🔍 Detailed Factor Analysis</h3>
                <p className="factors-description">
                    Our algorithm evaluates 6 weighted factors to calculate urgency. 
                    Below is the complete breakdown showing how each factor contributed to the final score.
                </p>

                <div className="factors-grid">
                    {Object.entries(factors).map(([factorKey, factor]) => {
                        const percentage = (factor.weight * 100).toFixed(0);
                        const contribution = factor.weightedScore;
                        const impact = factor.score >= 8 ? 'critical' : factor.score >= 6 ? 'high' : factor.score >= 4 ? 'medium' : 'low';
                        
                        return (
                            <div key={factorKey} className={`factor-card ${impact}`}>
                                <div className="factor-header">
                                    <h4>{formatFactorName(factorKey)}</h4>
                                    <span className="factor-weight">Weight: {percentage}%</span>
                                </div>

                                <div className="factor-score-bar">
                                    <div className="score-bar-container">
                                        <div 
                                            className="score-bar-fill"
                                            style={{ 
                                                width: `${factor.score * 10}%`,
                                                backgroundColor: getScoreColor(factor.score)
                                            }}
                                        >
                                            {factor.score.toFixed(1)}/10
                                        </div>
                                    </div>
                                </div>

                                <div className="factor-contribution">
                                    <strong>Contribution to total:</strong> +{contribution.toFixed(2)} points
                                </div>

                                <div className="factor-reasoning">
                                    {factor.reasoning}
                                </div>

                                {factor.indicators && factor.indicators.length > 0 && (
                                    <div className="factor-indicators">
                                        <strong>Detected indicators:</strong>
                                        <ul>
                                            {factor.indicators.map((indicator, idx) => (
                                                <li key={idx}>{indicator}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reasoning Narrative */}
            {reasoning && reasoning.length > 0 && (
                <div className="reasoning-narrative">
                    <h3>💡 Why This Score? - Step-by-Step Reasoning</h3>
                    <div className="reasoning-timeline">
                        {reasoning.map((item, index) => (
                            <div key={index} className={`reasoning-step ${item.impact.toLowerCase()}`}>
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <div className="step-header">
                                        <strong>{item.factor}</strong>
                                        <span className={`impact-badge impact-${item.impact.toLowerCase()}`}>
                                            {item.impact} IMPACT
                                        </span>
                                    </div>
                                    <div className="step-explanation">
                                        {item.explanation}
                                    </div>
                                    {item.indicators && item.indicators.length > 0 && (
                                        <div className="step-indicators">
                                            <strong>Evidence:</strong> {item.indicators.join(', ')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Calculation Verification */}
            <div className="calculation-verification">
                <h3>🧮 Score Calculation Verification</h3>
                <div className="verification-content">
                    <p>
                        <strong>Formula:</strong> (Factor 1 × Weight 1) + (Factor 2 × Weight 2) + ... + (Factor 6 × Weight 6) = Total Score
                    </p>
                    <table className="calculation-table">
                        <thead>
                            <tr>
                                <th>Factor</th>
                                <th>Score</th>
                                <th>Weight</th>
                                <th>Contribution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(factors).map(([factorKey, factor]) => (
                                <tr key={factorKey}>
                                    <td>{formatFactorName(factorKey)}</td>
                                    <td>{factor.score.toFixed(2)}/10</td>
                                    <td>{(factor.weight * 100).toFixed(0)}%</td>
                                    <td>+{factor.weightedScore.toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td colSpan="3"><strong>Total Weighted Score:</strong></td>
                                <td><strong>{totalWeighted.toFixed(2)}</strong></td>
                            </tr>
                            <tr className="final-row">
                                <td colSpan="3"><strong>Final Score (rounded):</strong></td>
                                <td><strong style={{ color: urgencyColor }}>{score}/10</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transparency Notice */}
            <div className="transparency-notice">
                <p>
                    <strong>🔒 Transparency Guarantee:</strong> This urgency score is calculated using our 
                    open, documented algorithm with clearly defined weights and factors. No hidden scoring. 
                    No black boxes. Every decision is explainable and auditable.
                </p>
            </div>
        </div>
    );
}

// Helper functions
function formatFactorName(name) {
    return name.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function getScoreColor(score) {
    if (score >= 8) return '#d32f2f';
    if (score >= 6) return '#f57c00';
    if (score >= 4) return '#fbc02d';
    return '#388e3c';
}

export default UrgencyBreakdown;
