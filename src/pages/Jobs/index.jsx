import { React, useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import MultiRangeSlider from "multi-range-slider-react";

import JOBS from "@client/jobsClient";
import JOB_ATTRIBUTES from "@client/jobAttributesClient";
import JOB_ATTRIBUTES_ITEMS from "@client/jobAttributeItemsClient";
import { fixUrl } from "../../helpers/helpers";

import searchBar from "./assets/searchBar.png";
import location from "./assets/location.png";
import ProductImg from "./assets/side-ad-product-img.svg";
import close from "./assets/close.png";
import setting from "./assets/setting.svg";
import ArrowLeft from "./assets/ArrowLeft.svg";
import ArrowRight from "./assets/ArrowRight.svg";

import "../Shop/style.css"
import "../ServiceList/style.css"
import "./style.css";

const Jobs = () => {
  const [searchJob, setsearchJob] = useState({})
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilterSidebar, setopenFilterSidebar] = useState(true);
  const categoryFilterMb = useRef(null);
  const [categories, setcategories] = useState([])
  const jobTypes = ["Full-Time", "Part-Time"];
  const workTypes = [{ name: "On Site", slug: "on-site" }, { name: "Remote", slug: "remote" }, { name: "Contract", slug: "contract" }, { name: "Hybrid", slug: "hybrid" }];
  const [filterInputChecked, setfilterInputChecked] = useState(false)
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [Search, setSearch] = useState(params ?? '');
  const [jobTypeFilter, setjobTypeFilter] = useState(null)
  const [workTypeFilter, setworkTypeFilter] = useState(null);
  const [minPriceFilter, setminPriceFilter] = useState(1);
  const [maxPriceFilter, setmaxPriceFilter] = useState(100_000_000);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setcategoryFilter] = useState(null);
  // const prices = ["All Price", "Under $20", "$25 to $100", "$100 to $300", "$300 to $500", "$500 to $1,000", "$1,000 to $10,000"];
  // const popularTags = ["Web", "CMR", "Web Design", "Mobile App", "Web", "UX Designer", "Social Media", "Saas", "Poster", "UX", "UI Designer", "Data Entry"];

  /* --------------------------------------------- X -------------------------------------------- */

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
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
      case 'salary_asc':
        setOrderBy('salary');
        setOrder('asc');
        break;
      case 'salary_desc':
        setOrderBy('salary');
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

  const fetchJobs = async () => {
    const attributes = [];
    const filterByAttributes = {};
    const columns = [];
    const filterByColumns = {};

    // Determine attribute filters based on the provided filters
    if (categoryFilter) {
      attributes.push({ key: 'categories', value: categoryFilter, operator: '=' });
    }

    // Determine column filters based on URL params
    if (minPriceFilter) {
      columns.push({ column: 'salary', value: minPriceFilter, operator: '>' });
    }
    if (maxPriceFilter) {
      columns.push({ column: 'salary', value: maxPriceFilter, operator: '<' });
    }
    if (jobTypeFilter) {
      columns.push({ column: 'job_type', value: jobTypeFilter, operator: '=' });
    }
    if (workTypeFilter) {
      columns.push({ column: 'work_type', value: workTypeFilter, operator: '=' });
    }
    if (attributes.length > 0) {
      filterByAttributes.filterJoin = 'AND';
      filterByAttributes.attributes = attributes;
    }
    if (columns.length > 0) {
      filterByColumns.filterJoin = 'AND';
      filterByColumns.columns = columns;
    }

    const { data, error } = await JOBS.getJobs({
      with: "thumbnail,shop",
      filterJoin: "OR",
      filterByAttributes,
      filterByColumns,
      search: Search,
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: 20,
    });
    if (data) {
      setJobs(data.jobs);
      setLoading(false);
    }
    if (error) {
      console.error(error);
      setJobs([])
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await JOB_ATTRIBUTES.getJobAttributes('categories');
    if (data) setcategories(data.product_attribute.attribute_items.product_attribute_items);
    if (error) console.error(error);
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

  useEffect(() => {
    fetchJobs();
  }, [Search, categoryFilter, order, orderBy, minPriceFilter, maxPriceFilter, jobTypeFilter, workTypeFilter])

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories();
  }, []);


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
      <section className="wrapper jobsWrapper">
        <div className="shop-category-heading-top">
          <p>Home / Jobs</p>
        </div>
      </section>
      <section className="SearchJobs">
        <h2>There Are <span>{jobs?.total}</span> Postings Here For you!</h2>
        <p>Find Jobs, Employment & Career Opportunities</p>
        <div className="searchBar">
          <div className="SearchJobInput">
            <img src={searchBar} alt="" />
            <input type="text" placeholder="Job title, keywords, or company" value={searchJob?.jobName} onChange={() => setSearch(event.target.value)} name="" id="" />
          </div>
          {/* <div className="searchLocation">
            <img src={location} alt="" />
            <input type="text" value={searchJob.location && searchJob.location} onChange={() => setsearchJob({ ...searchJob, location: event.target.value })} placeholder="City or postcode" />
          </div>
          <button onClick={submitSearch}>Find Jobs</button> */}
        </div>
      </section>
      <section className="wrapper banner-sec jobs-listing">
        <div className="jobsMainContainer">
          <div className="shop-category-inner-left" ref={categoryFilterMb}>
            <div className="bg" onClick={filterMb}></div>
            <div className="mobileFiltersDiv">
              <div className="filter-close closeFilterMb">
                Filter
                <img onClick={filterMb} src={close} alt="" />
              </div>
              <div className="filter-option-heading-box shop-category-inner-left-category">
                <p>CATEGORY</p>
                <div className="shop-category-inner-left-categories-container">
                  {categories.map((e, i) => {
                    return (
                      <div key={i}>
                        <input type="radio" value={e?.id} onChange={(event) => setcategoryFilter(event.target.value)} name="shop-category-category" id={e.name} />
                        <label htmlFor={e.name}>{e.name}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="filter-option-heading-box shop-category-inner-left-price">
                <p>PRICE RANGE</p>
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
                      <input type="radio" onChange={() => setFilters({ ...Filters, prices: e })} name="shop-category-prices-filter" id={e} />
                      <label htmlFor={e}>{e}</label>
                    </div>
                  );
                })}
              </div> */}
              </div>
              <div className="filter-option-heading-box shop-category-inner-brands-category">
                <p>JOB TYPES</p>
                <div className="shop-category-inner-left-brands-container">
                  {jobTypes?.map((e, i) => {
                    return (
                      <div key={i}>
                        <input onClick={() => setjobTypeFilter(event.target.value)} type="radio" name="job_type" id={e} value={e.toLowerCase()} />
                        <label htmlFor={e} >{e}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="filter-option-heading-box shop-category-inner-brands-category">
                <p>WORK TYPES</p>
                <div className="shop-category-inner-left-brands-container">
                  {workTypes?.map(e => (
                    <div>
                      <input type="radio" name="work-type" value={e.slug} onClick={() => setworkTypeFilter(event.target.value)} id={e.slug} />
                      <label htmlFor={"full"} >{e.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="filter-option-heading-box shop-category-inner-tags-category">
              <p>POPULAR TAGS</p>
              <div className="shop-category-inner-left-tags-container">
                {popularTags.map((e, i) => {
                  return (
                    <div key={i}>
                      <input type="checkbox" name="shop-category-tags" id={e} onChange={() => setFilters({ ...Filters, popularTags: !Filters.popularTags ? [e] : event.target.checked ? [...Filters.popularTags, e] : Filters.popularTags.filter((x) => x != e) })} />
                      <label htmlFor={e} >{e}</label>
                    </div>
                  );
                })}
              </div>
            </div> */}
            </div>
          </div>
          <div className="main-sec" style={{ width: "-webkit-fill-available" }}>
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
                <option value="salary_asc">Low to high (salary)</option>
                <option value="salary_desc">High to low (salary)</option>
              </select>
            </div>
            <div className="jobs">
              {jobs?.data?.map((job, index) => (
                <div className="job" key={index}>
                  <div className="Top">
                    <img src={fixUrl(job?.thumbnail?.media?.url)} alt="" />
                    <div className="title">
                      <Link to={`/jobs/${job.id}`}>
                        <h2 className="job-name">{job.title}</h2>
                      </Link>
                      <p>{job?.state?.name} <span /> {job?.country?.name}</p>
                    </div>
                  </div>
                  <div className="jobType">
                    <p className="salaryRange">${job.salary} a month</p>
                    <p className="type" style={{ textTransform: 'capitalize' }}>{job.job_type}</p>
                  </div>
                  <p className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
                  {/* <p className="job-price">Salary: {job.salary}.Rs</p> */}
                  {/* <p className="job-location">Location: {job.location}</p> */}
                  {/* <p className="job-published-date">Published Date: {job.created_at}</p> */}
                  {/* <p className="postTime">Active 5 days ago</p> */}
                </div>
              ))}
            </div>
            <ul className="pagination">
              {jobs?.prev_page_url && (
                <li>
                  <button onClick={() => handlePageChange(new URLSearchParams(new URL(jobs?.prev_page_url).search).get('page'))}><img src={ArrowLeft} alt="Previous" /></button>
                </li>
              )}
              {/* {jobs?.links?.map((link, index) => (
              link?.url && (
                <li key={index} className={`${link.active ? 'active' : ''} page-item`}>
                  <button onClick={() => handlePageChange(new URLSearchParams(new URL(link?.url).search).get('page'))}>{link?.label.replace(/&laquo;|&raquo;/g, '')}</button>
                </li>
              )
            ))} */}
              {jobs?.next_page_url && (
                <li>
                  <button onClick={() => handlePageChange(new URLSearchParams(new URL(jobs?.next_page_url).search).get('page'))}><img src={ArrowRight} alt="Previous" /></button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Jobs;
