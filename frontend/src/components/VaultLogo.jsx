import React from 'react';

const VaultLogo = ({ size = 48, className = "" }) => {
    return (
        <div
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                viewBox="0 0 24 24"
                width={size * 0.6}
                height={size * 0.6}
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Shield Shape */}
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                {/* Medical Cross */}
                <path d="M8 11h8" />
                <path d="M12 7v8" />
            </svg>
        </div>
    );
};

export default VaultLogo;
