import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from your routing library
import './Button.css';

export default function Button({
    children,
    to,
    href,
    variant = 'primary', // 'primary' | 'secondary' | 'tertiary' | 'ghost' |
    size = 'md',         // 'sm' | 'md' | 'lg'
    active = false,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) {
    // Combine base class, variant, size, active state, and custom classes
    const combinedClasses = `btn btn-${variant} btn-${size} ${active ? 'active' : ''} ${className}`.trim();

    if (to) {
        return (
            <Link 
                to={to} 
                className={combinedClasses} 
                {...props}
            >
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a 
                href={href} 
                className={combinedClasses} 
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}