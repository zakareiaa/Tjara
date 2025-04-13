import React from 'react';
import { formatPrice } from "@helpers/helpers";
import './style.css';

const ResellerProgressBar = ({ resellerProgressBar }) => {
    if (!resellerProgressBar) return null;

    const { levels, currentLevel, nextLevel, progress, amountToNextLevel } = resellerProgressBar;

    return (
        <>
            <h6 className="reseller-progress-title">Reseller Discount Progress</h6>
            <div className="reseller-progress-container">

                <div className="reseller-progress-bar-container">
                    {/* Level Markers */}
                    <div className="reseller-level-markers">
                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="reseller-level-marker"
                                style={{ left: `${(index / (levels.length - 1)) * 100}%` }}
                            >
                                <div className={`reseller-marker-dot ${currentLevel && level.level <= currentLevel.level ? 'active' : ''}`} />
                                <span className="reseller-marker-amount" style={{ color: `${currentLevel && level.level <= currentLevel.level ? 'red' : ''}` }}>{formatPrice(level.minSpent)}</span>
                                <span className="reseller-marker-discount" style={{ color: `${currentLevel && level.level <= currentLevel.level ? 'red' : ''}` }}>{level.discount}% off</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="reseller-progress-track">
                        {currentLevel && (
                            <div
                                className="reseller-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {currentLevel && (
                    <div className="reseller-status-message">
                        {nextLevel ? (
                            <>
                                Add <span className="reseller-highlight-amount">{formatPrice(amountToNextLevel)}</span> more to reach {nextLevel.discount}% discount!
                            </>
                        ) : (
                            <>
                                You've reached the maximum discount level of {currentLevel.discount}%!
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ResellerProgressBar;