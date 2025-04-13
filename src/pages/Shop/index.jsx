// modules
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useNavigationType, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import MultiRangeSlider from "multi-range-slider-react";
// contexts
import { useheaderFooter } from "@contexts/globalHeaderFooter";
// helpers
import { fixUrl } from "../../helpers/helpers";
// api clients
import PRODUCT_ATTRIBUTE_ITEMS from '@client/productAttributeItemsClient'
import PRODUCT_ATTRIBUTES from '@client/productAttributesClient'
import PRODUCTS from "@client/productsClient";
import COUNTRIES from "@client/countriesClient";
import STATES from "@client/statesClient";
import CITIES from "@client/citiesClient";
// components
import ProductCard from "@components/ProductCard";
import AuctionCard from "@components/AuctionCard";
import SinginPopup from "@components/signInPopup/index";
import Loader from '@components/Loader';
import Skeleton from "react-loading-skeleton";
// images
import Bag from "./assets/bags.svg";
import Car from "./assets/cars.svg";
import Mobile from "./assets/phone.svg";
import noProducts from "../../assets/noProducts.jpg";
import filter from "./assets/filter.jpg";
import Electronic from "./assets/electronic.svg";
import Cloth from "./assets/cloth.svg";
import cartIcon from "../../assets/cartPlusIcon.svg"
import Health from "./assets/health.svg";
import SideAdProductImg from "./assets/side-ad-product-img.svg";
// import loadingGif from "@assets/loading.gif"
import AllCategoriesIcon from './assets/all_icon.png';
import logger from '../../utils/logger'
// css
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import "../ServiceList/style.css";
import "../Jobs/style.css";
import "./style.css";
import { cache } from "react";
import RoundLoader from "../../components/RoundLoader";
import EmptyProductCard from "../../components/EmptyProductCard";
import { Helmet } from "react-helmet-async";
import { usePopup } from "../../components/DataContext";

const debouncedFetchProducts = debounce((callback) => {
  callback();
}, 200); // 500ms delay, adjust as needed

const debouncedChildCategoryProducts = debounce((callback) => {
  callback();
}, 200); // 500ms delay, adjust as needed

