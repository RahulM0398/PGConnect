import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, ExternalLink, Settings, X } from 'lucide-react';

const COUNTY_SERVICES = [
    {
        name: 'PGC311 Portal',
        url: 'https://pgc311.com/customer/s/',
        desc: 'Service requests & tracking'
    },
    {
        name: 'MyMDThink',
        url: 'https://mymdthink.maryland.gov/home/#/',
        desc: 'Benefits & social services'
    },
    {
        name: 'County Tax Portal',
        url: 'https://www.princegeorgescountymd.gov/departments-offices/finance/taxes',
        desc: 'Property taxes & payments'
    },
    {
        name: 'DPIE Permits',
        url: 'https://www.princegeorgescountymd.gov/departments-offices/permitting-inspections-and-enforcement',
        desc: 'Building permits & inspections'
    }
];

const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="profile-menu-wrapper" ref={menuRef}>
            <button
                className="profile-btn"
                onClick={() => setOpen(!open)}
                title="Profile & Services"
            >
                <User size={18} />
            </button>

            {open && (
                <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                        <span>County Services</span>
                        <button className="dropdown-close" onClick={() => setOpen(false)}>
                            <X size={14} />
                        </button>
                    </div>

                    <div className="profile-dropdown-body">
                        {COUNTY_SERVICES.map((svc, idx) => (
                            <a
                                key={idx}
                                href={svc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="service-login-item"
                            >
                                <div className="service-login-info">
                                    <span className="service-login-name">{svc.name}</span>
                                    <span className="service-login-desc">{svc.desc}</span>
                                </div>
                                <ExternalLink size={14} />
                            </a>
                        ))}
                    </div>

                    <div className="profile-dropdown-footer">
                        <a
                            href="https://www.princegeorgescountymd.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="county-portal-link"
                        >
                            <LogIn size={14} />
                            <span>PG County Main Portal</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
