// modules
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { User, LogOut, MessageCircleMore, ShoppingCart, Heart, MessageSquareMore, BellRing, Languages, ChevronDown, ExternalLink, X, Search, Tag, Camera, Loader } from 'lucide-react';
import _ from 'lodash';
// api clients
import NOTIFICATIONS from '../../client/notificationsClient';
import PRODUCTS from "@client/productsClient.js";
import PRODUCT_ATTRIBUTES from '@client/productAttributesClient.js'
// components
import LoginModal from "@components/LoginModal/LoginModal";
import LeadGenerationModal from "@components/LeadGenerationModal/LeadGenerationModal";
import ForgotPasswordModal from "@components/ForgotPasswordModal";
import ResetPasswordModal from "@components/ResetPasswordModal";
import SmsVerificationModal from "@components/SmsVerificationModal";
import SignUpModal from "@components/SignUpModal/SignUpModal";
import AccountDropdown from "../AccountDropdown";
// contexts
// import { usePopup } from "@components/DataContext";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
// helpers
import { formatPrice, timeAgo } from "../../helpers/helpers";
// images
import logo from "@assets/logo.svg";
import logoOptimized from "./assets/tjara.png";
import dashboard from "@assets/header-dashboard.svg";
import headerCaret from "@assets/header-caret.svg";
import language from "@assets/language.svg";
import wishlist from "@assets/wishlist.svg";
import cart from "@assets/header-shopping-cart.svg";
import account from "@assets/header-user.svg";
// css
import 'swiper/css';
import 'swiper/css/autoplay';
import "./Header.css";

/* ---------------------------------------------- X --------------------------------------------- */

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ---------------------------------------------- X --------------------------------------------- */

