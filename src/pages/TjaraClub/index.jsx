import React, { useEffect, useState, Suspense, lazy } from "react";
import Skeleton from 'react-loading-skeleton';
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import { useLocation } from "react-router-dom";

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

import { useAuth } from "@contexts/Auth.jsx";
import AUTH from "@client/authClient";
import { usePopup } from "../../components/DataContext";

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

// import ProductPerview from '../../components/productperview/ProductPreview';
const ProductPerview = lazy(() => import('../../components/productperview/ProductPreview'));
// import HeaderMenuSlider from '@components/headerMenuSlider/HeaderMenuSlider';
const HeaderMenuSlider = lazy(() => import('@components/headerMenuSlider/HeaderMenuSlider'));
// import HeroBanner from '@components/heroBanner/HeroBanner';
const HeroBanner = lazy(() => import('@components/heroBanner/HeroBanner'));
// import AllCategories from '@components/allCategories/AllCategories';
const AllCategories = lazy(() => import('@components/allCategories/AllCategories'));
// import CategoryProducts from '@components/categoryProducts/CategoryProducts';
// const CategoryProducts = lazy(() => import('@components/categoryProducts/CategoryProducts'));
// import ServiceRow from '@components/serviceRow/ServiceRow';
// const ServiceRow = lazy(() => import('@components/serviceRow/ServiceRow'));
// import SaleProduct from '@components/SaleProduct/SaleProduct';
const SaleProduct = lazy(() => import('@components/SaleProduct/SaleProduct'));
// import ServiceCategories from '@components/ServiceCategories/ServiceCategories';
// const ServiceCategories = lazy(() => import('@components/ServiceCategories/ServiceCategories'));
// import FeaturedProduct from '@components/featuredProduct/FeaturedProduct';
const FeaturedProduct = lazy(() => import('@components/featuredProduct/FeaturedProduct'));
// import SalePoster from '@components/salePoster/SalePoster';
// const SalePoster = lazy(() => import('@components/salePoster/SalePoster'));
// import CarProducts from '@components/CarProducts/CarProducts';
// const CarProducts = lazy(() => import('@components/CarProducts/CarProducts'));
// import AllProductSection from '@components/allProductsSection/AllProductSection';
const AllProductSection = lazy(() => import('@components/allProductsSection/AllProductSection'));
// import ViewJobSection from '@components/ViewJobSection/ViewJobSection';
// const ViewJobSection = lazy(() => import('@components/ViewJobSection/ViewJobSection'));
// import HotAuctions from '@components/hotAuctions/HotAuctions';
const HotAuctions = lazy(() => import('@components/hotAuctions/HotAuctions'));
// import Services from '@components/Services';
// const Services = lazy(() => import('@components/Services'));
// import Contests from '@components/contests/Contests';
// const Contests = lazy(() => import('@components/contests/Contests'));
// import SaleBanner from '@components/SaleBanner/SaleBanner';
// const SaleBanner = lazy(() => import('@components/SaleBanner/SaleBanner'));
// import HotDeals from '@components/hotDeals/HotDeals';
// const HotDeals = lazy(() => import('@components/hotDeals/HotDeals'));
// import Faq from '@components/faqSection/Faq';
// const Faq = lazy(() => import('@components/faqSection/Faq'));
// import LightningProducts from '@components/lightningDeals';
const LightningProducts = lazy(() => import('@components/lightningDeals'));
// import SinginPopup from "@components/signInPopup";
const SinginPopup = lazy(() => import("@components/signInPopup"));
// import HeaderMenuVideoPopup from "@components/headerMenuVideoPopup";
const HeaderMenuVideoPopup = lazy(() => import("@components/HeaderMenuVideoPopup"));
// import SupportWhatsappButton from "@components/supportWhatsappButton";
const SupportWhatsappButton = lazy(() => import("@components/supportWhatsappButton"));

const ClubBenefits = lazy(() => import("@components/ClubBenefits"));

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

