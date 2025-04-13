import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

import { AuthProvider } from "@contexts/Auth";
import { DataContextProvider } from "@components/DataContext";
import { GlobalHeaderFooter } from "@contexts/globalHeaderFooter";
// import { ProductsProvider } from './hooks/ProductsContext';
import FCMHandler from './components/FCMHandler';
import Loader from "@components/Loader";
import ErrorBoundary from "@components/ErrorBoundary";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/* ---------------------------------------------------------------------------------------------- */
/*                                           Middlewares                                          */
/* ---------------------------------------------------------------------------------------------- */

// import AdminMiddleware from "@middlewares/AdminMiddleware";
// import VendorMiddleware from "@middlewares/VendorMiddleware";
// import CustomerMiddleware from "@middlewares/CustomerMiddleware";

/* ---------------------------------------------------------------------------------------------- */
/*                                        Global Components                                       */
/* ---------------------------------------------------------------------------------------------- */

// import HeaderMenuVideoPopup from "@components/HeaderMenuVideoPopup";
const HeaderMenuVideoPopup = React.lazy(() => import("@components/HeaderMenuVideoPopup"));
// import BackgroundTransparentLayer from "@components/BackgroundTransparentLayer/BackgroundTransparentLayer";
// const BackgroundTransparentLayer = React.lazy(() => import("@components/BackgroundTransparentLayer/BackgroundTransparentLayer"));
// import Header from "@components/Header/Header.jsx";
const Header = React.lazy(() => import("@components/Header/Header.jsx"));
// import Footer from "@components/footer/Footer.jsx";
const Footer = React.lazy(() => import("@components/Footer/Footer.jsx"));
// import HeaderMenu from "@components/headerMenu/HeaderMenu";
const HeaderMenu = React.lazy(() => import("@components/headerMenu/HeaderMenu"));
// import ProductPreview from "@components/productperview/ProductPreview";
const ProductPreview = React.lazy(() => import("@components/productperview/ProductPreview"));
// import MobileBottomNav from "@components/MobileBottomNav";
const MobileBottomNav = React.lazy(() => import("@components/mobileBottomNav"));
// import ScrollToTop from "@components/scrollToTop";
const ScrollToTop = React.lazy(() => import("@components/scrollToTop"));
// import BackButton from "@components/backButton";
const BackButton = React.lazy(() => import("@components/backButton"));
// import PushReload from "@components/pushReload";
const PushReload = React.lazy(() => import("@components/pushReload"));

/* ---------------------------------------------------------------------------------------------- */
/*                                          Website Pages                                         */
/* ---------------------------------------------------------------------------------------------- */

// import Home from "@pages/Home";
const Home = React.lazy(() => import("@pages/Home"));
// import TjaraClub from "@pages/TjaraClub";
const TjaraClub = React.lazy(() => import("@pages/TjaraClub"));
// import Shop from "@pages/Shop";
const Shop = React.lazy(() => import("@pages/Shop"));
// import Cart from "@pages/Cart";
const Cart = React.lazy(() => import("@pages/Cart"));
// import Wishlist from "@pages/Wishlist";
const Wishlist = React.lazy(() => import("@pages/wishlist"));
// import Checkout from "@pages/Checkout";
const Checkout = React.lazy(() => import("@pages/Checkout"));
// import Jobs from "@pages/Jobs";
const Jobs = React.lazy(() => import("@pages/Jobs"));
// import ApplyJob from "@pages/ApplyJob";
const ApplyJob = React.lazy(() => import("@pages/ApplyJob"));
// import SingleJob from "@pages/SingleJob";
const SingleJob = React.lazy(() => import("@pages/SingleJob"));
// import Contests from "@pages/Contests";
const Contests = React.lazy(() => import("@pages/Contests"));
// import SingleProduct from "@pages/SingleProduct";
const SingleProduct = React.lazy(() => import("@pages/SingleProduct"));
// import SingleContest from "@pages/SingleContest";
const SingleContest = React.lazy(() => import("@pages/SingleContest"));
// import Store from "@pages/Store";
const Store = React.lazy(() => import("@pages/Store"));
// import BlogArchive from "@pages/Blogs/blogArchive";
const BlogArchive = React.lazy(() => import("@pages/Blogs/blogArchive"));
// import Blog from "@pages/SingleBlog/Blog";
const Blog = React.lazy(() => import("@pages/SingleBlog/Blog"));
// import Faq from "@components/faqSection/Faq";
const Faq = React.lazy(() => import("@components/faqSection/Faq"));
// import Serviceslist from "@pages/ServiceList";
const Serviceslist = React.lazy(() => import("@pages/ServiceList"));
// import ServiceDetails from "@pages/ServiceDetails";
const ServiceDetails = React.lazy(() => import("@pages/ServiceDetails"));
// import HelpCenter from "@pages/helpCenter";
const HelpCenter = React.lazy(() => import("@pages/helpCenter"));
// import TjaraClubBenefits from "@pages/ResellerProgram";
const TjaraClubBenefits = React.lazy(() => import("@pages/ResellerProgram"));
// import PrivacyPolicy from "@pages/PrivacyPolicy";
const PrivacyPolicy = React.lazy(() => import("@pages/PrivacyPolicy"));
// import TermServices from "@pages/TermsServices";
const TermServices = React.lazy(() => import("@pages/TermsServices"));

