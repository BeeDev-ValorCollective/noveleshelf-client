import React from "react";
import './select.css';

export default function Select({
    id,
    value,
    onChange,
    children,
    disabled= false,
    size = 'md', // 'sm' | 'md' | 'lg'
    variant = 'default', // 'default', | 'inline'
    className = '',
    'aria-label': ariaLabel,
    ...props
}) {
    const combinedClasses = `nes-select nes-select--${variant} nes-select--${size}${className}`.trim();

    return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={combinedClasses}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </select>
    );
}