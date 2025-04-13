// Modules
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// components
import CART_ITEMS from "../../client/cartItemsClient";
import WISHLIST from "../../client/wishlistClient";
import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";
import ProductCardNotice from "../ProductCardNotice";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { createNavigationHandler, daysLeft, fixUrl, formatPrice, getOptimizedThumbnailUrl, getOptimizedVideoUrl, isVideo, renderStars } from "../../helpers/helpers";
// images
import placeholder from "@assets/logo.svg";
import eyeImage from "./assets/eye.svg";
import RatedStar from "../../assets/rated-star.svg";
import playVideo from "../../assets/productVideoPlay.png";
import EmptyStar from "../../assets/empty-star.svg";
import { BadgeCheck } from 'lucide-react'
// css
import 'swiper/css';
import 'swiper/css/autoplay';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-loading-skeleton/dist/skeleton.css';
import "./style.css";

function ProductsFeature({ detail, isWishlist = false, wishlistItemId, onDeleteWishlist }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { showPopup, setProductDetails, setopenSigninPopup, setFetchWishlistItems, fetchWishlistItemsCount, cartsItemCount } = usePopup();
  const [cartTotal, setCartTotal] = useState(0);
  const [showCartToss, setShowCartToss] = useState(false);
  const cartTossWrapperRef = useRef(null);
  const [transformDistanceY, settransformDistanceY] = useState(0);
  const [transformDistanceX, settransformDistanceX] = useState(0);
  const [UserNotFound, setUserNotFound] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const { currentUser } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { globalSettings } = useheaderFooter();

  /* --------------------------------------------- X -------------------------------------------- */

  const openPopup = (data, toggle) => {
    setProductDetails({});
    showPopup(data, toggle);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setCartItem({ product_id: detail?.id, shop_id: detail?.shop_id, quantity: 1 });
  }, [detail]);

  /* --------------------------------------------- X -------------------------------------------- */

  const addToCart = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setopenSigninPopup(true);
      return
    }
    const { data, error } = await CART_ITEMS.createCartItem(cartItem);

    if (data) {
      toast.success(data.message);
      setCartTotal((prevTotal) => prevTotal + 1);

      setShowCartToss(true);
      const cartTossWrapper = cartTossWrapperRef.current;
      let { top, right, width, height } = cartTossWrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      let transformDistanceX;
      let transformDistanceY;
      if (viewportWidth < 1024) {
        // Move to the bottom
        transformDistanceY = viewportHeight - (top + height + 14);
        transformDistanceX = (viewportWidth / 2) - ((right - 50) - (width / 2)) - (width / 2);
      } else {
        // Move to the top
        transformDistanceY = -top - 14;
        transformDistanceX = viewportWidth - (right + 60);
      }
      settransformDistanceY(transformDistanceY);
      settransformDistanceX(transformDistanceX);

      setTimeout(() => {
        setShowCartToss(false);
        setCartTotal((prevTotal) => prevTotal);
      }, 750);

      setTimeout(() => {
        settransformDistanceY(0);
        settransformDistanceX(0);
      }, 1000);

      cartsItemCount();
    }

    if (error.data.message == "User id not found, please login first!") {
      setopenSigninPopup(true);
    } else if (error) {
      toast.error(error.data.message)
    };
  };


  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Delete Cart Item                                 */
  /* -------------------------------------------------------------------------------------------- */

  const deleteWishlist = async (e) => {
    e.preventDefault();
    const { data, error } = await WISHLIST.deleteWishlistItem(wishlistItemId);
    if (data) {
      setFetchWishlistItems(data.wishlistItems);
      onDeleteWishlist(wishlistItemId);
      fetchWishlistItemsCount();
      toast.success(data.message);
    }
    if (error) toast.error(error.message);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  // const renderStars = (rating) => {
  //   let stars = [];
  //   for (let i = 1; i <= rating; i++) {
  //     stars.push(<img src={i <= rating ? RatedStar : EmptyStar} alt={`${i <= rating ? "rated" : "empty"} star`} key={i} />);
  //   }
  //   return stars;
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleMouseEnter = () => {
    videoRef.current.play();
  };
  const handleMouseLeave = () => {
    videoRef.current.pause();
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const renderBottomText = () => {
    if (detail?.product_type === "auction") {
      return <p className="product-feature-days-left">{daysLeft(detail?.auction_end_time)}</p>;
    }

    if (detail?.sale_price > 0) {
      const discountPercentage = ((detail?.price - detail?.sale_price) / detail?.price * 100).toFixed(2);
      return <p className="product-meta off">{discountPercentage}% Off</p>;
    }

    else if (detail?.variations && detail?.variations?.product_variations?.some(v => v.sale_price > 0)) {
      const maxDiscount = detail.variations.product_variations.reduce((max, v) => {
        if (v.sale_price > 0) {
          const discount = ((v.price - v.sale_price) / v.price * 100).toFixed(2);
          return Math.max(max, discount);
        }
        return max;
      }, 0);

      if (maxDiscount > 0) {
        return <p className="product-meta off">{maxDiscount}% Off</p>;
      }
    }

    if (detail?.product_group !== "car" && detail?.stock === 0) {
      return <p className="product-meta sold-out">Sold Out!</p>;
    }

    if (detail?.product_group !== "car" && detail?.stock <= 4 && detail?.stock !== 0) {
      return <p className="product-meta almost-sold-out">Almost Sold Out!</p>;
    }

    if (detail?.product_group !== "car" && detail?.meta?.sold) {
      return <p className="product-meta items-sold">({detail?.meta?.sold}) Items Sold</p>;
    }

    return null;
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const renderStockOrRecentBuyer = () => {

    const productDiscount = detail?.product_type == "variable" && detail?.variations?.product_variations?.some(v => v?.sale_price > 0) ? detail.variations.product_variations.reduce((max, v) => {
      if (v?.sale_price > 0) {
        const discount = ((v.price - v.sale_price) / v.price * 100).toFixed(2);
        return Math.max(max, discount);
      }
      return max;
    }, 0) : detail?.product_type == "simple" && detail?.sale_price > 0 ? ((detail?.price - detail?.sale_price) / detail?.price * 100).toFixed(2) : null;

    const notices = [
      detail?.product_type === "auction"
        ? { text: daysLeft(detail?.auction_end_time), className: "product-feature-days-left" }
        : null,
      productDiscount
        ? { text: `${productDiscount}% Off`, className: "product-meta off" }
        : null,
      detail?.product_group !== "car" && detail?.stock === 0
        ? { text: "Sold Out!", className: "product-meta sold-out" }
        : null,
      detail?.product_group !== "car" && detail?.stock <= 4 && detail?.stock !== 0
        ? { text: "Almost Sold Out!", className: "product-meta almost-sold-out" }
        : null,
      detail?.product_group !== "car" && detail?.meta?.sold
        ? { text: `(${detail?.meta?.sold}) Items Sold`, className: "product-meta items-sold" }
        : null,
      detail?.meta?.recent_buyer
        ? { text: detail.meta.recent_buyer, className: "product-notice recent-buyer" }
        : null
    ].filter(Boolean);

    if (notices.length === 0) return null;

    return (
      <div style={{ height: '20px', overflow: 'hidden', pointerEvents: "none", touchAction: "auto" }}>
        <Swiper
          direction="vertical"
          modules={[Autoplay]}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          spaceBetween={10}
          slidesPerView={1}
          loop={notices.length > 1}
          className="vertical-notice-slider"
        >
          {notices.map((notice, index) => (
            <SwiperSlide key={index}>
              <p className={`product-notice ${notice.className}`} style={{ margin: 0 }}>
                {notice.text}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };


  /* --------------------------------------------- X -------------------------------------------- */

  const hasVideo = detail?.video?.media?.url && detail?.video?.media?.url.trim() !== '';
  const videoSrc = getOptimizedVideoUrl(detail?.video);
  const containerClass = `${hasVideo ? 'has-video' : ''}`;

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    detail && (
      <div className="product-card-component feature-products-items-single" >
        <div className={`cardTop ${containerClass}`}>
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                  Video Or Thumbnail                                  */}
          {/* ------------------------------------------------------------------------------------ */}
          <LazyLoadImage
            effect="blur"
            /* width={254}
            height={228} */
            loading="lazy"
            placeholderSrc={{/* <Skeleton height={200} width="100%" /> */ }}
            className={`product-image ${detail?.thumbnail?.media?.url ? 'loaded' : 'loading'}`}
            onClick={createNavigationHandler(`/product/${detail?.slug}`, navigate)}
            src={getOptimizedThumbnailUrl(detail?.thumbnail) || <Skeleton height={200} width="100%" />}
            // style={detail?.thumbnail?.media?.url ? {} : { objectFit: "contain", objectPosition: "center" }}
            alt={detail?.name || 'Product Image'}
          />
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                         Video                                        */}
          {/* ------------------------------------------------------------------------------------ */}
          {(hasVideo) && (
            <video muted className="product-image product-video"
              disablePictureInPicture
              // onClick={() => window.open(`/product/${detail?.slug}`, "_blank")}
              // onClick={() => navigate(`/product/${detail?.slug}`)}
              onClick={createNavigationHandler(`/product/${detail?.slug}`, navigate)}
              ref={videoRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} src={videoSrc}
            />
          )}
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                      Video Icon                                      */}
          {/* ------------------------------------------------------------------------------------ */}
          {(hasVideo) && (
            <div className="product-thumbnail">
              <img src={playVideo} alt="Video play icon" style={{ position: "absolute", bottom: "31px", right: "3px", width: '25px' }} />
            </div>
          )}
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                    Quick View Tag                                    */}
          {/* ------------------------------------------------------------------------------------ */}
          {window.innerWidth > 500 && <p className="QuickView" onClick={() => openPopup(detail?.id, true)}>Quick View</p>}
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                       Sale Tag                                       */}
          {/* ------------------------------------------------------------------------------------ */}
          {detail?.product_type === 'simple' ?
            (detail?.sale_price ? (
              <span className="sale-product-heading">Sale</span>
            ) : null)
            :
            (detail?.variations && detail?.variations?.product_variations.some(v => v.sale_price > 0) ? (
              <span className="sale-product-heading">Sale</span>
            ) : null)
          }
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                      Badge Tag                                       */}
          {/* ------------------------------------------------------------------------------------ */}
          {/* {detail?.is_discount_product == true ? (
            <div className="tooltip-container" style={{ position: 'absolute', bottom: '30px', left: '2%' }}>
              <BadgeCheck
                style={{
                  stroke: 'var(--main-green-color)',
                  fill: 'var(--main-red-color)'
                }}
                title={'Tjara Club Product'}
                size={20}
              />
              <span className="tooltip">Tjara Club Premium product</span>
            </div>
          ) : null} */}
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                     Featured Tag                                     */}
          {/* ------------------------------------------------------------------------------------ */}
          {detail?.is_featured ? (
            <span className="feature-product-heading">Featured</span>
          ) : detail?.meta?.is_featured === '1' ? (
            <span className="feature-product-heading">Featured</span>
          ) : null}
          {/* ------------------------------------------------------------------------------------ */}
          {/*                                    Green Meta Text                                   */}
          {/* ------------------------------------------------------------------------------------ */}
          <div className="bottomText" style={{ color: '#fff', opacity: renderBottomText() ? '1' : '0' }}>
            {renderBottomText()}
          </div>
        </div>
        <div className="cardBottom">
          <div className="product-feature-single-store-name-row">
            <Link className="product-feature-single-product-name" to={`/store/${detail?.shop?.shop?.slug}`}>
              {detail?.is_discount_product == true ? (
                <div className="tooltip-container" >
                  <BadgeCheck style={{ stroke: 'var(--main-red-color)' }} title={'Tjara Club Product'} size={20} />
                  <span className="tooltip">Tjara Club Premium product</span>
                </div>
              ) : null}
              {detail?.shop?.shop?.name ? `${detail?.shop?.shop?.name?.substring(0, 8)}...` : <Skeleton width={50} />}
            </Link>
            <div className="ratings">
              <div className="rating-stars">{detail?.rating ? renderStars(detail?.reviews?.reviews?.average_rating, RatedStar, EmptyStar) : <Skeleton width={100} />}</div>
              <p className="rating-count">({detail?.rating?.length ?? '0'})</p>
            </div>
            <div className="views-count">
              <img src={eyeImage} alt="view-icon" className="view-icon" />
              <p className="view-count">{detail?.meta?.views > 0 ? detail?.meta?.views : 0}</p>
            </div>
          </div>

          {isWishlist == true && <button title="Remove from Wishlist" onClick={deleteWishlist} className="remove-from-wishlist">X</button>}

          <a className="product-feature-single-store-name" /* onClick={() => window.open(`/product/${detail?.slug}`, "_blank")} */ onClick={createNavigationHandler(`/product/${detail?.slug}`, navigate)}>
            {detail?.name ? detail?.name : <Skeleton width={150} />}
          </a>

          <div className="product-feature-single-price-row">
            <div className="product-feature-single-price">
              {detail?.product_type == 'variable' ? (
                <div>
                  <span className="product-feature-single-original-price">
                    {detail.min_price === detail.max_price ? (
                      formatPrice(detail.min_price)
                    ) : (
                      <>
                        <span style={{ marginRight: '5px' }}>{formatPrice(detail.min_price)}</span>
                        -
                        <span style={{ marginLeft: '5px' }}>{formatPrice(detail.max_price)}</span>
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <div>
                  {detail?.sale_price > 0 ? (
                    <>
                      <span className="product-feature-single-discounted-price">
                        {detail?.price ? formatPrice(detail?.price) : <Skeleton width={50} />}
                      </span>
                      <span className="product-feature-single-original-price">
                        {detail?.sale_price ? formatPrice(detail?.sale_price) : <Skeleton width={50} />}
                      </span>
                    </>
                  ) : (
                    <span className="product-feature-single-original-price">
                      {detail?.price ? formatPrice(detail?.price) : <Skeleton width={50} />}
                    </span>
                  )}
                </div>
              )}
              {/* add to cart or sold out */}
              {detail?.stock == 0 ?
                <p className="sold-out-txt">Sold Out</p>
                :
                detail?.product_type == "variable" || detail?.product_group === "car" ?
                  <p className="viewDetailsBtn" onClick={() => navigate(`/product/${detail?.slug}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512"><path fill="#d21642" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" /></svg>
                  </p>
                  :
                  <svg onClick={addToCart} className="feature-product-cart-btn" style={{ cursor: 'pointer' }} width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_333_15582)"><path d="M30.3043 16.3646C30.0933 16.1115 29.8292 15.9078 29.5307 15.7682C29.2322 15.6286 28.9066 15.5565 28.577 15.5569H16.451L16.4195 15.2936C16.3551 14.7464 16.0921 14.2419 15.6804 13.8757C15.2687 13.5096 14.737 13.3071 14.186 13.3069H14.0195C13.8206 13.3069 13.6299 13.3859 13.4892 13.5266C13.3485 13.6672 13.2695 13.858 13.2695 14.0569C13.2695 14.2558 13.3485 14.4466 13.4892 14.5872C13.6299 14.7279 13.8206 14.8069 14.0195 14.8069H14.186C14.3697 14.8069 14.547 14.8744 14.6843 14.9964C14.8216 15.1185 14.9093 15.2867 14.9308 15.4691L15.9628 24.2441C16.0699 25.1567 16.5084 25.9982 17.195 26.6089C17.8815 27.2196 18.7684 27.5569 19.6873 27.5569H27.5195C27.7184 27.5569 27.9092 27.4779 28.0499 27.3372C28.1905 27.1966 28.2695 27.0058 28.2695 26.8069C28.2695 26.608 28.1905 26.4172 28.0499 26.2766C27.9092 26.1359 27.7184 26.0569 27.5195 26.0569H19.6873C19.2231 26.0556 18.7706 25.9107 18.392 25.6422C18.0133 25.3736 17.727 24.9945 17.5723 24.5569H26.5123C27.3915 24.5569 28.2428 24.2481 28.9174 23.6842C29.592 23.1204 30.0471 22.3374 30.203 21.4721L30.7918 18.2066C30.8505 17.8826 30.8373 17.5497 30.7531 17.2314C30.6688 16.913 30.5156 16.6171 30.3043 16.3646ZM29.3195 17.9404L28.73 21.2059C28.6364 21.7256 28.3629 22.1959 27.9574 22.5343C27.552 22.8727 27.0404 23.0577 26.5123 23.0569H17.3338L16.628 17.0569H28.577C28.6872 17.0562 28.7962 17.0799 28.8962 17.1261C28.9962 17.1723 29.0848 17.24 29.1557 17.3243C29.2266 17.4087 29.278 17.5076 29.3063 17.6141C29.3346 17.7206 29.3391 17.832 29.3195 17.9404Z" fill="white" /><path d="M18.5195 31.3069C19.348 31.3069 20.0195 30.6353 20.0195 29.8069C20.0195 28.9785 19.348 28.3069 18.5195 28.3069C17.6911 28.3069 17.0195 28.9785 17.0195 29.8069C17.0195 30.6353 17.6911 31.3069 18.5195 31.3069Z" fill="white" /><path d="M26.0195 31.3069C26.848 31.3069 27.5195 30.6353 27.5195 29.8069C27.5195 28.9785 26.848 28.3069 26.0195 28.3069C25.1911 28.3069 24.5195 28.9785 24.5195 29.8069C24.5195 30.6353 25.1911 31.3069 26.0195 31.3069Z" fill="white" /></g><circle cx="22.2695" cy="22.3069" r="21" stroke="white" strokeWidth="2" /><defs><clipPath id="clip0_333_15582"><rect width="18" height="18" fill="white" transform="translate(13.2695 13.3069)" /></clipPath></defs></svg>
              }
              {/* cart count */}
              <div className={`${showCartToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={cartTossWrapperRef}>
                <div className="number">1</div>
              </div>
            </div>
          </div>
          {/* render stock or recent buyer */}
          <div className="product-notices-slider" style={{ color: "var(--main-red-color)", fontSize: "14px" }}>
            {renderStockOrRecentBuyer()}
          </div>
          {/* product-card-global-notice */}
          {globalSettings?.all_products_notice && (<ProductCardNotice noticeText={globalSettings?.all_products_notice} />)}
        </div>
      </div>
    )
  );
}

export default ProductsFeature;
