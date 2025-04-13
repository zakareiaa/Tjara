import React, { useState, useEffect } from 'react';
import './style.css';

const ContestExpiryTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDateTime = new Date(endTime).getTime();
            const now = new Date().getTime();
            const difference = endDateTime - now;

            if (difference <= 0) {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true
                };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                isExpired: false
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update timer every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, [endTime]);

    if (timeLeft.isExpired) {
        return (
            <div className="timer-container expired">
                <p className="expiry-status">EXPIRED</p>
                <p className="expiry-date">
                    Expiry Date: <span>{new Date(endTime).toLocaleDateString()}</span>
                </p>
            </div>
        );
    }

    return (
        <div className="timer-container">
            <div className="countdown-wrapper">
                <div className="countdown-item">
                    <span className="countdown-value">{timeLeft.days}</span>
                    <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-item">
                    <span className="countdown-value">{timeLeft.hours}</span>
                    <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-item">
                    <span className="countdown-value">{timeLeft.minutes}</span>
                    <span className="countdown-label">Minutes</span>
                </div>
                <div className="countdown-item">
                    <span className="countdown-value">{timeLeft.seconds}</span>
                    <span className="countdown-label">Seconds</span>
                </div>
            </div>
            <p className="expiry-date">
                Expiry Date: <span>{new Date(endTime).toLocaleDateString()}</span>
            </p>
        </div>
    );
};

export default ContestExpiryTimer;