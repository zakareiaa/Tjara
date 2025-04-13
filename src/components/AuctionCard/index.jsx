// Modules
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
// import { toast } from "react-toastify";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
// Api Clients
// import CART_ITEMS from "../../client/cartItemsClient";
// import WISHLIST from "../../client/wishlistClient";
// Contexts
// import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";
// images
// import placeholder from "@assets/logo.svg";
import eyeImage from "../ProductCard/assets/eye.svg";
// import RatedStar from "../../assets/rated-star.svg";
import playVideo from "../../assets/productVideoPlay.png";
// import EmptyStar from "../../assets/empty-star.svg";
import { BadgeCheck } from 'lucide-react'
// helpers
import { daysLeft, fixUrl, formatPrice, getOptimizedThumbnailUrl, getOptimizedVideoUrl, isVideo, renderStars } from "../../helpers/helpers";
// css
import 'swiper/css';
import 'swiper/css/autoplay';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-loading-skeleton/dist/skeleton.css';
import "./style.css";

const index = ({ detail, isDragging }) => {
    const navigate = useNavigate();
    const { showPopup } = usePopup();
    const videoRef = useRef(null);

    /* --------------------------------------------- X -------------------------------------------- */

    const openPopup = (data, toggle) => {
        showPopup(data, toggle);
    };

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

    const hasVideo = detail?.video?.media?.url && detail?.video?.media?.url.trim() !== '';
    const videoSrc = getOptimizedVideoUrl(detail?.video);
    const containerClass = `${hasVideo ? 'has-video' : ''}`;

    /* -------------------------------------------------------------------------------------------- */
    /*                                               X                                              */
    /* -------------------------------------------------------------------------------------------- */

    return (
        detail && (
            <div className="auction-card-component auction-product-container-items-single">
                <div className={`cardTop ${containerClass}`}>
                    {/* ------------------------------------------------------------------------------------ */}
                    {/*                                  Video Or Thumbnail                                  */}
                    {/* ------------------------------------------------------------------------------------ */}
                    <LazyLoadImage
                        effect="blur"
                        placeholderSrc={<Skeleton height={200} width="100%" />}
                        className={`product-image ${detail?.thumbnail?.media?.url ? 'loaded' : 'loading'}`}
                        // onClick={() => window.open(`/product/${detail?.slug}`, "_blank")}
                        onClick={() => navigate(`/product/${detail?.slug}`)}
                        src={getOptimizedThumbnailUrl(detail?.thumbnail) || <Skeleton height={200} width="100%" />}
                        style={detail?.thumbnail?.media?.url ? {} : { objectFit: "contain", objectPosition: "center" }}
                        alt={detail?.name || "Product Image"}
                    />
                    {/* ------------------------------------------------------------------------------------ */}
                    {/*                                         Video                                        */}
                    {/* ------------------------------------------------------------------------------------ */}
                    {(hasVideo) && (
                        <video muted className="product-image product-video" disablePictureInPicture
                            // onClick={() => window.open(`/product/${detail?.slug}`, "_blank")} 
                            onClick={() => navigate(`/product/${detail?.slug}`)}
                            ref={videoRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} src={videoSrc} />
                    )}
                    {/* ------------------------------------------------------------------------------------ */}
                    {/*                                      Video Icon                                      */}
                    {/* ------------------------------------------------------------------------------------ */}
                    {(hasVideo) && (
                        <div className="product-thumbnail">
                            <img src={playVideo} alt="Play video icon" style={{ position: "absolute", bottom: "31px", right: "3px", width: '25px' }} />
                        </div>
                    )}
                    {/* ------------------------------------------------------------------------------------ */}
                    {/*                                    Quick View Tag                                    */}
                    {/* ------------------------------------------------------------------------------------ */}
                    {window.innerWidth > 500 && <p className="QuickView" onClick={() => openPopup(detail?.id, true)}>Quick View</p>}
                    {/* ------------------------------------------------------------------------------------ */}
                    {/*                                       Sale Tag                                       */}
                    {/* ------------------------------------------------------------------------------------ */}
                    {detail?.sale_price ? (
                        <span className="sale-product-heading">Sale</span>
                    ) : null}
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
                    <div className="bottomText" style={{ color: '#fff' }}>
                        {renderBottomText()}
                    </div>
                </div>
                <div className="cardBottom">
                    <div className="product-feature-single-store-name-row">
                        <Link className="product-feature-single-store-name" to={`/store/${detail?.shop?.shop?.slug}`}>
                            {detail?.is_discount_product == true ? (
                                <div className="tooltip-container" >
                                    <BadgeCheck style={{ stroke: 'var(--main-red-color)', }} title={'Tjara Club Product'} size={20} />
                                    <span className="tooltip">Tjara Club Premium product</span>
                                </div>
                            ) : null}
                            {detail?.shop?.shop?.name ? `${detail?.shop?.shop?.name?.substring(0, 8)}...` : <Skeleton width={50} />}
                        </Link>
                        <div className="views-count">
                            <img src={eyeImage} alt="view icon" className="view-icon" />
                            <p className="view-count">{detail?.meta?.views > 0 ? detail?.meta?.views : 0}</p>
                        </div>
                    </div>
                    <a className="product-feature-single-product-name" /* onClick={() => window.open(`/product/${detail?.slug}`, "_blank")} */ onClick={() => navigate(`/product/${detail?.slug}`)}>
                        {detail?.name ? detail?.name : <Skeleton width={150} />}
                    </a>
                    <div className="product-feature-single-price">
                        {detail?.sale_price > 0 ? (
                            <>
                                <span className="product-feature-single-discounted-price">
                                    {detail?.price ? formatPrice(detail?.price) : <Skeleton width={50} />}
                                </span>
                                <span className="product-feature-single-original-price auction-product-price">
                                    {detail?.sale_price ? formatPrice(detail?.sale_price) : <Skeleton width={50} />}
                                </span>
                            </>
                        ) : (
                            <span className="product-feature-single-original-price auction-product-price">
                                {detail?.price ? formatPrice(detail?.price) : <Skeleton width={50} />}
                            </span>
                        )}
                    </div>
                    <div className="auction-product-action-bid">
                        <div className='auction-end-time'>
                            <p>Auction End:</p>
                            <p className="auction-product-days-left">{detail?.auction_end_time ? daysLeft(detail?.auction_end_time) : <Skeleton width={50} />}</p>
                        </div>
                        <div className='auction-bids-count'>
                            <p>Bids:</p>
                            <p className="product-feature-days-left">{detail?.bids?.bids?.length ?? "No Bids Placed"}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default index