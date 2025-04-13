import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();
    const [isDesktop, setIsDesktop] = useState(false);

    // Check if the device is mobile based on screen width
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth > 768); // Common breakpoint for mobile devices
        };

        // Initial check
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Helper function to check if current page should be excluded from auto-scrolling
    const isExcludedPage = () => {
        // Only apply exclusions on desktop, not on mobile
        if (isDesktop) {
            return false; // No exclusions on mobile
        }

        // Check for exact homepage or specific sections that should be excluded on desktop
        return pathname === '/' ||
            pathname.startsWith('/shop') ||
            pathname.startsWith('/cars') ||
            pathname.startsWith('/club') ||
            pathname.startsWith('/store') ||
            pathname.startsWith('/global');
    };

    useEffect(() => {
        if (!isExcludedPage()) {
            setTimeout(() => { window.scrollTo(0, 0); }, 500);
        }
    }, [pathname, isDesktop]);

    useEffect(() => {
        if (navigationType === 'POP' && !isExcludedPage()) {
            setTimeout(() => { window.scrollTo(0, 0); }, 500);
        }
    }, [pathname, navigationType, isDesktop]);

    return null;
}

export default ScrollToTop;