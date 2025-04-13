import React from 'react';
import './style.css';

const SectionHeading = ({ heading, className = null }) => {
    return (
        <h1 className={`section-heading ${className}`}>{heading}</h1>
    )
}

export default SectionHeading