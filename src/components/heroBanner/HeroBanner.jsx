import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import POSTS from "@client/postsClient";
import bannerBackground from "@assets/hero-banner.svg";
import bannerProductImg from "@assets/banner-product-img.png";
import "./HeroBanner.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ViewPortComponent, isDarkColor } from "../../helpers/helpers"
import { usePopup } from "../DataContext";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", right: "40px", }} onClick={onClick} >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" > <g clipPath="url(#clip0_333_15182)"> <path d="M22 0C34.1312 0 44 9.86883 44 22C44 34.1312 34.1312 44 22 44C9.86883 44 0 34.1312 0 22C0 9.86883 9.86883 0 22 0ZM12.8333 23.8333H22V29.9952C22 31.2693 23.562 31.9092 24.475 31.0072L32.5747 23.012C33.1412 22.4528 33.1412 21.5472 32.5747 20.988L24.475 12.9928C23.562 12.0908 22 12.7307 22 14.0048V20.1667H12.8333C11.8213 20.1667 11 20.988 11 22C11 23.012 11.8213 23.8333 12.8333 23.8333Z" fill="#374856" /> </g> <defs> <clipPath id="clip0_333_15182"> <rect width="44" height="44" fill="white" transform="matrix(-1 0 0 1 44 0)" /> </clipPath> </defs> </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", left: "40px", zIndex: 1 }} onClick={onClick} >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" > <g clipPath="url(#clip0_333_15186)"> <path d="M22 0C9.86883 0 0 9.86883 0 22C0 34.1312 9.86883 44 22 44C34.1312 44 44 34.1312 44 22C44 9.86883 34.1312 0 22 0ZM31.1667 23.8333H22V29.9952C22 31.2693 20.438 31.9092 19.525 31.0072L11.4253 23.012C10.8588 22.4528 10.8588 21.5472 11.4253 20.988L19.525 12.9928C20.438 12.0908 22 12.7307 22 14.0048V20.1667H31.1667C32.1787 20.1667 33 20.988 33 22C33 23.012 32.1787 23.8333 31.1667 23.8333Z" fill="#374856" /> </g> <defs> <clipPath id="clip0_333_15186"> <rect width="44" height="44" fill="white" /> </clipPath> </defs> </svg>
    </div>
  );
}

/* ---------------------------------------------- X --------------------------------------------- */

