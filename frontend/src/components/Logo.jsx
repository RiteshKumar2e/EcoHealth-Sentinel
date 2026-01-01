import React from 'react';

const Logo = ({ className = "w-12 h-12" }) => {
    return (
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
                flexShrink: 0,
            }}
            className={className}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="24"
                height="24"
                style={{
                    fill: 'none',
                    stroke: '#ffffff',
                    strokeWidth: 2.5,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
            >
                <path
                    d="M32 6C42 10 54 14 54 26C54 40 32 58 32 58S10 40 10 26C10 14 22 10 32 6Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M24 30C28 24 36 22 40 28C42 32 38 38 32 40C28 41 26 38 26 34"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default Logo;
