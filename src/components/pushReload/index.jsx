import React, { useState, useEffect, useRef } from 'react';

const PullDownRefresh = ({ children }) => {
    const [startY, setStartY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const [showArrow, setShowArrow] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isProductPage, setIsProductPage] = useState(false);
    const arrowRef = useRef(null);
    const componentMounted = useRef(true);

    // Check if window is at top
    const checkIfAtTop = () => {
        if (componentMounted.current) {
            setIsAtTop(window.scrollY === 0);
        }
    };

    // Check if current page is a product page
    const checkIfProductPage = () => {
        if (componentMounted.current) {
            const path = window.location.pathname;
            setIsProductPage(path.startsWith('/product/'));
        }
    };

    const handleTouchStart = (e) => {
        // Only set start position if we're at the top of the page and not on a product page
        if (window.scrollY === 0 && !isProductPage) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        // Only handle pull if we're at the top of the page and not on a product page
        if (!isAtTop || isProductPage || !componentMounted.current) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
            setPullDistance(distance);
            if (distance > 150) {
                setShowArrow(true);
            } else {
                setShowArrow(false);
            }
        }
    };

    const handleTouchEnd = () => {
        // Only handle refresh if we're at the top, arrow is shown, and not on a product page
        if (isAtTop && showArrow && !isProductPage && componentMounted.current) {
            const urlWithoutParams = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', urlWithoutParams);
            window.location.reload();
        }
        setPullDistance(0);
        setShowArrow(false);
    };

    useEffect(() => {
        // Initial checks
        checkIfAtTop();
        checkIfProductPage();

        // Add scroll listener to update top status
        window.addEventListener('scroll', checkIfAtTop, { passive: true });

        // Properly scope these event handlers to the document body
        const docBody = document.body;
        docBody.addEventListener('touchstart', handleTouchStart, { passive: true });
        docBody.addEventListener('touchmove', handleTouchMove, { passive: true });
        docBody.addEventListener('touchend', handleTouchEnd);

        // Add route change listener
        const handleRouteChange = () => {
            checkIfProductPage();
        };
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            componentMounted.current = false;
            window.removeEventListener('scroll', checkIfAtTop);
            docBody.removeEventListener('touchstart', handleTouchStart);
            docBody.removeEventListener('touchmove', handleTouchMove);
            docBody.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);  // Empty dependency array to run only once

    // Use memoized handlers that depend on state
    useEffect(() => {
        const currentHandleTouchStart = (e) => {
            if (window.scrollY === 0 && !isProductPage) {
                setStartY(e.touches[0].clientY);
            }
        };

        const currentHandleTouchMove = (e) => {
            if (!isAtTop || isProductPage) return;

            const currentY = e.touches[0].clientY;
            const distance = currentY - startY;

            if (distance > 0) {
                setPullDistance(distance);
                if (distance > 150) {
                    setShowArrow(true);
                } else {
                    setShowArrow(false);
                }
            }
        };

        const currentHandleTouchEnd = () => {
            if (isAtTop && showArrow && !isProductPage) {
                const urlWithoutParams = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', urlWithoutParams);
                window.location.reload();
            }
            setPullDistance(0);
            setShowArrow(false);
        };

        const docBody = document.body;
        docBody.removeEventListener('touchstart', handleTouchStart);
        docBody.removeEventListener('touchmove', handleTouchMove);
        docBody.removeEventListener('touchend', handleTouchEnd);

        docBody.addEventListener('touchstart', currentHandleTouchStart, { passive: true });
        docBody.addEventListener('touchmove', currentHandleTouchMove, { passive: true });
        docBody.addEventListener('touchend', currentHandleTouchEnd);

        return () => {
            docBody.removeEventListener('touchstart', currentHandleTouchStart);
            docBody.removeEventListener('touchmove', currentHandleTouchMove);
            docBody.removeEventListener('touchend', currentHandleTouchEnd);
        };
    }, [startY, showArrow, isAtTop, isProductPage]);

    // Render children regardless of product page status to avoid DOM remounting issues
    return (
        <>
            {children}
            {!isProductPage && showArrow && (
                <div
                    ref={arrowRef}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '24px',
                        background: 'lightgray',
                        borderRadius: '50%',
                        padding: '10px',
                        width: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'red',
                        alignItems: 'center',
                        height: '40px',
                        zIndex: 1000,
                        transition: 'opacity 0.3s'
                    }}
                >
                    ↓
                </div>
            )}
        </>
    );
};

export default PullDownRefresh;