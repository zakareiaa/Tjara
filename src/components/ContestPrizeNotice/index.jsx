import React, { useEffect, useState } from 'react';
import { Crown, Trophy, Award, Sparkles, Star, Timer } from 'lucide-react';
import ImageWithFallback from "@components/ImageWithFallback/ImageWithFallback";
import './style.css';

const ContestPrizeNotice = ({
    prize,
    isExpired,
    hasWinner,
    winner,
    isSelecting,
    currentParticipant,
    onSelectWinner,
    endTime
}) => {
    const [showPrize, setShowPrize] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (winner && !isSelecting) {
            const timer = setTimeout(() => {
                setShowPrize(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowPrize(false);
        }
    }, [winner, isSelecting]);

    // Timer calculation effect
    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endTime) - new Date();
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }

            return timeLeft;
        };

        if (!isExpired) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [endTime, isExpired]);

    if (!isExpired || !hasWinner) {
        return (
            <div className="contest-expiry-timer">
                <div className="timer-header">
                    <Timer className="timer-icon" />
                    <h3>Contest Ends In:</h3>
                </div>
                <div className="timer-display">
                    <div className="time-block">
                        <span className="time-value">{timeLeft.days}</span>
                        <span className="time-label">Days</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{timeLeft.hours}</span>
                        <span className="time-label">Hours</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{timeLeft.minutes}</span>
                        <span className="time-label">Minutes</span>
                    </div>
                    <div className="time-separator">:</div>
                    <div className="time-block">
                        <span className="time-value">{timeLeft.seconds}</span>
                        <span className="time-label">Seconds</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contest-prize-notice">
            {/* Rest of your existing prize notice component code */}
            {/* Light effects */}
            <div className="light-rays light-rays-1"></div>
            <div className="light-rays light-rays-2"></div>
            <div className="light-rays light-rays-3"></div>

            {/* Floating decorations */}
            <div className="floating-stars">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="floating-star" size={24} />
                ))}
            </div>
            {/* <div className="sparkles sparkles-left">
                <Sparkles size={24} />
            </div>
            <div className="sparkles sparkles-right">
                <Sparkles size={24} />
            </div> */}

            {/* Main content */}
            <div className="prize-notice-content">
                {/* Initial Message */}
                {!winner && !isSelecting && (
                    <div className="expired-message">
                        <h2>The Contest Has Ended!</h2>
                        <p>It's time to reveal our lucky winner</p>
                    </div>
                )}

                {/* Name Picker Section */}
                <div className={`name-picker-section ${isSelecting ? 'selecting' : ''}`}>
                    {!winner && !isSelecting && (
                        <button
                            onClick={onSelectWinner}
                            className="lucky-picker-btn"
                        >
                            Reveal Winner
                        </button>
                    )}

                    {(isSelecting || winner) && (
                        <>
                            <div className="picker-header">
                                {/* <Sparkles className="sparkles-icon" /> */}
                                <h3>{isSelecting ? "Selecting Winner..." : "Winner Selected!"}</h3>
                                {/* <Sparkles className="sparkles-icon" /> */}
                            </div>

                            <div className="name-display-container">
                                <div className="name-scroll-effect top"></div>
                                <div className={`name-display ${isSelecting ? 'selecting' : ''}`}>
                                    <span className="current-name">
                                        {currentParticipant || 'Winner 🥇'}
                                    </span>
                                </div>
                                <div className="name-scroll-effect bottom"></div>
                            </div>
                        </>
                    )}
                </div>

                {/* Winner Details Section */}
                {winner && (
                    <div className="winner-details-section">
                        <div className="winner-card">
                            <div className="winner-avatar">
                                {winner.participant?.image ? (
                                    <ImageWithFallback
                                        url={winner?.participant?.thumbnail?.url}
                                        name={winner.participant?.first_name}
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {winner.participant?.first_name?.[0] || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="winner-info">
                                <p className="winner-name">
                                    {winner?.participant?.first_name || 'Unknown'} {winner?.participant?.last_name}
                                </p>
                                {winner.participant?.phone && (
                                    <p className="winner-phone">
                                        <strong>Phone: </strong>
                                        {`${winner?.participant?.phone?.slice(0, 7)}${'*'.repeat(winner?.participant?.phone?.length - 7)}`}
                                    </p>
                                )}
                                {!winner.participant?.phone && winner.participant?.email && (
                                    <p className="winner-email">
                                        <strong>Email: </strong>
                                        {`${winner?.participant?.email?.slice(0, 7)}${'*'.repeat(winner?.participant?.email?.length - 7)}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Prize Section - Only shows after winner is revealed */}
                {showPrize && (
                    <div className="prize-section">
                        <div className="prize-header">
                            <Crown className="crown-icon" />
                            <h2 className="prize-title">Grand Prize</h2>
                            <Crown className="crown-icon" />
                        </div>

                        <div className="prize-value-display">
                            <Trophy className="trophy-icon" />
                            <div className="prize-text">{prize || "Amazing Prize"}</div>
                        </div>

                        <div className="prize-status">
                            <Award className="award-icon" />
                            Tjara support team will reach out to the winner regarding the prize.
                            <Award className="award-icon" />
                        </div>
                    </div>
                )}
            </div>

            {/* Corner decorations */}
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>
        </div>
    );
};

export default ContestPrizeNotice;