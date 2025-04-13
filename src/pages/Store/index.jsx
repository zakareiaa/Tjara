import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import Slider from "react-slick";
import MultiRangeSlider from "multi-range-slider-react";

import ProductCard from "@components/ProductCard";
import AuctionCard from "@components/AuctionCard";
import SHOP from "@client/storesClient"
import PRODUCTS from "@client/productsClient"
import { useAuth } from "@contexts/Auth";
import { fixUrl, formatDate } from "../../helpers/helpers";
import Livechat from "@components/Livechat";
import PRODUCT_ATTRIBUTE_ITEMS from '@client/productAttributeItemsClient'
import PRODUCT_ATTRIBUTES from '@client/productAttributesClient';
import Loader from '@components/Loader';

import Close from "./close.png"
import chat from "../../assets/chat.png";
import Whatsapp from "../../assets/whatsapp.png";
import call from "../../assets/call.png";
import loadingGif from "@assets/loading.gif"
import noProducts from "../../assets/noProducts.jpg";
import cartIcon from "../../assets/cartPlusIcon.svg"
import WhatsappNew from "./assets/whatsapp.png";

import "./style.css";
import "../Shop/style.css"
import EmptyProductCard from "../../components/EmptyProductCard";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

function index() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [currentShopId, setCurrentShopId] = useState(null);
  const [search, setsearch] = useState("")
  const [customerServicePopup, setcustomerServicePopup] = useState(false)
  const [toggleLiveChat, settoggleLiveChat] = useState(false)
  const [newlyAddedproducts, setnewlyAddedproducts] = useState([])
  const [displayedNewlyProducts, setDisplayedNewlyProducts] = useState(6);
  const [loading, isLoading] = useState(true);
  const [Store, setStore] = useState({});
  const componentRef = useRef(null);
  const [categoryId, setcategoryId] = useState(null)
  const [filterInputChecked, setfilterInputChecked] = useState(false)
  const [tab, settab] = useState("Products")
  const [productChatMessages, setProductChatMessages] = useState([]);
  const [categoryFilter, setcategoryFilter] = useState(null);
  const [currentProductChat, setCurrentProductChat] = useState('');
  const [isInitail, setIsInitail] = useState(true);
  const [brandFilter, setbrandFilter] = useState(null);
  const [modelFilter, setmodelFilter] = useState(null);
  const [yearFilter, setyearFilter] = useState(null);
  const [minPriceFilter, setminPriceFilter] = useState(0);
  const [maxPriceFilter, setmaxPriceFilter] = useState(100_000_000);
  const [productdata, setproductdata] = useState({ data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] });
  const categoryFilterMb = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  // const prices = ["All Price", "Under $20", "$25 to $100", "$100 to $300", "$300 to $500", "$500 to $1,000", "$1,000 to $10,000"];
  const [popularBrands, setPopularBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const [switchTabs, setswitchTabs] = useState("NewlyAdded");
  const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
  const [brandFilterSearch, setBrandFilterSearch] = useState("");
  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      }
    ],
  };
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  /* --------------------------------------------- X -------------------------------------------- */

  // const loadMoreNewlyProducts = () => {
  //   setDisplayedNewlyProducts(
  //     (prevDisplayedProducts) => prevDisplayedProducts + 6
  //   );
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchProducts = async () => {
  //   const columns = [];
  //   const filterByColumns = {};

  //   // Determine column filters based on URL params
  //   // const filterByColumn = params.get("filter_by_column");
  //   // if (filterByColumn === "sale") {
  //   //   columns.push({ column: "sale_price", value: 1, operator: ">" });
  //   // }
  //   // if (filterByColumn === "featured") {
  //   //   columns.push({ column: "is_featured", value: 1, operator: "=" });
  //   // }
  //   // if (filterByColumn === "auction") {
  //   //   columns.push({ column: "product_type", value: "auction", operator: "=" });
  //   // }
  //   // if (filterByColumn === "featured_cars") {
  //   //   columns.push({ column: "is_featured", value: 1, operator: "=" });
  //   //   columns.push({ column: "product_group", value: "car", operator: "=" });
  //   // }
  //   if (id) {
  //     columns.push({ column: 'shop_id', value: id, operator: '=' });
  //   }
  //   if (columns.length > 0) {
  //     filterByColumns.filterJoin = 'AND';
  //     filterByColumns.columns = columns;
  //   }

  //   // Make the API call
  //   const { data, error } = await PRODUCTS.getProducts({
  //     with: "thumbnail,shop",
  //     filterJoin: "OR",
  //     filterByColumns,
  //     search: search,
  //     orderBy: 'created_at',
  //     order: 'desc',
  //     per_page: 20,
  //   });

  //   if (data) setnewlyAddedproducts(data.products);
  //   if (error) console.error(error);
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchShopIdBySlug = async (slug) => {
    if (slug === '') {
      return;
    }
    const { data, error } = await SHOP.getShopIdBySlug(slug);
    if (data) {
      setCurrentShopId(data.id);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchShopIdBySlug(id)
  }, [id]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchShop = async (id) => {
    const { data, error } = await SHOP.getShop(id);
    if (data) {
      setStore(data.shop);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchShop(currentShopId)
    // fetchProducts();
  }, [currentShopId, search]);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------------------- X -------------------------------------------- */

  const filterMb = () => {
    if (window.innerWidth <= 450) {
      categoryFilterMb.current.classList.toggle("active");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const handleInput = useCallback(debounce((minValue, maxValue) => {
  //   setminPriceFilter(minValue);
  //   setmaxPriceFilter(maxValue);
  // }, 2000), []);

  // Function to handle the slider input event
  // const handleSliderInput = (e) => {
  //   handleInput(e.minValue, e.maxValue);
  // };

  const handleSliderInput = (e) => {
    setminPriceFilter(Math.min(e.minValue, maxPriceFilter));
    setmaxPriceFilter(Math.max(e.maxValue, minPriceFilter));
  };


  // const handleMinPriceChange = useCallback(debounce((value) => {
  //   setminPriceFilter(value);
  // }, 2000), []);

  // const handleMaxPriceChange = useCallback(debounce((value) => {
  //   setmaxPriceFilter(value);
  // }, 2000), []);

  // Functions to handle input change for min and max price
  // const handleMinInputChange = (e) => {
  //   handleMinPriceChange(e.target.value);
  // };

  // const handleMaxInputChange = (e) => {
  //   handleMaxPriceChange(e.target.value);
  // };

  // Functions to handle input change for min and max price
  const handleMinInputChange = (e) => {
    const value = Math.max(0, Math.min(Number(e.target.value), maxPriceFilter));
    setminPriceFilter(value);
  };

  const handleMaxInputChange = (e) => {
    const value = Math.max(minPriceFilter, Math.min(Number(e.target.value), 100_000_000));
    setmaxPriceFilter(value);
  };

  // Add this useEffect to ensure maxPriceFilter is always >= minPriceFilter
  useEffect(() => {
    if (minPriceFilter > maxPriceFilter) {
      setmaxPriceFilter(minPriceFilter);
    }
  }, [minPriceFilter, maxPriceFilter]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', {
      // parent_id: 'NULL',
      hide_empty: true,
      shop_id: currentShopId,
      search: categoryFilterSearch,
    });
    if (data) {
      setCategories(data.product_attribute.attribute_items.product_attribute_items);
      setcategoryId(data.product_attribute.id);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchPopularBrands = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('brands', {
      hide_empty: true,
      shop_id: currentShopId,
      // search: brandFilterSearch,
      limit: 'all',
      order_by: 'name',
      order: 'ASC'
    });
    if (data) {
      setPopularBrands(data.product_attribute.attribute_items.product_attribute_items);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCarModels = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('models', {
      hide_empty: true,
      order_by: 'name',
      order: 'ASC'
    });
    if (data) {
      setCarModels(data.product_attribute.attribute_items.product_attribute_items);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCarYears = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('years', {
      hide_empty: true,
    });
    if (data) {
      setCarYears(data.product_attribute.attribute_items.product_attribute_items);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSorting = (event) => {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case 'created_at_desc':
        setOrderBy('created_at');
        setOrder('desc');
        break;
      // case 'popularity_desc':
      //   setOrderBy('popularity');
      //   setOrder('desc');
      //   break;
      // case 'relevance_desc':
      //   setOrderBy('relevance');
      //   setOrder('desc');
      //   break;
      case 'price_asc':
        setOrderBy('price');
        setOrder('asc');
        break;
      case 'price_desc':
        setOrderBy('price');
        setOrder('desc');
        break;
      default:
        setOrderBy('created_at');
        setOrder('desc');
    }
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const fetchAllProducts = async () => {
    isLoading(true);
    // if (windowsWidth > 550 || isInitail == true) {
    //   setproductdata([]);
    // }

    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "OR",
      search: search,
      orderBy: orderBy,
      order: order,
      page: currentPage,
      per_page: 20,
    }

    const columns = [];
    const attributes = [];

    // Determine column filters based on URL params
    // const filterByColumn = params.get("filter_by_column");
    // if (filterByColumn === "sale") {
    //   columns.push({ column: "sale_price", value: 1, operator: ">" });
    // }
    // if (filterByColumn === "featured") {
    //   columns.push({ column: "is_featured", value: 1, operator: "=" });
    // }
    // if (filterByColumn === "auction") {
    //   columns.push({ column: "product_type", value: "auction", operator: "=" });
    // }
    // if (filterByColumn === "featured_cars") {
    //   columns.push({ column: "is_featured", value: 1, operator: "=" });
    //   columns.push({ column: "product_group", value: "car", operator: "=" });
    // }
    if (minPriceFilter) {
      columns.push({ column: 'price', value: minPriceFilter, operator: '>' });
    }
    if (maxPriceFilter) {
      columns.push({ column: 'price', value: maxPriceFilter, operator: '<' });
    }
    if (currentShopId) {
      columns.push({ column: 'shop_id', value: currentShopId, operator: '=' });
    }

    columns.push({ column: 'status', value: 'active', operator: '=' });

    if (columns.length > 0) {
      ApiParams.filterByColumns = {
        filterJoin: 'AND',
        columns: columns,
      }
    }

    // Determine attribute filters based on the provided filters
    if (categoryFilter) {
      attributes.push({ key: 'categories', value: categoryFilter, operator: '=' });
    }
    if (brandFilter) {
      attributes.push({ key: 'brands', value: brandFilter, operator: '=' });
    }
    if (modelFilter) {
      attributes.push({ key: 'models', value: modelFilter, operator: '=' });
    }
    if (yearFilter) {
      attributes.push({ key: 'years', value: yearFilter, operator: '=' });
    }

    if (attributes.length > 0) {
      ApiParams.filterByAttributes = {
        filterJoin: 'AND',
        attributes: attributes,
      }
    }

    // Make the API call
    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (windowsWidth > 550 || currentPage <= 1) {
        setproductdata(data.products);
        localStorage.setItem('store-products-name', id);
        localStorage.setItem('store-products', JSON.stringify(data.products));
      } else {
        setproductdata({ ...productdata, data: [...productdata.data, ...data.products.data] });
        localStorage.setItem('store-products-name', id);
        localStorage.setItem('store-products', JSON.stringify({ ...productdata, data: [...productdata.data, ...data.products.data] }));
      }
      // setCurrentPage(data.products.current_page);
      // if (isInitail) {
      //   setProductIds(data.products.data.map((e) => e.id));
      //   fetchCategories(true);
      // }
      setIsInitail(false);
    }
    if (error) {
      console.error(error);
      setProducts([]);
    }
    setTimeout(() => { isLoading(false); }, 1000);
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const params = new URLSearchParams(location.search);
    params.set('page', selected.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentShopId) {
      fetchCategories();
      fetchPopularBrands();
      fetchCarModels();
      fetchCarYears();
    }
  }, [currentShopId, productdata]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(params.get('page') > 1 ? params.get('page') : 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentShopId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories();
  }, [categoryFilterSearch]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchPopularBrands();
  }, [brandFilterSearch]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleChatSubmit = async () => {
    if (!currentUser?.id) {
      setopenSigninPopup(true);
      return;
    }

    const { data, error } = await PRODUCTS.insertProductChat({ product_id: 'null' });

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

  useEffect(() => {
    if (windowsWidth <= 550) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          handleLoadMore()
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
  }, [productdata]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentShopId) {
      const timer = setTimeout(() => {
        fetchAllProducts();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentShopId, search, currentPage, orderBy, order, minPriceFilter, maxPriceFilter, categoryFilter, brandFilter, modelFilter, yearFilter]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (localStorage.getItem('store-products-name') === id) {
      setproductdata(JSON.parse(localStorage.getItem('store-products')));
    }
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>{`${Store?.name} | Shop Online on Tjara`}</title>
        <meta name="description" content={`Explore ${Store?.name} on Tjara. Find the best deals on a wide selection of products with fast and free delivery. Shop now and enjoy exclusive offers!`} />
        <meta name="keywords" content={`Tjara, ${Store?.name}, online shopping, best deals, multivendor marketplace, e-commerce, seller platform, store discounts, free delivery, top brands`} />
        <meta property="og:title" content={`${Store?.name} | Shop Online on Tjara`} />
        <meta property="og:description" content={`Discover ${Store?.name} on Tjara. Enjoy unbeatable prices, fast delivery, and a seamless shopping experience.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.tjara.com/store/${Store?.slug}`} />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-store-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${Store?.name} | Shop Online on Tjara`} />
        <meta name="twitter:description" content={`Shop from ${Store?.name} on Tjara. Get the best deals and free delivery on a variety of products.`} />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-store-preview.jpg" />
      </Helmet>


      <div className="wrapper store">
        <div className="store-top-info-box"
          style={
            Store?.banner?.media?.url
              ? {
                backgroundImage: `url(${fixUrl(Store.banner.media.url)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
              : {}
          }
        >
          {Store?.thumbnail?.media?.url
            ?
            <img src={fixUrl(Store?.thumbnail?.media?.url)} style={{ width: "125px", height: "125px", borderRadius: "10px" }} alt="Store Logo" />
            :
            <div className="store-logo">{Store?.name?.charAt(0)}</div>
          }
          <div className="store-top-info-box-content">
            <div className="store-top-info-box-left">
              <div className="store-top-inner-info">
                <p className="store-top-info-box-store-name">
                  {Store?.name}
                </p>
                <div className="store-top-info-box-store-rating-row">
                  {/* <p>98.2% positive feedback (279)</p>
                <li>1.1K items sold</li> */}
                  {/* <li>96 followers</li> */}
                </div>
              </div>
            </div>
            <div className="store-top-info-box-right">
              {/* <button>
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1 19.05L12 19.15L11.89 19.05C7.14 14.74 4 11.89 4 9C4 7 5.5 5.5 7.5 5.5C9.04 5.5 10.54 6.5 11.07 7.86H12.93C13.46 6.5 14.96 5.5 16.5 5.5C18.5 5.5 20 7 20 9C20 11.89 16.86 14.74 12.1 19.05ZM16.5 3.5C14.76 3.5 13.09 4.31 12 5.58C10.91 4.31 9.24 3.5 7.5 3.5C4.42 3.5 2 5.91 2 9C2 12.77 5.4 15.86 10.55 20.53L12 21.85L13.45 20.53C18.6 15.86 22 12.77 22 9C22 5.91 19.58 3.5 16.5 3.5Z"
                  fill="black"
                />
              </svg>
              Follow Shop
            </button> */}
              <button onClick={() => setcustomerServicePopup(!customerServicePopup)}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.5 6.5C22.5 5.4 21.6 4.5 20.5 4.5H4.5C3.4 4.5 2.5 5.4 2.5 6.5V18.5C2.5 19.6 3.4 20.5 4.5 20.5H20.5C21.6 20.5 22.5 19.6 22.5 18.5V6.5ZM20.5 6.5L12.5 11.5L4.5 6.5H20.5ZM20.5 18.5H4.5V8.5L12.5 13.5L20.5 8.5V18.5Z"
                    fill="black"
                  />
                </svg>
                Contact Us
              </button>
            </div>
          </div>
        </div>
        <div className="store-top-links-search-row">
          <div className="store-links-box">
            {/* <a onClick={() => settab("Home")} className={`${tab == "Home" && "active"} store-link`} style={{ cursor: "pointer" }}>
            Home
          </a> */}
            <a onClick={() => settab("Products")} className={`${tab == "Products" && "active"}  store-link`} style={{ cursor: "pointer" }}>
              All Products
            </a>
            <a onClick={() => settab("About")} className={`${tab == "About" && "active"} store-link`} style={{ cursor: "pointer" }}>
              About Store
            </a>
          </div>
          {tab != "About" &&
            <div className="store-top-links-search-box">
              <input onKeyDown={(e) => e.key == "Enter" && setsearch(e.target.value)} type="text" placeholder="Search in store" />
              {/* <svg onClick={(e) => setsearch(e.target.value)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M19.0002 19L14.6572 14.657M14.6572 14.657C15.4001 13.9141 15.9894 13.0321 16.3914 12.0615C16.7935 11.0909 17.0004 10.0506 17.0004 8.99996C17.0004 7.94936 16.7935 6.90905 16.3914 5.93842C15.9894 4.96779 15.4001 4.08585 14.6572 3.34296C13.9143 2.60007 13.0324 2.01078 12.0618 1.60874C11.0911 1.20669 10.0508 0.999756 9.00021 0.999756C7.9496 0.999756 6.90929 1.20669 5.93866 1.60874C4.96803 2.01078 4.08609 2.60007 3.34321 3.34296C1.84288 4.84329 1 6.87818 1 8.99996C1 11.1217 1.84288 13.1566 3.34321 14.657C4.84354 16.1573 6.87842 17.0002 9.00021 17.0002C11.122 17.0002 13.1569 16.1573 14.6572 14.657Z" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> */}
              {tab == "Products" && <svg onClick={filterMb} className="filterMb" width="46" height="52" viewBox="0 0 46 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="46" height="52" rx="8" fill="#222222" /><path d="M31.75 19.75H29.02C28.7638 19.0205 28.2877 18.3883 27.6573 17.9406C27.0269 17.4928 26.2732 17.2516 25.5 17.25C24.7268 17.2516 23.9731 17.4928 23.3427 17.9406C22.7123 18.3883 22.2362 19.0205 21.98 19.75H14.25C13.9185 19.75 13.6005 19.8817 13.3661 20.1161C13.1317 20.3505 13 20.6685 13 21C13 21.3315 13.1317 21.6495 13.3661 21.8839C13.6005 22.1183 13.9185 22.25 14.25 22.25H21.98C22.2362 22.9795 22.7123 23.6117 23.3427 24.0594C23.9731 24.5072 24.7268 24.7484 25.5 24.75C26.2732 24.7484 27.0269 24.5072 27.6573 24.0594C28.2877 23.6117 28.7638 22.9795 29.02 22.25H31.75C32.0815 22.25 32.3995 22.1183 32.6339 21.8839C32.8683 21.6495 33 21.3315 33 21C33 20.6685 32.8683 20.3505 32.6339 20.1161C32.3995 19.8817 32.0815 19.75 31.75 19.75ZM31.75 29.75H24.02C23.764 29.0204 23.2879 28.3881 22.6575 27.9403C22.0271 27.4926 21.2733 27.2514 20.5 27.25C19.7268 27.2516 18.9731 27.4928 18.3427 27.9406C17.7123 28.3883 17.2362 29.0205 16.98 29.75H14.25C13.9185 29.75 13.6005 29.8817 13.3661 30.1161C13.1317 30.3505 13 30.6685 13 31C13 31.3315 13.1317 31.6495 13.3661 31.8839C13.6005 32.1183 13.9185 32.25 14.25 32.25H16.98C17.2362 32.9795 17.7123 33.6117 18.3427 34.0594C18.9731 34.5072 19.7268 34.7484 20.5 34.75C21.2732 34.7484 22.0269 34.5072 22.6573 34.0594C23.2877 33.6117 23.7638 32.9795 24.02 32.25H31.75C32.0815 32.25 32.3995 32.1183 32.6339 31.8839C32.8683 31.6495 33 31.3315 33 31C33 30.6685 32.8683 30.3505 32.6339 30.1161C32.3995 29.8817 32.0815 29.75 31.75 29.75Z" fill="white" /></svg>}
            </div>
          }
        </div>
        {/* {windowsWidth <= 500 ?
        <div className="mobileProductstabs storeMbTabs">
          <button className={switchTabs == "NewlyAdded" ? "active" : ""} onClick={() => setswitchTabs("NewlyAdded")}>Newly Added</button>
        </div> : ""} */}
        {/* {tab == "Home" &&
        <div className={`store-newly-added-product-container ${switchTabs == "NewlyAdded" ? "active" : ""}`}>
          <div className="feature-products-container-heading-row">
            <p className="store-about-container-heading">Newly Added</p>
            <button onClick={() => settab("Products")}>View All</button>
          </div>
          {windowsWidth <= 768 && window.innerWidth >= 500 ?
            <Slider {...settings} className="feature-products-items-container">
              {newlyAddedproducts?.data?.map((e, i) => {
                return (
                  <ProductCard key={i} detail={e} />
                );
              })}
            </Slider> :
            <div className="feature-products-items-container">
              {newlyAddedproducts?.data?.map((e, i) => {
                return (
                  <ProductCard key={i} detail={e} />
                );
              })}
            </div>}
          {displayedNewlyProducts < newlyAddedproducts.length && (
            <div className="load-more-btn-row">
              <button className="button" onClick={loadMoreNewlyProducts}>
                Load More
              </button>
            </div>
          )}
        </div>
      } */}
        {/* ---------------------------------------------------------------------------------------- */}
        {/*                                             X                                            */}
        {/* ---------------------------------------------------------------------------------------- */}
        {tab == "About" &&
          <div className="store-about-container">
            <p className="store-about-container-heading">
              About ({Store?.name})
            </p>
            <p className="store-about-container-description">
              {Store?.description}
            </p>
            <p className="store-about-container-location">
              Address: <span>{Store?.meta?.address ?? '---'}</span>
            </p>
            <p className="store-about-container-location">
              Location: <span>{Store?.meta?.city} {Store?.meta?.state} {Store?.meta?.country}</span>
            </p>
            <p className="store-about-container-member-since">
              Member since: <span>{Store?.created_at && formatDate(Store?.created_at ?? '')}</span>
            </p>
          </div>
        }
        {/* -------------------------------------------------------------------------------------- */}
        {/*                                            X                                           */}
        {/* -------------------------------------------------------------------------------------- */}
        {tab == "Products" &&
          <div className="shop-category-inner-container all-products-store-category-inner-container">
            <div ref={categoryFilterMb} className="shop-category-inner-left filter-options-row">
              <div className="bg" onClick={filterMb} />
              <div className="mobileFiltersDiv">
                <div className="filter-close closeFilterMb">Filter
                  <button onClick={() => {
                    filterMb();
                    fetchAllProducts()
                  }} className="close-filter-btn">Apply Filter</button>
                  {/* <img onClick={filterMb} src={Close} alt="" /> */}
                </div>
                <div className="shop-category-inner-left-category filter-option-heading-box">
                  <p className="filter-option-heading">CATEGORY</p>
                  <div className="category-search"><input type="search" name="" onChange={(e) => setCategoryFilterSearch(e.target.value)} id="" placeholder="Search Category" /></div>
                  <div className="shop-category-inner-left-categories-container filters-inner-option">
                    {/* ------------------------------------------------------------------------------ */}
                    {/*                                  All Category                                  */}
                    {/* ------------------------------------------------------------------------------ */}
                    <div>
                      <input
                        type="radio"
                        checked={categoryFilter === null}
                        value=''
                        onChange={() => {
                          setcategoryFilter(null);
                          setCurrentCategory(null);
                          setSearchTerm('');
                          setIsInitail(true);
                          setCurrentPage(1);
                        }}
                        name="shop-category-category"
                        id='all'
                      />
                      <label htmlFor='all'>All Categories</label>
                    </div>
                    {/* ------------------------------------------------------------------------------ */}
                    {/*                                Baqaya Categories                               */}
                    {/* ------------------------------------------------------------------------------ */}
                    {categories?.map((category, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          checked={categoryFilter === category.id}
                          value={category.id}
                          onChange={(e) => {
                            setcategoryFilter(e.target.value);
                            setIsInitail(true);
                            setCurrentPage(1);
                          }}
                          name="shop-category-category"
                          id={category.id}
                        />
                        <label htmlFor={category.id}>{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="shop-category-inner-left-price filter-option-heading-box">
                  <p className="filter-option-heading" >PRICE RANGE</p>
                  <div className="filters-inner-option">
                    <div>
                      <MultiRangeSlider min={0} max={100_000} step={5} ruler={false} labels={false} minValue={minPriceFilter} maxValue={maxPriceFilter} barInnerColor="#D21642" thumbLeftColor="#fff" thumbRightColor="#fff" style={{ padding: 0, boxShadow: "none" }} onInput={(e) => { handleSliderInput(e); }} />
                    </div>
                    <div className="shop-category-inner-left-price-min-max-input">
                      <input
                        type="number"
                        min={0}
                        max={maxPriceFilter}
                        placeholder="Min price"
                        // value={minPriceFilter}
                        ref={minPriceRef}
                      // onChange={handleMinInputChange}
                      />
                      <input
                        type="number"
                        min={minPriceFilter}
                        max={100_000}
                        placeholder="Max price"
                        // value={maxPriceFilter}
                        ref={maxPriceRef}
                      // onChange={handleMaxInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="shop-category-inner-brands-category filter-option-heading-box">
                  <p className="filter-option-heading" >POPULAR BRANDS</p>
                  <div className="shop-category-inner-left-brands-container filters-inner-option">
                    {/* <div className="category-search"><input type="search" name="brands-search" onChange={(e) => setBrandFilterSearch(e.target.value)} id="" placeholder="Search Brand" /></div> */}
                    <div>
                      <input type="radio" name="shop-category-brands" id='all' checked={brandFilter == null} value='' onChange={() => {
                        setbrandFilter(null);
                        setIsInitail(true);
                        setCurrentPage(1);
                      }} />
                      <label htmlFor='all'>All</label>
                    </div>
                    {popularBrands?.map((brand, index) => (
                      <div key={index}>
                        <input type="radio" name="shop-category-brands" id={brand?.id} /* checked={selectedBrand === brand?.id} */ value={brand?.id} onChange={(e) => {
                          setbrandFilter(e.target.value);
                          setIsInitail(true);
                          setCurrentPage(1);
                        }} />
                        <label htmlFor={brand?.id}>{brand?.name ?? 'BMW'}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {brandFilter && (
                  <div className="shop-category-inner-brands-category filter-option-heading-box">
                    <p className="filter-option-heading" /* onClick={() => setSelectedModel(null)} */>POPULAR MODELS</p>
                    <div className="shop-category-inner-left-brands-container filters-inner-option">
                      <div>
                        <input type="radio" name="shop-category-models" id='all' checked={modelFilter == null} value='' onChange={() => {
                          setmodelFilter(null);
                          setIsInitail(true);
                          setCurrentPage(1);
                        }} />
                        <label htmlFor='all'>All</label>
                      </div>
                      {carModels?.map((model, index) => (
                        <div key={index}>
                          <input type="radio" name="shop-category-models" id={model?.id} checked={modelFilter == model?.id} value={model?.id} onChange={() => {
                            setmodelFilter(event.target.value);
                            setIsInitail(true);
                            setCurrentPage(1);
                          }} />
                          <label htmlFor={model?.id}>{model?.name ?? 'GTR'}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {modelFilter && (
                  <div className="shop-category-inner-brands-category filter-option-heading-box">
                    <p className="filter-option-heading">POPULAR MODEL YEAR</p>
                    <div className="shop-category-inner-left-brands-container filters-inner-option">
                      <div>
                        <input type="radio" name="shop-category-years" id='all' checked={yearFilter == null} value='' onChange={() => {
                          setyearFilter(null);
                          setIsInitail(true);
                          setCurrentPage(1);
                        }} />
                        <label htmlFor='all'>All</label>
                      </div>
                      {carYears?.map((year, index) => (
                        <div key={index}>
                          <input type="radio" name="shop-category-years" id={year?.id} checked={yearFilter == year?.id} value={year?.id} onClick={() => {
                            setyearFilter(event.target.value);
                            setIsInitail(true);
                            setCurrentPage(1);
                          }} />
                          <label htmlFor={year?.id}>{year?.name ?? '2023'}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="shop-category-inner-right store-all-products-inner-right">
              <div className="store-all-products-right-top-filter-row">
                <button className="filterButtonPc  filterButton" onClick={filterMb}>
                  <input onClick={() => setfilterInputChecked(!filterInputChecked)} type="checkbox" checked={filterInputChecked} />
                  Fitler
                </button>
                Sort By:
                <select name="sort" id="sortSelect" onChange={handleSorting}>
                  <option value="created_at_desc">Most Recent</option>
                  {/* <option value="popularity_desc">Most Popular</option> */}
                  {/* <option value="relevance_desc">Most Relevant</option> */}
                  <option value="price_asc">Low to high (price)</option>
                  <option value="price_desc">High to low (price)</option>
                </select>
              </div>
              {/* ---------------------------------------------------------------------------------- */}
              {/*                                          X                                         */}
              {/* ---------------------------------------------------------------------------------- */}
              {/* {windowsWidth <= 500
              ?
              <div className="mobileProductstabs storeMbTabs">
                <button className={switchTabs == "NewlyAdded" ? "active" : ""} onClick={() => setswitchTabs("NewlyAdded")}>Newly Added</button>
                <button className={switchTabs == "JustForYou" ? "active" : ""} onClick={() => setswitchTabs("JustForYou")}>Just For You</button>
              </div>
              :
              ""} */}
              {/* <div className={`shop-category-inner-right-products-container store-all-products-inner-container-right ${windowsWidth > 550 && loading == true || windowsWidth <= 550 && isInitail == true && loading == true || windowsWidth <= 550 && productdata?.data?.length < 0 && loading == true ? 'loading' : ''}`}>
              {windowsWidth > 550 && loading == true || windowsWidth <= 550 && isInitail == true && loading == true || windowsWidth <= 550 && productdata?.data?.length < 0 && loading == true
                ?
                (<div className="loader-sec">
                  <Loader />
                </div>)
                :
                (loading == false && productdata?.data?.length == 0 ?
                  <div className="noProducts">
                    <img src={noProducts} />
                    <h2 >No Products Found</h2>
                  </div>
                  :
                  productdata?.data?.map((e, i) => (
                    e.product_type == 'auction'
                      ?
                      <AuctionCard key={i} detail={e} />
                      :
                      <ProductCard cartIcon={cartIcon} key={i} detail={e} />
                  ))
                )
              }
            </div> */}
              {/* ---------------------------------------------------------------------------------- */}
              {/*                                          X                                         */}
              {/* ---------------------------------------------------------------------------------- */}
              <div className={`shop-category-inner-right-products-container ${windowsWidth > 550 && loading == true && (search !== '' || search !== null) ? 'loading-products' : ''}`}>
                {windowsWidth > 550 && loading == true && (search !== '' || search !== null) ? (
                  Array.from({ length: 20 }, (_, index) => (
                    <EmptyProductCard key={index} />
                  ))
                ) : productdata == '' ? (
                  <div className="noProducts">
                    <img src={noProducts} />
                    <h2>No Products Found!</h2>
                  </div>
                ) : productdata?.data?.map((e, i) => (
                  e?.product_type == 'auction' ? <AuctionCard key={i} detail={e} onClick={() => handleProductClick(e)} /> : <ProductCard cartIcon={cartIcon} key={i} detail={e} onClick={() => handleProductClick(e)} />
                ))}
              </div>
              {/* ---------------------------------------------------------------------------------- */}
              {/*                                          X                                         */}
              {/* ---------------------------------------------------------------------------------- */}
              {windowsWidth <= 550 && productdata?.data?.length < productdata?.total &&
                <div ref={componentRef} className="loadingAnimGif">
                  <img src={loadingGif} alt="" />
                </div>
              }
              {/* {windowsWidth > 500 && productdata?.data?.length < productdata?.total &&
              <div className="load-more-btn-row">
                <button className="button" onClick={handleLoadMore}>Load More</button>
              </div>
            } */}
              {windowsWidth > 550 && productdata?.data?.length < productdata?.total &&
                <ul className="pagination">
                  {/* {productdata?.prev_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(productdata?.prev_page_url).search).get('page'))}><img src={ArrowLeft} alt="Previous" /></button>
                  </li>
                )} */}
                  {productdata?.links?.map((link, index) => (
                    link?.url && (
                      <li key={index} className={`${link.active ? 'active' : ''} page-item`}>
                        <button onClick={() => handlePageChange(new URLSearchParams(new URL(link?.url).search).get('page'))}>{link?.label.replace(/&laquo;|&raquo;/g, '')}</button>
                      </li>
                    )
                  ))}
                  {/* {productdata?.next_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(productdata?.next_page_url).search).get('page'))}><img src={ArrowRight} alt="Previous" /></button>
                  </li>
                )} */}
                </ul>
              }
              {/* ------------------------------------------------------------------------------------ */}
              {/*                                           X                                          */}
              {/* ------------------------------------------------------------------------------------ */}
            </div>
          </div>
        }
        {/* ---------------------------------------------------------------------------------------- */}
        {/*                                             X                                            */}
        {/* ---------------------------------------------------------------------------------------- */}

        {customerServicePopup && (
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
                  const metaData = Store?.meta || {};
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

                      {/* <div
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
                      </div> */}

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
        )}

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

        <div className="fixedContactIcons">
          {/* <img onClick={() => setcustomerServicePopup(!customerServicePopup)} src={chat} alt="" /> */}
          <img style={{ cursor: 'pointer', width: '70px', height: '70px' }} onClick={() => setcustomerServicePopup(true)} src={WhatsappNew} alt="WhatsApp" />
        </div>
        {/* {toggleLiveChat &&
        <div className="liveChatContainer">
          <div className="closeContainer" onClick={() => settoggleLiveChat(!toggleLiveChat)} />
          <Livechat />
        </div>
      } */}
      </div>
    </>
  );
}

export default index;