import 'react-loading-skeleton/dist/skeleton.css';
import "./style.css"

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function HomePage() {
  const [switchTabs, setswitchTabs] = useState("all")
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const { resetPassPopup, ReferrelProgramRegisterPopup } = usePopup();
  const Query = useQuery();
  const { currentUser, login, logout } = useAuth();
  const resetPasswordQuery = Query.get('reset-password');
  const ReferrelProgramRegister = Query.get('invited_by');

  /* --------------------------------------------- X -------------------------------------------- */

  const loginWithJwt = async (jwt) => {
    const { data, error } = await AUTH.loginWithJwt({ authToken: jwt });
    if (data) login(data.user)
    if (error) toast.error(error.data.message);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const jwt = Query.get('jwt');
    if (jwt && jwt !== 'false') {
      if (currentUser?.authToken) {
        return;
      }
      loginWithJwt(jwt);
    } else if (jwt && jwt === 'false') {
      setTimeout(() => { logout(); }, 1000);
    }
  }, [Query]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const message = Query.get('message');
    toast.success(message);
  }, [Query.get('message')]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (resetPasswordQuery === 'true') {
      resetPassPopup();
    }
  }, [resetPasswordQuery]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (ReferrelProgramRegister && ReferrelProgramRegister !== '') {
      ReferrelProgramRegisterPopup();
    }
  }, [ReferrelProgramRegister]);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  });

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                         SEO Tags                                         */}
      {/* ---------------------------------------------------------------------------------------- */}

      <Helmet>
        <title>Join Tjara Club | Exclusive Benefits for Shoppers & Resellers</title>
        <meta name="description" content="Unlock exclusive discounts, reseller opportunities, and special deals with Tjara Club. Join now to maximize your savings and grow your business effortlessly." />
        <meta name="keywords" content="Tjara Club, exclusive deals, reseller program, membership benefits, online shopping, e-commerce perks, discount marketplace, best shopping platform, seller opportunities, free delivery, business growth" />
        <meta property="og:title" content="Join Tjara Club | Exclusive Benefits for Shoppers & Resellers" />
        <meta property="og:description" content="Become a Tjara Club member and enjoy exclusive discounts, reseller benefits, and special offers. Start your journey to smarter shopping and business growth today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com/club" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-club-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join Tjara Club | Exclusive Benefits for Shoppers & Resellers" />
        <meta name="twitter:description" content="Get access to special discounts, reseller perks, and more with Tjara Club. Sign up today and start saving!" />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-club-preview.jpg" />
      </Helmet>

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                    Stories Video Popup                                   */}
      {/* ---------------------------------------------------------------------------------------- */}

      <HeaderMenuVideoPopup />

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                       Sign In Popup                                      */}
      {/* ---------------------------------------------------------------------------------------- */}

      <SinginPopup display={false} setdisplay={false} />

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Product Preview Popup                                  */}
      {/* ---------------------------------------------------------------------------------------- */}

      <ProductPerview />

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                    Header Menu Slider                                    */}
      {/* ---------------------------------------------------------------------------------------- */}

      <HeaderMenuSlider />

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                        For Mobiles                                       */}
      {/* ---------------------------------------------------------------------------------------- */}

      {windowsWidth <= 500 ?
        <div className="mainProductsContainer">

          {/* <ServiceRow /> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <HeroBanner />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllCategories shopId={"76c60862-c355-4238-9f85-a0520c423feb"} />
          {/* </Suspense> */}

          <LightningProducts shopId={"76c60862-c355-4238-9f85-a0520c423feb"} />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CategoryProducts /> */}
          {/* </Suspense> */}

          <div className="mobileProductstabs">
            <button className={switchTabs == "all" ? "active" : ""} onClick={() => setswitchTabs("all")}>All</button>
            <button className={switchTabs == "sale" ? "active" : ""} onClick={() => setswitchTabs("sale")}>On Sale</button>
            <button className={switchTabs == "featured" ? "active" : ""} onClick={() => setswitchTabs("featured")}>Featured Products</button>
            {/* <button className={switchTabs == "car" ? "active" : ""} onClick={() => setswitchTabs("car")}>Cars</button> */}
            <button className={switchTabs == "auctions" ? "active" : ""} onClick={() => setswitchTabs("auctions")}>Hot Auctions</button>
            {/* <button className={switchTabs == "viewJobSection" ? "active" : ""} onClick={() => setswitchTabs("viewJobSection")}>Jobs</button> */}
            {/* <button className={switchTabs == "services" ? "active" : ""} onClick={() => setswitchTabs("services")}>Services</button> */}
            {/* <button className={switchTabs == "contests" ? "active" : ""} onClick={() => setswitchTabs("contests")}>Contests</button> */}
            {/* <button className={switchTabs == "hotDeals" ? "active" : ""} onClick={() => setswitchTabs("hotDeals")}>Hot Deals</button> */}
            {/* <button className={switchTabs == "faq" ? "active" : ""} onClick={() => setswitchTabs("faq")}>Faqs</button> */}
            {/* <button className={switchTabs == "stories" ? "active" : ""} onClick={() => setswitchTabs("stories")}>Stories</button> */}
            {/* <button className={switchTabs == "serviceCategories" ? "active" : ""} onClick={() => setswitchTabs("serviceCategories")}>Service Categories</button> */}
            {/* <button className={switchTabs == "salePoster" ? "active" : ""} onClick={() => setswitchTabs("salePoster")}>Sales</button> */}
            {/* <button className={switchTabs == "saleBanner" ? "active" : ""} onClick={() => setswitchTabs("saleBanner")}>Promotions</button> */}
          </div>

          {/* ---------------------------------------------------------------------------------- */}
          {/*                                          X                                         */}
          {/* ---------------------------------------------------------------------------------- */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <SaleProduct shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} className={switchTabs == "sale" ? "active" : ""} />
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ServiceCategories appended={true} className={switchTabs == "serviceCategories" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <FeaturedProduct shopId={"76c60862-c355-4238-9f85-a0520c423feb"} className={switchTabs == "featured" ? "active" : ""} appended={true} />
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SalePoster appended={true} className={switchTabs == "salePoster" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SaleBanner appended={true} className={switchTabs == "saleBanner" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CarProducts appended={true} className={switchTabs == "car" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllProductSection shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} className={switchTabs == "all" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ViewJobSection className={switchTabs == "viewJobSection" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <HotAuctions shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} className={switchTabs == "auctions" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <Services className={switchTabs == "services" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <Contests className={switchTabs == "contests" ? "active" : ""} /> */}
          {/* </Suspense> */}

          <SupportWhatsappButton />

          {/* <HeaderMenuSlider className={switchTabs == "stories" ? "active" : ""} /> */}

          {/* <HotDeals className={switchTabs == "hotDeals" ? "active" : ""} /> */}

          {/* <Faq className={switchTabs == "faq" ? "active" : ""} /> */}

        </div>
        :
        <div>

          <HeroBanner />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllCategories shopId={"76c60862-c355-4238-9f85-a0520c423feb"} />
          {/* </Suspense> */}

          <LightningProducts shopId={"76c60862-c355-4238-9f85-a0520c423feb"} />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CategoryProducts /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ServiceRow /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <SaleProduct shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ServiceCategories /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <FeaturedProduct shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SalePoster /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CarProducts appended={true} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllProductSection shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ViewJobSection /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <HotAuctions shopId={"76c60862-c355-4238-9f85-a0520c423feb"} appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <ClubBenefits />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <Contests /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '50px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <SupportWhatsappButton />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SaleBanner /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <HotDeals /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <Faq /> */}
          {/* </Suspense> */}

        </div>
      }
    </>
  );
}
export default HomePage;