import React, { useState } from 'react';
import './style.css';

const Spinner = ({ participants }) => {
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const spin = () => {
        if (isSpinning) return; // Prevent multiple spins at once

        setIsSpinning(true);

        // Randomly pick a winner
        const randomIndex = Math.floor(Math.random() * participants.length);
        const degrees = 360 / participants.length;
        const offset = degrees * randomIndex;

        // Rotate the wheel
        document.querySelector('.wheel').style.transform = `rotate(${3600 + offset}deg)`;

        // Highlight the winner
        setTimeout(() => {
            setSelectedParticipant(randomIndex);
            setIsSpinning(false);
        }, 4000); // Match this with CSS transition duration
    };

    return (
        <div className="wheel-container">
            <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
                {participants.map((participant, index) => (
                    <div
                        key={index}
                        className={`wheel-participant ${selectedParticipant === index ? 'highlight' : ''}`}
                        style={{ '--i': index }}
                    >
                        {participant}
                    </div>
                ))}
            </div>
            <div className="indicator"></div>
            <button onClick={spin} disabled={isSpinning}>
                Spin the Wheel
            </button>
        </div>
    );
};

export default Spinner;
