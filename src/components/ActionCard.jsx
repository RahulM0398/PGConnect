import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Phone, AlertTriangle, Building, ShieldCheck, CheckCircle2, Siren, ArrowRight, HelpCircle } from 'lucide-react';

const ActionCard = ({ data }) => {
    if (!data) return null;

    const getIcon = (category) => {
        switch (category) {
            case 'Emergencies':
            case 'Emergency':
                return <div className="action-card-icon icon-emergency"><Siren size={24} /></div>;
            case 'Health': return <div className="action-card-icon icon-health"><Building size={24} /></div>;
            case 'IT/Cybersecurity Related':
            case 'Cybersecurity':
                return <div className="action-card-icon icon-it"><ShieldCheck size={24} /></div>;
            case 'Civic': return <div className="action-card-icon icon-general"><Building size={24} /></div>;
            case 'General Queries':
            default: return <div className="action-card-icon icon-general"><HelpCircle size={24} /></div>;
        }
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'Critical': return 'severity-critical';
            case 'High': return 'severity-high';
            case 'Medium': return 'severity-medium';
            default: return 'severity-low';
        }
    };

    const getBorderColor = (severity) => {
        switch (severity) {
            case 'Critical': return '#ef4444';
            case 'High': return '#f97316';
            default: return '#e2e8f0';
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="action-card"
            style={{ borderLeftColor: getBorderColor(data.severity) }}
        >
            {/* Header */}
            <div className="action-card-header">
                {getIcon(data.category)}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 className="action-card-title">{data.title}</h3>
                        {data.severity && (
                            <div className={`severity-badge ${getSeverityClass(data.severity)}`}>
                                {data.severity}
                            </div>
                        )}
                    </div>
                    <span className="action-card-subtitle">{data.description}</span>
                </div>
            </div>

            {/* Body */}
            <div className="action-card-body">

                {/* Steps */}
                {data.steps && data.steps.length > 0 && (
                    <div>
                        <h4 className="card-section-title">Step-by-Step Action Plan</h4>
                        <ul className="steps-list">
                            {data.steps.map((step, idx) => (
                                <li key={idx} className="step-item">
                                    <div className="step-checkbox"><CheckCircle2 size={14} /></div>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contacts */}
                {data.contacts && data.contacts.length > 0 && (
                    <div>
                        <h4 className="card-section-title">Points of Contact</h4>
                        <div className="contacts-grid">
                            {data.contacts.map((contact, idx) => (
                                <div key={idx} className="contact-item">
                                    <div className="contact-info">
                                        {contact.url ? (
                                            <a href={contact.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                                                {contact.name} <ExternalLink size={14} />
                                            </a>
                                        ) : (
                                            <span className="contact-name" style={{ fontWeight: 600 }}>{contact.name}</span>
                                        )}
                                        {contact.description && (
                                            <span className="contact-desc">{contact.description}</span>
                                        )}
                                        {contact.when_to_use && (
                                            <div className="contact-when-to-use">{contact.when_to_use}</div>
                                        )}
                                    </div>
                                    <div className="contact-actions">
                                        {contact.phone && (
                                            <a href={`tel:${contact.phone.replace(/[^\d]/g, '')}`} className="action-btn call" title={`Call ${contact.phone}`}>
                                                <Phone size={16} /> <span>Call</span>
                                            </a>
                                        )}
                                        {contact.url && (
                                            <a href={contact.url} target="_blank" rel="noopener noreferrer" className="action-btn visit" title="Open Website">
                                                <span>Visit</span> <ArrowRight size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Emergency Notice */}
                {data.emergency_notice && (
                    <div className="emergency-notice">
                        <AlertTriangle size={20} />
                        <span>{data.emergency_notice}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ActionCard;
