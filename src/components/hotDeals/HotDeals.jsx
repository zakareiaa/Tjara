import React, { useEffect, useRef, useState } from "react";
import "./HotDeals.css";
import DealOneImg from "./assets/deal-one.png";
import DealOneStoreImg from "./assets/deal-one.png";
import loadingGif from "@assets/loading.gif"
import PRODUCTS from "@client/productsClient";
import { useNavigate } from "react-router-dom";
import { fixUrl, formatPrice, getOptimizedThumbnailUrl } from "../../helpers/helpers";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import eyeImage from "./assets/eye.svg";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SectionHeading from "../ui/SectionHeading";

function HotDeals({ ids, className }) {
  const { globalSettings } = useheaderFooter();
  const componentRef = useRef()
  const [items, setitems] = useState([{}, {}]);
  const navigate = useNavigate();
  const [totalItems, settotalItems] = useState(null)
  const [currentPage, setcurrentPage] = useState(1)
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const [IsInitial, setIsInitial] = useState(true);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchHotDeals = async () => {
    const ApiParams = {
      ids: ids,
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
            value: 1,
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
      with: "thumbnail,shop",
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: 2,
    }

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setitems(data.products.data);
        setIsInitial(false);
      } else {
        setitems([...items, ...data.products.data]);
      }
      settotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreDeals = async () => {
    setcurrentPage(currentPage + 1);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchHotDeals()
  }, [currentPage])

  /* --------------------------------- XINFINITE SCROLL FUNCTION -------------------------------- */

  useEffect(() => {
    if (windowsWidth <= 500) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchMoreDeals()
          setTimeout(() => {
          }, 3000);
        }
      });
      if (componentRef.current) {
        observer.observe(componentRef.current);
      }
      return () => {
        if (componentRef.current) {
          observer.unobserve(componentRef.current);
        }
      };
    }
  }, [items]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`hot-deal-container wrapper ${className}`}>
      <div className="feature-products-container-heading-row">
        <SectionHeading heading="Hot Deals" />
        <button onClick={() => navigate('/global/products?filter_by_column=hot_deals')}>View All</button>
      </div>
      <div className="hot-deal-box-container">
        {items?.map((e, i) => {
          return (
            <div key={i} className="hot-deal-box">
              <div className="hot-deal-box-top" style={{ position: "relative" }}>
                <img onClick={() => navigate(`/product/${e?.slug}`)} className="hot-deal-img" src={getOptimizedThumbnailUrl(e?.thumbnail) ?? DealOneImg} alt="" />
                {e?.sale_price > 0 && <p className="bottomText">{(((e?.price - e?.sale_price) / e?.price) * 100).toFixed(2)}% Off</p>}
              </div>
              <div className="hot-deal-right">
                <div className="hot-deal-days-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '10px' }}>Limited time offer
                  <div className="views-count" style={{ gap: '5px', display: 'flex', alignItems: 'center' }}>
                    <img src={eyeImage} width={18} height={18} alt="" className="view-icon" />
                    <p style={{ fontSize: '12px' }} className="view-count">{e?.meta?.views > 0 ? e?.meta?.views : 0}</p>
                  </div>
                </div>

                <div className="hot-deal-store-detail">
                  <img className="hot-deal-store-img" src={getOptimizedThumbnailUrl(e?.shop?.shop?.thumbnail) ?? DealOneStoreImg} alt="" />
                  {e?.shop?.shop?.name ? <p className="hot-deal-store-name"> {e?.shop?.shop?.name ?? "Tjara Store"} </p> : <Skeleton width={50} />}
                </div>

                {e?.name ? <p className="hot-deal-title"> {e?.name ?? "Tjara Child's Day Giveaway"} </p> : <Skeleton width={150} />}

                <div className="hot-deal-description" dangerouslySetInnerHTML={{ __html: e?.description }} />

                <div className="hot-deal-price-row">
                  {e?.product_type == 'variable' ? (
                    <div>
                      <>
                        <span style={{ marginRight: '5px' }} className="hot-deal-discounted-price">{formatPrice(e?.min_price)}</span>
                        -
                        <span style={{ marginLeft: '5px' }} className="hot-deal-discounted-price">{formatPrice(e?.max_price)}</span>
                      </>
                    </div>
                  ) : (
                    <div>
                      {e?.sale_price > 0 ? (
                        <>
                          <span className="hot-deal-original-price">{formatPrice(e?.price)}</span>
                          <span style={{ marginLeft: "5px" }} className="hot-deal-discounted-price">{formatPrice(e?.sale_price)}</span>
                        </>
                      ) : (
                        <span className="hot-deal-original-price">{formatPrice(e?.price)}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="hot-deal-btn-row ">
                  {e?.slug ? <button className="button" onClick={() => navigate(`/product/${e?.slug}`)}>Buy Now</button> : <Skeleton width={100} height={40} />}
                </div>
              </div>
            </div>
          );
        })}
        {windowsWidth <= 500 && items?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
      </div>
      {windowsWidth > 500 && items?.length < totalItems && <div className="load-more-btn-row">
        <button className="button" onClick={fetchMoreDeals}>Load More</button>
      </div>}
    </div>
  )
}

export default HotDeals;