/* ---------------------------------------------- X --------------------------------------------- */

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const { slug } = useParams(null);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const { globalSettings } = useheaderFooter();
  const { category } = useParams(null);
  const [filterInputChecked, setfilterInputChecked] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [isInitail, setIsInitail] = useState(true);
  const [categories, setCategories] = useState([]);
  // const prices = ["All Price", "Under $20", "$25 to $100", "$100 to $300", "$300 to $500", "$500 to $1,000", "$1,000 to $10,000"];
  const [popularBrands, setPopularBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carYears, setCarYears] = useState([]);
  // const popularTags = ["Game", "Heater", "Asus Laptops", "Lights", "SSD", "Graphics Card", "Power Bank", "Smart TV", "Speaker", "AC", "Microwave", "Play Station"];
  const [subCategoryItems, setSubCategoryItems] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const [loading, isLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryFilter, setcategoryFilter] = useState('products');
  const [brandFilter, setbrandFilter] = useState(null);
  const [modelFilter, setmodelFilter] = useState(null);
  const [yearFilter, setyearFilter] = useState(null);
  const [countryFilter, setcountryFilter] = useState(null);
  const [stateFilter, setstateFilter] = useState(null);
  const [cityFilter, setcityFilter] = useState(null);
  const [minPriceFilter, setminPriceFilter] = useState(params.get('min_price') ?? 0);
  const [maxPriceFilter, setmaxPriceFilter] = useState(params.get('max_price') ?? 100_000_000);
  const [searchTerm, setSearchTerm] = useState(params.get("search"));
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState({ data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] });
  const [carCategory, setCarCategory] = useState(slug === 'cars' ? true : slug === 'global' ? true : false);
  const [orderBy, setOrderBy] = useState("created_at"); // is_featured / created_at
  const [order, setOrder] = useState("desc"); // desc / asc
  const [subCategoriesCount, setSubCategoriesCount] = useState(0);
  const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
  const [brandFilterSearch, setBrandFilterSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [CurrentCategoryId, setCurrentCategoryId] = useState([]);
  // const [modelPopup, setModelPopup] = useState(false);
  // const [yearPopup, setYearPopup] = useState(false);
  // const [selectedBrand, setSelectedBrand] = useState(null);
  // const [selectedModel, setSelectedModel] = useState(null);
  const categoryFilterMb = useRef(null);
  const componentRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const isInitialProductsFetchEffectMount = useRef(true);
  const [ProductsFetchTimer, setProductsFetchTimerDone] = useState(false);
  const productsContainerRef = useRef(null);
  const navigationType = useNavigationType();
  const scrollRestored = useRef(false);
  const cacheKey = `${location.pathname}-shopProducts`;
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const { setIsSearching } = usePopup();
  const [selectedSorting, setSelectedSorting] = useState(null);


  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    const previousPath = sessionStorage.getItem("previousPath");

    // Handle back button navigation
    if (navigationType === "POP" && savedPosition && previousPath?.includes("/product")) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 0);
      setForceUpdate(prev => !prev); // Force re-render
    } else {
      // If navigating normally, reset scroll to top
      window.scrollTo(0, 0);
    }

    // Save the current path for the next navigation
    sessionStorage.setItem("previousPath", location.pathname);
  }, [location.pathname, navigationType]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleProductClick = (product) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleBrandClick = (brand) => {
    // setSelectedBrand(brand);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleModelClick = (model) => {
    // setSelectedModel(model);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  function handleYearClick(year) {
    // logger.log("Selected Model Year:", year);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  // Function to handle the slider input event
  // const handleSliderInput = (e) => {
  //   handleInput(e.minValue, e.maxValue);
  // };

  // const handleInput = useCallback(debounce((minValue, maxValue) => {
  //   setminPriceFilter(minValue);
  //   setmaxPriceFilter(maxValue);
  // }, 2000), []);

  // Functions to handle input change for min and max price
  // const handleMinInputChange = (e) => {
  //   handleMinPriceChange(e.target.value);
  // };

  // const handleMaxInputChange = (e) => {
  //   handleMaxPriceChange(e.target.value);
  // };

  // const handleMinPriceChange = useCallback(debounce((value) => {
  //   setminPriceFilter(value);
  // }, 2000), []);

  // const handleMaxPriceChange = useCallback(debounce((value) => {
  //   setmaxPriceFilter(value);
  // }, 2000), []);

  // Add this useEffect to ensure maxPriceFilter is always >= minPriceFilter
  // useEffect(() => {
  //   if (minPriceFilter > maxPriceFilter) {
  //     setmaxPriceFilter(minPriceFilter);
  //   }
  // }, [minPriceFilter, maxPriceFilter]);



  // Functions to handle input change for min and max price
  // const handleSliderInput = (e) => {
  //   const minValue = e.minValue !== '' ? Math.min(e.minValue, maxPriceFilter) : '';
  //   const maxValue = e.maxValue !== '' ? Math.max(e.maxValue, minPriceFilter) : '';
  //   setminPriceFilter(minValue);
  //   setmaxPriceFilter(maxValue);
  // };

  // const handleMinInputChange = (e) => {
  //   const value = e.target.value === '' ? '' : Math.max(0, Math.min(Number(e.target.value), maxPriceFilter));
  //   setminPriceFilter(value);
  // };

  // const handleMaxInputChange = (e) => {
  //   const value = e.target.value === '' ? '' : Math.max(minPriceFilter, Math.min(Number(e.target.value), 100_000_000));
  //   setmaxPriceFilter(value);
  // };

  const updatePriceInURL = (minPrice, maxPrice) => {
    const params = new URLSearchParams(location.search);
    params.set('min_price', minPrice);
    params.set('max_price', maxPrice);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSliderInput = (e) => {
    const minValue = e.minValue;
    const maxValue = e.maxValue;

    if (minValue > maxValue) {
      toast.error("Min value cannot be greater than max value");
      return;
    }

    if (maxValue < minValue) {
      toast.error("Max value cannot be less than min value");
      return;
    }

    setminPriceFilter(minValue);
    setmaxPriceFilter(maxValue);
    updatePriceInURL(minValue, maxValue);
  };

  const handlePriceInput = () => {
    const minValue = Number(minPriceRef.current.value);
    const maxValue = Number(maxPriceRef.current.value);

    if (minValue > maxValue) {
      toast.error("Min value cannot be greater than max value");
      return;
    }

    if (maxValue < minValue) {
      toast.error("Max value cannot be less than min value");
      return;
    }

    setminPriceFilter(minValue);
    setmaxPriceFilter(maxValue);
    updatePriceInURL(minValue, maxValue);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCountries = async () => {
    if (slug !== 'cars' || slug !== 'global') return;
    const { data, error } = await COUNTRIES.getCountries({});
    if (data) {
      setCountries(data.countries);
      const e = {
        target: {
          value: "89b79d20-36e8-4619-8d39-681450cb1311"
        }
      };
      handleCountryChange(e)
    }
    if (error) logger.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchStates = async (countryId) => {
    if (slug !== 'cars' || slug !== 'global') return;
    const { data, error } = await STATES.getStates(countryId);
    if (data) setStates(data.states);
    if (data) fetchCities(data.states[0]?.id)
    if (error) logger.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCities = async (stateId) => {
    if (slug !== 'cars' || slug !== 'global') return;
    const { data, error } = await CITIES.getCities(stateId);
    if (data) setCities(data.cities);
    if (error) logger.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCurrentCategory = async (category) => {
    if (category === 'products') {
      return;
    }

    const ApiParams = {
      post_type: slug == 'cars' ? 'car' : slug == 'shop' ? 'product' : slug == 'global' ? '' : 'product',
    }

    const { data, error } = await PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItem(category, ApiParams);

    if (data) {
      setCurrentCategory(data.product_attribute_item);
      setcategoryFilter(data.product_attribute_item?.id);
    }

    if (error) {
      logger.error(error);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                      Set Category In Url                                     */
  /* -------------------------------------------------------------------------------------------- */

  const setCategoryInUrl = (slug, category) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = `/${slug}/${category}`;
    window.history.pushState({}, '', currentUrl.toString());
    navigate(`${currentUrl.pathname}`, { replace: true });
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCurrentCategoryIdBySlug = async (category) => {
    if (category === 'products') {
      setCurrentCategoryId(category);
      return;
    }

    const { data, error } = await PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItemIdBySlug(category);

    if (data) {
      setCurrentCategoryId(data.id);
    }

    if (error) {
      logger.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCurrentCategoryIdBySlug(category);
  }, [category]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async (initial_fetch = false) => {
    const ApiParams = {
      post_type: slug === 'cars' ? 'car' : slug === 'shop' ? 'product' : slug === 'global' ? '' : 'product',
      with: 'thumbnail, parent',
      parent_id: CurrentCategoryId === 'products' ? 'NULL' : CurrentCategoryId,
      hide_empty: true,
      search: categoryFilterSearch,
      order_by: 'product_count',
      order: 'desc',
      // product_ids: initial_fetch ? productIds.join(',') : '',
    }

    if (slug === 'club') ApiParams.shop_id = '76c60862-c355-4238-9f85-a0520c423feb';

    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', ApiParams);

    if (data) {
      setCategories(data.product_attribute.attribute_items.product_attribute_items);
    }

    if (error) {
      logger.error(error);
    }
  };


  /* --------------------------------------------- X -------------------------------------------- */

  const fetchPopularBrands = async () => {
    // if (slug && slug == 'products') return;
    const ApiParams = {
      post_type: slug == 'cars' ? 'car' : slug == 'shop' ? 'product' : slug == 'global' ? '' : '',
      with: 'thumbnail, parent',
      hide_empty: true,
      search: brandFilterSearch,
      limit: 'all',
      order_by: 'name',
      order: 'ASC'
    }

    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('brands', ApiParams);

    if (data) {
      setPopularBrands(data.product_attribute.attribute_items.product_attribute_items);
    }

    if (error) {
      logger.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCarModels = async () => {
    // if (slug && slug == 'products') return;
    const ApiParams = {
      post_type: slug == 'cars' ? 'car' : slug == 'shop' ? 'product' : slug == 'global' ? '' : '',
      with: 'thumbnail, parent',
      hide_empty: true,
      limit: 'all',
      order_by: 'name',
      order: 'ASC',
    }

    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('models', ApiParams);

    if (data) {
      setCarModels(data.product_attribute.attribute_items.product_attribute_items);
    }

    if (error) {
      logger.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCarYears = async () => {
    // if (slug && slug == 'products') return;
    const ApiParams = {
      post_type: slug == 'cars' ? 'car' : slug == 'shop' ? 'product' : slug == 'global' ? '' : '',
      with: 'thumbnail, parent',
      hide_empty: true,
      limit: 'all',
      order_by: 'name',
      order: 'DESC',
    }

    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('years', ApiParams);

    if (data) {
      setCarYears(data.product_attribute.attribute_items.product_attribute_items);
    }

    if (error) {
      logger.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchSubCategories = async (category) => {
    const ApiParams = {
      // attribute_id: categoryId,
      attribute_slug: 'categories',
      post_type: slug == 'cars' ? 'car' : slug == 'shop' ? 'product' : slug == 'global' ? '' : 'product',
      // parent_id: category ?? 'NULL',
      with: 'thumbnail, parent',
      parent_id: category == 'products' ? 'NULL' : category,
      hide_empty: true,
      order_by: 'name',
      order: 'ASC',
      limit: slug == 'cars' ? 'all' : category == null || category == 'products' || category == '' ? 30 : 'all'
    }

    if (slug === 'club') ApiParams.shop_id = '76c60862-c355-4238-9f85-a0520c423feb';

    const { data, error } = await PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItems(ApiParams);

    if (data) {
      setSubCategoryItems(data.product_attribute_items);
      // localStorage.setItem('shop-sub-categories', JSON.stringify(data.product_attribute_items));
      setSubCategoriesCount(data.product_attribute_items.length);
    }

    if (error) {
      logger.error(error);
      setSubCategoriesCount(0);
      setSubCategoryItems([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCountryChange = (e) => {
    if (slug == 'cars' || slug == 'global') {
      fetchStates(e.target.value);
      setIsInitail(true);
      setcountryFilter(e.target.value);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleStateChange = (e) => {
    if (slug == 'cars' || slug == 'global') {
      fetchCities(e.target.value);
      setCurrentPage(1);
      setIsInitail(true);
      setstateFilter(e.target.value);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCityChange = (e) => {
    if (slug == 'cars' || slug == 'global') {
      setCurrentPage(1);
      setIsInitail(true);
      setcityFilter(e.target.value);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSorting = (event) => {
    const selectedOption = event.target.value;
    setSelectedSorting(selectedOption);
    // Update the URL to include the sort parameter
    const currentParams = new URLSearchParams(location.search);
    currentParams.set('sort', selectedOption);
    navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true });

    switch (selectedOption) {
      case 'created_at_desc':
        setOrderBy('created_at');
        setOrder('desc');
        break;
      case 'popularity_desc':
        setOrderBy('popularity');
        setOrder('desc');
        break;
      case 'featured_desc':
        setOrderBy('is_featured');
        setOrder('desc');
        break;
      case 'relevance_desc':
        setOrderBy('relevance');
        setOrder('desc');
        break;
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

  const fetchProducts = async () => {
    isLoading(true);
    setIsSearching(true);

    if (windowsWidth > 550 /* && isInitail == false */) {
      setProducts({ data: [] });
    }

    const ApiParams = {
      with: "thumbnail,shop,variations",
      filterJoin: "OR",
      // orderBy: orderBy,
      // order: order,
      page: currentPage,
      per_page: 16,
      // customOrder: 'featured_products_first'
    }

    // Only add ordering parameters if:
    // 1. There's no search term, OR
    // 2. There's a search term but user has explicitly selected a sort option
    const hasSelectedSorting = params.get("sort") || (orderBy !== "created_at" || order !== "desc"); // Check if different from default

    if (!searchTerm || hasSelectedSorting) {
      ApiParams.orderBy = orderBy;
      ApiParams.order = order;

      // Only add customOrder when we're applying ordering
      if (!params.get("filter_by_column") || orderBy == 'is_featured') {
        ApiParams.customOrder = 'featured_products_first';
      }

      if (orderBy !== 'is_featured') {
        delete ApiParams.customOrder;
      }
    }

    // if (searchTerm && searchTerm !== '' && !hasSelectedSorting) {
    //   ApiParams.orderBy = 'relevance';
    //   ApiParams.order = 'desc';
    // }

    const attributes = [];
    const columns = [];
    const fields = [];
    // const filters = [];

    /* ---------------------- Determine Column Filters Based On URL Params ---------------------- */

    const filterByColumn = params.get("filter_by_column");

    if (filterByColumn === "sale") {
      columns.push({ column: "sale_price", value: 1, operator: ">" });

      const sortedSaleProductIds = globalSettings?.sale_products_sort_order?.split(',');

      if (sortedSaleProductIds !== null && sortedSaleProductIds !== "" && sortedSaleProductIds !== undefined) {
        ApiParams.orderBy = "ids";
        ApiParams.order = sortedSaleProductIds;
        delete ApiParams.customOrder;
      };
    }

    if (filterByColumn === "hot_deals") {
      columns.push({ column: "is_deal", value: 1, operator: "=" });

      const sortedDealsProductIds = globalSettings?.super_deals_products_sort_order?.split(',');

      if (sortedDealsProductIds !== null && sortedDealsProductIds !== "" && sortedDealsProductIds !== undefined) {
        ApiParams.orderBy = "ids";
        ApiParams.order = sortedDealsProductIds;
        delete ApiParams.customOrder;
      };
    }

    if (filterByColumn === "percentage_discount") {
      columns.push({ column: "sale_price", value: 1, operator: ">" });
      columns.push({ column: "product_type", value: "auction", operator: "!=" });
      ApiParams.filterByDiscount = globalSettings?.website_deals_percentage;
    }

    if (filterByColumn === "discount" && params.get("discount") != '') {
      columns.push({ column: "sale_price", value: 1, operator: ">" });
      columns.push({ column: "product_type", value: "auction", operator: "!=" });
      ApiParams.filterByDiscount = params.get("discount");
    }

    if (filterByColumn === "featured") {
      // columns.push({ column: "is_featured", value: 1, operator: "=" });
      // ApiParams.orderBy = 'is_featured';
      // ApiParams.order = 'desc';

      const sortedFeaturedProductIds = globalSettings?.featured_products_sort_order?.split(',');

      if (sortedFeaturedProductIds !== null && sortedFeaturedProductIds !== "" && sortedFeaturedProductIds !== undefined) {
        ApiParams.orderBy = "ids";
        ApiParams.order = sortedFeaturedProductIds;
        // delete ApiParams.customOrder;
        ApiParams.customOrder = 'featured_products_first';
      };
    }

    if (filterByColumn === "auction") {
      columns.push({ column: "product_type", value: "auction", operator: "=" });
    }

    if (filterByColumn === "featured_cars") {
      // columns.push({ column: "is_featured", value: 1, operator: "=" });
      columns.push({ column: "product_group", value: "car", operator: "=" });
      // ApiParams.orderBy = 'is_featured';
      // ApiParams.order = 'desc';

      const sortedFeaturedCarsIds = globalSettings?.featured_cars_sort_order?.split(',');

      if (sortedFeaturedCarsIds !== null && sortedFeaturedCarsIds !== "" && sortedFeaturedCarsIds !== undefined) {
        ApiParams.orderBy = "ids";
        ApiParams.order = sortedFeaturedCarsIds;
        delete ApiParams.customOrder;
      };
    }

    if (minPriceFilter) {
      columns.push({ column: 'price', value: minPriceFilter, operator: '>=' });
      // if (minPriceFilter > 0) {
      //   columns.push({ column: 'price', value: '1', operator: '>' });
      // }
    }

    if (maxPriceFilter) {
      columns.push({ column: 'price', value: maxPriceFilter, operator: '<=' });
      // if (maxPriceFilter < 100000) {
      //   columns.push({ column: 'price', value: '1', operator: '>' });
      // }
    }

    if (slug && slug == 'cars') {
      columns.push({ column: 'product_group', value: 'car', operator: '=' });
      ApiParams.product_group = 'car';
    }

    if (slug && slug == 'shop') {
      columns.push({ column: 'product_group', value: 'car', operator: '!=' });
    }

    if (slug && slug == 'club') {
      columns.push({ column: 'product_group', value: 'car', operator: '!=' });
      // columns.push({ column: 'shop_id', value: '76c60862-c355-4238-9f85-a0520c423feb', operator: '=' });
    }

    if (slug && slug == 'global') {
      // columns.push({ column: 'product_group', value: 'car', operator: '!=' });
    }

    columns.push({ column: 'status', value: 'active', operator: '=' });

    if (columns.length > 0) {
      ApiParams.filterByColumns = {
        filterJoin: 'AND',
        columns: columns,
      }
    }

    /* ---------------- Determine Attribute Filters Based On The Provided Filters --------------- */

    if (categoryFilter && categoryFilter !== 'products') {
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

    /* ------------------ Determine Fields Filters Based On The Provided Filters ----------------- */

    if (slug && slug == 'cars' && countryFilter) {
      fields.push({ key: 'country_id', value: countryFilter, operator: '=' });
    }
    if (slug && slug == 'cars' && stateFilter) {
      fields.push({ key: 'state_id', value: stateFilter, operator: '=' });
    }
    if (slug && slug == 'cars' && cityFilter) {
      fields.push({ key: 'city_id', value: cityFilter, operator: '=' });
    }
    // if (slug && slug == 'cars' && minPriceFilter) {
    //   fields.push({ key: 'hide_price', value: '1', operator: '!=' });
    // }
    // if (slug && slug == 'cars' && maxPriceFilter) {
    //   fields.push({ key: 'hide_price', value: '1', operator: '!=' });
    // }

    if (fields.length > 0) {
      ApiParams.filterByMetaFields = {
        filterJoin: 'AND',
        fields: fields,
      }
    }

    /* ---------------- Determine Filters Based On The Provided Filters ----------------- */

    // if (slug && slug == 'club') {
    //   filters.push('filter_categories_by_shopId');
    // }

    // if (filters.length > 0) {
    //   ApiParams.customFilters = filters
    // }


    if (searchTerm) {
      ApiParams.search = searchTerm;
    }

    // Make the API call
    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (windowsWidth > 550 || currentPage <= 1) {
        // Create a deep copy and remove thumbnails before caching
        const productsForCache = JSON.parse(JSON.stringify(data.products));
        if (productsForCache.data) {
          productsForCache.data = productsForCache.data.map(product => {
            const productCopy = { ...product };
            delete productCopy.thumbnail;
            return productCopy;
          });
        }

        setProducts(data.products);
        localStorage.setItem('shop-products-category', category || '');
        localStorage.setItem('shop-products', JSON.stringify(productsForCache));
      } else {
        setProducts(prev => ({ ...prev, data: [...prev.data, ...data.products.data] }));

        // Create a deep copy of merged products and remove thumbnails
        const mergedProducts = {
          ...products,
          data: [...products.data, ...data.products.data].map(product => {
            const productCopy = { ...product };
            delete productCopy.thumbnail;
            return productCopy;
          })
        };

        localStorage.setItem('shop-products-category', category || '');
        localStorage.setItem('shop-products', JSON.stringify(mergedProducts));
      }

      setIsInitail(false);
    }

    if (error) {
      logger.error(error);
      setProducts([]);
    }

    setTimeout(() => {
      isLoading(false);
      setIsSearching(false);
    }, 500);
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const handlePageChange = (selected) => {
    saveScrollPosition()
    setCurrentPage(selected);
    scrollRestored.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const params = new URLSearchParams(location.search);
    params.set('page', selected.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  /* ---------------------------------------------- X --------------------------------------------- */

  const openFilterMenu = (element) => {
    const allElements = document.querySelectorAll(".filter-option-heading");
    allElements.forEach((e) => {
      if (element.target != e) {
        e.parentElement.querySelector(".filters-inner-option").classList.remove("toggle-filter-option");
      }
    });
    element.target.parentElement.querySelector(".filters-inner-option").classList.toggle("toggle-filter-option");
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const filterMb = () => {
    categoryFilterMb.current.classList.toggle("active");
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const saveScrollPosition = useCallback(() => {
    if (productsContainerRef?.current && !loading && products?.data?.length > 0) {
      const position = productsContainerRef?.current?.scrollTop
      const scrollData = JSON.parse(localStorage.getItem(cacheKey) || '{}')
      scrollData[currentPage] = position
      localStorage.setItem(cacheKey, JSON.stringify(scrollData))
      // logger.log('Scroll Position Saved:', position, 'Page:', currentPage)
    }
    else {
      // logger.log('Scroll Position not saved:', { loading: loading, productCount: products?.data?.length })
    }
  }, [cacheKey, currentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  const restoreScrollPosition = useCallback(() => {
    if (productsContainerRef?.current && !loading && products?.data?.length > 0 && !scrollRestored.current) {
      const scrollData = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      const savedPosition = scrollData[currentPage];
      // logger.log('[Shop] Restore attempt - Saved position:', savedPosition, 'Page:', currentPage);

      if (savedPosition !== undefined && savedPosition > 0) {
        const maxScroll = productsContainerRef?.current?.scrollHeight - productsContainerRef?.current?.clientHeight;
        if (maxScroll >= savedPosition) {
          productsContainerRef?.current.scrollTo({ top: savedPosition, behavior: 'auto' });
          // logger.log('[Shop] Scroll position restored:', savedPosition, 'Actual:', productsContainerRef?.current?.scrollTop);
          scrollRestored.current = true
        } else {
          // logger.log('[Shop] Scroll height too short:', maxScroll, 'Target:', savedPosition);
        }
      } else {
        // logger.log('[Shop] No saved scroll position 0 for page:', currentPage);
      }
    }
  }, [cacheKey, currentPage, loading, products?.data?.length]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setSearchTerm(params.get("search"));
  }, [params]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (slug && CurrentCategoryId) {
      fetchCategories();
    }
  }, [slug, CurrentCategoryId, categoryFilterSearch]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (brandFilterSearch !== '' && slug && (slug == 'cars' || slug == 'global')) {
      fetchPopularBrands();
    }
  }, [brandFilterSearch]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCurrentCategory(CurrentCategoryId);
  }, [CurrentCategoryId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (CurrentCategoryId) {
      // Call the debounced function instead of directly calling fetchProducts
      debouncedChildCategoryProducts(() => fetchSubCategories(CurrentCategoryId == 'products' ? null : CurrentCategoryId));

      // Clean up the debounce on unmount
      return () => {
        debouncedChildCategoryProducts.cancel();
      };
    }
  }, [slug, CurrentCategoryId]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (slug && slug !== 'products') {
      fetchCountries();
      fetchPopularBrands();
      fetchCarModels();
      fetchCarYears();
    }
  }, [slug]);

  /* --------------------------------------------- X -------------------------------------------- */

  // Add this new useEffect to load initial price values from URL
  useEffect(() => {
    const minPrice = params.get('min_price');
    const maxPrice = params.get('max_price');

    if (minPrice) setminPriceFilter(Number(minPrice));
    if (maxPrice) setmaxPriceFilter(Number(maxPrice));
  }, [params]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setcategoryFilter('products');
    setbrandFilter(null);

    // Only reset price filters if they're not in the URL
    // const params = new URLSearchParams(location.search);
    // if (!params.get('min_price')) setminPriceFilter(0);
    // if (!params.get('max_price')) setmaxPriceFilter(100_000_000);

    setSearchTerm(params.get("search"));
    setCurrentPage(params.get('page') > 1 ? params.get('page') : 1);
    setCarCategory(slug == 'cars' ? true : slug == 'global' ? true : false);
    setCurrentCategory(null);
    setIsInitail(true);
    scrollRestored.current = false
    localStorage.removeItem(cacheKey)
    isInitialProductsFetchEffectMount.current = true
  }, [slug]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        handleLoadMore();
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
  }, [products]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setProductsFetchTimerDone(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (isInitialProductsFetchEffectMount.current) {
      isInitialProductsFetchEffectMount.current = false;
      return;
    }

    if (slug) {
      // Call the debounced function instead of directly calling fetchProducts
      debouncedFetchProducts(() => fetchProducts());
    }

    // Clean up the debounce on unmount
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [slug, CurrentCategoryId, searchTerm, orderBy, order, minPriceFilter, maxPriceFilter, countryFilter, stateFilter, cityFilter, categoryFilter, brandFilter, modelFilter, yearFilter, currentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   if (localStorage.getItem('shop-products-category') === category) {
  //     localStorage.getItem('shop-products')?.length > 0 && setProducts(JSON.parse(localStorage.getItem('shop-products')));
  //   }
  // }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   if (localStorage.getItem('shop-sub-categories')) {
  //     setSubCategoryItems(JSON.parse(localStorage.getItem('shop-sub-categories')));
  //   }
  // }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container) return

    const handleScroll = debounce(() => {
      // logger.log('[Shop] Scroll event triggered, scrollTop:', container.scrollTop);
      saveScrollPosition()
    }, 150);

    return () => {
      if (container) {
        // logger.log('Scroll Listener Removed')
        container.removeEventListener('scroll', handleScroll);
        saveScrollPosition()
      }

    };
  }, [saveScrollPosition]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (!loading && products?.data?.length > 0) {
      if (navigationType === 'POP') {
        requestAnimationFrame(restoreScrollPosition)
      } else if (isInitialProductsFetchEffectMount.current) {
        requestAnimationFrame(restoreScrollPosition)
      }
    }
    isInitialProductsFetchEffectMount.current = false
  }, [loading, products?.data?.length, navigationType, restoreScrollPosition]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>Shop on Tjara | Explore Top Stores & Exclusive Deals</title>
        <meta name="description" content="Discover top stores on Tjara, a leading multivendor marketplace. Shop from a vast selection of products at unbeatable prices with fast and free delivery. Enjoy exclusive store deals and seamless shopping." />
        <meta name="keywords" content="Tjara stores, online shopping, best stores, multivendor marketplace, exclusive deals, shop online, e-commerce, seller platform, online store, store discounts, free delivery, top brands, reseller opportunities" />
        <meta property="og:title" content="Shop on Tjara | Explore Top Stores & Exclusive Deals" />
        <meta property="og:description" content="Browse and shop from the best stores on Tjara. Get exclusive discounts, fast delivery, and a seamless shopping experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com/stores" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-stores-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop on Tjara | Explore Top Stores & Exclusive Deals" />
        <meta name="twitter:description" content="Find top stores and shop effortlessly on Tjara. Enjoy the best deals, fast shipping, and a hassle-free experience." />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-stores-preview.jpg" />
      </Helmet>

      <div className={`wrapper shop-category-container ${carCategory == true ? 'cars' : 'products'}`}>
        <SinginPopup />
        {/* <div className="shop-category-heading-top">
          <p className="bread-crumbs-sec">
            Home / <span style={{ textTransform: 'capitalize' }}>{slug}</span> / <span>{currentCategory?.name ?? 'Categories'}</span>
          </p>
        </div> */}
        <div className="shop-category-inner-container">
          <div ref={categoryFilterMb} className="shop-category-inner-left filter-options-row">
            <div className="bg" onClick={filterMb} />
            <div className="mobileFiltersDiv">
              <div className="closeFilterMb">
                Filter
                <button onClick={() => { filterMb(); fetchProducts() }} className="close-filter-btn">Apply Filter</button>
                {/* <svg onClick={filterMb} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1.625C6.6625 1.625 1.625 6.6625 1.625 13C1.625 19.3375 6.6625 24.375 13 24.375C19.3375 24.375 24.375 19.3375 24.375 13C24.375 6.6625 19.3375 1.625 13 1.625ZM13 22.75C7.6375 22.75 3.25 18.3625 3.25 13C3.25 7.6375 7.6375 3.25 13 3.25C18.3625 3.25 22.75 7.6375 22.75 13C22.75 18.3625 18.3625 22.75 13 22.75Z" fill="#9E9E9E" />
                <path d="M17.3875 18.6875L13 14.3L8.6125 18.6875L7.3125 17.3875L11.7 13L7.3125 8.6125L8.6125 7.3125L13 11.7L17.3875 7.3125L18.6875 8.6125L14.3 13L18.6875 17.3875L17.3875 18.6875Z" fill="#9E9E9E" />
              </svg> */}
              </div>
              {carCategory && slug !== 'global' ? null :
                (<div className="shop-category-inner-left-category filter-option-heading-box">
                  <p className="filter-option-heading" onClick={openFilterMenu}>CATEGORIES</p>
                  <div className="category-search"><input type="search" name="categories-search" onChange={(e) => setCategoryFilterSearch(e.target.value)} id="" placeholder="Search Category" /></div>
                  <div className="shop-category-inner-left-categories-container filters-inner-option">
                    {/* ------------------------------------------------------------------------------ */}
                    {/*                                  All Category                                  */}
                    {/* ------------------------------------------------------------------------------ */}
                    <div>
                      <input
                        type="radio"
                        checked={categoryFilter === null || categoryFilter === 'products' || categoryFilter === '' || !currentCategory?.parent?.name}
                        value=''
                        onChange={() => {
                          setcategoryFilter('products');
                          setCategoryInUrl(slug, 'products');
                          setCurrentCategory(null);
                          setSearchTerm('');
                          setIsInitail(true);
                          setCurrentPage(1);
                          fetchSubCategories('products');
                        }}
                        name="shop-category-category"
                        id='all'
                      />
                      <label htmlFor='all'>All Categories</label>
                    </div>
                    {/* ------------------------------------------------------------------------------ */}
                    {/*                                 Parent Category                                */}
                    {/* ------------------------------------------------------------------------------ */}
                    {currentCategory?.parent?.name && (<div>
                      <input
                        type="radio"
                        checked={true}
                        value=''
                        name="shop-category-category"
                        id='all'
                      />
                      <label htmlFor='all'>{currentCategory?.parent?.name}</label>
                    </div>)}
                    {/* ------------------------------------------------------------------------------ */}
                    {/*                                Baqaya Categories                               */}
                    {/* ------------------------------------------------------------------------------ */}
                    {categories?.map((category, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          checked={categoryFilter === category.id || currentCategory?.parent?.id === category.id}
                          value={category.id}
                          onChange={(e) => {
                            setcategoryFilter(e.target.value);
                            setCategoryInUrl(category?.post_type == "product" ? `shop` : category?.post_type == "car" ? `cars` : "global", category?.slug);
                            setCurrentCategory(category);
                            setIsInitail(true);
                            setCurrentPage(1);
                            fetchSubCategories(e.target.value);
                          }}
                          name="shop-category-category"
                          id={category.id}
                        />
                        <label htmlFor={category.id}>{category.name}</label>
                      </div>
                    ))}
                  </div>
                </div>)
              }
              <div style={carCategory ? { marginTop: '0px' } : undefined} className="shop-category-inner-left-price filter-option-heading-box">
                <p className="filter-option-heading" onClick={openFilterMenu}>PRICE RANGE</p>
                <div className="filters-inner-option">
                  <div className="price-range-filter">
                    <MultiRangeSlider min={0} max={100_000} step={5} ruler={false} labels={false} minValue={minPriceFilter} maxValue={maxPriceFilter} barInnerColor="#D21642" thumbLeftColor="#fff" thumbRightColor="#fff" style={{ padding: 0, boxShadow: "none" }} onChange={(e) => { handleSliderInput(e); }} />
                  </div>
                  <div className="shop-category-inner-left-price-min-max-input">
                    <input
                      type="number"
                      min={0}
                      max={maxPriceFilter}
                      placeholder="Min price"
                      value={minPriceFilter}
                      ref={minPriceRef}
                      onChange={handlePriceInput}
                    />
                    <input
                      type="number"
                      min={minPriceFilter}
                      max={100_000}
                      placeholder="Max price"
                      value={maxPriceFilter}
                      ref={maxPriceRef}
                      onChange={handlePriceInput}
                    />
                    <button className="filter-btn" style={{ background: 'red', padding: '5px 10px', border: 'unset', color: '#fff', borderRadius: '5px', cursor: 'pointer' }} onClick={handlePriceInput}>Filter</button>
                  </div>
                  {/* <div className="shop-category-inner-left-prices-container">
                {prices.map((e, i) => {
                  return (
                    <div key={i}>
                      <input type="radio" name="shop-category-prices-filter" id={e} />
                      <label htmlFor={e}>{e}</label>
                    </div>
                  );
                })}
              </div> */}
                </div>
              </div>
              {carCategory == true &&
                <div className="filter-option-heading-box country-left-box">
                  SELECT COUNTRY
                  <select name="country_id" id="" onChange={(e) => {
                    handleCountryChange(e);
                    setCurrentPage(1);
                  }}>
                    <option value="">Select Country</option>
                    {countries.length > 0 &&
                      countries.map((country, index) => (
                        <option key={index} value={country.id} selected={country.id === "89b79d20-36e8-4619-8d39-681450cb1311"}>
                          {country?.name}
                        </option>
                      ))}
                  </select>
                </div>
              }
              {carCategory == true &&
                <div className="filter-option-heading-box country-left-box state-country-box">
                  SELECT STATE
                  <select name="state_id" id="" onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {states.length > 0 &&
                      states.map((state, index) => (
                        <option key={index} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                  </select>
                </div>
              }
              {carCategory == true &&
                <div className="filter-option-heading-box country-left-box">
                  SELECT CITY
                  <select name="city_id" id="" onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {cities.length > 0 &&
                      cities.map((city, index) => (
                        <option key={index} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>
              }
              {popularBrands?.length > 0 && 1 == 0 ?
                (<div className="shop-category-inner-brands-category filter-option-heading-box">
                  <p className="filter-option-heading" onClick={() => setbrandFilter(null)}>POPULAR BRANDS</p>
                  <div className="shop-category-inner-left-brands-container filters-inner-option">
                    {/* <div className="category-search"><input type="search" name="brands-search" onChange={(e) => setBrandFilterSearch(e.target.value)} id="" placeholder="Search Brand" /></div> */}
                    <div>
                      <input type="radio" name="shop-category-brands" id='all' checked={brandFilter == null} value='' onChange={() => {
                        setbrandFilter(null);
                        setIsInitail(true);
                        setCurrentPage(1);
                      }}
                      />
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
                </div>) : ("")
              }

              {/* <div className="shop-category-inner-tags-category filter-option-heading-box">
            <p className="filter-option-heading" onClick={openFilterMenu}>POPULAR TAGS</p>
            <div className="shop-category-inner-left-tags-container filters-inner-option">
              {popularTags.map((e, i) => {
                return (
                  <div key={i}>
                    <input type="checkbox" name="shop-category-tags" id={e} />
                    <label htmlFor={e}>{e}</label>
                  </div>
                );
              })}
            </div>
          </div> */}

              {carCategory == true && 1 == 0 ?
            /* brandFilter && */ (
                  <div className="shop-category-inner-brands-category filter-option-heading-box">
                    <p className="filter-option-heading" /* onClick={() => setSelectedModel(null)} */>
                      POPULAR MODELS
                    </p>
                    <div className="shop-category-inner-left-brands-container filters-inner-option">
                      <div>
                        <input type="radio" name="shop-category-models" id='all' checked={modelFilter == null} value='' onChange={() => {
                          setmodelFilter(null);
                          setIsInitail(true);
                          setCurrentPage(1);
                        }}
                        />
                        <label htmlFor='all'>All</label>
                      </div>
                      {carModels?.map((model, index) => (
                        <div key={index}>
                          <input type="radio" name="shop-category-models" id={model?.id} checked={modelFilter == model?.id} value={model?.id} onChange={() => {
                            setmodelFilter(event.target.value);
                            setIsInitail(true);
                            setCurrentPage(1);
                          }}
                          />
                          <label htmlFor={model?.id}>{model?.name ?? 'GTR'}</label>
                        </div>
                      ))}
                    </div>
                    {/* <button className="button filter-btn" onClick={() => setModelPopup(true)}>
                  Show More
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5422 8.25049L10.3338 14.4588L4.12549 8.25049" stroke="white" strokeWidth="1.8625" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button> */}
                  </div>
                ) : ("")
              }
              {/* {carCategory && (
            modelPopup && (
              <div className="customerServicePopup model-popup">
                <div className="bg" onClick={() => setModelPopup(false)} />
                <div className="container">
                  <h2>MODEL PAPER</h2>
                  <div className="options">
                    {carYears.map((modelObj, i) => (
                      <div key={i} className="opt">
                        <input
                          type="radio"
                          name="shop-category-models"
                          id={modelObj.model}
                          checked={selectedModel === modelObj.model}
                          onChange={() => {
                            setFilters({ ...Filters, modelPaper: modelObj.model })
                            setSelectedModel(modelObj.model);
                          }}
                        />
                        <label htmlFor={modelObj.model}>{modelObj.model}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )} */}
              {carCategory == true &&
            /* modelFilter &&  */(
                  <div className="shop-category-inner-brands-category filter-option-heading-box">
                    <p className="filter-option-heading">POPULAR MODEL YEARS</p>
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
                          }}
                          />
                          <label htmlFor={year?.id}>{year?.name ?? '2023'}</label>
                        </div>
                      ))}
                    </div>
                    {/* <button className="button" onClick={() => setYearPopup(true)}>
                  Show More
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.5422 8.25049L10.3338 14.4588L4.12549 8.25049" stroke="white" strokeWidth="1.8625" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button> */}
                  </div>
                )
              }
              {/* {carCategory && (
            yearPopup && (
              <div className="customerServicePopup model-popup">
                <div className="bg" onClick={() => setYearPopup(false)} />
                <div className="container">
                  <h2>YEAR POPUP</h2>
                  <div className="options">
                    {carBrandsAndModels[selectedBrand]
                      .find((modelObj) => modelObj.model === selectedModel)
                      .year.map((year, i) => (
                        <div key={i} className="opt">
                          <input type="radio" name="shop-category-years" id={year} onClick={() => handleModelYearClick(year)} />
                          <label htmlFor={year}>{year}</label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )
          )} */}
              {/* <div className="shop-category-inner-left-ad-product">
            <img src={SideAdProductImg} alt="" />
            <p className="shop-category-inner-left-ad-product-name">Heavy on Features. Light on Price.</p>
            <p className="shop-category-inner-left-ad-product-price">
              Only for: <span>$299 USD</span>
            </p>
            <button className="button">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.20026 21.8116C9.20026 22.1545 8.9223 22.4324 8.57943 22.4324C8.23655 22.4324 7.95859 22.1545 7.95859 21.8116C7.95859 21.4687 8.23655 21.1908 8.57943 21.1908C8.9223 21.1908 9.20026 21.4687 9.20026 21.8116Z" fill="white" stroke="white" strokeWidth="1.8625" />
                <path d="M18.6654 23.3637C19.5226 23.3637 20.2174 22.6688 20.2174 21.8116C20.2174 20.9544 19.5226 20.2595 18.6654 20.2595C17.8082 20.2595 17.1133 20.9544 17.1133 21.8116C17.1133 22.6688 17.8082 23.3637 18.6654 23.3637Z" fill="white" />
                <path d="M4.92103 7.84286H22.3238L19.7628 16.8061C19.6715 17.1314 19.4758 17.4177 19.2059 17.621C18.936 17.8243 18.6068 17.9334 18.2689 17.9314H8.97585C8.63796 17.9334 8.30878 17.8243 8.03889 17.621C7.76901 17.4177 7.57334 17.1314 7.48197 16.8061L3.97038 4.52528C3.92397 4.36304 3.82595 4.22035 3.69117 4.11882C3.55638 4.0173 3.39218 3.96247 3.22344 3.96265H1.59375" stroke="white" strokeWidth="1.8625" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              ADD TO CART
            </button>
            <button className="shop-category-inner-left-ad-product-button-detail">
              VIEW DETAILS
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.13281 13.175H21.2057" stroke="#D21642" strokeWidth="2.235" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.2188 6.19067L21.2031 13.175L14.2188 20.1594" stroke="#D21642" strokeWidth="2.235" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div> */}
            </div>
          </div>
          <div className="shop-category-inner-right shop-page-category-inner-right">
            <div className="shop-category-inner-right-sub-category">
              <p className="shop-category-inner-right-sub-category-heading">{`More in ${currentCategory?.name ?? 'Categories'}`}</p>
              <div className="sub-cats-se">
                <Swiper
                  freeMode={true}
                  modules={[FreeMode, Pagination]}
                  className="sub-categories-slider"
                  breakpoints={{
                    320: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                    400: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                    640: {
                      slidesPerView: 5,
                      spaceBetween: 20,
                    },
                    800: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 30,
                    },
                    1250: {
                      slidesPerView: 8,
                      spaceBetween: 30,
                    },

                  }}>
                  {/* ------------------------------------------------------------------------------ */}
                  {/*                                 All Categories                                 */}
                  {/* ------------------------------------------------------------------------------ */}
                  <SwiperSlide>
                    <div className={`all-category-slider-single-item ${categoryFilter === null || categoryFilter === 'products' || categoryFilter === '' ? 'selected' : ''}`} onClick={() => {
                      setcategoryFilter('products');
                      setCategoryInUrl(slug, 'products');
                      setCurrentCategory(null);
                      setSearchTerm('');
                      setIsInitail(true);
                      setCurrentPage(1);
                      fetchSubCategories('products');
                    }}>
                      <div className="all-category-item-img-box">
                        <img src={AllCategoriesIcon} alt="" />
                      </div>
                      <p>All Categories</p>
                    </div>
                  </SwiperSlide>
                  {/* ------------------------------------------------------------------------------ */}
                  {/*                                 Parent Category                                */}
                  {/* ------------------------------------------------------------------------------ */}
                  {currentCategory?.parent?.name && (
                    <SwiperSlide>
                      <div className={`all-category-slider-single-item ${categoryFilter === currentCategory?.parent?.id ? 'selected' : ''}`} onClick={() => {
                        setcategoryFilter(currentCategory?.parent?.id);
                        setCategoryInUrl(currentCategory?.parent?.post_type == "product" ? `shop` : currentCategory?.parent?.post_type == "car" ? `cars` : "global", currentCategory?.parent?.slug);
                        setCurrentCategory(currentCategory?.parent);
                        setIsInitail(true);
                        setCurrentPage(1);
                        fetchSubCategories(currentCategory?.parent?.id);
                      }}>
                        <div className="all-category-item-img-box">
                          {fixUrl(currentCategory?.parent?.thumbnail?.media?.url) ?
                            <img src={fixUrl(currentCategory?.parent?.thumbnail?.media?.url)} alt="" />
                            :
                            <div style={{
                              fontSize: '25px',
                              fontWeight: '600',
                              color: '#fff',
                            }}>{currentCategory?.parent?.name?.charAt(0)}</div>
                          }
                        </div>
                        <p>{currentCategory?.parent?.name}</p>
                      </div>
                    </SwiperSlide>)}
                  {/* ---------------------------------------------------------------------------- */}
                  {/*                               Current Category                               */}
                  {/* ---------------------------------------------------------------------------- */}
                  {(currentCategory !== null && currentCategory !== 'products' && currentCategory !== '' && currentCategory?.name) && (
                    <SwiperSlide>
                      <div className={`all-category-slider-single-item ${categoryFilter === currentCategory?.id ? 'selected' : ''}`}>
                        <div className="all-category-item-img-box">
                          {fixUrl(currentCategory?.thumbnail?.media?.url)
                            ?
                            <img src={fixUrl(currentCategory?.thumbnail?.media?.url)} alt="" />
                            :
                            <div style={{ fontSize: '25px', fontWeight: '600', color: '#fff', }}>{currentCategory?.name?.charAt(0)}</div>
                          }
                        </div>
                        <p>{currentCategory?.name}</p>
                      </div>
                    </SwiperSlide>)
                  }
                  {/* ---------------------------------------------------------------------------- */}
                  {/*                               Child Categories                               */}
                  {/* ---------------------------------------------------------------------------- */}
                  {subCategoryItems?.map((data, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className={`all-category-slider-single-item ${categoryFilter === data?.id ? 'selected' : ''}`} onClick={() => {
                          setcategoryFilter(data?.id);
                          setCategoryInUrl(data?.post_type == "product" ? `shop` : data?.post_type == "car" ? `cars` : "global", data?.slug);
                          setCurrentCategory(data);
                          setIsInitail(true);
                          setCurrentPage(1);
                          fetchSubCategories(data?.id);
                        }}>
                          <div className="all-category-item-img-box">
                            {data?.thumbnail ? (
                              fixUrl(data?.thumbnail?.media?.url)
                                ? <img className="category-image" src={fixUrl(data?.thumbnail?.media?.url)} alt="" />
                                : <div className="category-image" style={{ fontSize: '25px', fontWeight: '600', color: '#fff', }}>{data?.name?.charAt(0)}</div>
                            ) : (
                              <Skeleton style={{ borderRadius: '100%' }} height={90} width={90} />
                            )}
                          </div>
                          <p className="category-name">{data?.name ?? <Skeleton width={80} />}</p>
                        </div>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </div>
            <div className="shop-category-inner-right-sort-filter-row">
              <button className="filterButtonPc  filterButton" onClick={filterMb}>
                <input onClick={() => setfilterInputChecked(!filterInputChecked)} type="checkbox" checked={filterInputChecked} />
                {window.innerWidth <= 450 ? <img src={filter} /> : ""} Filter
              </button>
              <p className="sort-by-text">Sort by:</p>
              <select name="sort" value={selectedSorting} id="sortSelect" onChange={handleSorting}>
                <option value="">Default</option>
                <option value="relevance_desc">Most Relevant</option>
                <option value="created_at_desc">Most Recent</option>
                <option value="featured_desc">Featured {slug == "cars" ? "Cars" : slug == "shop" ? "Products" : ""}</option>
                {/* <option value="popularity_desc">Most Popular</option> */}
                <option value="price_asc">Low to high (price)</option>
                <option value="price_desc">High to low (price)</option>
              </select>
            </div>
            <div className="shop-category-inner-right-active-filter-row">
              <div className="shop-category-inner-right-active-filter-row-right">
                <span>Showing: </span>
                <p>{products?.from ?? '0'} - {products?.to ?? '0'} Products</p>
              </div>
              <div className="shop-category-inner-right-active-filter-row-left">
                <p>Active Filters:</p>
                <span>
                  Category : {currentCategory?.name ?? 'All'}
                </span>
              </div>
              <div className="shop-category-inner-right-active-filter-row-right">
                <p>{products?.total ?? '0'}</p>
                <span>Results found.</span>
              </div>
            </div>
            {/* ------------------------------------------------------------------------------------ */}
            {/*                                           X                                          */}
            {/* ------------------------------------------------------------------------------------ */}
            {/* <div className={`shop-category-inner-right-products-container ${windowsWidth > 550 && loading == true || windowsWidth <= 550 && isInitail == true && loading == true || windowsWidth <= 550 && products?.data?.length < 0 && loading == true ? 'loading' : ''}`}>
            {windowsWidth > 550 && loading == true || windowsWidth <= 550 && isInitail == true && loading == true || windowsWidth <= 550 && products?.data?.length < 0 && loading == true
              ?
              (<div className="loader-sec">
                <Loader />
              </div>)
              :
              (products == '' ?
                <div className="noProducts">
                  <img src={noProducts} />
                  <h2>No Products Found</h2>
                </div>
                :
                products?.data?.map((e, i) => (
                  e.product_type == 'auction'
                    ?
                    <AuctionCard key={i} detail={e} />
                    :
                    <ProductCard cartIcon={cartIcon} key={i} detail={e} />
                ))
              )
            }
          </div> */}
            {/* ------------------------------------------------------------------------------------ */}
            {/*                                           X                                          */}
            {/* ------------------------------------------------------------------------------------ */}
            {/* <div ref={productsContainerRef} className="shop-category-inner-right-products-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', position: 'relative' }}>
            {loading && products?.data?.every(item => !item.id) ? (
              <div className="loader-src">
                <Loader />
              </div>
            ) : products?.data?.length == 0 ? (
              <div className="noProducts">
                <img src={noProducts} />
                <h2>No Products Found!</h2>
              </div>
            ) : (
              products?.data?.map((e, i) => (
                e?.product_type === 'auction' ? (
                  <AuctionCard key={i} detail={e} />
                ) : (
                  <ProductCard cartIcon={cartIcon} key={i} detail={e} />
                )
              ))
            )}
          </div> */}

            {/* ------------------------------------------------------------------------------------ */}
            {/*                                           X                                          */}
            {/* ------------------------------------------------------------------------------------ */}

            <div className={`shop-category-inner-right-products-container`}>
              {(windowsWidth > 550 && products?.data?.length <= 0 && loading == true || windowsWidth <= 550 && products?.data?.length <= 0 && isInitail == true && loading == true || windowsWidth <= 550 && products?.data?.length <= 0 && loading == true) && (searchTerm !== '' || searchTerm !== null) ? (
                Array.from({ length: 20 }, (_, index) => (
                  <EmptyProductCard key={index} />
                ))
              ) : products == '' ? (
                <div className="noProducts">
                  <img src={noProducts} />
                  <h2>No Products Found!</h2>
                </div>
              ) : products?.data?.map((e, i) => (
                e?.product_type == 'auction' ? <AuctionCard key={i} detail={e} onClick={() => handleProductClick(e)} /> : <ProductCard cartIcon={cartIcon} key={i} detail={e} onClick={() => handleProductClick(e)} />
              ))}
            </div>

            {/* <div className={`shop-category-inner-right-products-container`}>
            {loading ? (
              // Loader
              Array.from({ length: 20 }, (_, index) => (
                <EmptyProductCard key={index} />
              ))
            ) : (
              (windowsWidth > 550 && products?.data?.length < 0 && loading === true ||
                windowsWidth <= 550 && products?.data?.length < 0 && isInitail === true && loading === true ||
                windowsWidth <= 550 && products?.data?.length < 0 && loading === true) &&
                (searchTerm !== '' || searchTerm !== null) ? (
                Array.from({ length: 20 }, (_, index) => (
                  <EmptyProductCard key={index} />
                ))
              ) : products == '' ? (
                <div className="noProducts">
                  <img src={noProducts} />
                  <h2>No Products Found!</h2>
                </div>
              ) : (
                products?.data?.map((e, i) => (
                  e?.product_type === 'auction' ?
                    <AuctionCard key={i} detail={e} onClick={() => handleProductClick(e)} /> :
                    <ProductCard cartIcon={cartIcon} key={i} detail={e} onClick={() => handleProductClick(e)} />
                ))
              )
            )}
          </div> */}


            {/* ------------------------------------------------------------------------------------ */}
            {/*                                           X                                          */}
            {/* ------------------------------------------------------------------------------------ */}
            {windowsWidth <= 550 && products?.data?.length < products?.total &&
              <RoundLoader componentRef={componentRef} />
            }

            {/* {windowsWidth > 500 && products?.data?.length < products?.total &&
            <div className="load-more-btn-row">
              <button className="button" onClick={handleLoadMore}>Load More</button>
            </div>
          } */}

            {windowsWidth > 550 && products?.data?.length < products?.total &&
              <ul className="pagination">
                {/* {products?.prev_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(products?.prev_page_url).search).get('page'))}><img src={ArrowLeft} alt="Previous" /></button>
                  </li>
                )} */}
                {products?.links?.map((link, index) => (

                  link?.url && (
                    <li key={index} className={`${link.active ? 'active' : ''} page-item`}>
                      <button onClick={() => handlePageChange(new URLSearchParams(new URL(link?.url).search).get('page'))}>{link?.label.replace(/&laquo;|&raquo;/g, '')}</button>
                    </li>
                  )
                ))}
                {/* {products?.next_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(products?.next_page_url).search).get('page'))}><img src={ArrowRight} alt="Previous" /></button>
                  </li>
                )} */}
              </ul>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
