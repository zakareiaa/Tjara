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
const CategoryProducts = lazy(() => import('@components/categoryProducts/CategoryProducts'));
// import ServiceRow from '@components/serviceRow/ServiceRow';
const ServiceRow = lazy(() => import('@components/serviceRow/ServiceRow'));
// import SaleProduct from '@components/SaleProduct/SaleProduct';
const SaleProduct = lazy(() => import('@components/SaleProduct/SaleProduct'));
// import ServiceCategories from '@components/ServiceCategories/ServiceCategories';
const ServiceCategories = lazy(() => import('@components/ServiceCategories/ServiceCategories'));
// import FeaturedProduct from '@components/featuredProduct/FeaturedProduct';
const FeaturedProduct = lazy(() => import('@components/featuredProduct/FeaturedProduct'));
// import SalePoster from '@components/salePoster/SalePoster';
// const SalePoster = lazy(() => import('@components/salePoster/SalePoster'));
// import CarProducts from '@components/CarProducts/CarProducts';
const CarProducts = lazy(() => import('@components/CarProducts/CarProducts'));
// import FeaturedCarsSection from '@components/FeaturedCarsSection/FeaturedCarsSection';
const FeaturedCarsSection = lazy(() => import('@components/FeaturedCarsSection/FeaturedCarsSection'));
// import AllProductSection from '@components/allProductsSection/AllProductSection';
const AllProductSection = lazy(() => import('@components/allProductsSection/AllProductSection'));
// import ViewJobSection from '@components/ViewJobSection/ViewJobSection';
const ViewJobSection = lazy(() => import('@components/ViewJobSection/ViewJobSection'));
// import HotAuctions from '@components/hotAuctions/HotAuctions';
const HotAuctions = lazy(() => import('@components/hotAuctions/HotAuctions'));
// import Services from '@components/Services';
const Services = lazy(() => import('@components/Services'));
// import Contests from '@components/contests/Contests';
const Contests = lazy(() => import('@components/contests/Contests'));
// import SaleBanner from '@components/SaleBanner/SaleBanner';
// const SaleBanner = lazy(() => import('@components/SaleBanner/SaleBanner'));
// import HotDeals from '@components/hotDeals/HotDeals';
// const HotDeals = lazy(() => import('@components/hotDeals/HotDeals'));
// import Faq from '@components/faqSection/Faq';
const Faq = lazy(() => import('@components/faqSection/Faq'));
// import LightningProducts from '@components/lightningDeals';
const LightningProducts = lazy(() => import('@components/lightningDeals'));
// import SinginPopup from "@components/signInPopup";
const SinginPopup = lazy(() => import("@components/signInPopup"));
// import HeaderMenuVideoPopup from "@components/headerMenuVideoPopup";
const HeaderMenuVideoPopup = lazy(() => import("@components/HeaderMenuVideoPopup"));
// import SupportWhatsappButton from "@components/supportWhatsappButton";
const SupportWhatsappButton = lazy(() => import("@components/supportWhatsappButton"));

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
  const [switchTabs, setswitchTabs] = useState(localStorage.getItem("tab") || "all")
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const { resetPassPopup, ReferrelProgramRegisterPopup, headerMenuVideoPopup } = usePopup();
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
        <title>Tjara | The Ultimate Multivendor Ecommerce Marketplace</title>
        <meta name="description" content="Tjara is a leading multivendor e-commerce platform that empowers buyers, sellers, and resellers. Enjoy unbeatable prices, a vast product selection, fast and free delivery, and seamless shopping. Join Tjara Club and reseller programs to maximize your profits and grow your business effortlessly." />
        <meta name="keywords" content="Tjara, multivendor marketplace, online shopping, e-commerce, reselling, digital marketing, seller platform, best online deals, free delivery, online store, business growth, reseller program, e-commerce platform, shopping online, discount marketplace" />
        <meta property="og:title" content="Tjara | The Ultimate Multivendor Ecommerce Marketplace" />
        <meta property="og:description" content="Join Tjara, the top multivendor marketplace for buyers, sellers, and resellers. Access exclusive deals, free delivery, and advanced selling tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tjara | The Ultimate Multivendor Ecommerce Marketplace" />
        <meta name="twitter:description" content="Shop, sell, and resell with ease on Tjara. Unbeatable prices, free delivery, and powerful tools for sellers." />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-preview.jpg" />
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

      {/* <HeaderMenuSlider /> */}

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                        For Mobiles                                       */}
      {/* ---------------------------------------------------------------------------------------- */}

      {windowsWidth <= 500 ?
        <div className="mainProductsContainer">
          <HeaderMenuSlider />

          <ServiceRow />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <HeroBanner /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllCategories />
          {/* </Suspense> */}

          <LightningProducts />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CategoryProducts /> */}
          {/* </Suspense> */}

          <div className="mobileProductstabs">
            <button className={switchTabs == "all" ? "active" : ""} onClick={() => {
              setswitchTabs("all");
              localStorage.setItem("tab", "all");
            }}>All</button>
            <button className={switchTabs == "sale" ? "active" : ""} onClick={() => {
              setswitchTabs("sale");
              localStorage.setItem("tab", "sale");
            }}>On Sale</button>
            <button className={switchTabs == "featured" ? "active" : ""} onClick={() => {
              setswitchTabs("featured");
              localStorage.setItem("tab", "featured");
            }
            }>Featured Products</button>
            <button className={switchTabs == "car" ? "active" : ""} onClick={() => {
              setswitchTabs("car");
              localStorage.setItem("tab", "car");
            }
            }>Cars</button>
            <button className={switchTabs == "auctions" ? "active" : ""} onClick={() => {
              setswitchTabs("auctions");
              localStorage.setItem("tab", "auctions");
            }}>Hot Auctions</button>
            <button className={switchTabs == "viewJobSection" ? "active" : ""} onClick={() => {
              setswitchTabs("viewJobSection");
              localStorage.setItem("tab", "viewJobSection");
            }
            }>Jobs</button>
            <button className={switchTabs == "services" ? "active" : ""} onClick={() => {
              setswitchTabs("services");
              localStorage.setItem("tab", "services");
            }
            }>Services</button>
            <button className={switchTabs == "contests" ? "active" : ""} onClick={() => {
              setswitchTabs("contests");
              localStorage.setItem("tab", "contests");
            }
            }>Contests</button>
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
          <SaleProduct appended={true} className={switchTabs == "sale" ? "active" : ""} />
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <ServiceCategories appended={true} className={switchTabs == "serviceCategories" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <FeaturedProduct className={switchTabs == "featured" ? "active" : ""} appended={true} />
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SalePoster appended={true} className={switchTabs == "salePoster" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SaleBanner appended={true} className={switchTabs == "saleBanner" ? "active" : ""} /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <CarProducts appended={true} className={switchTabs == "car" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllProductSection appended={true} className={switchTabs == "all" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <ViewJobSection className={switchTabs == "viewJobSection" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <HotAuctions appended={true} className={switchTabs == "auctions" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <Services className={switchTabs == "services" ? "active" : ""} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <Contests className={switchTabs == "contests" ? "active" : ""} />
          {/* </Suspense> */}

          {headerMenuVideoPopup?.display ? "" : <SupportWhatsappButton />}

          {/* <HeaderMenuSlider className={switchTabs == "stories" ? "active" : ""} /> */}

          {/* <HotDeals className={switchTabs == "hotDeals" ? "active" : ""} /> */}

          {/* <Faq className={switchTabs == "faq" ? "active" : ""} /> */}

        </div>
        :
        <div>

          {/* <HeroBanner /> */}
          <HeaderMenuSlider />
          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllCategories />
          {/* </Suspense> */}

          <LightningProducts />

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '200px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <CategoryProducts /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '100px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <ServiceRow />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <SaleProduct appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <ServiceCategories />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <FeaturedProduct appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          {/* <SalePoster /> */}
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <FeaturedCarsSection appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <AllProductSection appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <ViewJobSection />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <HotAuctions appended={true} />
          {/* </Suspense> */}

          {/* <Suspense fallback={<Skeleton containerClassName="skeleton-parent-container" style={{ width: '100%', height: '300px', margin: '25px auto', borderRadius: '10px' }} />}> */}
          <Contests />
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
          <Faq />
          {/* </Suspense> */}

        </div>
      }
    </>
  );
}
export default HomePage;