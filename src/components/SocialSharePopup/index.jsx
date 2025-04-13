import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import whatsapp from "../../assets/whatsapp.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import pinterest from "../../assets/pinterest.png";
import copyLink from "../../assets/copyLink.png";
import './style.css';

const shareMessages = [
    "🎉 Join me in this amazing contest! You could win fantastic prizes!",
    "🎮 Hey! I found an exciting contest - want to try your luck?",
    "🎁 Don't miss out on this contest - amazing prizes up for grabs!",
    "✨ Check out this awesome contest I'm participating in!",
    "🏆 Join this contest for a chance to win big!"
];

const SocialSharePopup = ({ isOpen, onClose, contestName, contestUrl, onShareComplete }) => {
    const [hasShared, setHasShared] = useState(false);

    if (!isOpen) return null;

    const getRandomMessage = () => {
        const randomIndex = Math.floor(Math.random() * shareMessages.length);
        return `${shareMessages[randomIndex]} ${contestName}`;
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(getRandomMessage() + ' ' + contestUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${contestUrl}&quote=${encodeURIComponent(getRandomMessage())}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(getRandomMessage())}&url=${contestUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${contestUrl}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${contestUrl}&description=${encodeURIComponent(getRandomMessage())}`
    };

    const handleShare = (platform) => {
        const shareWindow = window.open(shareLinks[platform], '_blank', 'width=600,height=400');

        // Create interval to check if window closed
        const checkWindow = setInterval(() => {
            if (shareWindow.closed) {
                clearInterval(checkWindow);
                setHasShared(true);
                if (onShareComplete) {
                    onShareComplete();
                }
                toast.success('Thanks for sharing! You can now submit your answers.');
            }
        }, 1000);

        // Cleanup interval after 2 minutes maximum
        setTimeout(() => {
            clearInterval(checkWindow);
        }, 120_000);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${getRandomMessage()}\n${contestUrl}`);
            setTimeout(() => { setHasShared(true); }, 5000);
            if (onShareComplete) {
                onShareComplete();
            }
            toast.success('Link and message copied to clipboard! You can now submit your answers.');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className="social-share-overlay">
            <div className="social-share-modal">
                <div className="social-share-header">
                    <h3 className="social-share-title">Share to Continue</h3>
                    <button onClick={onClose} className="social-share-close">
                        <X size={24} />
                    </button>
                </div>

                <p className="social-share-message">
                    Please share this contest with either:
                    <br />• 5 contacts on WhatsApp, or
                    <br />• Post it on one of your social media channels
                    <br />to continue with your submission.
                </p>

                <div className="social-share-grid">
                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="social-share-button whatsapp"
                    >
                        <img src={whatsapp} alt="WhatsApp" />
                        <span>WhatsApp</span>
                    </button>

                    <button
                        onClick={() => handleShare('facebook')}
                        className="social-share-button facebook"
                    >
                        <img src={facebook} alt="Facebook" />
                        <span>Facebook</span>
                    </button>

                    <button
                        onClick={() => handleShare('twitter')}
                        className="social-share-button twitter"
                    >
                        <img src={twitter} alt="Twitter" />
                        <span>Twitter</span>
                    </button>

                    <button
                        onClick={() => handleShare('linkedin')}
                        className="social-share-button linkedin"
                    >
                        <img src={linkedin} alt="LinkedIn" />
                        <span>LinkedIn</span>
                    </button>

                    <button
                        onClick={() => handleShare('pinterest')}
                        className="social-share-button pinterest"
                    >
                        <img src={pinterest} alt="Pinterest" />
                        <span>Pinterest</span>
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="social-share-button copy-link"
                    >
                        <img src={copyLink} alt="Copy Link" />
                        <span>Copy Link</span>
                    </button>
                </div>

                {hasShared && (
                    <div className="share-confirmation">
                        <p className="text-green-600 text-center mt-4">
                            ✅ Thanks for sharing! You can now close this popup and submit your answers.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialSharePopup;