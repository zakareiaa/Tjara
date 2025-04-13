import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import SimpleBar from 'simplebar-react';

import PRODUCTS from "@client/productsClient";
import ProductsFeature from "../ProductCard";
import { fixUrl, formatPrice } from "@helpers/helpers";
import { useheaderFooter } from "@contexts/globalHeaderFooter";

import cartIcon from "@assets/cartPlusIcon.svg"

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'simplebar';
import 'simplebar/dist/simplebar.min.css';
import "./style.css"
import { Zap } from "lucide-react";
import { getOptimizedThumbnailUrl } from "../../helpers/helpers";
import Skeleton from "react-loading-skeleton";

const index = ({ shopId = null }) => {
  const { globalSettings } = useheaderFooter();
  const [onSaleProducts, setOnSaleProducts] = useState([]);
  const navigate = useNavigate();
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchOnSaleProducts = async () => {
    const superDealProductSortedIDs = globalSettings?.super_deals_products_sort_order?.split(',');
    const params = {
      with: "thumbnail,shop",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          // {
          //   column: 'sale_price',
          //   value: 1,
          //   operator: '>',
          // },
          {
            column: 'is_deal',
            value: '1',
            operator: '=',
          },
          {
            column: 'status',
            operator: '=',
            value: 'active',
          }
        ]
      },
      // filterByDiscount: globalSettings?.website_deals_percentage,
      orderBy: "ids",
      order: superDealProductSortedIDs,
      ids: superDealProductSortedIDs,
      per_page: 20,
    };

    if (shopId !== null) params.filterByColumns.columns.push({ column: 'shop_id', operator: '=', value: shopId, });

    const { data, error } = await PRODUCTS.getProducts(params);
    if (data) setOnSaleProducts(data.products.data);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const swiperProps = {
    freeMode: true,
    className: "feature-products-items-container",
    modules: [FreeMode],
    breakpoints: {
      640: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 7,
        spaceBetween: 20,
      },
      1250: {
        slidesPerView: 10,
        spaceBetween: 20,
      },
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const renderSuperDealSlide = (e, i) => (
    <SwiperSlide key={i}>
      <div onClick={() => navigate(`/product/${e?.slug}`)} key={i} className="product" style={{ display: 'inline-block', marginRight: '10px' }} >
        <div style={{ position: 'relative' }}>
          <img src={getOptimizedThumbnailUrl(e?.thumbnail)} alt="" />
          {e?.sale_price > 0 && (
            <p style={{ position: 'absolute', bottom: '2px', width: '100%', background: '#3f7b4b', color: 'white', fontSize: '10px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 0 8px 8px' }} className="sale-text">
              {(((e?.price - e?.sale_price) / e?.price) * 100).toFixed(2)}% Off
            </p>
          )}
        </div>
        <div className="details">
          {e?.product_type == 'variable' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', }}>
              <h2 style={{ marginRight: '5px' }} className="product-feature-single-original-price">{formatPrice(e?.min_price)}</h2>
              -
              <h2 style={{ marginLeft: '5px' }} className="product-feature-single-original-price">{formatPrice(e?.max_price)}</h2>
            </div>
          ) : (
            <div>
              {e?.sale_price > 0 ? (
                <h2 className="product-feature-single-original-price">{formatPrice(e?.sale_price)}</h2>
              ) : null}
            </div>
          )}
          <p>{e?.meta?.sold ?? 0} Sold</p>
        </div>
      </div>
    </SwiperSlide>
  );

  /* --------------------------------------------- X -------------------------------------------- */

  const renderSuperDealItem = (e, i) => (
    <div onClick={() => navigate(`/product/${e?.slug}`)} key={i} className="product" style={{ display: 'inline-block', marginRight: '10px' }} >
      <div style={{ position: 'relative' }}>
        <img src={getOptimizedThumbnailUrl(e?.thumbnail)} alt="" />
        {e?.sale_price > 0 && (
          <p style={{ position: 'absolute', bottom: '2px', width: '100%', background: '#3f7b4b', color: 'white', fontSize: '10px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 0 8px 8px' }} className="sale-text">
            {(((e?.price - e?.sale_price) / e?.price) * 100).toFixed(2)}% Off
          </p>
        )}
      </div>
      <div className="details">
        {e?.product_type == 'variable' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', }}>
            <h2 style={{ marginRight: '5px' }} className="product-feature-single-original-price">{formatPrice(e?.min_price)}</h2>
            -
            <h2 style={{ marginLeft: '5px' }} className="product-feature-single-original-price">{formatPrice(e?.max_price)}</h2>
          </div>
        ) : (
          <div>
            {e?.sale_price > 0 ? (
              <h2 className="product-feature-single-original-price">{formatPrice(e?.sale_price)}</h2>
            ) : null}
          </div>
        )}
        <p>{e?.meta?.sold ?? 0} Sold</p>
      </div>
    </div>
  );

  /* --------------------------------------------- Timer -------------------------------------------- */

  const calculateTimeLeft = () => {
    // Define the daily reset time (e.g., midnight)
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(24, 0, 0, 0); // Set to midnight of the next day

    const difference = resetTime - now;

    if (difference > 0) {
      setTimeLeft({
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      });
    } else {
      // Reset the timer
      setTimeLeft({
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchOnSaleProducts()
  }, [globalSettings?.super_deals_products_sort_order]);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`active saleproducts feature-products lightningProducts`}>
      <div className={` feature-products-container`}>
        <div className="feature-products-container-heading-row">
          <div className="feature-product-heading-name">
            <Zap size={20} />
            Super Deals
            <div className="timer">
              <p className="timer-heading">Ends In:</p>
              <div className="countdown">
                <div className="time-box">
                  {timeLeft.hours}
                  {/* <small>Hrs</small> */}
                </div>
                <span className="seprator">:</span>
                <div className="time-box">
                  {timeLeft.minutes}
                  {/* <small>Mins</small> */}
                </div>
                <span className="seprator">:</span>
                <div className="time-box">
                  {timeLeft.seconds}
                  {/* <small>Sec</small> */}
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/global/products?filter_by_column=hot_deals')}>View All</button>
        </div>
        {windowsWidth > 700 ? onSaleProducts?.length > 0 ?
          (<div style={{ width: '100%', overflow: 'hidden' }}>
            <Swiper {...swiperProps}>
              {onSaleProducts?.map(renderSuperDealSlide)}
            </Swiper>
          </div>)
          :
          (<div style={{ width: '100%', overflow: 'hidden', display: 'flex', }}>
            {Array(15).fill(0).map((_, i) => (
              <div key={i} className="product" style={{ marginRight: '15px' }}>
                <Skeleton width={140} height={130} />
              </div>
            ))}
          </div>)
          : onSaleProducts?.length > 0 ?
            (<div style={{ width: '100%', overflow: 'hidden' }}>
              <SimpleBar className="feature-products-items-container" style={{ whiteSpace: 'nowrap' }}>
                {onSaleProducts?.map(renderSuperDealItem)}
              </SimpleBar>
            </div>)
            :
            (<div style={{ width: '100%', overflow: 'hidden', display: 'flex', }}>
              {Array(15).fill(0).map((_, i) => (
                <div key={i} className="product" style={{ marginRight: '15px' }}>
                  <Skeleton width={140} height={130} />
                </div>
              ))}
            </div>)
        }
      </div>
    </div>
  )
}

export default index