function HeroBanner({ ids }) {
  const { setcurrentHeaderColor, currentHeaderColor } = usePopup();
  const [headerColors, setheaderColors] = useState(["#ded8c2", "#d8152d", "#f4f4f4", "#d21742"]);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const componentRef = useRef(null);
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const settings = {
    infinite: true,
    slidesToShow: 1,
    speed: 1000,
    pauseOnHover: true,
    // autoplay: true,
    autoplaySpeed: 4000,
    dots: false,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    customPaging(i) {
      return (
        <a />
      );
    },
    afterChange: (current) => {
      setcurrentHeaderColor(banners?.data[current]?.meta?.background_color);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchHomePageBanners = async () => {
    const { data, error } = await POSTS.getPosts({
      ids: ids,
      with: 'video',
      filterByColumns: {
        filterJoin: "OR",
        columns: [
          {
            column: 'post_type',
            value: 'hero_banners',
            operator: '=',
          }
        ]
      },
      per_page: 20,
    })
    if (data) setBanners(data.posts);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchHomePageBanners()
    ViewPortComponent(componentRef, setIsComponentVisible)
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (banners?.data?.length > 0) {
      setcurrentHeaderColor(banners?.data[0]?.meta?.background_color)
    }
  }, [banners]);

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    banners?.data?.length > 0 ? (
      <div className={`${isDarkColor(currentHeaderColor) ? "IsDark" : ""} hero-banner-sec`} ref={componentRef} style={{ background: `linear-gradient(to right, ${currentHeaderColor},${currentHeaderColor}), url("/src/assets/hero-banner.svg")` }}>
        {banners?.data?.length > 1 ? (
          <Slider {...settings} className="heroBannerContainer">
            {banners?.data?.map((banner, key) => (
              <div key={key} className="hero-banner" style={{ direction: banner?.language?.dir }}>
                {/* <div className="banner-background-image" style={{ background: `url(${banner?.thumbnail?.media?.url})` }}> */}
                <div className="container" style={{ direction: banner?.language?.dir }}>
                  <div className="hero-banner-text-content-container">
                    <p className="hero-banner-sale-name" style={{ color: banner?.meta?.name_color || "#000000" }}>{banner?.name ?? 'New Summer Collection'}</p>
                    <p className="hero-banner-sale-year" style={{ color: banner?.meta?.sub_heading_color || "#000000" }}>{banner?.meta?.sub_heading}</p>
                    <p className="hero-banner-sale-desc" style={{ color: banner?.meta?.description_color || "#000000" }}> {banner?.description ?? "There's nothing like trend"}</p>
                    <button
                      onClick={() => {
                        const path = (() => {
                          switch (banner?.meta?.banner_type) {
                            case 'sale-banner':
                              return `/global/products?filter_by_column=discount&discount=${banner?.meta?.banner_type_value}` || '/shop/products';
                            case 'product-promo-banner':
                              return `/product/${banner?.meta?.banner_type_value}` || '/shop/products';
                            case 'shop-promo-banner':
                              return `/store/${banner?.meta?.banner_type_value}` || '/shop/products';
                            default:
                              return '/shop/products';
                          }
                        })();
                        navigate(path);
                      }}
                      className="hero-banner-shop-btn">
                      {banner?.meta?.button_text || 'Shop Now'}
                    </button>
                  </div>
                  <div className="hero-banner-product-img-container" style={{ maxWidth: "40%" }}>
                    <img src={banner?.thumbnail?.media?.url ?? bannerProductImg} alt="" />
                    {banner.meta.banner_type == 'sale-banner' && <div className="hero-banner-product-img-discount">{banner?.meta?.banner_type_value}% OFF</div>}
                  </div>
                </div>
                {/* </div> */}
              </div>
            ))}
          </Slider>
        ) : (
          <div className="heroBannerContainer">
            {banners?.data?.map((banner, key) => (
              <div key={key} className="hero-banner">
                {/* <div className="banner-background-image" style={{ background: `url(${banner?.thumbnail?.media?.url})` }}> */}
                <div className="container">
                  <div className="hero-banner-text-content-container">
                    <p className="hero-banner-sale-name">{banner?.name ?? 'New Summer Collection'}</p>
                    <p className="hero-banner-sale-year">{banner?.meta?.sub_heading}</p>
                    <p className="hero-banner-sale-desc">
                      {banner?.description ?? "There's nothing like trend"}
                    </p>
                    <button
                      onClick={() => {
                        const path = (() => {
                          switch (banner?.meta?.banner_type) {
                            case 'sale-banner':
                              return `/global/products?filter_by_column=discount&discount=${banner?.meta?.banner_type_value}` || '/shop/products';
                            case 'product-promo-banner':
                              return `/product/${banner?.meta?.banner_type_value}` || '/shop/products';
                            case 'shop-promo-banner':
                              return `/store/${banner?.meta?.banner_type_value}` || '/shop/products';
                            default:
                              return '/shop/products';
                          }
                        })();
                        navigate(path);
                      }}
                      className="hero-banner-shop-btn">
                      {banner?.meta?.button_text || 'Shop Now'}
                    </button>
                  </div>
                  <div className="hero-banner-product-img-container" style={{ maxWidth: "40%" }}>
                    <img src={banner?.thumbnail?.media?.url ?? bannerProductImg} alt="" />
                    {banner.meta.banner_type == 'sale-banner' && <div className="hero-banner-product-img-discount">{banner?.meta?.banner_type_value}% OFF</div>}
                  </div>
                </div>
                {/* </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    ) : null
  );
}

export default HeroBanner;
