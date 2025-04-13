import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid, FreeMode } from 'swiper/modules';
import Skeleton from "react-loading-skeleton";

import PRODUCT_ATTRIBUTES from "@client/productAttributesClient";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { usePopup } from "../DataContext";
import { fixUrl } from "@helpers/helpers";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";
import { getOptimizedThumbnailUrl } from "../../helpers/helpers";

import Bag from "./assets/bags.svg";
import CatIcon from "./assets/category-icon.svg";
import catIcon from "./assets/category.svg";
import AllCategoriesIcon from "./assets/all_icon.png";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import "./style.css";

function AllCategories({ shopId = null }) {
  const navigate = useNavigate();
  const [categoryItems, setCategoryItems] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const { sethomeSubCategoriesId, homeSubCategoriesId, sethomeSubCategoriesTitle, setShowMegaMenu } = usePopup();
  const { globalSettings } = useheaderFooter();
  // const [currentImgIndex, setCurrentImgIndex] = useState(0);
  // const [fade, setFade] = useState(false);
  // const randomTime = Math.floor(Math.random() * (5 - 3 + 1)) + 3;

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const ApiParams = {
      hide_empty: true,
      limit: 50,
      with: "thumbnail,have_sub_categories",
      ids: globalSettings?.header_categories?.split(',')
    }

    if (shopId !== null) ApiParams.shop_id = shopId;

    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', ApiParams);

    if (data) {
      const headerCategoriesArray = globalSettings?.header_categories?.split(',') || [];
      const sortedCategories = data?.product_attribute?.attribute_items?.product_attribute_items?.sort((a, b) => {
        return headerCategoriesArray.indexOf(a.id.toString()) - headerCategoriesArray.indexOf(b.id.toString());
      });
      setCategoryItems(sortedCategories);
      // setCategoryItems([...sortedCategories, ...sortedCategories]);
      localStorage.setItem('home-categories', JSON.stringify(sortedCategories));
    }

    if (error) {
      console.error(error);
      setCategoryItems([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setFade(true);
  //     setTimeout(() => {
  //       setCurrentImgIndex((prevIndex) => (prevIndex + 1) % data?.img?.length);
  //       setFade(false);
  //     }, 500);
  //   }, randomTime * 1000);

  //   return () => clearInterval(intervalId);
  // }, [data?.img?.length, randomTime]);
  // const currentImg = data?.img[currentImgIndex];
  // const currentImg = catIcon;

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (globalSettings?.header_categories?.split(',')?.length > 0) {
      fetchCategories();
    }
  }, [globalSettings?.header_categories?.split(',')?.length > 0]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const HomeCategories = localStorage.getItem('home-categories');

    if (HomeCategories) {
      setCategoryItems(JSON.parse(HomeCategories));
    }
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  const renderCategoryItem = (categoryItem, i) => (
    <SwiperSlide key={i}>
      <div
        className={`all-category-slider-single-item ${homeSubCategoriesId === categoryItem?.id ? 'selected' : ''}`}
        onClick={() => {
          // window.innerWidth <= 500 ?
          // :
          navigate(categoryItem?.post_type === "product" ? `/shop/${categoryItem?.slug}` : categoryItem?.post_type === "car" ? `/cars/${categoryItem?.slug}` : "/global/products");
          setShowMegaMenu(false)
          // sethomeSubCategoriesId(categoryItem?.id); sethomeSubCategoriesTitle(categoryItem?.name)
        }}
      >
        <div className="all-category-item-img-box">
          {categoryItem?.thumbnail ? (
            <ImageWithFallback width={120} height={120} loading="lazy" url={categoryItem?.thumbnail?.media?.optimized_media_cdn_url} name={categoryItem?.name} />
          ) : (
            <Skeleton style={{ borderRadius: '100%' }} height={90} width={90} />
          )}
        </div>
        <p className="category-name">
          {categoryItem?.name ?? <Skeleton width={80} />}
        </p>
      </div>
    </SwiperSlide>
  );

  /* --------------------------------------------- X -------------------------------------------- */

  const swiperProps = {
    freeMode: true,
    className: "sub-categories-slider",
    style: { marginBottom: '25px' },
    grid: {
      fill: 'row',
      rows: 2
    },
    modules: [Grid, Autoplay, FreeMode],
    breakpoints: {
      300: {
        slidesPerView: 4,
        spaceBetween: 20,
        modules: [Grid, Autoplay, FreeMode],
      },
      640: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 6,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 7,
        spaceBetween: 30,
      },
      1250: {
        slidesPerView: 10,
        spaceBetween: 30,
      },
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    categoryItems &&
    (<div className="wrapper all-category-container">
      {/* <div className="all-category-heading-row">
        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{window.innerWidth > 500 ? "All" : <img style={{ width: '20px', height: '20px' }} src={CatIcon} />} Categories</p>
      </div> */}
      <div className="all-category-slider-container">
        <Swiper {...swiperProps}>
          <SwiperSlide>
            <div
              className={`all-category-slider-single-item ${homeSubCategoriesId === null ? 'selected' : ''}`}
              onClick={() => {
                // window.innerWidth <= 500 ?
                navigate(`/global/products`)
                setShowMegaMenu(false)
                // :
                // sethomeSubCategoriesId(null)
              }}>
              <div className="all-category-item-img-box">
                <img loading="lazy" width={120} height={120} src={globalSettings?.all_categories_image_url ?? AllCategoriesIcon} alt="All categories" />
              </div>
              <p> All Categories</p>
            </div>
          </SwiperSlide>
          {categoryItems?.map(renderCategoryItem)}
        </Swiper>
      </div>
    </div>)
  );
}

export default AllCategories;
