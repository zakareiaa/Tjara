import React, { useState, useEffect, useRef } from "react";
import PRODUCT_ATTRIBUTE_ITEMS from '@client/productAttributeItemsClient'
import { usePopup } from "../DataContext";
import { fixUrl } from "../../helpers/helpers";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode } from 'swiper/modules';
import Skeleton from "react-loading-skeleton";
import "./CategoryProducts.css";
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

function CategoryProducts() {
  const componentRef = useRef(null);
  const { homeSubCategoriesId, homeSubCategoriesTitle } = usePopup();
  const [homeSubcategories, setHomeSubcategories] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchSubCategories = async () => {
    const ApiParams = {
      attribute_slug: 'categories',
      with: 'thumbnail',
      parent_id: homeSubCategoriesId,
      limit: 50,
      hide_empty: true,
    }

    const { data, error } = await PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItems(ApiParams);

    if (data) {
      setHomeSubcategories(data.product_attribute_items);
      localStorage.setItem('home-sub-categories', JSON.stringify(data.product_attribute_items));
    }

    if (error) {
      console.error(error);
      setHomeSubcategories([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  function chunkArray(array, rows) {
    const chunkSize = Math.ceil(array.length / rows);
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  /* --------------------------------------------- X -------------------------------------------- */

  let slides = homeSubcategories ? homeSubcategories.length > 20 ? chunkArray(homeSubcategories, 2) : chunkArray(homeSubcategories, 1) : [];

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchSubCategories();
  }, [homeSubCategoriesId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const HomeSubCategories = localStorage.getItem('home-sub-categories');

    if (HomeSubCategories) {
      setHomeSubcategories(JSON.parse(HomeSubCategories));
    }
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div ref={componentRef}>
      {homeSubcategories &&
        <div className="category-product-container">
          <div className="topHeading">
            <p className="categoty-product-category-name">More in {homeSubCategoriesTitle ? homeSubCategoriesTitle : 'Bags, Shoes & Accessories'}</p>
            <p className="categoty-product-category-desc" style={{ marginTop: '10px' }}>Look through our top categories with thousands of products.</p>
          </div>
          <div className="category-product-items-container">
            <div className="carousel-container">
              <div className={`carousel-track`}>
                {slides?.map((slide, slideIndex) => (
                  <div key={slideIndex} className="slide">
                    {slide?.map((item, itemIndex) => (
                      <Link to={`/shop/${item?.slug}`} key={itemIndex} className="category-product-single-item">
                        {item?.thumbnail ? (
                          <ImageWithFallback
                            url={item?.thumbnail?.media?.url}
                            name={item?.name}
                          />
                        ) : (
                          <Skeleton style={{ borderRadius: '100%' }} height={90} width={90} />
                        )}
                        <p className="category-name">{item?.name ?? <Skeleton width={80} />}</p>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="category-product-items-container">
            <Swiper
              slidesPerView={5}
              spaceBetween={30}
              speed={5000}
              freeMode={true}
              modules={[Autoplay, FreeMode]}
              className="sub-categories-slider"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                400: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 8,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 10,
                  spaceBetween: 50,
                },
              }}>
              {homeSubcategories.map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    <Link to={`/shop/${item?.slug}`} key={i} className="category-product-single-item" style={{ display: "flex", flexDirection: 'column' }}>
                      <img src={fixUrl(item.thumbnail?.media?.url) ?? Borjan} alt={item.name} />
                      <p>{item?.name ?? 'Category'}</p>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div> */}
        </div>
      }
    </div >
  );
}

export default CategoryProducts;
