import { React, useState, useEffect, useRef, useCallback } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from 'lodash';

import SERVICE from "@client/servicesClient";
import SERVICE_ATTRIBUTES from "@client/serviceAttributesClient";
import SERVICE_ATTRIBUTE_ITEMS from "@client/serviceAttributeItemsClient";
import COUNTRIES from "@client/countriesClient";
import STATES from "@client/statesClient";
import CITIES from "@client/citiesClient";
import { fixUrl } from "../../helpers/helpers"

import searchBar from "./assets/searchBar.png";
import RatedStar from "../../assets/rated-star.svg";
import setting from "./assets/setting.svg";
import close from "./assets/close.png";

import "../Shop/style.css";
import "./style.css";
import { Helmet } from "react-helmet-async";

const Services = () => {
  const [services, setServices] = useState([]);
  const [categoryId, setcategoryId] = useState(null)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get('search');
  const [currentPage, setCurrentPage] = useState(1);
  const [Search, setSearch] = useState(search);
  const [categoryFilter, setcategoryFilter] = useState(null);
  const [countryFilter, setcountryFilter] = useState(null);
  const [stateFilter, setstateFilter] = useState(null);
  const [cityFilter, setcityFilter] = useState(null);
  const [minPriceFilter, setminPriceFilter] = useState(1);
  const [maxPriceFilter, setmaxPriceFilter] = useState(100_000_000);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  // const [tags, setTags] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filterInputChecked, setfilterInputChecked] = useState(false)
  const categoryFilterMb = useRef(null);
  const navigate = useNavigate();

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await SERVICE_ATTRIBUTES.getServiceAttribute('categories');
    if (data) setCategories(data?.service_attribute?.attribute_items?.service_attribute_items);
    if (data) setcategoryId(data?.service_attribute?.id);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCurrentCategory = async (category) => {
    const { data, error } = await SERVICE_ATTRIBUTE_ITEMS.getServiceAttributeItem(category, {});
    if (data) setCurrentCategory(data.service_attribute_items);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchTags = async () => {
  //   const { data, error } = await SERVICE_ATTRIBUTES.getServiceAttribute('tags');
  //   if (data) setTags(data.service_attribute.attribute_items.service_attribute_items);
  //   if (error) console.error(error);
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCountries = async () => {
    const { data, error } = await COUNTRIES.getCountries({});
    if (data) setCountries(data.countries);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchStates = async (countryId) => {
    const { data, error } = await STATES.getStates(countryId);
    if (data) setStates(data.states);
    if (data) fetchCities(data.states[0]?.id)
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCities = async (stateId) => {
    const { data, error } = await CITIES.getCities(stateId);
    if (data) setCities(data.cities);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCountryChange = (e) => {
    setcountryFilter(e.target.value);
    fetchStates(e.target.value);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleStateChange = (e) => {
    setstateFilter(e.target.value);
    fetchCities(e.target.value);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCityChange = (e) => {
    setcityFilter(e.target.value);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCurrentCategory(categoryFilter);
  }, [categories]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCurrentCategory(categoryFilter);
  }, [categoryFilter]);

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

  /* -------------------------------------------------------------------------------------------- */
  /*                                Function To Fetch The Jobs                                */
  /* -------------------------------------------------------------------------------------------- */

  const fetchServices = async () => {

    const ApiParams = {};
    const attributes = [];
    const filterByAttributes = {};
    const columns = [];
    const filterByColumns = {};

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

    // Determine attribute filters based on the provided filters
    if (categoryFilter) {
      attributes.push({ key: 'categories', value: categoryFilter, operator: '=' });
    }

    // Determine column filters based on URL params
    if (minPriceFilter) {
      columns.push({ column: 'price', value: minPriceFilter, operator: '>' });
    }
    if (maxPriceFilter) {
      columns.push({ column: 'price', value: maxPriceFilter, operator: '<' });
    }
    if (countryFilter) {
      columns.push({ column: 'country_id', value: countryFilter, operator: '=' });
    }
    if (stateFilter) {
      columns.push({ column: 'state_id', value: stateFilter, operator: '=' });
    }
    if (cityFilter) {
      columns.push({ column: 'city_id', value: cityFilter, operator: '=' });
    }

    if (attributes.length > 0) {
      filterByAttributes.filterJoin = 'AND';
      filterByAttributes.attributes = attributes;
      ApiParams.filterByAttributes = filterByAttributes;
    }

    if (columns.length > 0) {
      filterByColumns.filterJoin = 'AND';
      filterByColumns.columns = columns;
      ApiParams.filterByColumns = filterByColumns;
    }

    if (Search) {
      ApiParams.search = Search;
    }

    ApiParams.with = "thumbnail,shop";
    ApiParams.filterJoin = "OR";
    ApiParams.orderBy = orderBy;
    ApiParams.order = order;
    ApiParams.page = currentPage;
    ApiParams.per_page = 20;

    const { data, error } = await SERVICE.getServices(ApiParams);

    if (data) {
      setServices(data.services);
    }

    if (error) {
      console.error(error)
      setServices([])
    };
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

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1170) {
        // setopenFilterSidebar(false);
      }
    });
  }, [window.innerWidth]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories();
    fetchCountries();
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchServices();
  }, [Search, currentPage, categoryFilter, orderBy, order, minPriceFilter, maxPriceFilter, countryFilter, stateFilter, cityFilter])

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setSearch(search);
  }, [search])

  /* --------------------------------------------- X -------------------------------------------- */

  const filterMb = () => {
    if (window.innerWidth <= 450) {
      categoryFilterMb.current.classList.toggle("active");
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>Find & Offer Services | Tjara Marketplace</title>
        <meta name="description" content="Discover professional services on Tjara. Browse or list services in various categories, from digital marketing to home services. Connect with top providers today!" />
        <meta name="keywords" content="Tjara services, hire professionals, offer services, service marketplace, digital marketing, home services, freelancing, local services, online marketplace" />
        <meta property="og:title" content="Find & Offer Services | Tjara Marketplace" />
        <meta property="og:description" content="Need a service? Find skilled professionals or list your own services on Tjara. Get the best offers today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com/services" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-services-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Find & Offer Services | Tjara Marketplace" />
        <meta name="twitter:description" content="Browse and offer professional services on Tjara. Connect with top service providers today!" />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-services-preview.jpg" />
      </Helmet>

      <section className="wrapper jobsWrapper filter-option-heading-box ">
        <div className="shop-category-heading-top">
          <p>Home / Computer</p>
        </div>
      </section>
      <section className="SearchJobs">
        <h2>Professional Services For Your Home & Commercial</h2>
        <p>Search From 100 Awesome Verified Ads</p>
        <div className="searchBar">
          <div className="SearchJobInput">
            <img src={searchBar} alt="" />
            <input type="text" onChange={() => setSearch(event.target.value)} value={Search} placeholder="What are you looking for?" name="" id="" />
          </div>
          {/* <div className="searchLocation">
            <img src={location} alt="" />
            <input type="text" onChange={() => setSearch(event.target.value)} placeholder="City or postcode" />
          </div> */}
          {/* <button onClick={submitSearch}>Find Services</button> */}
        </div>
      </section>
      <section className="wrapper banner-sec services-container">
        <div className="jobsMainContainer serviceList">
          <div ref={categoryFilterMb} className="shop-category-inner-left">
            <div className="bg" onClick={filterMb} />
            <div className="mobileFiltersDiv">
              <div className="filter-close closeFilterMb">Filter
                <img onClick={filterMb} src={close} alt="" />
              </div>
              <div className="filter-option-heading-box country-left-box">
                SELECT COUNTRY
                <select name="country_id" id="" onChange={handleCountryChange}>
                  <option value="">Select Country</option>
                  {countries.length > 0 &&
                    countries.map((country, index) => (
                      <option key={index} value={country.id}>
                        {country?.name}
                      </option>
                    ))}
                </select>
              </div>
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
              <div className="filter-option-heading-box shop-category-inner-left-category">
                <p>CATEGORY</p>
                <div className="shop-category-inner-left-categories-container">
                  <div>
                    <input
                      type="radio"
                      checked={categoryFilter === null}
                      value=''
                      onChange={() => setcategoryFilter(null)}
                      name="shop-category-category"
                      id='all'
                    />
                    <label htmlFor='all'>All</label>
                  </div>
                  {categories?.map((category, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        checked={categoryFilter === category.id}
                        value={category.id}
                        onChange={(e) => setcategoryFilter(e.target.value)}
                        name="shop-category-category"
                        id={category.id}
                      />
                      <label htmlFor={category.id}>{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="shop-category-inner-tags-category">
                  <p>POPULAR TAGS</p>
                  <div className="shop-category-inner-left-tags-container">
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
              {/* <div className="filter-option-heading-box shop-category-inner-left-category shop-sub-category">
              <p>SUB CATEGORY</p>
              <div className="shop-category-inner-left-categories-container">
                {subCategories?.map((e, i) => {
                  return (
                    <div key={i}>
                      <input type="radio" name="shop-category-category" onChange={() => setFilters({ ...Filters, subCategory: e?.id })} id={e?.id} />
                      <label htmlFor={e?.id}>{e?.name}</label>
                    </div>
                  );
                })}
              </div>
            </div> */}
              <div className="filter-option-heading-box shop-category-inner-left-price service-category-inner-left-price filter-option-heading-box">
                <p className="filter-option-heading" onClick={openFilterMenu}>
                  BUDGET RANGE
                </p>
                <div className="filters-inner-option">
                  <div>
                    <MultiRangeSlider min={1} max={100_000} step={5} ruler={false} labels={false} minValue={minPriceFilter} maxValue={maxPriceFilter} barInnerColor="#D21642" thumbLeftColor="#fff" thumbRightColor="#fff" style={{ padding: 0, boxShadow: "none" }} onInput={(e) => { handleSliderInput(e); }} />
                  </div>
                  <div className="shop-category-inner-left-price-min-max-input">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={minPriceFilter}
                      onChange={handleMinInputChange}
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={maxPriceFilter}
                      onChange={handleMaxInputChange}
                    />
                  </div>
                  {/* <div className="shop-category-inner-left-prices-container">
                  {prices.map((e, i) => {
                    return (
                      <div key={i}>
                        <input
                          type="radio"
                          name="shop-category-prices-filter"
                          id={e}
                        />
                        <label htmlFor={e}>{e}</label>
                      </div>
                    );
                  })}
                </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="main-sec">
            <div className="sort">
              <button className="filterButtonPc  filterButton" onClick={filterMb}>
                <input onClick={() => setfilterInputChecked(!filterInputChecked)} type="checkbox" checked={filterInputChecked} />
                <img className="filter-setting" src={setting} alt="" />
                Filter
              </button>
              <p>Sort By:</p>
              <select name="sort" id="sortSelect" onChange={handleSorting}>
                <option value="created_at_desc">Most Recent</option>
                <option value="popularity_desc">Most Popular</option>
                <option value="relevance_desc">Most Relevant</option>
                <option value="price_asc">Low to high (price)</option>
                <option value="price_desc">High to low (price)</option>
              </select>
            </div>

            <div className="jobs services">
              {services?.data?.map((service, index) => (
                <div key={index} className="job service">
                  <div className="Top" onClick={() => navigate(`/services/${service?.id}`)}>
                    <img src={fixUrl(service?.thumbnail?.media?.url)} alt="" />
                  </div>
                  <div className="title">
                    {/* <div className="rating">
                      <img src={RatedStar} alt="" />
                      <img src={RatedStar} alt="" />
                      <img src={RatedStar} alt="" />
                      <img src={RatedStar} alt="" />
                      <img src={RatedStar} alt="" />
                    </div> */}
                    <Link to={`/services/${service?.id}`}>
                      <h2 className="job-name">
                        {service?.name}
                      </h2>
                    </Link>
                    <p>
                      {service?.state?.name} <span />  {service?.country?.name}
                    </p>
                  </div>
                  <Link to={`/services/${service?.id}`}>
                    <button>Inquire Now</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
