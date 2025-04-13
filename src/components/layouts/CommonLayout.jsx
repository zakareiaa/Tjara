// src/components/layouts/CommonLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DataContextProvider } from '@components/DataContext';

// Import components directly instead of lazy loading them
import Header from '@components/Header/Header';
import Footer from '@components/footer/Footer';
import HeaderMenu from '@components/headerMenu/HeaderMenu';
import ProductPreview from '@components/productperview/ProductPreview';
import MobileBottomNav from '@components/MobileBottomNav';
import HeaderMenuVideoPopup from '@components/HeaderMenuVideoPopup';
import BackButton from '@components/backButton';
import PushReload from '@components/pushReload';

const CommonLayout = () => {
    const [windowsWidth, setWindowsWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowsWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <DataContextProvider>
            <>
                <HeaderMenuVideoPopup />
                <ProductPreview />
                <Header />
                <HeaderMenu />
                <main className="main-content">
                    <Outlet />
                </main>
                <ToastContainer />
                <BackButton />
                <PushReload />
                <Footer />
                {windowsWidth <= 500 && <MobileBottomNav />}
            </>
        </DataContextProvider>
    );
};

export default CommonLayout;