import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import Skeleton from "react-loading-skeleton";

import PRODUCT_BIDS from "../../client/productBidsClient";
import CART_ITEMS from "../../client/cartItemsClient";
import { expiryDate, fixUrl, formatPrice, isAuctionEnded, isVideo, renderStars } from "../../helpers/helpers";
import { usePopup } from "@components/DataContext";
import { useAuth } from "@contexts/Auth";

import RatedStar from "../../assets/rated-star.svg";
import loadingVideo from "../../assets/loadingVideo.gif";
import EmptyStar from "../../assets/empty-star.svg";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import "./ProductPerview.css";

function ProductPreview() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isPopupVisible, showPopup, productDetails, cartsItemCount, setopenSigninPopup } = usePopup();
  const [currentSelectedVariation, setcurrentSelectedVariation] = useState({})
  const [cartItem, setCartItem] = useState({});
  const [quantity, setquantity] = useState(1);
  const [canBid, setcanBid] = useState(true)
  const [bidAmount, setbidAmount] = useState("");
  const [VariationsArr, setVariationsArr] = useState([]);
  const [canAddToCart, setcanAddToCart] = useState(true);
  const [IsProductExpired, setIsProductExpired] = useState(false);
  const imageArray = [];
  let imageArrayLength = 0;
  const [CurrentVariationProduct, setCurrentVariationProduct] = useState({});
  const [showCartToss, setShowCartToss] = useState(false);
  const cartTossWrapperRef = useRef(null);
  const [transformDistanceY, settransformDistanceY] = useState(0);
  const [transformDistanceX, settransformDistanceX] = useState(0);
  const previewSwiper = useRef();

  // With an object to track each video by index
  const [videosLoaded, setVideosLoaded] = useState({});
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);

  if (productDetails?.video?.media?.id) {
    imageArray.push({
      id: productDetails?.video?.media?.id,
      url: productDetails?.video?.media?.url,
    });
    imageArrayLength++;
  }
  if (productDetails?.thumbnail?.media?.id) {
    imageArray.push({
      id: productDetails.thumbnail?.media?.id,
      url: fixUrl(productDetails.thumbnail?.media?.url),
    });
    imageArrayLength++;
  }
  if (productDetails?.gallery?.length > 0) {
    productDetails?.gallery?.forEach((image) => {
      if (!image?.media?.id) {
        return;
      }
      imageArray.push({
        id: image?.media?.id,
        url: fixUrl(image?.media?.url),
      });
      imageArrayLength++;
    });
  }
  if (productDetails?.variations?.product_variations?.length > 0) {
    productDetails?.variations?.product_variations?.forEach((variation) => {
      // imageArray.push({
      //   id: variation?.id,
      //   url: fixUrl(variation?.thumbnail?.media?.url),
      // });
      imageArrayLength++;
    });
  }
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [previousProductId, setPreviousProductId] = useState(null);

  /* --------------------------------------------- X -------------------------------------------- */

  const [cart, setCart] = useState({
    cartItems: [],
    cartTotal: 0
  });

  /* --------------------------------------------- X -------------------------------------------- */

  // Check if product details have changed and trigger loading state
  useEffect(() => {
    if (productDetails?.id && previousProductId !== productDetails?.id) {
      // setIsLoading(true);
      setPreviousProductId(productDetails?.id);

      // Simulate loading delay (remove this in production if data loads quickly)
      // const timer = setTimeout(() => {
      // }, 800);
      setIsLoading(false);

      // return () => clearTimeout(timer);
    }
    // console.log(productDetails?.id, previousProductId);
  }, [productDetails?.id, previousProductId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setCartItem({
      product_id: productDetails?.id,
      shop_id: productDetails?.shop_id,
      quantity: quantity,
      variation_id: productDetails?.product_type == "variable" ? CurrentVariationProduct?.id : undefined
    })

  }, [CurrentVariationProduct, productDetails]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setCurrentVariationProduct(productDetails?.product_type == "auction" || productDetails?.product_type == "simple" ? productDetails : productDetails?.variations?.message ? data?.product : productDetails?.variations?.product_variations[0]);
  }, [productDetails]);


  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    // setcurrentVariationProduct()
    setCartItem((prev) => ({ ...prev, seller_id: productDetails?.product?.shop_id }));
  }, [productDetails])

  /* --------------------------------------------- X -------------------------------------------- */

  const addToCart = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showPopup(null, false)
      setopenSigninPopup(true);
      return
    }
    const { data, error } = await CART_ITEMS.createCartItem(cartItem);
    // setCartItemsCount(cartItemsCount++);
    if (data) {
      cartsItemCount()
      toast.success(data.message)
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
        transformDistanceX = viewportWidth - (right + 250);
      }
      settransformDistanceY(transformDistanceY);
      settransformDistanceX(transformDistanceX);

      setTimeout(() => {
        setShowCartToss(false);
      }, 750);

      setTimeout(() => {
        settransformDistanceY(0);
        settransformDistanceX(0);
      }, 1000);
    };
    if (error?.data?.message == "User id not found, please login first!") {
      showPopup(null, false)
      setopenSigninPopup(true);
      toast.error(error.data.message);
    } else if (error) toast.error(error.data.message);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const setCurrentVariation = (attribute, attributeItem, varId, index) => {
    let selectedVariation = { ...currentSelectedVariation };
    selectedVariation[attribute] = { id: null, name: attributeItem };

    // Find the variation that matches the selected color
    const selectedColorVariation = productDetails?.variations?.product_variations.find(variation => {
      const colorAttribute = variation.attributes.product_variation_attribute_items.find(
        attr => attr.attribute.name === "Colors"
      );
      return colorAttribute && colorAttribute.attribute_item.name === attributeItem;
    });

    if (selectedColorVariation) {
      // Set the selected color variation as the current variation
      setcurrentSelectedVariation(selectedVariation);
      setCurrentVariationProduct(selectedColorVariation);

      // Update the image for the selected variation
      // setcurrentVariationImage({
      //   id: `gallery-${0}`,
      //   url: fixUrl(selectedColorVariation?.thumbnail?.media?.url),
      //   type: 'image',
      // });

      // scroll to image
      if (previewSwiper.current?.swiper) {
        previewSwiper.current.swiper.update();
        previewSwiper.current.swiper.slideTo(imageArray.length + index);
      }

      // setActiveSlideIndex(selectedColorVariation?.id);
      setcanAddToCart(true);

      // Update VariationsArr to show all sizes as enabled and select the size from this variation
      const sizeAttribute = selectedColorVariation.attributes.product_variation_attribute_items.find(
        attr => attr.attribute.name === "Sizes"
      );

      if (sizeAttribute) {
        const updatedSizes = VariationsArr.Sizes.map(size => ({
          ...size,
          isEnabled: size.name === sizeAttribute.attribute_item.name,
          isSelected: size.name === sizeAttribute.attribute_item.name
        }));
        setVariationsArr({ ...VariationsArr, Sizes: updatedSizes });
      }
    } else {
      setCurrentVariationProduct(null);
      setcanAddToCart(false);
      toast.warning("No variation found for the selected color!");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const findvariation = () => {
    let arr = {};
    if (!productDetails?.variations?.message && productDetails?.variations?.product_variations) {
      productDetails.variations.product_variations.forEach((variation) => {
        variation.attributes.product_variation_attribute_items.forEach((element) => {
          const attributeName = element.attribute.name;
          if (!arr[attributeName]) {
            arr[attributeName] = [];
          }

          // Check if this attribute item already exists in the array
          const existingItem = arr[attributeName].find(item => item.id === element.attribute_item.id);

          if (!existingItem) {
            arr[attributeName].push({
              variationId: element.variation_id,
              id: element.attribute_item.id,
              name: element.attribute_item.name,
              isSelected: false,
              isEnabled: false
            });
          }
        });
      });
    }
    setVariationsArr(arr);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Handle Buy Now                                        */
  /* -------------------------------------------------------------------------------------------- */

  const BuyNow = async (e) => {
    setLoadingBuyNow(true);

    e.preventDefault();

    if (!currentUser?.authToken) {
      setopenSigninPopup(true);
      return
    }

    const { data, error } = await CART_ITEMS.createCartItem(cartItem);

    if (data) {
      toast.success(data.message);
      cartsItemCount();
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
        transformDistanceX = viewportWidth - (right + 250);
      }
      settransformDistanceY(transformDistanceY);
      settransformDistanceX(transformDistanceX);

      setTimeout(() => {
        setShowCartToss(false);
      }, 750);

      setTimeout(() => {
        settransformDistanceY(0);
        settransformDistanceX(0);
      }, 1000);

      navigate('/checkout');
    };

    if (error) {
      toast.error(error.data.message)
    }

    setLoadingBuyNow(false);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const InsertBid = async (event) => {
    // if (!currentUser) return setopenSigninPopup(true)
    if (bidAmount <= productDetails?.price || canBid == false || IsProductExpired) {
      if (!canBid) {
        toast.warning("Sorry! You have already placed a bid!")
      } else {
        toast.warning("Bid amount should be greater than actual price!")
      }
    } else {
      if (productDetails.bids.highest_bid >= bidAmount) {
        toast.warning("Bid amount should be greater than highest bid")
      } else {
        const { data, error } = await PRODUCT_BIDS.insertProductBid(productDetails?.id, {
          product_id: productDetails?.id,
          auction_bid_price: bidAmount
        });
        if (data) {
          addToCart(event)
          toast.success(data.message);
          setcanBid(false);
          setLoading(false);
          fetchProduct();
        }
        if (error?.data?.message == "User id not found, please login first!") {
          showPopup(null, false)
          setopenSigninPopup(true);
          toast.error(error.data.message);
        }
      }
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    let bid = productDetails?.bids?.bids?.filter(x => {
      return x.user_id == currentUser.id
    })
    setcanBid(
      bid?.length > 0 ? false : true
    )
    findvariation()
    let arr = {}
    productDetails?.variations?.product_variations[0]?.attributes.product_variation_attribute_items.forEach((element) => {
      arr = { ...arr, [element.attribute.name]: { id: element.attribute_item.id, name: element.attribute_item.name, isSelected: false } }
      setcurrentSelectedVariation(arr)
    })
  }, [productDetails]);

  /* --------------------------------------------- X -------------------------------------------- */

  const videoRefs = useRef([]);
  const onSlideChange = (swiper) => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        video.muted = true;
        if (idx === swiper.activeIndex) {
          video.muted = false;
          video.play().catch(() => { }); // ignore autoplay promise error
        } else {
          video.pause();
          video.muted = true;
          // video.currentTime = 0; // reset playback
        }
        // video.pause();
      }
    });
    const activeSlideVideo = videoRefs.current[swiper.activeIndex];
    if (activeSlideVideo) {
      activeSlideVideo.play();
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // // Update the handleCanPlay function to track specific video index
  // const handleCanPlay = (index) => {
  //   setVideosLoaded(prev => ({
  //     ...prev,
  //     [index]: true
  //   }));
  // };

  // Update the handler to use multiple video events
  const handleVideoLoad = (index, e = null) => {
    setVideosLoaded(prev => ({
      ...prev,
      [index]: true
    }));
    if (e) {
      const video = e.target;
      video.muted = false;
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleVideoPlay = (e) => {
    const video = e.target;
    if (video.paused) {
      video.play();
      video.muted = false;
    } else {
      video.pause();
      video.muted = true;
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      {isPopupVisible &&
        <section style={{ display: "flex" }} className={`${isPopupVisible && "active"} productPerviewContainer`}>
          <div className="bg" onClick={() => showPopup({}, false)} />
          <div className="main-sec">
            <div className="details-sec">
              <div className=" product-perview-container">
                <div className="productImagesSlider">
                  <div className="thumbnail-container">
                    {productDetails && imageArray.length > 1 ?
                      (<Swiper style={{ height: "100%" }}
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        direction={"vertical"}
                        slidesPerView={7}
                        breakpoints={{
                          1340: {
                            slidesPerView: 7,
                            spaceBetween: 10,
                          },
                          1024: {
                            slidesPerView: 5,
                            spaceBetween: 10,
                          },
                          500: {
                            slidesPerView: 4,
                            spaceBetween: 10,
                            vertical: false
                          },
                        }}
                        loop={true}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                        initialSlide={0}>

                        {imageArray.map((image, index) => (
                          <SwiperSlide key={image.id} style={{ marginBottom: "10px" }}>
                            {isVideo(image.url) ? (
                              <video style={{ width: '100%', height: "100%", objectFit: 'contain' }} src={image.url} />
                            ) : (
                              <img src={image.url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={"Image"} />
                            )}
                          </SwiperSlide>
                        ))}
                        {productDetails?.product_type === 'variable' &&
                          productDetails?.variations?.product_variations?.map((image) => (
                            <SwiperSlide key={image?.thumbnail?.media?.id} style={{ marginBottom: '10px', border: '1px solid var(--main-red-color)' }}>
                              <img src={image?.thumbnail?.media?.url} style={{ width: '100%', height: "100%", objectFit: 'contain' }} alt={'Image'} />
                            </SwiperSlide>
                          ))
                        }
                      </Swiper>
                      ) : imageArray == 1 ? (
                        imageArray.map((image) => (
                          <div key={image.id} style={{ marginBottom: '10px', border: '1px solid var(--main-red-color)' }}>
                            {isVideo(image.url) ? (
                              <video autoPlay muted={true} controls style={{ height: '80px', objectFit: 'contain' }} src={image.url} />
                            ) : (
                              <img src={image.url} style={{ width: '80px', height: '80px', objectFit: 'contain' }} alt={'Image'} />
                            )}
                          </div>
                        ))
                      ) : ('')}
                  </div>
                  <div className="image-preview-container single-product-image-preview-container">
                    {productDetails &&
                      imageArray.length > 1 ?
                      (<Swiper
                        style={{
                          '--swiper-navigation-color': '#fff',
                          '--swiper-pagination-color': '#fff',
                        }}
                        loop={true}
                        pagination={{ clickable: true }}
                        breakpoints={{
                          300: {
                            pagination: {
                              el: '.swiper-pagination',
                              clickable: true,
                            }
                          }
                        }}
                        spaceBetween={10}
                        onSlideChange={onSlideChange}
                        ref={previewSwiper}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        modules={[FreeMode, Navigation, Thumbs, Pagination]}
                        className="mySwiper2"
                        initialSlide={0}>

                        {/* {productDetails?.thumbnail && (
                          <div>
                            <img src={fixUrl(productDetails.thumbnail?.media?.url)} alt={`Thumbnail `} />
                          </div>
                        )}
                        {productDetails?.gallery?.map((image, index) => {
                          if (!Slides.current[index]) {
                            Slides.current[index] = React.createRef();
                          }
                          return (
                            <div ref={Slides.current[index]}>
                              <img src={fixUrl(image?.media?.url)} key={index} alt={`Thumbnail ${index}`} />
                            </div>
                          )
                        })} */}

                        {imageArray.map((image, index) => (
                          isVideo(image.url) ? (
                            <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                              {/* Show loading indicator above the video until loaded */}
                              {!videosLoaded[index] && (
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  zIndex: 2,
                                  background: '#F5F5F5'
                                }}>
                                  <img src={loadingVideo} alt="Loading" />
                                </div>
                              )}
                              <video
                                ref={el => videoRefs.current[index] = el}
                                onCanPlay={() => handleVideoLoad(index)}
                                onLoadedData={(e) => handleVideoLoad(index, e)}
                                onPlaying={() => handleVideoLoad(index)}
                                onClick={(e) => handleVideoPlay(e)}
                                key={image.id}
                                preload="auto"
                                playsInline
                                autoPlay
                                muted
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                src={image.url}
                              />
                            </SwiperSlide>
                          ) : (
                            <SwiperSlide key={index}>
                              <img key={image.id} src={fixUrl(image?.url)} alt="Image" />
                            </SwiperSlide>
                          )
                        ))}
                        {productDetails?.product_type == 'variable' &&
                          productDetails?.variations?.product_variations?.map((image) => (
                            <SwiperSlide key={image?.thumbnail?.media?.id}>
                              <img onClick={() => { if (window.innerWidth >= 550) { setmainProductImage(fixUrl(image?.thumbnail?.media?.url)); setMainImagePopup(true); } }} src={fixUrl(image?.thumbnail?.media?.url)} alt="Image" />
                            </SwiperSlide>
                          ))
                        }
                      </Swiper>
                      ) : imageArray == 1 ? (
                        imageArray.map((image) => (
                          isVideo(image.url) ? (
                            <video key={image.id} style={{ height: "100%", objectFit: "contain" }} src={image.url} />
                          ) : (
                            <img key={image.id} onClick={() => { if (window.innerWidth >= 550) { setmainProductImage(fixUrl(image.url)); setMainImagePopup(true); } }} src={fixUrl(image.url)} alt="Image" />
                          )
                        ))
                      ) : ('')}
                  </div>
                </div>

                <div className="product-perview-details">
                  <div className="product-perview-review-row">
                    <div>{renderStars(productDetails?.reviews?.reviews?.average_rating, RatedStar, EmptyStar)}</div>
                    <p className="prouct-perview-rating-text" style={{ marginLeft: "0" }}>({productDetails?.reviews?.reviews?.average_rating ?? 0})</p>
                    <p className="prouct-perview-review-text">{productDetails?.reviews?.reviews?.total_reviews ?? 0} reviews</p>
                    <p className="prouct-perview-sales-text">{productDetails?.meta?.sold ?? 0} Sold</p>
                  </div>
                  <p className="product-title">{productDetails?.name}</p>
                  {productDetails?.product_type == "auction" ?
                    <>
                      <div style={{ margin: "10px 0", color: "var(--main-red-color)" }} className="AuctionExpiryDate">
                        Expiry : {expiryDate(productDetails?.auction_end_time)}
                      </div>
                      <div style={{ margin: "10px 0" }} className="AuctionExpiryDate">
                        Total Bids : {productDetails?.bids.bids?.length ?? 0} Bids
                      </div>
                      <div style={{ margin: "20px 0" }} className="AuctionExpiryDate">
                        Highest Bid : ${productDetails?.bids.highest_bid ?? 0}
                      </div>

                    </>
                    : ""}
                  <div className="product-perview-price-row">
                    {productDetails?.product_group === 'car' && productDetails?.meta?.hide_price === '1' ? (
                      <p style={{ margin: '10px auto 10px 0' }} className="product-perview-discounted-price">Price: Ask the dealer</p>
                    ) : (
                      <>
                        {/* ------------------------------------------------------------------------------ */}
                        {/*                              For Variable Product                              */}
                        {/* ------------------------------------------------------------------------------ */}
                        {productDetails?.product_type == 'variable' && (
                          productDetails?.sale_price ? (
                            <>
                              <p className="product-perview-original-price">{formatPrice(CurrentVariationProduct?.sale_price)}</p>
                              <p className="product-perview-discounted-price">{formatPrice(CurrentVariationProduct?.price)}</p>
                            </>
                          ) : (
                            <p className="product-perview-discounted-price">{formatPrice(CurrentVariationProduct?.price)}</p>
                          )
                        )}
                        {/* ---------------------------------------------------------------------------- */}
                        {/*                              For Other Products                              */}
                        {/* ---------------------------------------------------------------------------- */}
                        {productDetails?.product_type !== 'variable' && (
                          productDetails?.sale_price ? (
                            <>
                              <p className="product-perview-original-price">{formatPrice(productDetails?.sale_price)}</p>
                              <p className="product-perview-discounted-price">{formatPrice(productDetails?.price)}</p>
                            </>
                          ) : (
                            <p className="product-perview-discounted-price">{formatPrice(productDetails?.price)}</p>
                          )
                        )}
                      </>
                    )}
                    {/* ----------------------------------- Stock ---------------------------------- */}
                    <p className="product-perview-stock-percent">({CurrentVariationProduct?.stock}) Available in Stock</p>
                  </div>
                  {productDetails?.product_type === "variable" && (
                    Object.entries(VariationsArr)?.map((variation, index) => (
                      variation[0] === "Colors" ?
                        <div className="product-perview-color-box" key={index}>
                          <p className="product-perview-color-heading">{variation[0]}:</p>
                          <div className={`product-perview-color-variations `}>
                            {variation[1].map((variationItem, i) => (
                              <input key={variationItem.id} type="radio" name={variation[0]} className="color" style={{ background: variationItem.name }} onChange={() => setCurrentVariation(variation[0], variationItem.name, variationItem.variationId, i)} />
                            ))}
                          </div>
                        </div>
                        :
                        <div className="product-perview-size-box" key={index}>
                          <p className="product-perview-color-heading">{variation[0]}:
                            {/* <svg onClick={() => setshowSizePopup(true)} width="97" height="24" viewBox="0 0 97 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.64577 15.1181C1.78474 15.9791 1.78474 17.3751 2.64577 18.2361L5.76385 21.3542C6.62488 22.2153 8.02089 22.2153 8.88193 21.3542L9.91075 20.3254L8.35175 18.7664C8.05886 18.4735 8.05886 17.9986 8.35175 17.7057C8.64464 17.4128 9.11952 17.4128 9.41241 17.7057L10.9714 19.2647L13.0288 17.2074L11.4698 15.6483C11.1769 15.3554 11.1769 14.8806 11.4698 14.5877C11.7627 14.2948 12.2375 14.2948 12.5304 14.5877L14.0895 16.1467L16.1468 14.0893C16.1468 14.0893 16.1468 14.0893 16.1468 14.0893L14.5878 12.5302C14.2949 12.2374 14.2949 11.7625 14.5878 11.4696C14.8807 11.1767 15.3555 11.1767 15.6484 11.4696L17.2075 13.0286C17.2075 13.0286 17.2075 13.0286 17.2075 13.0287L19.265 10.9712L17.7059 9.41217C17.413 9.11927 17.413 8.6444 17.7059 8.35151C17.9988 8.05861 18.4737 8.05861 18.7666 8.35151L20.3256 9.91054L21.3542 8.88193C22.2153 8.02089 22.2153 6.62488 21.3542 5.76385L18.2361 2.64577C17.3751 1.78474 15.9791 1.78474 15.1181 2.64577L2.64577 15.1181Z" fill="#28303F" />  <path d="M35.794 17.14C35.0193 17.14 34.3613 17 33.82 16.72C33.2787 16.44 32.7933 16.0293 32.364 15.488L33.456 14.396C33.7267 14.788 34.0487 15.096 34.422 15.32C34.7953 15.5347 35.2713 15.642 35.85 15.642C36.3913 15.642 36.8207 15.53 37.138 15.306C37.4647 15.082 37.628 14.774 37.628 14.382C37.628 14.0553 37.544 13.7893 37.376 13.584C37.208 13.3787 36.984 13.2107 36.704 13.08C36.4333 12.94 36.13 12.8187 35.794 12.716C35.4673 12.604 35.136 12.4827 34.8 12.352C34.4733 12.212 34.17 12.0393 33.89 11.834C33.6193 11.6287 33.4 11.3627 33.232 11.036C33.064 10.7093 32.98 10.294 32.98 9.79C32.98 9.21133 33.12 8.72133 33.4 8.32C33.6893 7.90933 34.0767 7.59667 34.562 7.382C35.0473 7.16733 35.5887 7.06 36.186 7.06C36.83 7.06 37.404 7.186 37.908 7.438C38.4213 7.69 38.8367 8.012 39.154 8.404L38.062 9.496C37.782 9.17867 37.488 8.94533 37.18 8.796C36.8813 8.63733 36.536 8.558 36.144 8.558C35.6587 8.558 35.276 8.656 34.996 8.852C34.7253 9.048 34.59 9.32333 34.59 9.678C34.59 9.97667 34.674 10.2193 34.842 10.406C35.01 10.5833 35.2293 10.7373 35.5 10.868C35.78 10.9893 36.0833 11.106 36.41 11.218C36.746 11.33 37.0773 11.456 37.404 11.596C37.74 11.736 38.0433 11.918 38.314 12.142C38.594 12.3567 38.818 12.6367 38.986 12.982C39.154 13.3273 39.238 13.7613 39.238 14.284C39.238 15.1613 38.9253 15.8567 38.3 16.37C37.684 16.8833 36.8487 17.14 35.794 17.14ZM40.6473 17V10.28H42.1873V17H40.6473ZM41.4173 9.048C41.156 9.048 40.9366 8.95933 40.7593 8.782C40.5913 8.60467 40.5073 8.38533 40.5073 8.124C40.5073 7.86267 40.5913 7.64333 40.7593 7.466C40.9366 7.28867 41.156 7.2 41.4173 7.2C41.688 7.2 41.9073 7.28867 42.0753 7.466C42.2433 7.64333 42.3273 7.86267 42.3273 8.124C42.3273 8.38533 42.2433 8.60467 42.0753 8.782C41.9073 8.95933 41.688 9.048 41.4173 9.048ZM43.4105 16.16L47.1625 11.12H48.9685L45.2165 16.16H43.4105ZM43.4105 17V16.16L44.8105 15.6H48.8845V17H43.4105ZM43.6625 11.68V10.28H48.9685V11.12L47.5685 11.68H43.6625ZM53.2436 17.14C52.5716 17.14 51.9649 16.9907 51.4236 16.692C50.8916 16.384 50.4669 15.964 50.1496 15.432C49.8416 14.9 49.6876 14.3027 49.6876 13.64C49.6876 12.9773 49.8416 12.3847 50.1496 11.862C50.4576 11.33 50.8729 10.91 51.3956 10.602C51.9276 10.294 52.5156 10.14 53.1596 10.14C53.7849 10.14 54.3356 10.2847 54.8116 10.574C55.2969 10.8633 55.6749 11.26 55.9456 11.764C56.2256 12.268 56.3656 12.842 56.3656 13.486C56.3656 13.598 56.3562 13.7147 56.3376 13.836C56.3282 13.948 56.3096 14.074 56.2816 14.214H50.7656V12.954H55.4836L54.9096 13.458C54.8909 13.0473 54.8116 12.702 54.6716 12.422C54.5316 12.142 54.3309 11.9273 54.0696 11.778C53.8176 11.6287 53.5049 11.554 53.1316 11.554C52.7396 11.554 52.3989 11.638 52.1096 11.806C51.8202 11.974 51.5962 12.212 51.4376 12.52C51.2789 12.8187 51.1996 13.178 51.1996 13.598C51.1996 14.018 51.2836 14.3867 51.4516 14.704C51.6196 15.0213 51.8576 15.2687 52.1656 15.446C52.4736 15.614 52.8282 15.698 53.2296 15.698C53.5749 15.698 53.8922 15.6373 54.1816 15.516C54.4802 15.3947 54.7322 15.2173 54.9376 14.984L55.9176 15.978C55.5909 16.3607 55.1942 16.65 54.7276 16.846C54.2609 17.042 53.7662 17.14 53.2436 17.14ZM65.0368 17.14C64.3648 17.14 63.7302 17.0093 63.1328 16.748C62.5355 16.4867 62.0128 16.1273 61.5648 15.67C61.1168 15.2033 60.7622 14.6667 60.5008 14.06C60.2488 13.444 60.1228 12.786 60.1228 12.086C60.1228 11.386 60.2488 10.7327 60.5008 10.126C60.7622 9.51933 61.1168 8.98733 61.5648 8.53C62.0222 8.06333 62.5542 7.704 63.1608 7.452C63.7768 7.19067 64.4395 7.06 65.1488 7.06C65.9235 7.06 66.6422 7.20933 67.3048 7.508C67.9675 7.80667 68.5228 8.23133 68.9708 8.782L67.8788 9.874C67.5895 9.46333 67.2022 9.15067 66.7168 8.936C66.2315 8.712 65.7088 8.6 65.1488 8.6C64.4768 8.6 63.8842 8.74933 63.3708 9.048C62.8668 9.33733 62.4748 9.74333 62.1948 10.266C61.9148 10.7887 61.7748 11.3953 61.7748 12.086C61.7748 12.7767 61.9148 13.388 62.1948 13.92C62.4842 14.4427 62.8715 14.8533 63.3568 15.152C63.8422 15.4507 64.3928 15.6 65.0088 15.6C65.6622 15.6 66.2222 15.4833 66.6888 15.25C67.1648 15.0073 67.5288 14.6527 67.7808 14.186C68.0328 13.71 68.1588 13.1267 68.1588 12.436L69.1668 13.164H64.9808V11.694H69.8248V11.918C69.8248 13.0847 69.6148 14.0553 69.1948 14.83C68.7842 15.6047 68.2195 16.1833 67.5008 16.566C66.7822 16.9487 65.9608 17.14 65.0368 17.14ZM73.9753 17.14C73.4059 17.14 72.8973 17.014 72.4493 16.762C72.0106 16.51 71.6653 16.1647 71.4133 15.726C71.1706 15.278 71.0493 14.7647 71.0493 14.186V10.28H72.5893V14.116C72.5893 14.4427 72.6406 14.7227 72.7433 14.956C72.8553 15.18 73.0139 15.3527 73.2193 15.474C73.4339 15.5953 73.6859 15.656 73.9753 15.656C74.4233 15.656 74.7639 15.5253 74.9973 15.264C75.2399 14.9933 75.3613 14.6107 75.3613 14.116V10.28H76.9013V14.186C76.9013 14.774 76.7753 15.292 76.5233 15.74C76.2806 16.1787 75.9399 16.524 75.5013 16.776C75.0626 17.0187 74.5539 17.14 73.9753 17.14ZM78.4637 17V10.28H80.0037V17H78.4637ZM79.2337 9.048C78.9724 9.048 78.753 8.95933 78.5757 8.782C78.4077 8.60467 78.3237 8.38533 78.3237 8.124C78.3237 7.86267 78.4077 7.64333 78.5757 7.466C78.753 7.28867 78.9724 7.2 79.2337 7.2C79.5044 7.2 79.7237 7.28867 79.8917 7.466C80.0597 7.64333 80.1437 7.86267 80.1437 8.124C80.1437 8.38533 80.0597 8.60467 79.8917 8.782C79.7237 8.95933 79.5044 9.048 79.2337 9.048ZM84.545 17.14C83.9383 17.14 83.3876 16.986 82.893 16.678C82.4076 16.37 82.0203 15.9547 81.731 15.432C81.451 14.9 81.311 14.3073 81.311 13.654C81.311 12.9913 81.451 12.3987 81.731 11.876C82.0203 11.344 82.4076 10.924 82.893 10.616C83.3876 10.2987 83.9383 10.14 84.545 10.14C85.0583 10.14 85.511 10.252 85.903 10.476C86.3043 10.6907 86.6216 10.9893 86.855 11.372C87.0883 11.7547 87.205 12.1887 87.205 12.674V14.606C87.205 15.0913 87.0883 15.5253 86.855 15.908C86.631 16.2907 86.3183 16.594 85.917 16.818C85.5156 17.0327 85.0583 17.14 84.545 17.14ZM84.797 15.684C85.1796 15.684 85.511 15.6 85.791 15.432C86.0803 15.2547 86.3043 15.012 86.463 14.704C86.6216 14.396 86.701 14.0413 86.701 13.64C86.701 13.2387 86.6216 12.884 86.463 12.576C86.3043 12.268 86.0803 12.03 85.791 11.862C85.511 11.6847 85.1796 11.596 84.797 11.596C84.4236 11.596 84.0923 11.6847 83.803 11.862C83.523 12.03 83.299 12.268 83.131 12.576C82.9723 12.884 82.893 13.2387 82.893 13.64C82.893 14.0413 82.9723 14.396 83.131 14.704C83.299 15.012 83.523 15.2547 83.803 15.432C84.0923 15.6 84.4236 15.684 84.797 15.684ZM88.143 17H86.603V15.194L86.869 13.556L86.603 11.932V6.92H88.143V17ZM92.974 17.14C92.302 17.14 91.6954 16.9907 91.154 16.692C90.622 16.384 90.1974 15.964 89.88 15.432C89.572 14.9 89.418 14.3027 89.418 13.64C89.418 12.9773 89.572 12.3847 89.88 11.862C90.188 11.33 90.6034 10.91 91.126 10.602C91.658 10.294 92.246 10.14 92.89 10.14C93.5154 10.14 94.066 10.2847 94.542 10.574C95.0274 10.8633 95.4054 11.26 95.676 11.764C95.956 12.268 96.096 12.842 96.096 13.486C96.096 13.598 96.0867 13.7147 96.068 13.836C96.0587 13.948 96.04 14.074 96.012 14.214H90.496V12.954H95.214L94.64 13.458C94.6214 13.0473 94.542 12.702 94.402 12.422C94.262 12.142 94.0614 11.9273 93.8 11.778C93.548 11.6287 93.2354 11.554 92.862 11.554C92.47 11.554 92.1294 11.638 91.84 11.806C91.5507 11.974 91.3267 12.212 91.168 12.52C91.0094 12.8187 90.93 13.178 90.93 13.598C90.93 14.018 91.014 14.3867 91.182 14.704C91.35 15.0213 91.588 15.2687 91.896 15.446C92.204 15.614 92.5587 15.698 92.96 15.698C93.3054 15.698 93.6227 15.6373 93.912 15.516C94.2107 15.3947 94.4627 15.2173 94.668 14.984L95.648 15.978C95.3214 16.3607 94.9247 16.65 94.458 16.846C93.9914 17.042 93.4967 17.14 92.974 17.14Z" fill="black" />
                            </svg> */}
                          </p>
                          <div className="product-perview-color-variations">
                            {variation[1].map((variationItem, i) => (
                              <div key={i} style={variationItem.isEnabled ? { opacity: 1, } : { opacity: .3, pointerEvents: "none" }} >
                                <input checked={variationItem.isSelected} type="radio" name={variation[0]} value={variationItem.name} /* onChange={() => setCurrentVariation(variation[0], variationItem.name, null)} */ />
                                <label htmlFor={`size-${variation[0]}`} >{variationItem.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                    ))
                  )}

                  {productDetails?.product_type !== "auction" && productDetails?.product_group !== "car" ?
                    CurrentVariationProduct?.stock !== 0 ?
                      <div className="inputGroup quantity">
                        <div className="product-perview-color-heading size ">
                          <div className="quantity-sec">
                            Quantity
                            <div className="QuantityInput">
                              <input type="number" placeholder="1" onChange={() => setCartItem({ ...cartItem, quantity: parseInt(event.target.value == "" ? 1 : event.target.value >= CurrentVariationProduct?.stock ? CurrentVariationProduct?.stock : event.target.value) })} value={cartItem.quantity} />
                              <div>
                                <button onClick={() => setCartItem({ ...cartItem, quantity: cartItem.quantity >= CurrentVariationProduct?.stock ? cartItem.quantity : cartItem.quantity + 1 })}>+</button>
                                <button onClick={() => setCartItem({ ...cartItem, quantity: cartItem.quantity == 1 ? 1 : cartItem.quantity <= 0 ? 0 : cartItem.quantity - 1 })}>-</button>
                              </div>
                            </div>
                          </div>
                          {/* <p className="sold">
                            <span>{CurrentVariationProduct?.stock ?? productDetails?.stock}</span>/ {productDetails?.meta?.sold ?? 0} sold
                          </p> */}
                        </div>
                      </div>
                      :
                      <p style={{ color: "var(--main-red-color)", margin: "30px 0" }}>Sold Out</p>
                    : null
                  }

                  {productDetails?.product_type == "auction"
                    ?
                    isAuctionEnded(productDetails?.auction_end_time)
                      ?
                      <p style={{ margin: "20px 0", color: "var(--main-red-color)" }}>Sorry Auction Expired!</p>
                      :
                      <div className="bidInput" style={canBid ? {} : { pointerEvents: "none", opacity: "0.6" }}>
                        <input type="number" onChange={() => setbidAmount(parseInt(event.target.value))} placeholder="Bid Amount" />
                        <button onClick={() => InsertBid(event)}>Bid Now</button>
                      </div>
                    :
                    productDetails?.product_group == "car" ?
                      <div className="query">
                        <p>If you have any query! Enquire Now</p>
                        <button className="button" onClick={() => navigate(`/product/${productDetails?.slug}`)/* setcustomerServicePopup(true) */}>
                          Enquire Now
                          <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M19.8407 14.22C20.249 13.2283 20.4707 12.1666 20.4707 11C20.4707 10.16 20.3423 9.35498 20.1207 8.60831C19.3623 8.78331 18.569 8.87665 17.7407 8.87665C16.0443 8.87847 14.3723 8.47242 12.8658 7.69274C11.3592 6.91306 10.0622 5.78259 9.08399 4.39665C8.0376 6.92851 6.06363 8.96508 3.56565 10.09C3.51898 10.3816 3.51898 10.6966 3.51898 11C3.51898 12.1138 3.73837 13.2167 4.16461 14.2458C4.59086 15.2748 5.21561 16.2098 6.00321 16.9974C7.59383 18.588 9.75117 19.4816 12.0007 19.4816C13.2257 19.4816 14.404 19.2133 15.4657 18.735C16.1307 20.0066 16.434 20.6366 16.4107 20.6366C14.4973 21.2783 13.0157 21.5933 12.0007 21.5933C9.17732 21.5933 6.48232 20.485 4.49898 18.49C3.29265 17.2874 2.39592 15.8101 1.88565 14.185H0.333984V8.87665H1.60565C1.99093 7.00124 2.87673 5.26512 4.16904 3.8525C5.46135 2.43988 7.11198 1.40345 8.94577 0.853197C10.7796 0.30294 12.7281 0.259379 14.5847 0.727136C16.4412 1.19489 18.1365 2.15652 19.4907 3.50998C20.9609 4.97444 21.9638 6.84209 22.3723 8.87665H23.6673V14.185H23.5973L19.444 18L13.2607 17.3V15.3516H18.8957L19.8407 14.22ZM8.81565 10.7316C9.16565 10.7316 9.50398 10.8716 9.74898 11.1283C9.9952 11.3765 10.1334 11.712 10.1334 12.0616C10.1334 12.4113 9.9952 12.7467 9.74898 12.995C9.50398 13.24 9.16565 13.38 8.81565 13.38C8.08065 13.38 7.48565 12.7966 7.48565 12.0616C7.48565 11.3266 8.08065 10.7316 8.81565 10.7316ZM15.174 10.7316C15.909 10.7316 16.4923 11.3266 16.4923 12.0616C16.4923 12.7966 15.909 13.38 15.174 13.38C14.439 13.38 13.844 12.7966 13.844 12.0616C13.844 11.7089 13.9841 11.3706 14.2335 11.1212C14.483 10.8718 14.8212 10.7316 15.174 10.7316Z"
                              fill="white"
                            />
                          </svg>
                        </button>
                      </div>
                      :
                      <>
                        {isLoading ? (
                          <Skeleton style={{ width: "100%", height: "40px", borderRadius: "5px" }} />
                        ) : (
                          <button style={!canAddToCart || productDetails?.stock == 0 ? { opacity: ".6", pointerEvents: "none" } : { position: "relative" }} className="button product-perview-add-to-cart-btn buy-now-btn" onClick={() => BuyNow(event)}>
                            {loadingBuyNow ? 'Lets go...' : 'Buy Now'}
                            <div className={`${showCartToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={cartTossWrapperRef}>
                              <div className="number">1</div>
                            </div>
                          </button>
                        )}
                        {isLoading ? (
                          <Skeleton style={{ width: "100%", height: "40px", borderRadius: "5px" }} />
                        ) : (
                          <button style={!canAddToCart || productDetails?.stock == 0 ? { opacity: ".6", pointerEvents: "none" } : { position: "relative" }} className="button product-perview-add-to-cart-btn" onClick={() => addToCart(event)}>
                            Add To Cart
                            <div className={`${showCartToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={cartTossWrapperRef}>
                              <div className="number">1</div>
                            </div>
                          </button>
                        )}
                      </>
                  }
                  <Link to={`/product/${productDetails?.slug}`} className="allDetails">All Details</Link>
                </div>
              </div>
            </div>
          </div >
        </section >
      }
    </>
  );
}
export default ProductPreview;
