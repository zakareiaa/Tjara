import { useState, React, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";

import PRODUCTS from "@client/productsClient";
import { useAuth } from "@contexts/Auth";
import WISHLIST from "../../client/wishlistClient";
import ProductCard from "../../components/ProductCard";
import SignInPopup from "@components/signInPopup/index";
import { usePopup } from "@components/DataContext";
import ImageMagnifier from "@components/imageMagnifier";
import PRODUCT_BIDS from "../../client/productBidsClient";
import CART_ITEMS from "../../client/cartItemsClient";
import ProductVariations from "../../components/ProductVariations";
import { expiryDate, fixUrl, formatPrice, isAuctionEnded, isVideo, renderStars, timeAgo } from "../../helpers/helpers";
import SectionHeading from "../../components/ui/SectionHeading";

import loadingGif from "@assets/loading.gif"
import paypal from "../../assets/paypal.png";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/mastercard.png";
import maestro from "../../assets/maestro.png";
import americanExpress from "../../assets/americanExpress.png";
import discover from "../../assets/discover.png";
import dclubs from "../../assets/dclubs.png";
import applePay from "../../assets/applepay.png";
import jcb from "../../assets/jsb.png";
import clearpay from "../../assets/clearpay.png";
import pci from "../../assets/pci.png";
import visaSecure from "../../assets/visaSecure.png";
import safeke from "../../assets/safeke.png";
import protectBuy from "../../assets/protectBuy.png";
import jSecure from "../../assets/jSecure.png";
import trusted from "../../assets/trusted.png";
import call from "../../assets/call.png";
import FootImg from "../../assets/foot.png";
import reviewUser from "../../assets/reviewUser.png";
import EmptyStar from "../../assets/empty-star.svg";
import loadingVideo from "../../assets/loadingVideo.gif";
import RatedStar from "../../assets/rated-star.svg";
import chat from "../../assets/chat.png";
import Whatsapp from "../../assets/whatsapp.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import pinterest from "../../assets/pinterest.png";
import copyLink from "../../assets/copyLink.png";
import WhatsappNew from "./assets/whatsapp.png";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import "./circle-bars.css";
import "./style.css";

const SingleProduct = ({ }) => {
  const [totalItems, settotalItems] = useState(0)
  const [canAddToWishlist, setcanAddToWishlist] = useState(true)
  const { currentUser } = useAuth();
  const [toggleLiveChat, settoggleLiveChat] = useState(false)
  const { setopenSigninPopup, cartsItemCount, fetchWishlistItemsCount } = usePopup();
  const { id } = useParams();
  const [currentProductId, setCurrentProductId] = useState(null);
  const [quantity, setquantity] = useState(1);
  const [showSizePopup, setshowSizePopup] = useState(false);
  const [sizeRatingsPopup, setsizeRatingsPopup] = useState(false);
  const [customerServicePopup, setcustomerServicePopup] = useState(false);
  const [guidelinesPopup, setguidelinesPopup] = useState(false);
  const [MainImagePopup, setMainImagePopup] = useState(false);
  const [paymentPopup, setpaymentPopup] = useState(false);
  const [reviewsPopup, setreviewsPopup] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate()
  const [bidAmount, setbidAmount] = useState("")
  const [productMeasurmentPopup, setproductMeasurmentPopup] = useState(false);
  const [similarProducts, setsimilarProducts] = useState([]);
  const [tabs, settabs] = useState("description");
  const [canBid, setcanBid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [loadingInsertBid, setLoadingInsertBid] = useState(false);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [loadingBuyNow, setLoadingBuyNow] = useState(false);
  const [shareButtons, setshareButtons] = useState(false);
  const [mainProductImage, setmainProductImage] = useState(null);
  const [currentProductCategory, setCurrentProductCategory] = useState(null);
  const [canAddToCart, setcanAddToCart] = useState(true)
  const [VariationsArr, setVariationsArr] = useState([])
  const [productChatMessages, setProductChatMessages] = useState([]);
  const [currentProductChat, setCurrentProductChat] = useState('');
  const [message, setProductMessage] = useState({ message: "", message_type: "text", });
  const [CurrentPage, setCurrentPage] = useState(1);
  const [loadingChatMessage, setloadingChatMessage] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState({
    user_id: "",
    name: "",
    slug: "",
    product_type: "simple",
    stock: "",
    quantity: "",
    regular_price: "",
  });
  const [currentVariationProduct, setcurrentVariationProduct] = useState({})
  const [currentVariationImage, setcurrentVariationImage] = useState({})
  const [currentSelectedVariation, setcurrentSelectedVariation] = useState({})
  const [cartItem, setCartItem] = useState({});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [IsProductExpired, setIsProductExpired] = useState(false);
  const componentRef = useRef(null);
  let imageArray = [];
  let imageArrayLength = 0;
  const [showCartToss, setShowCartToss] = useState(false);
  const cartTossWrapperRef = useRef(null);
  const [transformDistanceY, settransformDistanceY] = useState(0);
  const [transformDistanceX, settransformDistanceX] = useState(0);
  const [showWLToss, setShowWLToss] = useState(false);
  const WLTossWrapperRef = useRef(null);
  const [videoLoaded, setvideoLoaded] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);
  const previewSwiper = useRef();

  if (product?.video?.media?.id) {
    imageArray.push({
      id: product?.video?.media?.id,
      url: product?.video?.media?.url,
    });
    imageArrayLength++;
  }
  if (product?.thumbnail?.media?.id) {
    imageArray.push({
      id: product.thumbnail?.media?.id,
      url: fixUrl(product.thumbnail?.media?.url),
    });
    imageArrayLength++;
  }
  if (product?.gallery?.length > 0) {
    product?.gallery?.forEach((image) => {
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
  if (product?.variations?.product_variations?.length > 0) {
    product?.variations?.product_variations?.forEach((variation) => {
      // imageArray.push({
      //   id: variation?.id,
      //   url: fixUrl(variation?.thumbnail?.media?.url),
      // });
      imageArrayLength++;
    });
  }

  // useEffect(() => {
  //   if (thumbsSwiper && !thumbsSwiper.destroyed) {
  //     thumbsSwiper.slideTo(activeSlideIndex);
  //   }
  //   if (mainSwiper && !mainSwiper.destroyed) {
  //     mainSwiper.slideTo(activeSlideIndex);
  //   }
  // }, [activeSlideIndex]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCanPlay = () => {
    setvideoLoaded(true)
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleVideoPlay = (e) => {
    const video = e.target;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setCartItem({
      product_id: currentProductId,
      shop_id: product.shop_id,
      quantity,
      variation_id: product?.product_type == "variable" ? currentVariationProduct?.id : undefined
    });
  }, [currentVariationProduct]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Fetch Products                                        */
  /* -------------------------------------------------------------------------------------------- */

  const fetchProduct = async (id) => {
    setLoading(true);

    imageArray = [];

    const { data, error } = await PRODUCTS.getProduct(id, {
      with: "gallery,attribute_items,rating,video,meta"
    });

    if (data) {
      // set product data
      setProduct(data.product);

      // set current variation
      setcurrentVariationProduct(data?.product.product_type == "auction" || data?.product.product_type == "simple" ? data.product : data?.product?.variations?.message ? data?.product : data?.product?.variations?.product_variations[0])

      // set current variation image
      // if (data?.product?.product_type == 'variable') {
      //   setcurrentVariationImage({
      //     id: `variation-image`,
      //     url: fixUrl(data?.product?.variations?.product_variations?.[0]?.thumbnail?.media?.url),
      //     type: 'image',
      //   });
      // }

      // set current variation attributes
      let arr = {}
      data?.product?.variations?.product_variations[0]?.attributes.product_variation_attribute_items.forEach((element) => {
        arr = { ...arr, [element.attribute.name]: { id: element.attribute_item.id, name: element.attribute_item.name, isSelected: false } }
      })
      setcurrentSelectedVariation(arr);

      // set cart item
      setCartItem((prev) => ({ ...prev, seller_id: data.product.shop_id, }));

      // Call fetchRelatedProducts here after setting the category
      const category = data.product.categories?.product_attribute_items[0]?.attribute_item_id;
      if (category) {
        setCurrentProductCategory(category);
        fetchRelatedProducts(category, true);
      }
    };

    if (error) {
      console.error(error);
      // document.location.href = '/';
    }

    setLoading(false);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const targetDate = new Date(product?.auction_end_time).getTime();
    if (isNaN(targetDate)) {
      return;
    }
    const updateTimer = () => {
      const now = new Date().getTime();
      const timeLeft = targetDate - now;
      if (timeLeft < 0) {
        clearInterval(intervalId);
        setIsProductExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    const intervalId = setInterval(updateTimer, 1000);
    updateTimer();
  }, [product?.auction_end_time]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchRelatedProducts = async (category = currentProductCategory, isInitialFetch = false) => {
    setLoadingMoreProducts(true);

    const attributes = [];

    if (category) {
      attributes.push({ key: 'categories', value: category, operator: '=' });
    }

    const requestParams = {
      with: "image,shop",
      orderBy: "created_at",
      order: "desc",
      page: isInitialFetch ? 1 : CurrentPage,
      per_page: 6
    };

    if (attributes.length > 0) {
      requestParams.filterByAttributes = {
        filterJoin: 'AND',
        attributes: attributes
      };
    }
    const { data, error } = await PRODUCTS.getProducts(requestParams);

    if (data) {
      if (isInitialFetch) {
        setsimilarProducts(data.products.data);
      } else {
        setsimilarProducts(prev => [...prev, ...data.products.data]);
      }
      settotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
    }

    setLoadingMoreProducts(false);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCurrentProductIdBySlug = async (slug) => {
    if (slug === '') {
      return;
    }
    const { data, error } = await PRODUCTS.getProductIdBySlug(slug);
    if (data) {
      setCurrentProductId(data.id);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCurrentProductIdBySlug(id);
  }, [id]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchProduct(currentProductId);
  }, [currentProductId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchRelatedProducts();
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (CurrentPage > 1) {
      fetchRelatedProducts();
    }
  }, [CurrentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   if (currentProductCategory) {
  //     fetchRelatedProducts();
  //   }
  // }, [currentProductCategory]);

  /* --------------------------------------------- X -------------------------------------------- */

  const InsertBid = async (event) => {

    setLoadingInsertBid(true);

    if (!currentUser) return setopenSigninPopup(true);

    if (IsProductExpired) {
      toast.warning("Sorry! The auction is already expired!");
      setLoadingInsertBid(false);
      return;
    }

    if (!canBid || canBid == false) {
      toast.warning("Sorry! You have already placed a bid!");
      setLoadingInsertBid(false);
      return;
    }

    if (bidAmount <= product?.price) {
      toast.warning("Bid amount should be greater than actual price!");
      setLoadingInsertBid(false);
      return;
    }

    const increment = product?.meta?.bid_increment_by > 0 ? product?.meta?.bid_increment_by : 10;
    const highest_bid_amount = product.bids.highest_bid > 0 ? product.bids.highest_bid : product?.price;

    if (bidAmount <= parseFloat(highest_bid_amount)) {
      toast.warning("Bid amount should be greater than highest bid");
      setLoadingInsertBid(false);
      return;
    }

    if (bidAmount < parseFloat(highest_bid_amount) + parseFloat(increment)) {
      toast.warning(`Bid amount should be incremented by at least $${increment} from the ${product.bids.highest_bid > 0 ? 'highest Bid' : 'starting price'}`);
      setLoadingInsertBid(false);
      return;
    }

    const { data, error } = await PRODUCT_BIDS.insertProductBid(product?.id, {
      product_id: product?.id,
      auction_bid_price: bidAmount
    });

    if (data) {
      // addToCart(event)
      toast.success(data.message);
      setcanBid(false);
      fetchProduct(currentProductId);
    }

    if (error) toast.error(error.message);

    setLoadingInsertBid(false);

  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                      Handle Add To Cart                                      */
  /* -------------------------------------------------------------------------------------------- */

  const addToCart = async (e) => {
    setLoadingAddToCart(true);

    e.preventDefault();

    if (!currentUser?.authToken) {
      setopenSigninPopup(true);
      return
    }

    const { data, error } = await CART_ITEMS.createCartItem(cartItem);

    if (data) {
      toast.success(data.message)
      cartsItemCount()
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

    if (error) {
      toast.error(error.data.message)
    }

    setLoadingAddToCart(false);
  }

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

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Add To Wishlist                                       */
  /* -------------------------------------------------------------------------------------------- */

  const AddedToWishlist = async () => {
    const wishlists = await WISHLIST.getWishlistItems({});
    const findAddeddWishlistItem = wishlists?.data?.wishlistItems.filter(x => {
      return x.product_id == currentProductId
    })
    setcanAddToWishlist(!findAddeddWishlistItem?.length > 0)
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const AddtoWishlist = async (e) => {
    e.preventDefault();

    if (!currentUser?.authToken) {
      setopenSigninPopup(true);
      return;
    }

    if (!canAddToWishlist) {
      toast.error("Item Already exists in wishlist");
      return;
    }

    const { data, error } = await WISHLIST.insertWishlistItem({ ...cartItem, user_id: currentUser?.id });

    if (data) {
      toast.success(data.message);

      fetchWishlistItemsCount();

      setShowWLToss(true);

      const WLTossWrapper = WLTossWrapperRef.current;
      let { top, right, width, height } = WLTossWrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      let transformDistanceX;
      let transformDistanceY;

      if (viewportWidth < 1024) {
        // Move to the bottom
        transformDistanceY = viewportHeight - (top + height + 14);
        transformDistanceX = (viewportWidth / 2) - ((right - 120) - (width / 2)) - (width / 2);
      } else {
        // Move to the top
        transformDistanceY = -top - 14;
        transformDistanceX = viewportWidth - (right + 400);
      }

      settransformDistanceY(transformDistanceY);
      settransformDistanceX(transformDistanceX);

      setTimeout(() => {
        setShowWLToss(false);
      }, 750);

      setTimeout(() => {
        settransformDistanceY(0);
        settransformDistanceX(0);
      }, 750);

      setcanAddToWishlist(false);

    }

    if (error) {
      toast.error(error.data.message);
    }

  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreProducts()
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
  }, [similarProducts]);

  /* --------------------------------------------- X -------------------------------------------- */

  const loadMoreProducts = () => {
    setCurrentPage(CurrentPage + 1)
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const openAccordian = (element) => {
    element.target.parentElement.classList.toggle("active");
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    let bid = product?.bids?.bids?.filter(x => {
      return x?.user_id == currentUser?.id
    })
    setcanBid(
      bid?.length > 0 ? false : true
    )
    findvariation()
    AddedToWishlist()
  }, [product])

  /* --------------------------------------------- X -------------------------------------------- */

  const copyLinkToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy:', error);
    }
  };

  const currentUrl = window.location.href;
  const title = "Check this out!";

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                       Fetch Chat ChatMessages                                */
  /* -------------------------------------------------------------------------------------------- */

  const fetchProductChatMessages = async (chatId) => {
    const { data, error } = await PRODUCTS.getProductChatMessages(chatId);
    if (data) {
      scrollToBottom();
      setProductChatMessages(data.ProductChatMessages);
    }
    if (error) {
      console.error(error.data.message);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Handle Change                                        */
  /* -------------------------------------------------------------------------------------------- */

  const handleProductMessageChange = (e) => {
    setProductMessage((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Handle Submit                                        */
  /* -------------------------------------------------------------------------------------------- */

  const handleSubmit = async (e) => {
    setloadingChatMessage(true);

    if (message?.message == '') {
      toast.warning('Message cannot be empty!');
      setloadingChatMessage(false);
      return;
    }

    if (!currentUser?.id) {
      setopenSigninPopup(true);
      setloadingChatMessage(false);
      return;
    }

    e.preventDefault();

    const { data, error } = await PRODUCTS.insertProductChatMessage(currentProductChat, message);

    if (data) {
      scrollToBottom();
      setProductChatMessages((currentMessages) => [...currentMessages, data.newMessage]);
      setProductMessage({ message: "", message_type: "text" });
    }

    if (error) {
      toast.error(error.data.message);
    }

    setloadingChatMessage(false)
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Handle Submit                                        */
  /* -------------------------------------------------------------------------------------------- */

  const handleChatSubmit = async () => {
    if (!currentUser?.id) {
      setopenSigninPopup(true);
      return;
    }

    const { data, error } = await PRODUCTS.insertProductChat({ product_id: product?.id });

    if (data) {
      setCurrentProductChat(data?.chat_id);
      settoggleLiveChat(true);
    }

    if (error) {
      toast.error(error.data.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentProductChat) {
      fetchProductChatMessages(currentProductChat);
    }
  }, [currentProductChat]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentProductChat) {
        fetchProductChatMessages(currentProductChat);
      }
    }, 20_000);
    return () => clearInterval(intervalId);
  }, [currentProductChat]);

  /* --------------------------------------------- X -------------------------------------------- */

  const videoRefs = useRef([]);
  const onSlideChange = (swiper) => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
      }
    });

    const activeSlideVideo = videoRefs.current[swiper.activeIndex];
    if (activeSlideVideo) {
      activeSlideVideo.play();
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Variation Code                                        */
  /* -------------------------------------------------------------------------------------------- */

  // const setCurrentVariation = (attribute, attributeItem, varId) => {
  //   let selectedVariation = { ...currentSelectedVariation };
  //   selectedVariation[attribute] = { id: null, name: attributeItem };

  //   // Find the variation that matches the selected color
  //   const selectedColorVariation = product?.variations?.product_variations.find(variation => {
  //     const colorAttribute = variation.attributes.product_variation_attribute_items.find(
  //       attr => attr.attribute.name === "Colors"
  //     );
  //     return colorAttribute && colorAttribute.attribute_item.name === attributeItem;
  //   });

  //   if (selectedColorVariation) {
  //     // Get the size from the selected color variation
  //     const sizeAttribute = selectedColorVariation.attributes.product_variation_attribute_items.find(
  //       attr => attr.attribute.name === "Sizes"
  //     );

  //     if (sizeAttribute) {
  //       // Update the selected variation with the size
  //       selectedVariation["Sizes"] = { id: null, name: sizeAttribute.attribute_item.name };

  //       // Update VariationsArr to show only the size from this variation
  //       const updatedSizes = VariationsArr.Sizes.map(size => ({
  //         ...size,
  //         isEnabled: size.name === sizeAttribute.attribute_item.name,
  //         isSelected: size.name === sizeAttribute.attribute_item.name
  //       }));

  //       setVariationsArr({ ...VariationsArr, Sizes: updatedSizes });
  //     }

  //     setcurrentSelectedVariation(selectedVariation);
  //     // setcurrentVariationProduct(selectedColorVariation);
  //     // setcurrentVariationImage({
  //     //   id: `gallery-${0}`,
  //     //   url: fixUrl(selectedColorVariation?.thumbnail?.media?.url),
  //     //   type: 'image',
  //     // });
  //     setActiveSlideIndex(selectedVariation?.id);
  //     setcanAddToCart(true);
  //   } else {
  //     setcurrentVariationProduct(null);
  //     setcanAddToCart(false);
  //     toast.warning("No variation found for the selected color!");
  //   }
  // };

  const setCurrentVariation = (attribute, attributeItem, varId, index) => {
    let selectedVariation = { ...currentSelectedVariation };
    selectedVariation[attribute] = { id: null, name: attributeItem };

    // Find the variation that matches the selected color
    const selectedColorVariation = product?.variations?.product_variations.find(variation => {
      const colorAttribute = variation.attributes.product_variation_attribute_items.find(
        attr => attr.attribute.name === "Colors"
      );
      return colorAttribute && colorAttribute.attribute_item.name === attributeItem;
    });

    if (selectedColorVariation) {
      // Set the selected color variation as the current variation
      setcurrentSelectedVariation(selectedVariation);
      setcurrentVariationProduct(selectedColorVariation);

      // Update the image for the selected variation
      setcurrentVariationImage({
        id: `gallery-${0}`,
        url: fixUrl(selectedColorVariation?.thumbnail?.media?.url),
        type: 'image',
      });

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
      setcurrentVariationProduct(null);
      setcanAddToCart(false);
      toast.warning("No variation found for the selected color!");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const findvariation = () => {
    let arr = {};
    if (!product?.variations?.message && product?.variations?.product_variations) {
      product.variations.product_variations.forEach((variation) => {
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

  /* --------------------------------------------- X -------------------------------------------- */

  const ViewProduct = async () => {
    const currentViews = parseInt(product.meta.views) || 0;
    const newViews = currentViews + 1;

    const { data, error } = await PRODUCTS.updateProductMeta(product?.id, {
      key: 'views',
      value: newViews,
    });

    if (error) {
      console.error('Error updating product views:', error);
    }
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (product?.id) {
      const timer = setTimeout(() => {
        ViewProduct();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [product?.id]);

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>{`${product?.name} | Buy Online on Tjara`}</title>
        <meta name="description" content={`Buy ${product?.name} on Tjara at the best price. Enjoy fast and free delivery with secure payments. Shop now for exclusive discounts!`} />
        <meta name="keywords" content={`Tjara, ${product?.name}, buy online, best price, e-commerce, shopping, discounts, free delivery, ${product?.categories?.product_attribute_items?.[0]?.attribute_item?.product_attribute_item?.name}, ${product?.brands?.product_attribute_items?.[0]?.attribute_item?.product_attribute_item?.name}`} />
        <meta property="og:title" content={`${product?.name} | Buy Online on Tjara`} />
        <meta property="og:description" content={`Shop ${product?.name} on Tjara. Get the best deals, fast delivery, and secure payments. Don't miss out on exclusive offers!`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.tjara.com/product/${product?.slug}`} />
        <meta property="og:image" content={product?.thumbnail?.media?.url || "https://www.tjara.com/assets/images/default-product.jpg"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product?.name} | Buy Online on Tjara`} />
        <meta name="twitter:description" content={`Order ${product?.name} today on Tjara. Enjoy great discounts, fast delivery, and a hassle-free shopping experience.`} />
        <meta name="twitter:image" content={product?.thumbnail?.media?.url || "https://www.tjara.com/assets/images/default-product.jpg"} />
      </Helmet>

      <section className="wrapper single-product-details-sec">
        <div className="main-sec">
          <div className="details-sec">
            <div className="product-perview-container">
              <div className="productImagesSlider">
                {/* ------------------------------------------------------------------------------ */}
                {/*                             Gallery Images Section                             */}
                {/* ------------------------------------------------------------------------------ */}
                {loading ? (
                  <Skeleton height={500} width={100} />
                ) : (
                  <div className="thumbnail-container">
                    {imageArrayLength > 1 ? (
                      <Swiper
                        style={{ height: "100%" }}
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
                            vertical: false,
                          },
                        }}
                        loop={true}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper"
                        initialSlide={0}
                      >
                        {imageArray.map((image, index) => (
                          <SwiperSlide key={index} style={{ marginBottom: '10px', border: '1px solid var(--main-red-color)' }}>
                            {isVideo(image.url) ? (
                              <video style={{ width: '100%', height: "100%", objectFit: 'contain' }} disablePictureInPicture src={image.url} />
                            ) : (
                              <img src={image.url} style={{ width: '100%', height: "100%", objectFit: 'contain' }} alt={'Image'} />
                            )}
                          </SwiperSlide>
                        ))}
                        {product?.product_type === 'variable' &&
                          product?.variations?.product_variations.length > 0 ? product?.variations?.product_variations?.map((image, index) => (
                            image?.thumbnail?.media?.url ? (
                              <SwiperSlide key={index} style={{ marginBottom: '10px', border: '1px solid var()' }}>
                                <img src={image?.thumbnail?.media?.url} style={{ width: '100%', height: "100%", objectFit: 'contain' }} alt={'Image'} />
                              </SwiperSlide>
                            ) : null
                          )) : null
                        }
                      </Swiper>
                    ) : imageArrayLength == 1 ? (
                      imageArray.map((image, index) => (
                        <div key={index} style={{ marginBottom: '10px', border: '1px solid var()' }}>
                          {isVideo(image.url) ? (
                            <video autoPlay muted={true} controls style={{ height: '80px', objectFit: 'contain' }} disablePictureInPicture src={image.url} />
                          ) : (
                            <img src={image.url} style={{ width: '80px', height: '80px', objectFit: 'contain' }} alt={'Image'} />
                          )}
                        </div>
                      ))
                    ) : ('')}
                  </div>
                )}
                {/* ------------------------------------------------------------------------------ */}
                {/*                             Preview Images Section                             */}
                {/* ------------------------------------------------------------------------------ */}
                {/* {
                  product?.product?.variation?.gallery?.map((image, index) => (
                    <img onClick={() => { setmainProductImage(fixUrl(image?.media?.url)); setMainImagePopup(true); }} src={fixUrl(image?.media?.url)} key={index} alt={`Thumbnail ${index}`} />
                  ))
                } */}
                {/* <div onClick={() => { setmainProductImage(fixUrl(image?.media?.url)); setMainImagePopup(true); }}>
                  <ImageMagnifier src={fixUrl(image?.media?.url)} width={"100%"} height={`100%`} />
                </div> */}
                {loading ? (
                  <Skeleton height={600} width={600} />
                ) : (
                  <div className="image-preview-container single-product-image-preview-container">
                    {imageArrayLength > 1 ? (
                      <Swiper
                        style={{ '--swiper-navigation-color': '#fff', '--swiper-pagination-color': '#fff', }}
                        loop={true}
                        spaceBetween={10}
                        onSlideChange={onSlideChange}
                        navigation={true}
                        touchAngle={30}
                        touchRatio={1}
                        verticalswiping="false"
                        pagination={{ clickable: true }}
                        breakpoints={{ 300: { pagination: { el: '.swiper-pagination', clickable: true, }, } }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        onSwiper={setMainSwiper}
                        ref={previewSwiper}
                        modules={[FreeMode, Navigation, Thumbs, Pagination]}
                        className="mySwiper2"
                        initialSlide={0}
                      >
                        {imageArray.map((image, index) => (
                          isVideo(image.url) ? (
                            <SwiperSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={index}>
                              {/* {!videoLoaded && <img src={loadingVideo} alt="" />} */}
                              <video onCanPlay={handleCanPlay} ref={el => videoRefs.current[index] = el} onClick={(e) => handleVideoPlay(e)} autoPlay loop disablePictureInPicture style={{ position: videoLoaded ? "static" : "absolute", opacity: videoLoaded ? "1" : "0", height: "100%", objectFit: "contain", background: "#F5F5F5" }} src={image.url} />
                            </SwiperSlide>
                          ) : (
                            <SwiperSlide key={index}>
                              <img onClick={() => { setmainProductImage(fixUrl(image.url)); setMainImagePopup(true); }} src={fixUrl(image.url)} alt="Image" />
                            </SwiperSlide>
                          )
                        ))}
                        {product?.product_type === 'variable' &&
                          product?.variations?.product_variations.length > 0 ? product?.variations?.product_variations?.map((image, index) => (
                            image?.thumbnail?.media?.url ? (
                              <SwiperSlide key={index}>
                                <img onClick={() => { setmainProductImage(fixUrl(image?.thumbnail?.media?.url)); setMainImagePopup(true); }} src={fixUrl(image?.thumbnail?.media?.url)} alt="Image" />
                              </SwiperSlide>
                            ) : null
                          )) : null
                        }
                      </Swiper>
                    ) : imageArrayLength == 1 ? (
                      imageArray.map((image, index) => (
                        isVideo(image.url) ? (
                          <video key={index} style={{ height: "100%", objectFit: "contain" }} autoPlay muted loop disablePictureInPicture src={image.url} />
                        ) : (
                          <img key={index} onClick={() => { setmainProductImage(fixUrl(image.url)); setMainImagePopup(true); }} src={fixUrl(image.url)} alt="Image" />
                        )
                      ))
                    ) : ('')}
                  </div>
                )}
              </div>

              <div className="product-perview-details">
                <div className="productPreviewTop">
                  {loading ? (
                    <Skeleton height={25} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    product?.sale_price > 0 ? <p>{(((product?.price - product?.sale_price) / product?.price) * 100).toFixed(2)} % Off</p> : ''
                  )}

                  {loading ? (
                    <Skeleton height={25} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    product?.categories?.product_attribute_items.length > 0 ? <p><Link style={{ color: 'inherit', textDecoration: 'none' }} to={`/global/${product?.categories?.product_attribute_items?.[0]?.attribute_item?.product_attribute_item?.slug}`}>{product?.categories?.product_attribute_items?.[0]?.attribute_item?.product_attribute_item?.name}</Link></p> : ''
                  )}

                  {loading ? (
                    <Skeleton height={25} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    product?.brands?.product_attribute_items.length > 0 ? <p>{product?.brands?.product_attribute_items[0]?.attribute_item?.product_attribute_item?.name}</p> : ''
                  )}

                  {loading ? (
                    <Skeleton height={25} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <p>Views : {product?.meta?.views}</p>
                  )}

                  {/* <p>#2 Top Rated</p> */}
                  <div className={`share ${shareButtons ? "active" : ""}`}>
                    <button onClick={() => setshareButtons(!shareButtons)}><svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.375 8.50008L13.9167 0.041748V4.87508C5.45833 6.08342 1.83333 12.1251 0.625 18.1667C3.64583 13.9376 7.875 12.0042 13.9167 12.0042V16.9584L22.375 8.50008Z" fill="#999999" /></svg>Share</button>
                    <div className="shareButtons">
                      <span onClick={shareToWhatsApp}><img src={Whatsapp} alt="" /></span>
                      <span onClick={shareToFacebook}><img src={facebook} alt="" /></span>
                      <span onClick={shareToTwitter}><img src={twitter} alt="" /></span>
                      <span onClick={shareToLinkedIn}><img src={linkedin} alt="" /></span>
                      {/* <span to={"https://www.pinterest.com"}><img src={pinterest} alt="" /></span> */}
                      <span onClick={() => copyLinkToClipboard(window.location.href)}><img src={copyLink} alt="" /></span>
                    </div>
                  </div>
                </div>
                {/* ------------------------------------------------------------------------------ */}
                {/*                                  Product Name                                  */}
                {/* ------------------------------------------------------------------------------ */}
                {loading ? (
                  <Skeleton height={25} width={100} style={{ margin: '10px 0' }} />
                ) : (
                  product?.meta?.product_id &&
                  (<span title="Click to copy to clipboard" style={{ fontSize: '15px', cursor: 'pointer', marginBottom: '10px', display: 'flex' }} onClick={() => copyLinkToClipboard(product?.meta?.product_id)} className="product-id">
                    ID : <span className="product-id-number">{product?.meta?.product_id}</span>
                  </span>)
                )
                }

                {loading ? (
                  <Skeleton height={25} style={{ margin: '10px 0' }} />
                ) : (
                  <p className="product-title">
                    {product?.name}
                  </p>
                )}

                <div className="product-perview-review-row">
                  {loading ? (
                    <Skeleton height={30} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <div className="prouct-perview-rating">{renderStars(product?.reviews?.reviews?.average_rating, RatedStar, EmptyStar)}</div>
                  )}
                  {loading ? (
                    <Skeleton height={30} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <p className="prouct-perview-rating-text">({product?.reviews?.reviews?.average_rating ?? 0})</p>
                  )}
                  {loading ? (
                    <Skeleton height={30} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <p className="prouct-perview-review-text">{product?.reviews?.reviews?.total_reviews} reviews</p>
                  )}
                  {loading ? (
                    <Skeleton height={30} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <p className="prouct-perview-sales-text">({product?.meta?.sold ?? 0}) Sold</p>
                  )}
                  {loading ? (
                    <Skeleton height={30} width={100} style={{ margin: '10px 0' }} />
                  ) : (
                    <p className="prouct-perview-sales-text">Listed: {timeAgo(product?.created_at)}</p>
                  )}
                </div>

                {product?.product_type == "auction" &&
                  <>
                    <div className="AuctionExpiryDateTime">
                      {IsProductExpired ? <p style={{ color: "white" }}>Expired!</p> :
                        <>
                          <h2>Bidding Ends In: </h2>
                          <div className="time">
                            <div>
                              <p>{timeLeft?.days}</p>
                              <span>Day</span>
                            </div>
                            <p className="gap">:</p>
                            <div>
                              <p>{timeLeft?.hours}</p>
                              <span>Hrs</span>
                            </div>
                            <p className="gap">:</p>
                            <div>
                              <p>{timeLeft?.minutes}</p>
                              <span>Mins</span>
                            </div>
                            <p className="gap">:</p>
                            <div>
                              <p>{timeLeft?.seconds}</p>
                              <span>Sec</span>
                            </div>
                          </div>
                        </>
                      }
                    </div>
                    <div style={{ margin: "20px 0", border: "1px solid var()", display: "flex", padding: "15px 10px", borderRadius: "15px 5px", justifyContent: "space-between" }} className="AuctionExpiryDate">
                      <p>
                        Total Bids : {product?.bids?.bids?.length ?? 0} Bids
                      </p>
                      <p>
                        Highest Bid : ${product?.bids?.highest_bid ?? 0}
                      </p>
                    </div>
                  </>
                }

                {loading ? (
                  <Skeleton height={50} width={100} style={{ margin: '10px 0' }} />
                ) : (
                  <div className="product-perview-price-row">
                    {product?.product_group === 'car' && product?.meta?.hide_price === '1' ? (
                      <p style={{ margin: '10px auto 10px 0' }} className="product-perview-discounted-price">Price: Ask the dealer</p>
                    ) : (
                      <>
                        {/* ------------------------------------------------------------------------------ */}
                        {/*                              For Variable Product                              */}
                        {/* ------------------------------------------------------------------------------ */}
                        {product?.product_type !== 'variable' ? (
                          product?.sale_price ? (
                            <>
                              <p style={{ textDecoration: 'line-through' }} className="product-perview-original-price">{formatPrice(product?.price)}</p>
                              <p className="product-perview-discounted-price">{formatPrice(product?.sale_price)}</p>
                            </>
                          ) : (
                            <p className="product-perview-discounted-price">{formatPrice(product?.price)}</p>
                          )
                        ) : product?.product_type == 'variable' ? (
                          currentVariationProduct?.sale_price ? (
                            <>
                              <p style={{ textDecoration: 'line-through' }} className="product-perview-original-price">{formatPrice(currentVariationProduct?.price)}</p>
                              <p className="product-perview-discounted-price">{formatPrice(currentVariationProduct?.sale_price)}</p>
                            </>
                          ) : (
                            <p className="product-perview-discounted-price">{formatPrice(currentVariationProduct?.price)}</p>
                          )
                        ) : ("")}
                      </>
                    )}
                    {/* ---------------------------------------------------------------------------- */}
                    {/*                                     Stock                                    */}
                    {/* ---------------------------------------------------------------------------- */}
                    <p className="product-perview-stock-percent">({currentVariationProduct?.stock > 0 ? currentVariationProduct?.stock : 0}) Available in Stock</p>
                  </div>
                )}

                {loading ? (
                  <Skeleton height={50} style={{ margin: '10px 0' }} />
                ) : (
                  product?.product_type === "variable" && (
                    <ProductVariations
                      product={product}
                      onVariationSelect={(variation) => {
                        setcurrentVariationProduct(variation);
                        setCartItem(prev => ({
                          ...prev,
                          variation_id: variation.id
                        }));
                      }}
                      currentVariationProduct={currentVariationProduct}
                      setCurrentVariationProduct={setcurrentVariationProduct}
                      setCanAddToCart={setcanAddToCart}
                      previewSwiper={previewSwiper}
                    />
                  )
                )}

                {product?.product_group == "car" && (
                  <div className="carMainDetails product-perview-color-box">
                    {product?.product_meta?.find(meta => meta.key === 'mileage')?.value && (
                      <div>
                        <p>MILEAGE (KM/LITER)</p>
                        <h2>{product?.product_meta?.find(meta => meta.key === 'mileage')?.value ?? 'None'}</h2>
                      </div>
                    )}
                    {product?.product_meta?.find(meta => meta.key === 'transmission')?.value && (
                      <div>
                        <p>Transmission</p>
                        <h2>{product?.product_meta?.find(meta => meta.key === 'transmission')?.value ?? 'None'}</h2>
                      </div>
                    )}
                    {product?.product_meta?.find(meta => meta.key === 'fuel_type')?.value && (
                      <div>
                        <p>Fuel Type</p>
                        <h2>{product?.product_meta?.find(meta => meta.key === 'fuel_type')?.value ?? 'None'}</h2>
                      </div>
                    )}
                    {product?.product_meta?.find(meta => meta.key === 'engine')?.value && (
                      <div>
                        <p>Engine</p>
                        <h2>{product?.product_meta?.find(meta => meta.key === 'engine')?.value ?? 'None'}</h2>
                      </div>
                    )}
                  </div>
                )}

                {loading ? (
                  <Skeleton height={50} width={100} style={{ margin: '20px 0' }} />
                ) : (
                  product?.product_type != "auction" && product?.product_group != "car" ?
                    currentVariationProduct?.stock != 0 ?
                      <div className="inputGroup quantity">
                        <div className="product-perview-color-heading size ">
                          <div className="quantity-sec">
                            Quantity
                            <div className="QuantityInput">
                              <input type="number" placeholder="1" onChange={() => setCartItem({ ...cartItem, quantity: parseInt(event.target.value == "" ? 1 : event.target.value >= currentVariationProduct?.stock ? currentVariationProduct?.stock : event.target.value) })} value={cartItem.quantity} />
                              <div>
                                <button onClick={() => { cartItem.quantity >= currentVariationProduct?.stock ? toast.error(`Sorry only ${currentVariationProduct?.stock} items are available`) : setCartItem({ ...cartItem, quantity: cartItem.quantity + 1 }) }}>+</button>
                                <button onClick={() => setCartItem({ ...cartItem, quantity: cartItem.quantity == 1 ? 1 : cartItem.quantity <= 0 ? 0 : cartItem.quantity - 1 })}>-</button>
                              </div>
                            </div>
                          </div>
                          {/* <p className="sold">
                          <span>{currentVariationProduct?.stock ?? product?.stock}</span>/ {product?.meta?.sold ?? 0} sold
                        </p> */}
                        </div>
                      </div>
                      :
                      <p style={{ color: "var(--main-red-color)", margin: "30px 0" }}>Sold Out</p>
                    : null
                )}

                {/* ------------------------------------------------------------------------------ */}
                {/*                                        X                                       */}
                {/* ------------------------------------------------------------------------------ */}

                {product?.product_type === "auction" ?
                  isAuctionEnded(product?.auction_end_time) ?
                    <p style={{ margin: "20px 0", color: "var()" }}>Sorry Auction Expired!</p>
                    :
                    <div className={`bidInput ${canBid}`} style={(!canBid || IsProductExpired) ? { pointerEvents: "none", opacity: "0.6" } : {}}>
                      <input type="number" step={product?.meta?.bid_increment_by > 0 ? product?.meta?.bid_increment_by : 10} onChange={() => setbidAmount(parseInt(event.target.value))} placeholder="Bid Amount ($)" />
                      <button onClick={() => InsertBid(event)}>{loadingInsertBid ? 'Inserting...' : 'Bid Now'}</button>
                    </div>
                  :
                  product?.product_group !== "car" &&
                  <>
                    {loading ? (
                      <Skeleton height={50} style={{ margin: '10px 0' }} />
                    ) : (
                      <button style={!canAddToCart || product?.stock == 0 ? { opacity: ".6", pointerEvents: "none" } : { position: "relative" }} className="button product-perview-add-to-cart-btn buy-now-btn" onClick={() => BuyNow(event)}>
                        {loadingBuyNow ? 'Lets go...' : 'Buy Now'}
                        <div className={`${showCartToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={cartTossWrapperRef}>
                          <div className="number">1</div>
                        </div>
                      </button>
                    )}
                    {loading ? (
                      <Skeleton height={50} style={{ margin: '10px 0' }} />
                    ) : (
                      <button style={!canAddToCart || product?.stock == 0 ? { opacity: ".6", pointerEvents: "none" } : { position: "relative" }} className="button product-perview-add-to-cart-btn" onClick={() => addToCart(event)}>
                        {loadingAddToCart ? 'Adding...' : 'Add To Cart'}
                        <div className={`${showCartToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={cartTossWrapperRef}>
                          <div className="number">1</div>
                        </div>
                      </button>
                    )}
                  </>
                }

                {loading ? (
                  <Skeleton height={50} style={{ margin: '10px 0' }} />
                ) : (
                  product?.product_group === "car" &&
                  <div className="query">
                    <p>If you have any query! Enquire Now</p>
                    <button className="button" onClick={() => setcustomerServicePopup(true)}>
                      Enquire Now
                      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19.8407 14.22C20.249 13.2283 20.4707 12.1666 20.4707 11C20.4707 10.16 20.3423 9.35498 20.1207 8.60831C19.3623 8.78331 18.569 8.87665 17.7407 8.87665C16.0443 8.87847 14.3723 8.47242 12.8658 7.69274C11.3592 6.91306 10.0622 5.78259 9.08399 4.39665C8.0376 6.92851 6.06363 8.96508 3.56565 10.09C3.51898 10.3816 3.51898 10.6966 3.51898 11C3.51898 12.1138 3.73837 13.2167 4.16461 14.2458C4.59086 15.2748 5.21561 16.2098 6.00321 16.9974C7.59383 18.588 9.75117 19.4816 12.0007 19.4816C13.2257 19.4816 14.404 19.2133 15.4657 18.735C16.1307 20.0066 16.434 20.6366 16.4107 20.6366C14.4973 21.2783 13.0157 21.5933 12.0007 21.5933C9.17732 21.5933 6.48232 20.485 4.49898 18.49C3.29265 17.2874 2.39592 15.8101 1.88565 14.185H0.333984V8.87665H1.60565C1.99093 7.00124 2.87673 5.26512 4.16904 3.8525C5.46135 2.43988 7.11198 1.40345 8.94577 0.853197C10.7796 0.30294 12.7281 0.259379 14.5847 0.727136C16.4412 1.19489 18.1365 2.15652 19.4907 3.50998C20.9609 4.97444 21.9638 6.84209 22.3723 8.87665H23.6673V14.185H23.5973L19.444 18L13.2607 17.3V15.3516H18.8957L19.8407 14.22ZM8.81565 10.7316C9.16565 10.7316 9.50398 10.8716 9.74898 11.1283C9.9952 11.3765 10.1334 11.712 10.1334 12.0616C10.1334 12.4113 9.9952 12.7467 9.74898 12.995C9.50398 13.24 9.16565 13.38 8.81565 13.38C8.08065 13.38 7.48565 12.7966 7.48565 12.0616C7.48565 11.3266 8.08065 10.7316 8.81565 10.7316ZM15.174 10.7316C15.909 10.7316 16.4923 11.3266 16.4923 12.0616C16.4923 12.7966 15.909 13.38 15.174 13.38C14.439 13.38 13.844 12.7966 13.844 12.0616C13.844 11.7089 13.9841 11.3706 14.2335 11.1212C14.483 10.8718 14.8212 10.7316 15.174 10.7316Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {loading ? (
                  <Skeleton height={50} style={{ margin: '10px 0' }} />
                ) : (
                  <button style={!canAddToWishlist ? { opacity: ".6", pointerEvents: "none", position: "relative" } : { position: "relative" }} onClick={() => AddtoWishlist(event)} className="button product-perview-wishlist-btn">
                    Add To Wishlist
                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0007 21.9083L10.309 20.3683C4.30065 14.92 0.333984 11.315 0.333984 6.91667C0.333984 3.31167 3.15732 0.5 6.75065 0.5C8.78065 0.5 10.729 1.445 12.0007 2.92667C13.2723 1.445 15.2207 0.5 17.2507 0.5C20.844 0.5 23.6673 3.31167 23.6673 6.91667C23.6673 11.315 19.7007 14.92 13.6923 20.3683L12.0007 21.9083Z" fill="white" />
                    </svg>
                    <div className={`${showWLToss ? "show" : ""} cart-toss-number`} style={{ transform: `translate(${transformDistanceX}px, ${transformDistanceY}px)`, }} ref={WLTossWrapperRef}>
                      <div className="number" style={{ background: "#34a853" }}>1</div>
                    </div>
                  </button>
                )}

                {product?.product_group !== "car" &&
                  <div className="query">
                    <p>If you have any query! Enquire Now</p>
                    <button className="button" onClick={() => setcustomerServicePopup(true)}>
                      Enquire Now
                      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19.8407 14.22C20.249 13.2283 20.4707 12.1666 20.4707 11C20.4707 10.16 20.3423 9.35498 20.1207 8.60831C19.3623 8.78331 18.569 8.87665 17.7407 8.87665C16.0443 8.87847 14.3723 8.47242 12.8658 7.69274C11.3592 6.91306 10.0622 5.78259 9.08399 4.39665C8.0376 6.92851 6.06363 8.96508 3.56565 10.09C3.51898 10.3816 3.51898 10.6966 3.51898 11C3.51898 12.1138 3.73837 13.2167 4.16461 14.2458C4.59086 15.2748 5.21561 16.2098 6.00321 16.9974C7.59383 18.588 9.75117 19.4816 12.0007 19.4816C13.2257 19.4816 14.404 19.2133 15.4657 18.735C16.1307 20.0066 16.434 20.6366 16.4107 20.6366C14.4973 21.2783 13.0157 21.5933 12.0007 21.5933C9.17732 21.5933 6.48232 20.485 4.49898 18.49C3.29265 17.2874 2.39592 15.8101 1.88565 14.185H0.333984V8.87665H1.60565C1.99093 7.00124 2.87673 5.26512 4.16904 3.8525C5.46135 2.43988 7.11198 1.40345 8.94577 0.853197C10.7796 0.30294 12.7281 0.259379 14.5847 0.727136C16.4412 1.19489 18.1365 2.15652 19.4907 3.50998C20.9609 4.97444 21.9638 6.84209 22.3723 8.87665H23.6673V14.185H23.5973L19.444 18L13.2607 17.3V15.3516H18.8957L19.8407 14.22ZM8.81565 10.7316C9.16565 10.7316 9.50398 10.8716 9.74898 11.1283C9.9952 11.3765 10.1334 11.712 10.1334 12.0616C10.1334 12.4113 9.9952 12.7467 9.74898 12.995C9.50398 13.24 9.16565 13.38 8.81565 13.38C8.08065 13.38 7.48565 12.7966 7.48565 12.0616C7.48565 11.3266 8.08065 10.7316 8.81565 10.7316ZM15.174 10.7316C15.909 10.7316 16.4923 11.3266 16.4923 12.0616C16.4923 12.7966 15.909 13.38 15.174 13.38C14.439 13.38 13.844 12.7966 13.844 12.0616C13.844 11.7089 13.9841 11.3706 14.2335 11.1212C14.483 10.8718 14.8212 10.7316 15.174 10.7316Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                }
                <div className="accordians">
                  {product?.product_group !== "car" &&
                    <div className="accordian">
                      <div className="accordianButton">
                        <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0V2H19V17H12.844C12.398 15.281 10.852 14 9 14C7.148 14 5.602 15.281 5.156 17H4V12H2V19H5.156C5.602 20.719 7.148 22 9 22C10.852 22 12.398 20.719 12.844 19H21.156C21.602 20.719 23.148 22 25 22C26.852 22 28.398 20.719 28.844 19H32V10.844L31.937 10.687L29.937 4.687L29.72 4H21V0H0ZM1 4V6H10V4H1ZM21 6H28.281L30 11.125V17H28.844C28.398 15.281 26.852 14 25 14C23.148 14 21.602 15.281 21.156 17H21V6ZM2 8V10H8V8H2ZM9 16C10.117 16 11 16.883 11 18C11 19.117 10.117 20 9 20C7.883 20 7 19.117 7 18C7 16.883 7.883 16 9 16ZM25 16C26.117 16 27 16.883 27 18C27 19.117 26.117 20 25 20C23.883 20 23 19.117 23 18C23 16.883 23.883 16 25 16Z" fill="#474747" /></svg>
                        Shipping
                      </div>
                      <div className="accordianBody shipping">
                        <div className="box">
                          <p>
                            Shipping Fees : <span>{product?.meta?.shipping_fees ? `$ ${product?.meta?.shipping_fees}` : '----'}</span>
                          </p>
                          <p>
                            Shipping Time : <span> {product?.meta?.shipping_time_from ?? '---'}-{product?.meta?.shipping_time_to} {product?.meta?.shipping_time_unit ? `Business ${product?.meta?.shipping_time_unit}` : ''}</span>
                          </p>
                        </div>
                        <div className="box">
                          <p>
                            Shipping Company : <span>{product?.meta?.shipping_company ?? '----'}</span>
                          </p>
                          {/* <p>Get a $4.00 credit for late delivery</p> */}
                        </div>
                      </div>
                    </div>
                  }
                  <div className="accordian">
                    <div className="accordianButton">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 16.59L11.41 14L10 15.41L14 19.41L22 11.41L20.59 10L14 16.59Z" fill="#474747" />
                        <path d="M16 30L9.82401 26.707C8.06334 25.7703 6.59097 24.3719 5.56493 22.6617C4.53888 20.9516 3.99789 18.9943 4.00001 17V4C4.00054 3.46973 4.21142 2.96133 4.58638 2.58637C4.96134 2.21141 5.46974 2.00053 6.00001 2H26C26.5303 2.00053 27.0387 2.21141 27.4136 2.58637C27.7886 2.96133 27.9995 3.46973 28 4V17C28.0021 18.9943 27.4611 20.9516 26.4351 22.6617C25.409 24.3719 23.9367 25.7703 22.176 26.707L16 30ZM6.00001 4V17C5.99835 18.6318 6.44111 20.2333 7.28077 21.6325C8.12043 23.0317 9.32528 24.1758 10.766 24.942L16 27.733L21.234 24.943C22.6749 24.1767 23.8798 23.0324 24.7195 21.633C25.5592 20.2336 26.0018 18.632 26 17V4H6.00001Z" fill="#474747" />
                      </svg>
                      Shopping security
                    </div>
                    <div className="accordianBody shipping">
                      <ul>
                        <li onClick={() => setpaymentPopup(true)}>
                          Safe Payment Options
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#D21642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </li>
                        <li>
                          Secure logistics
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#D21642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          Secure privacy
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#D21642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </li>
                        <li>
                          Purchase protection
                          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1L6 6L1 1" stroke="#D21642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="StoreDetails">
                  <div className="container">
                    <div className="logo">
                      {loading ? (
                        <Skeleton height={80} width={80} style={{ borderRadius: '100%' }} />
                      ) : (
                        product?.shop?.shop?.thumbnail?.media?.url ?
                          <img src={fixUrl(product?.shop?.shop?.thumbnail?.media?.url)} alt="" onClick={() => navigate(`/store/${product?.shop?.shop?.slug}`)} />
                          :
                          <div onClick={() => navigate(`/store/${product?.shop?.shop?.slug}`)}>{product?.shop?.shop?.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="details">
                      <div className="top">
                        {loading ? (
                          <Skeleton height={20} width={100} style={{ margin: '10px 0' }} />
                        ) : (
                          <p className="name" onClick={() => navigate(`/store/${product?.shop?.shop?.slug}`)}>{product?.shop?.shop?.name}</p>
                        )}
                      </div>
                      <div className="bottom">
                        <div className="followers">
                          {/* <p>800 Reviews</p> */}
                          <p onClick={() => navigate(`/store/${product?.shop?.shop?.slug}`)}>Seller's other items</p>
                          <p onClick={() => setcustomerServicePopup(true)}>Contact seller</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="description">
                {/* <div className="ratings">
                  <div className="product-perview-review-row">
                    <div onClick={() => setguidelinesPopup(true)}>
                      {cardDetail.rating == 1 ? (
                        <>
                          <img src={RatedStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                        </>
                      ) : cardDetail.rating == 2 ? (
                        <>
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                        </>
                      ) : cardDetail.rating == 3 ? (
                        <>
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={EmptyStar} alt="" />
                          <img src={EmptyStar} alt="" />
                        </>
                      ) : cardDetail.rating == 4 ? (
                        <>
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={EmptyStar} alt="" />
                        </>
                      ) : (
                        <>
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                          <img src={RatedStar} alt="" />
                        </>
                      )}
                    </div>
                    <p className="prouct-perview-rating-text">
                      ({cardDetail.rating})
                    </p>
                    <p className="prouct-perview-review-text">
                      {cardDetail.reviews} reviews
                    </p>
                  </div>
                  <div
                    className="trusted"
                    onClick={() => setreviewsPopup(true)}
                  >
                    <svg
                      width="19"
                      height="23"
                      viewBox="0 0 19 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.25586 0.5L0.255859 4.5V10.5C0.255859 16.05 4.09586 21.24 9.25586 22.5C14.4159 21.24 18.2559 16.05 18.2559 10.5V4.5L9.25586 0.5ZM7.25586 16.5L3.25586 12.5L4.66586 11.09L7.25586 13.67L13.8459 7.08L15.2559 8.5L7.25586 16.5Z"
                        fill="#34A853"
                      />
                    </svg>
                    All reviews are from verified purchases
                  </div>
                </div>
                <div className="tabs">
                  <button className="active">Item reviews (4,625)</button>
                  <button>Provider reviews (10,341)</button>
                </div>
               
             
                <div className="Details">
                  <h1 className="MainHeading">Details:</h1>
                  <ul>
                    <li>
                      Sole Material: <span>MD</span>
                    </li>
                    <li>
                      Upper Material: <span>Fabric</span>
                    </li>
                    <li>
                      Patterned: <span>Stripes</span>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      Insole Material: <span>Fabric</span>
                    </li>
                    <li>
                      Inner Material: <span>Without Lining</span>
                    </li>
                    <li>
                      Product ID: <span>335140</span>
                    </li>
                  </ul>
                  <div className="productImages">
                    <img src={cardDetail.images[0]} alt="" />
                    <img src={cardDetail.images[1]} alt="" />
                    <img src={cardDetail.images[2]} alt="" />
                    <img src={cardDetail.images[3]} alt="" />
                  </div>
                  <button className="loadMore">See More Picture</button>
                </div>
                <div className="giveReviews">
                  <h2 className="MainHeading">Give Reviews</h2>
                  <p>
                    Nunc velit metus, volutpat elementum euismod eget, cursus
                    nec nunc.
                  </p>
                  <form action="">
                    <input type="text" placeholder="Enter Full Name" />
                    <input
                      type="email"
                      placeholder="Enter Your Email Address"
                    />
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                    <button type="submit">Submit</button>
                  </form>
                </div> */}
                <div className="tabs">
                  <button className={tabs == "description" ? "active" : ""} onClick={() => settabs("description")}>
                    Description
                  </button>
                  {product?.product_type !== "auction" && (
                    <button onClick={() => settabs("reviews")} className={tabs == "reviews" ? "active" : ""}>
                      Customer Reviews ({product?.reviews?.reviews?.total_reviews ?? 0})
                    </button>
                  )}
                </div>

                <div className="tabsContainers">
                  {tabs == "description" && (
                    <div className="descriptionContainer tabContainer">
                      {/* <h1 className="heading">Description:</h1> */}
                      {product?.description && (<p dangerouslySetInnerHTML={{ __html: product?.description }} />)}
                      <hr />
                      {product?.product_group == "car" && (
                        <div className="specifications">
                          <h1 className="heading">Specifications</h1>
                          <div className="row">
                            {product?.meta &&
                              // Object.entries(product?.meta).map(([key, value], index) => (
                              //   <div key={index}>
                              //     <p>{key}</p>
                              //     <h2>{value}</h2>
                              //   </div>
                              // ))
                              <>
                                {product?.meta?.condition && (
                                  <div>
                                    <p>Condition</p>
                                    <h2>{product?.meta?.condition}</h2>
                                  </div>
                                )}
                                {product?.meta?.mileage && (
                                  <div>
                                    <p>Mileage</p>
                                    <h2>{product?.meta?.mileage}</h2>
                                  </div>
                                )}
                                {product?.meta?.transmission && (
                                  <div>
                                    <p>Transmission</p>
                                    <h2>{product?.meta?.transmission}</h2>
                                  </div>
                                )}
                                {product?.meta?.fuel_type && (
                                  <div>
                                    <p>Fuel Type</p>
                                    <h2>{product?.meta?.fuel_type}</h2>
                                  </div>
                                )}
                                {product?.meta?.engine && (
                                  <div>
                                    <p>Engine (CC)</p>
                                    <h2>{product?.meta?.engine}</h2>
                                  </div>
                                )}
                              </>
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {tabs == "reviews" && (
                    <div className="reviewsContainer tabContainer active">
                      {product?.reviews?.reviews?.reviews.length > 0 ?
                        <>
                          <div className="top">
                            <p>Reviews</p>
                            <label htmlFor="">Sort</label>
                            <select name="" id="">
                              <option value="">Best Match</option>
                              <option value="">Best Match</option>
                              <option value="">Best Match</option>
                            </select>
                          </div>
                          <div className="itemReviews reviews">
                            {product?.reviews?.reviews?.reviews.map((review, index) => (
                              <div key={index} className="singleReview">
                                <div className="user">
                                  <img src={reviewUser} className="reviewUser" alt="" />
                                  <div className="name">
                                    <p>{review?.user?.user?.first_name} {review?.user?.user?.last_name} on {new Date(review?.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    <div className="ratings">
                                      <div className="product-perview-review-row">
                                        <div onClick={() => setguidelinesPopup(true)}>
                                          {[...Array(5)].map((_, index) => {
                                            const filledStars = Math.floor(review?.rating || 0);
                                            return (
                                              <img key={index} src={index < filledStars ? RatedStar : EmptyStar} alt="" />
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="verified">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M18.617 8.03949C18.3602 7.86713 18.1284 7.66036 17.9279 7.42495C17.9428 7.09719 18.0086 6.77375 18.1232 6.46629C18.3384 5.73755 18.6065 4.8306 18.0898 4.12092C17.5694 3.4056 16.6187 3.38158 15.8549 3.36206C15.5336 3.3749 15.2122 3.34034 14.901 3.25951C14.7298 2.99108 14.5992 2.69892 14.5132 2.39242C14.2583 1.66663 13.9409 0.763289 13.0906 0.486988C12.2656 0.218857 11.5253 0.728284 10.8724 1.17626C10.6101 1.38573 10.3155 1.55132 10.0002 1.6666C9.68476 1.55144 9.39007 1.38585 9.12766 1.17626C8.4748 0.72789 7.73422 0.220071 6.90942 0.486988C6.05942 0.763289 5.74204 1.66617 5.4869 2.39212C5.40108 2.6971 5.27185 2.98816 5.10319 3.25636C4.79098 3.33965 4.46795 3.37519 4.1451 3.36177C3.38135 3.38125 2.43064 3.4053 1.91022 4.12059C1.39354 4.83067 1.66161 5.73762 1.87689 6.46643C1.99008 6.77225 2.05654 7.09338 2.07403 7.41901C1.87443 7.65775 1.6417 7.86671 1.38291 8.03952C0.766667 8.50948 0 9.09456 0 9.99994C0 10.9053 0.766667 11.4904 1.38304 11.9604C1.63977 12.1327 1.87163 12.3395 2.07212 12.5749C2.05724 12.9027 1.99135 13.2261 1.87682 13.5336C1.66158 14.2623 1.39348 15.1693 1.91015 15.879C2.43057 16.5943 3.38129 16.6183 4.14507 16.6378C4.46636 16.625 4.7878 16.6596 5.09903 16.7404C5.27015 17.0088 5.40081 17.301 5.48681 17.6075C5.74195 18.3334 6.05932 19.2366 6.90951 19.513C7.06015 19.5624 7.21767 19.5875 7.37619 19.5875C8.01606 19.5875 8.60035 19.1859 9.12773 18.8237C9.39007 18.6142 9.68464 18.4486 9.99997 18.3333C10.3155 18.4484 10.6102 18.614 10.8726 18.8236C11.5254 19.272 12.2658 19.7794 13.0908 19.5129C13.9408 19.2366 14.2582 18.3337 14.5133 17.6077C14.5991 17.3028 14.7284 17.0117 14.897 16.7435C15.2092 16.6602 15.5323 16.6247 15.8551 16.6381C16.6189 16.6186 17.5696 16.5946 18.09 15.8793C18.6067 15.1692 18.3386 14.2622 18.1233 13.5334C18.0101 13.2276 17.9437 12.9065 17.9262 12.5809C18.1258 12.3421 18.3585 12.1332 18.6173 11.9604C19.2333 11.4904 20 10.9053 20 9.99994C20 9.09456 19.2333 8.50948 18.617 8.03949ZM13.7142 8.50581L9.54752 12.6725C9.22221 12.9979 8.69471 12.998 8.36929 12.6727L8.3691 12.6725L6.28576 10.5891C5.95621 10.2678 5.94952 9.74024 6.27079 9.41069C6.59207 9.08114 7.11968 9.07445 7.44922 9.39573C7.45427 9.40065 7.45926 9.40564 7.46418 9.41069L8.95831 10.9049L12.5358 7.32735C12.8571 6.9978 13.3847 6.99114 13.7142 7.31242C14.0438 7.6337 14.0504 8.1613 13.7291 8.49085C13.7242 8.49593 13.7192 8.50089 13.7142 8.50581Z"
                                        fill="#096C2B"
                                      />
                                    </svg>
                                    Verified Purchase
                                  </p>
                                </div>
                                <div className="reviewBox">
                                  <p className="reviewText">{review?.description}</p>
                                  <div className="imgs">
                                    {review?.reviewThumbnails.map((thumbnail, index) => (
                                      <img key={index} src={thumbnail?.media?.optimized_media_url} alt="" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button className="loadMore">See All Reviews</button>
                          </div>
                        </>
                        :
                        <div className="no-reviews top">Not Reviews Found!</div>
                      }
                    </div>
                  )}
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div >
      </section >

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                 Similar Products Section                                 */}
      {/* ---------------------------------------------------------------------------------------- */}

      <div className="singleProductBottomCards feature-products-container">
        <div className="feature-products-container-heading-row">
          {/* <p className="feature-product-heading-name">Similar Products {product?.categories?.product_attribute_items.length > 0 ? `in "${product?.categories?.product_attribute_items[0]?.attribute_item?.product_attribute_item?.name}"` : ''}</p> */}
          <SectionHeading heading={`Similar Products ${product?.categories?.product_attribute_items.length > 0 ? `in "${product?.categories?.product_attribute_items[0]?.attribute_item?.product_attribute_item?.name}"` : ''}`} />
        </div>
        <div className="feature-products-items-container">
          {similarProducts?.map((e, i) => {
            return <ProductCard key={i} detail={e} />;
          })}
          {window.innerWidth <= 500 && similarProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif">
            <img src={loadingGif} alt="" />
          </div>}
        </div>
        {window.innerWidth >= 500 && similarProducts?.length < totalItems &&
          (<div className="load-more-btn-row">
            <button className="button" onClick={loadMoreProducts}> {loadingMoreProducts ? 'Loading More...' : 'Load More'} </button>
          </div>)
        }
      </div>

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                       Sign In Popup                                      */}
      {/* ---------------------------------------------------------------------------------------- */}

      <SignInPopup />
      {
        showSizePopup ? (
          <div className="sizeguidePopup">
            <div className="bg" onClick={() => setshowSizePopup(false)} />
            <div className="container">
              <div className="top">
                <h1>
                  <svg onClick={() => setshowSizePopup(false)} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5.25H2.8725L7.065 1.0575L6 0L0 6L6 12L7.0575 10.9425L2.8725 6.75H12V5.25Z" fill="#D21642" />
                  </svg>
                  Size Guide:
                </h1>
                <div className="inputGroups">
                  <div className="inputField">
                    <label htmlFor="">Select Size by Country:</label>
                    <select name="" id="">
                      <option value="">UK Size</option>
                    </select>
                  </div>
                  <div className="inputField">
                    <label htmlFor="">Select Size Term:</label>
                    <select name="" id="">
                      <option value="">Inches</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="main">
                <h2>Product Measurements</h2>
                <div className="table">
                  <div className="row">
                    <p>Label Size (CN)</p>
                    <p>39</p>
                    <p>40</p>
                    <p>41</p>
                    <p>42</p>
                    <p>43</p>
                    <p>44</p>
                    <p>45</p>
                  </div>
                  <div className="row">
                    <p>Size (UK)</p>
                    <p>39</p>
                    <p>40</p>
                    <p>41</p>
                    <p>42</p>
                    <p>43</p>
                    <p>44</p>
                    <p>45</p>
                  </div>
                  <div className="row">
                    <p>Foot Length</p>
                    <p>39</p>
                    <p>40</p>
                    <p>41</p>
                    <p>42</p>
                    <p>43</p>
                    <p>44</p>
                    <p>45</p>
                  </div>
                </div>
              </div>
              <h2 className="measure">How to Measure?</h2>
              <div className="bottom">
                <div className="accordians">
                  <div className="accordian active">
                    <div className="accordianButton" onClick={() => openAccordian(event)}>
                      1. Foot Length{" "}
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 6L6 1L1 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div className="accordianBody">Measure the maximum length of your foot.</div>
                  </div>
                  <div className="accordian active">
                    <div className="accordianButton" onClick={() => openAccordian(event)}>
                      2. Foot width{" "}
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 6L6 1L1 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div className="accordianBody">Measure the maximum width of your foot.</div>
                  </div>
                </div>
                <img src={FootImg} alt="" />
              </div>
            </div>
          </div>
        ) : (
          ""
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                     Size Rating Popup                                    */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        sizeRatingsPopup && (
          <div className="sizeRatingsPopup">
            <div className="bg" onClick={() => setsizeRatingsPopup(false)}></div>
            <div className="container">
              <h2>92% of customers say these fit true to size</h2>
              <div className="percent">
                <div class="progress-circle  p3">
                  <span className="label">Small</span>
                  <span>3%</span>
                  <div class="left-half-clipper">
                    <div class="first50-bar" />
                    <div class="value-bar" />
                  </div>
                </div>
                <div class="progress-circle over50 p92">
                  <span className="label">True To Size</span>
                  <span>92%</span>
                  <div class="left-half-clipper">
                    <div class="first50-bar" />
                    <div class="value-bar" />
                  </div>
                </div>
                <div class="progress-circle  p5">
                  <span className="label">Large</span>
                  <span>5%</span>
                  <div class="left-half-clipper">
                    <div class="first50-bar" />
                    <div class="value-bar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                     Guidelines Popup                                     */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        guidelinesPopup && (
          <div className="guidelinesPopup">
            <div className="bg" onClick={() => setguidelinesPopup(false)} />
            <div className="container">
              <h2>Guidelines for rating</h2>
              <p>Customer reviews, including star ratings, help customers to learn more about the item to decide whether it is the right item for them.Temu calculates a star rating using machine-learned models instead of a simple average. They use multiple criteria that establish the authenticity and trustworthiness of the review. The system continues to learn and improve over time.</p>
              <button onClick={() => setguidelinesPopup(false)}>OK</button>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Payment Methods Popup                                  */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        paymentPopup && (
          <div className="paymentPopup">
            <div className="bg" onClick={() => setpaymentPopup(false)} />
            <div className="container">
              <h2>Safe Payment Options</h2>
              <ul>
                <li>
                  <span>Tjara is committed to protecting your payment information.</span>
                  We follow PCI DSS standards, use strong encryption, and perform regular reviews of its system to protect your privacy.
                </li>
              </ul>
              <h3>1. Payment methods</h3>
              <div className="paymentMethods">
                <img src={paypal} alt="" />
                <img src={visa} alt="" />
                <img src={mastercard} alt="" />
                <img src={americanExpress} alt="" />
                <img src={discover} alt="" />
                <img src={dclubs} alt="" />
                <img src={maestro} alt="" />
                <img src={jcb} alt="" />
                <img src={applePay} alt="" />
                <img src={clearpay} alt="" />
              </div>
              <h3>Security Certifications</h3>
              <div className="paymentMethods">
                <img src={pci} alt="" />
                <img src={visaSecure} alt="" />
                <img src={mastercard} alt="" />
                <img src={safeke} alt="" />
                <img src={protectBuy} alt="" />
                <img src={jSecure} alt="" />
                <img src={trusted} alt="" />
              </div>

              <div className="logistics">
                <h2>Safe Payment Options</h2>
                <ul>
                  <li>
                    Package safety <br />
                    <span>Full refund for your damaged or lost package.</span>
                  </li>
                  <li>
                    Delivery guaranteed <br />
                    <span>Accurate and precise order tracking.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                       Reveiws Popup                                      */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        reviewsPopup && (
          <div className="guidelinesPopup reviewsPopup">
            <div className="bg" onClick={() => setreviewsPopup(false)} />
            <div className="container">
              <p>This means that all reviewers posted their reviews after purchasing the item(s) from Tjara.</p>
              <button onClick={() => setreviewsPopup(false)}>OK</button>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                 Product Foot Measurement                                 */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        productMeasurmentPopup && (
          <div className="productMeasurmentPopup">
            <div className="bg" onClick={() => setproductMeasurmentPopup(false)} />
            <div className="container">
              <h2>
                Product Measurement:
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 6L6 1L1 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </h2>
              <p>Foot Length: 26 cm, Label Size CN40 </p>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Image Magnifier Popup                                  */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        MainImagePopup && (
          <div className="MainImagePopup">
            <div className="bg" onClick={() => setMainImagePopup(false)} />
            <div className="container">
              <ImageMagnifier src={[mainProductImage]} width={"100%"} height={"100%"} />
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                      Live Chat Popup                                     */}
      {/* ---------------------------------------------------------------------------------------- */}

      <div className="fixedContactIcons">
        {/* <img onClick={() => {settoggleLiveChat(!toggleLiveChat)handleChatSubmit()}} src={chat} alt="" /> */}
        <img style={{ cursor: 'pointer', width: '70px', height: '70px' }} onClick={() => setcustomerServicePopup(true)} src={WhatsappNew} alt="WhatsApp" />
      </div>

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                  Customer Service Popup                                  */}
      {/* ---------------------------------------------------------------------------------------- */}

      {
        customerServicePopup && (
          <div className="customerServicePopup">
            <div className="bg" onClick={() => setcustomerServicePopup(false)} />
            <div className="container">
              <h2>Customer service</h2>
              <ul>
                <li>Our customer service team is always here if you need help.</li>
              </ul>
              <div className="icons">
                {(() => {
                  // Extract phone numbers and area codes
                  const metaData = product?.shop?.shop?.meta || {};
                  const phone = metaData.phone || metaData.whatsapp || "";
                  const phoneAreaCode = metaData.area_code || metaData.whatsapp_area_code || "";

                  // Check if phone number is valid for calls
                  const isPhoneValid = phone && phone !== 'undefined' && phone !== '';

                  // Style for disabled links
                  const disabledStyle = { opacity: '0.5', filter: 'blur(0.5)', position: 'relative' };
                  const enabledStyle = { cursor: 'pointer', position: 'relative' };

                  // Tooltip styles
                  const tooltipStyle = {
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    width: '200px',
                    textWrap: 'wrap',
                    textAlign: 'center',
                    display: 'none'
                  };

                  // Tooltip messages
                  const phoneTooltipMessage = "Phone number not provided by seller";
                  const whatsappTooltipMessage = "WhatsApp number is not valid or not provided";

                  return (
                    <>
                      <div className="singleIcon-wrapper" style={{ position: 'relative' }}>
                        <Link
                          style={isPhoneValid ? enabledStyle : disabledStyle}
                          target={isPhoneValid ? "_blank" : "_self"}
                          to={isPhoneValid ? `tel:${phoneAreaCode && phoneAreaCode !== 'undefined' ? phoneAreaCode : ''}${phone}` : "#"}
                          className="singleIcon"
                          onMouseEnter={(e) => {
                            if (!isPhoneValid) {
                              const tooltip = e.currentTarget.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'block';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPhoneValid) {
                              const tooltip = e.currentTarget.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'none';
                            }
                          }}
                        >
                          <div>
                            <img src={call} alt="call-icon" />
                          </div>
                          <p>Call</p>
                        </Link>
                        {!isPhoneValid && <div style={tooltipStyle}>{phoneTooltipMessage}</div>}
                      </div>

                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setcustomerServicePopup(!customerServicePopup);
                          handleChatSubmit();
                        }}
                        className="singleIcon"
                      >
                        <div>
                          <img src={chat} alt="chat-icon" />
                        </div>
                        <p>Live Chat</p>
                      </div>

                      <div className="singleIcon-wrapper" style={{ position: 'relative' }}>
                        <Link
                          style={isPhoneValid ? enabledStyle : disabledStyle}
                          target={isPhoneValid ? "_blank" : "_self"}
                          to={isPhoneValid ? `https://api.whatsapp.com/send?phone=${phoneAreaCode && phoneAreaCode !== 'undefined' ? phoneAreaCode : ''}${phone.replace(/^\+/, "")}` : "#"}
                          className="singleIcon"
                          onMouseEnter={(e) => {
                            if (!isPhoneValid) {
                              const tooltip = e.currentTarget.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'block';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPhoneValid) {
                              const tooltip = e.currentTarget.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'none';
                            }
                          }}
                        >
                          <div>
                            <img src={WhatsappNew} alt="whatsapp-icon" />
                          </div>
                          <p>WhatsApp</p>
                        </Link>
                        {!isPhoneValid && <div style={tooltipStyle}>{whatsappTooltipMessage}</div>}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        )
      }

      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                             X                                            */}
      {/* ---------------------------------------------------------------------------------------- */}

      {toggleLiveChat &&
        <div className="liveChatContainer">
          <div className="closeContainer" onClick={() => settoggleLiveChat(!toggleLiveChat)} />
          <div class="LiveChat">
            <div class="chat_box">
              <div class="head">
                <div class="user">
                  <div class="avatar">
                    {product?.shop?.shop?.thumbnail?.media?.url ?
                      <img src={fixUrl(product?.shop?.shop?.thumbnail?.media?.url)} />
                      :
                      <div style={{ background: 'var(--main-red-color)', color: '#fff', width: '40px', height: '40px', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="shop-gravatar">{product?.shop?.shop?.name.charAt(0)}</div>
                    }
                  </div>
                  <div class="name">{product?.shop?.shop?.name}</div>
                </div>
                <ul class="bar_tool">
                  <li><span class="alink"><i class="fas fa-phone" /></span></li>
                  <li><span class="alink"><i class="fas fa-video" /></span></li>
                  <li><span class="alink"><i class="fas fa-ellipsis-v" /></span></li>
                </ul>
              </div>
              <div class="body">
                {Array.isArray(productChatMessages) && productChatMessages.length > 0 ? (
                  productChatMessages.map((faker, fakerKey) => (
                    <div key={fakerKey} className={`${faker?.user_id === currentUser?.id ? "outgoing" : "incoming"}`}>
                      <div className={`bubble ${faker?.user_id === currentUser?.id ? "lower" : ""}`}>
                        <p>{faker.message}</p>
                        <p>{timeAgo(faker.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Messages!</p>
                )}
                {/* <div class="typing">
                  <div class="bubble">
                    <div class="ellipsis dot_1"></div>
                    <div class="ellipsis dot_2"></div>
                    <div class="ellipsis dot_3"></div>
                  </div>
                </div> */}
              </div>
              <div class="foot">
                <input type="text" name={'message'} onKeyDown={(e) => { e.key == "Enter" ? handleSubmit(e) : '' }} onChange={handleProductMessageChange} value={message.message} class="msg" placeholder="Type a message..." />
                <button onClick={handleSubmit} type="submit">{loadingChatMessage ? 'Submitting...' : 'Submit'} <i class="fas fa-paper-plane" /></button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default SingleProduct;