/* ---------------------------------------------------------------------------------------------- */
/*                                         Not Found Page                                         */
/* ---------------------------------------------------------------------------------------------- */

// import NotFound from "@pages/NotFound";

/* ---------------------------------------------- X --------------------------------------------- */

import "react-toastify/dist/ReactToastify.css";
import "./style.css";

/* ---------------------------------------------------------------------------------------------- */
/*                                 Default Global Layout & Router                                 */
/* ---------------------------------------------------------------------------------------------- */

function App() {
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  // Common wrapper for all routes
  const commonWrapper = (Component, showFaq = false) => (
    <DataContextProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ProductsProvider> */}
        <Suspense fallback={<Loader />}>
          <HeaderMenuVideoPopup />
          <ProductPreview />
          <Header />
          <HeaderMenu />
          {Component}
          {showFaq && <Faq />}
          <ToastContainer />
          <BackButton />
          <PushReload />
          <Footer />
          <ReactQueryDevtools initialIsOpen={false} />
          {windowsWidth <= 500 && <MobileBottomNav />}
        </Suspense>
        {/* </ProductsProvider> */}
      </QueryClientProvider>
    </DataContextProvider>
  )

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <GlobalHeaderFooter>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <ErrorBoundary />
            <FCMHandler />
            <ScrollToTop />
            <Routes>
              {/* ------------------------------------------------------------------------------------ */}
              {/*                                     UnAuth Routes                                    */}
              {/* ------------------------------------------------------------------------------------ */}
              <Route index element={commonWrapper(<Home />)} />
              <Route path="/:slug/:category" element={commonWrapper(<Shop />, true)} />
              <Route path="/product/:id" element={commonWrapper(<SingleProduct />, true)} />
              <Route path="/blogs" element={commonWrapper(<BlogArchive />, true)} />
              <Route path="/blogs/:id" element={commonWrapper(<Blog />, true)} />
              <Route path="/help-and-center" element={commonWrapper(<HelpCenter />)} />
              <Route path="/club" element={commonWrapper(<TjaraClub />, true)} />
              <Route path="/club-benefits" element={commonWrapper(<TjaraClubBenefits />, true)} />
              <Route path="/jobs" element={commonWrapper(<Jobs />)} />
              <Route path="/jobs/:id" element={commonWrapper(<SingleJob />)} />
              <Route path="/jobs/:id/apply" element={commonWrapper(<ApplyJob />)} />
              <Route path="/services" element={commonWrapper(<Serviceslist />)} />
              <Route path="/services/:id" element={commonWrapper(<ServiceDetails />)} />
              <Route path="/contests" element={commonWrapper(<Contests />, true)} />
              <Route path="/contests/:id" element={commonWrapper(<SingleContest />, true)} />
              <Route path="/cart" element={commonWrapper(<Cart />)} />
              <Route path="/wishlist" element={commonWrapper(<Wishlist />)} />
              <Route path="/checkout" element={commonWrapper(<Checkout />)} />
              <Route path="/store/:id" element={commonWrapper(<Store />)} />
              <Route path="/privacy-policy" element={commonWrapper(<PrivacyPolicy />)} />
              <Route path="/terms-services" element={commonWrapper(<TermServices />)} />
              <Route path="*" element={commonWrapper(<Home />)} />
              {/* <Route path="*" element={commonWrapper(<NotFound />)} /> */}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </GlobalHeaderFooter >
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