function Header() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCameraPopup, setshowCameraPopup] = useState(false)
  const { globalSettings } = useheaderFooter();
  const query = useQuery();
  const [searchInput, setsearchInput] = useState(query.get('search') || '');
  const [correctedInput, setCorrectedInput] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [searchbarDropdown, setsearchbarDropdown] = useState({ name: "All", route: "global/products" });
  const [toggleSearchdropdown, settoggleSearchdropdown] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const searchBar = useRef(null);
  const { signInPopup, cartItemsCount, cartsItemCount, wishlistItemsCount, fetchWishlistItemsCount, currentHeaderColor, resetPassPopup, isSearching, setIsSearching } = usePopup();
  const { currentUser, logout } = useAuth();
  const [cartPopup, setcartPopup] = useState(false);
  const navigate = useNavigate();
  const resetPassQuery = query.get('password-reset');
  const [notifications, setNotifications] = useState({
    data: [],
    current_page: 1,
    prev_page_url: '',
    next_page_url: '',
    links: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ProductChatsCount, setProductChatsCount] = useState(0);
  const [productChats, setProductChats] = useState([]);
  const [suggestions] = useState(['Mobile phones', 'Mens clothing', 'Books', 'Mens shoes', 'Fitness equipment', 'Mens watches', 'Furniture', 'Mens grooming kits', 'Toys & games', 'Mens backpacks', 'Used cars', 'Mens jackets', 'Laptops', 'Mens sportswear', 'Smartwatches', 'Mens wallets', 'Womens clothing', 'Tablets', 'Womens shoes', 'Gaming consoles', 'Womens handbags', 'Headphones', 'Womens jewelry', 'Home appliances', 'Womens skincare', 'Kitchen gadgets', 'Womens makeup', 'Smart TVs', 'Womens perfumes', 'Office supplies']);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(suggestions[0]);
  const [fade, setFade] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState({
    products: [],
    categories: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  let placeholderIndex = 0;

  /* --------------------------------------------- X -------------------------------------------- */

  // const debouncedSearch = useRef(
  //   _.debounce((query) => {
  //     if (query.length < 2) {
  //       setSearchSuggestions({ products: [], categories: [] });
  //       return;
  //     }

  //     fetchSuggestedProducts(query.toLowerCase());

  //     fetchSuggestedCategories(query.toLowerCase());
  //   }, 300)
  // ).current;

  // // Spell check debounce
  // const debouncedSpellCheck = useRef(
  //   _.debounce((text) => {
  //     if (text.length < 2) {
  //       setCorrectedInput("");
  //       setShowCorrection(false);
  //       return;
  //     }

  //     checkSpelling(text);
  //   }, 500)
  // ).current;

  /* -------------------------------------------------------------------------------------------- */
  /*                             Function To Check Spelling Using API                             */
  /* -------------------------------------------------------------------------------------------- */

  // const checkSpelling = async (text) => {
  //   if (!text || text.trim() === "") return;

  //   setIsChecking(true);

  //   try {
  //     // You could use your own proxy endpoint to protect API keys
  //     const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/spellcheck`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ text }),
  //     });

  //     const data = await response.json();

  //     if (data.corrected && data.corrected !== text) {
  //       setCorrectedInput(data.corrected);
  //       setShowCorrection(true);
  //     } else {
  //       setShowCorrection(false);
  //     }
  //   } catch (error) {
  //     console.error("Error checking spelling:", error);
  //     setShowCorrection(false);
  //   } finally {
  //     setIsChecking(false);
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const handleProductClick = (product) => {
  //   const newUrl = `/${product?.product_group == 'car' ? 'cars' : 'global'}/${product?.categories?.product_attribute_items?.[0]?.attribute_item?.product_attribute_item?.slug || 'products'}?search=${encodeURIComponent(searchInput)}`;
  //   window.history.replaceState(null, '', newUrl);
  //   window.location.href = newUrl;
  //   setShowSuggestions(false);
  //   setShowCorrection(false);
  // };

  // const handleCategoryClick = (category) => {
  //   const newUrl = `/${category?.post_type == 'car' ? 'cars' : 'global'}/${category?.slug || 'products'}?search=${encodeURIComponent(searchInput)}`;
  //   window.history.replaceState(null, '', newUrl);
  //   window.location.href = newUrl;
  //   setShowSuggestions(false);
  //   setShowCorrection(false);
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const openSearch = () => {
    if (window.innerWidth <= 1024) {
      searchBar.current.classList.toggle("active");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const startCamera = async () => {
  //   try {
  //     setshowCameraPopup(!showCameraPopup);
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     setStream(stream);
  //     videoRef.current.srcObject = stream;
  //   } catch (error) {
  //     console.error('Error accessing the camera', error);
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
      setshowCameraPopup(!showCameraPopup);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    setshowCameraPopup(!showCameraPopup);
    setCapturedImage(imageDataUrl);
    navigate("/global/products");
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchProductChatsCount = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await PRODUCTS.getProductChatsCount();
    if (data) {
      setProductChatsCount(data.chats_count);
    }
    if (error) {
      console.error("Error fetching chats count:", error);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                          Fetch Chat                                          */
  /* -------------------------------------------------------------------------------------------- */

  const fetchProductChats = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await PRODUCTS.getProductChats({
      orderBy: "created_at",
      order: "desc",
      per_page: 20,
    });
    if (data) {
      setProductChats(data.ProductChats);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchSuggestedProducts = async (e) => {
  //   const { data, error } = await PRODUCTS.getProducts({
  //     with: "categories",
  //     search: e,
  //     orderBy: "created_at",
  //     order: "desc",
  //     per_page: 20,
  //   });
  //   if (data) {
  //     setSearchSuggestions((prev) => ({
  //       ...prev,
  //       products: data.products.data,
  //     }));
  //   }
  //   if (error) {
  //     console.error(error);
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchSuggestedCategories = async (e) => {
  //   const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', {
  //     // post_type: slug === 'cars' ? 'car' : slug === 'shop' ? 'product' : slug === 'global' ? '' : '',
  //     // with: 'thumbnail',
  //     search: e,
  //     hide_empty: true,
  //     order_by: 'product_count',
  //     order: 'desc',
  //     limit: 20,
  //   });
  //   if (data) {
  //     setSearchSuggestions((prev) => ({
  //       ...prev,
  //       categories: data.product_attribute.attribute_items.product_attribute_items,
  //     }));
  //   }
  //   if (error) {
  //     console.error(error);
  //   }
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchNotificationsCount = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await NOTIFICATIONS.getNotificationsCount();
    if (data) {
      setNotificationsCount(data.notifications_count);
    }
    if (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await NOTIFICATIONS.getNotifications({
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: 20,
    });
    if (data) {
      setNotifications(data.notifications);
      setCurrentPage(data.notifications.current_page);
    }
    if (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const deleteNotification = async (id) => {
    const { data, error } = await NOTIFICATIONS.deleteNotification(id);
    if (data) {
      fetchNotifications()
      toast.success(data.message);
    };
    if (error) toast.error(error.message);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const deleteAllNotifications = async () => {
    const { data, error } = await NOTIFICATIONS.deleteAllNotifications();
    if (data) {
      fetchNotifications()
      toast.success(data.message);
    };
    if (error) toast.error(error.message);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setShowSuggestions(true);
  }, [searchSuggestions]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleLogoNavigation = () => {
    setsearchInput("");
    navigate("/");
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (resetPassQuery == 'true') {
      resetPassPopup();
    }
  }, [resetPassQuery])

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      const intervalId = setInterval(() => {
        fetchProductChatsCount()
        fetchProductChats();
        fetchNotificationsCount();
        fetchNotifications();
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      cartsItemCount();
      fetchWishlistItemsCount();
      fetchProductChatsCount();
      fetchProductChats();
      fetchNotificationsCount();
      fetchNotifications();
    }
  }, [currentUser]);

  /* --------------------------------------------- X -------------------------------------------- */

  // const SearchBar = ({ image }) => {
  //   const [searchQuery, setSearchQuery] = useState('');
  //   const handleSearch = () => {
  //   };
  //   return (
  //     <div>
  //       <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." />
  //       <button onClick={handleSearch}>Search</button>
  //     </div>
  //   );
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // Apply correction 
  // const applyCorrection = () => {
  //   setsearchInput(correctedInput);
  //   setShowCorrection(false);
  //   // Update the URL
  //   const url = `/${searchbarDropdown.route}?search=${encodeURIComponent(correctedInput)}`;
  //   const newUrl = window.location.origin + url;
  //   window.history.replaceState(null, '', newUrl);
  //   // Perform search with corrected term
  //   debouncedSearch(correctedInput);
  // };

  // Handle input change
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setsearchInput(value);

    // Check spelling (with debounce)
    // debouncedSpellCheck(value);

    // Normal search functionality
    // debouncedSearch(value);

    const url = `/${searchbarDropdown.route}?search=${encodeURIComponent(value)}`;
    const newUrl = window.location.origin + url;
    window.history.replaceState(null, '', newUrl);
  };

  // Handle search button click or Enter
  const handleSearch = () => {
    setIsSearching(true);

    // If there's a correction, use it; otherwise use the input as is
    const finalQuery = showCorrection ? correctedInput : searchInput;
    setsearchbarDropdown(searchbarDropdown === "Products" ? "shop/products" : searchbarDropdown);
    // setShowSuggestions(false);
    // setShowCorrection(false);
    navigate(`/${searchbarDropdown.route}?search=${encodeURIComponent(finalQuery)}`);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel();
  //     debouncedSpellCheck.cancel();
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (searchRef.current && !searchRef.current.contains(event.target)) {
  //       setShowSuggestions(false);
  //       setShowCorrection(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        placeholderIndex = (placeholderIndex + 1) % suggestions.length;
        setCurrentPlaceholder(suggestions[placeholderIndex]);
        setFade(true);
      }, 500);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [suggestions]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Lead Generation Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <LeadGenerationModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                        Login Modal                                       */}
      {/* ---------------------------------------------------------------------------------------- */}
      <LoginModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Forgot Password Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <ForgotPasswordModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                   Reset Password Modal                                   */}
      {/* ---------------------------------------------------------------------------------------- */}
      <ResetPasswordModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                      Register Modal                                      */}
      {/* ---------------------------------------------------------------------------------------- */}
      <SignUpModal />
      {/* ---------------------------------------------------------------------------------------- */}
      {/*                                  Sms Verification Modal                                  */}
      {/* ---------------------------------------------------------------------------------------- */}
      <SmsVerificationModal />

      <div className="header" style={window.innerWidth <= 500 ? { backgroundColor: 'var(--main-red-color)' /* currentHeaderColor */ } : {}}>
        <div className="website-logo" onClick={() => handleLogoNavigation()} style={{ cursor: "pointer" }}>
          <img src={/* globalSettings.website_logo_url ?? */ logoOptimized} style={{ maxWidth: "165px" }} width={165} height={68} alt="Tjara Logo" className="logo" />
        </div>

        <div className="header-search-prod-container" ref={searchBar}>
          <div className={`searchbarDropdown ${toggleSearchdropdown ? "active" : ""}`}>
            <div className="header-product-container" onClick={() => settoggleSearchdropdown(!toggleSearchdropdown)}>
              <img width="18px" height="18px" src={dashboard} alt="all-navs-icon" />
              <p>{searchbarDropdown.name}</p>
              <img width="14px" height="7px" className="header-caret-icon" src={headerCaret} alt="dropdown-icon" />
            </div>
            <div className="dropdown">
              <div className="bg" onClick={() => settoggleSearchdropdown(!toggleSearchdropdown)} />
              <p onClick={() => {
                setsearchbarDropdown({ name: "All", route: "global/products" })
                settoggleSearchdropdown(false)
              }}>All</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Products", route: "shop/products" })
                settoggleSearchdropdown(false)
              }}>Products</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Cars", route: "cars/products" })
                settoggleSearchdropdown(false)
              }}>Cars</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Services", route: "services" })
                settoggleSearchdropdown(false)
              }}>Services</p>
              <p onClick={() => {
                setsearchbarDropdown({ name: "Contests", route: "contests" })
                settoggleSearchdropdown(false)
              }}>Contests</p>
              {/* <p onClick={() => {
              setsearchbarDropdown({ name: "Stores", route: "store" })
              settoggleSearchdropdown(false)
            }}>Stores</p> */}
            </div>
          </div>

          <div className="header-input-container">
            <div className="search-suggestions-container" ref={searchRef}>
              <div className="search-field">
                <input
                  type="search"
                  value={searchInput}
                  // onFocus={() => setShowSuggestions(true)}
                  placeholder={currentPlaceholder}
                  className={fade ? 'fade-in search-input' : 'fade-out search-input'}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) => handleSearchInput(e)}
                />

                {isSearching ? (
                  <Loader className="loader-icon" size={25} />
                ) : (
                  <Search onClick={handleSearch} className="search-icon" size={20} />
                )}
              </div>

              {/* {showCorrection && (
                <div className="spelling-suggestion">
                  Did you mean: <button onClick={(e) => applyCorrection(e)} className="correction-button">
                    {correctedInput}
                  </button>
                </div>
              )} */}

              {/* {isChecking && <small className="checking-spelling">Checking spelling...</small>} */}

              {/* {showSuggestions && (searchInput?.length > 1) && (searchSuggestions?.products?.length > 0 || searchSuggestions?.categories?.length > 0) && (
                <div className="suggestions-dropdown">
                  {searchSuggestions?.products?.length > 0 && (
                    <div className="suggestions-section">
                      <h3 className="suggestions-title">
                        <Search size={16} />
                        In Popular Products
                      </h3>
                      <div className="suggested-products">
                        {searchSuggestions?.products?.map((product) => (
                          <div
                            key={product?.id}
                            onClick={() => handleProductClick(product)}
                            className="suggestion-item product-suggestion"
                          >
                            <img src={product?.thumbnail?.media?.optimized_media_url || product?.thumbnail?.media?.url || logoOptimized} alt={product?.name} className="product-thumbnail" />
                            <div className="product-info">
                              <span className="product-name">{product?.name}</span>
                              <span className="product-price">{formatPrice(product?.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchSuggestions?.categories?.length > 0 && (
                    <div className="suggestions-section">
                      <h3 className="suggestions-title">
                        <Tag size={16} />
                        In Categories
                      </h3>
                      <div className="suggested-categories">
                        {searchSuggestions?.categories?.map((category) => (
                          <div
                            key={category?.id}
                            onClick={() => handleCategoryClick(category)}
                            className="suggestion-item category-suggestion"
                          >
                            <span className="category-name">{category?.name}</span>
                            <span className="category-count">{category?.product_count} items</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="header-menus-right">
          <div style={{ display: "none" }} className="header-menus-item-single">
            <Languages size={20} />
            <div className="langauge-drop-down">
              <select name="" id="">
                <option value="">English</option>
                <option value="">Arabic</option>
                <option value="">Spanish</option>
                <option value="">French</option>
              </select>
            </div>
            {/* <ChevronDown size={20} /> */}
          </div>

          <div className="header-menus-item-single wishlist">
            <Link to={"/wishlist"}><Heart size={18} /> {wishlistItemsCount > 0 && <span className="">{wishlistItemsCount}</span>}My Wishlist</Link>
          </div>

          <div className="header-menus-item-single count">
            <Link to="/cart">{cartItemsCount > 0 && <span className="">{cartItemsCount}</span>} <ShoppingCart size={18} /> Cart</Link>
          </div>

          {currentUser?.authToken && (
            <div className="header-menus-item-single notifications-dropdown">
              <div className="notifications-icon">
                <MessageSquareMore size={20} />
                {ProductChatsCount > 0 && <span className="notifications-count">{ProductChatsCount}</span>}
              </div>
              <div className="notifications-content">
                <div className="notifications-header">
                  <h3>Messages</h3>
                  <Link target='_blank' to={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/product-chats`} className="clear-all">See All</Link>
                </div>
                <ul className="notifications-list">
                  {productChats?.data?.length > 0 ? (
                    productChats?.data?.map((chat, index) => (
                      <li onClick={() => window.open(`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/product-chats?chatId=${chat?.id}`, "_blank")} key={index} className="notification-item">
                        <Link className="notification-title">{chat?.user?.user?.first_name} {chat?.user?.user?.last_name}</Link>
                        <div className="notification-description">{chat?.last_message}</div>
                        <div className="notification-date">{timeAgo(chat?.created_at)}</div>
                        <Link className="delete-notification"><ExternalLink size={15} /></Link>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No messages</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {currentUser?.authToken && (
            <div className="header-menus-item-single notifications-dropdown">
              <div className="notifications-icon">
                <BellRing size={20} />
                {notificationsCount > 0 && <span className="notifications-count">{notificationsCount}</span>}
              </div>
              <div className="notifications-content">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button onClick={deleteAllNotifications} className="clear-all">Clear All</button>
                </div>
                <ul className="notifications-list">
                  {notifications?.data?.length > 0 ? (
                    notifications.data.map((notification, index) => (
                      <li key={index} className="notification-item">
                        <Link to={notification?.url} className="notification-title">{notification.title}</Link>
                        <div className="notification-description">{notification.description}</div>
                        <div className="notification-date">{notification.date}</div>
                        <button onClick={() => deleteNotification(notification.id)} className="delete-notification"><X size={15} /></button>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No notifications</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <AccountDropdown currentUser={currentUser} logout={logout} signInPopup={signInPopup} />

          <div className="header-menus-item-single searchIcon" onClick={openSearch}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.875 13.875L16.5 16.5M15.75 8.625C15.75 4.68997 12.56 1.5 8.625 1.5C4.68997 1.5 1.5 4.68997 1.5 8.625C1.5 12.56 4.68997 15.75 8.625 15.75C12.56 15.75 15.75 12.56 15.75 8.625Z" stroke="#096C2B" strokeWidth="1.92857" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {showCameraPopup &&
          <div className="cameraPopup">
            <button className="closeCamera" onClick={stopCamera}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
            </button>
            <button className="captureImage" onClick={captureImage} />
            <video ref={videoRef} width="320" height="240" autoPlay />
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            {capturedImage && (
              <div>
                <h2>Captured Image</h2>
                <img src={capturedImage} alt="Captured" />
              </div>
            )}
          </div>
        }
      </div>
    </>
  );
}

export default Header;