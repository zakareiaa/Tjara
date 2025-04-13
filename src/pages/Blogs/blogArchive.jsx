import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import blogThumbnail from "./assets/blogs.png";
import POSTS from "@client/postsClient";
import POST_ATTRIBUTES from '@client/postAttributesClient'
import POST_ATTRIBUTE_ITEMS from '@client/postAttributeItemsClient'
import user from "./assets/UserCircle.svg";
import calender from "./assets/CalendarBlank.svg";
import setting from "./assets/setting.svg";
import chat from "./assets/ChatCircleDots.svg";
import arrow from "./assets/ArrowRight.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { fixUrl, formatDate } from "../../helpers/helpers";
import close from "./assets/close.png";

const blogArchive = ({ ids, limit }) => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [Search, setSearch] = useState(queryParams.get('search'))
  const [categoryParam, setcategoryParam] = useState(queryParams.get('category'))
  const [categoryFilter, setcategoryFilter] = useState(categoryParam);
  const [orderBy, setOrderBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [categories, setCategories] = useState([]);
  const [filterInputChecked, setfilterInputChecked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const categoryFilterMb = useRef(null);
  // const [tagsFilter, settagsFilter] = useState(null)
  // const [tags, setTags] = useState([
  //   { name: "Applicances" },
  //   { name: "Carpentry" },
  //   { name: "Laptops" },
  //   { name: "Lights" },
  //   { name: "Computers" },
  //   { name: "Electrical" },
  //   { name: "Electrical" },
  //   { name: "Smart TV" },
  //   { name: "Speaker" },
  //   { name: "Carpentry" },
  //   { name: "Caepentry" },
  //   { name: "Computer" }
  // ]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await POST_ATTRIBUTES.getPostAttribute('categories');
    if (data) setCategories(data.post_attribute.attribute_items.post_attribute_items);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchCurrentCategory = async (category) => {
  //   const { data, error } = await POST_ATTRIBUTE_ITEMS.getPostAttributeItem(category, {});
  //   if (data) setCurrentCategory(data.service_attribute_items);
  //   if (error) console.error(error);
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  // const fetchTags = async () => {
  //   const { data, error } = await POST_ATTRIBUTES.getPostAttribute('tags');
  //   if (data) setTags(data.post_attribute.attribute_items.post_attribute_items);
  //   if (error) console.error(error);
  // };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSorting = (event) => {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case 'created_at_desc':
        setOrderBy('created_at');
        setOrder('desc');
        break;
      case 'popularity_desc':
        setOrderBy('popularity');
        setOrder('desc');
        break;
      case 'relevance_desc':
        setOrderBy('relevance');
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

  const fetchBlogs = async () => {

    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "OR",
      search: Search,
      orderBy: orderBy,
      order: order,
      page: currentPage,
      per_page: 20,
    }

    const attributes = [];
    const columns = [];

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
    // if (minPriceFilter) {
    //   columns.push({ column: 'price', value: minPriceFilter, operator: '>' });
    // }

    columns.push({ column: 'post_type', value: 'blogs', operator: '=' });

    if (attributes.length > 0) {
      ApiParams.filterByAttributes = {
        filterJoin: 'AND',
        attributes: attributes
      }
    }

    if (columns.length > 0) {
      ApiParams.filterByColumns = {
        filterJoin: 'AND',
        columns: columns
      }
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) {
      setBlogs(data.posts);
    }

    if (error) {
      console.error(error);
      setBlogs([])
    };
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSearch = async () => {
    navigate(`/blogs?search=${Search}`)
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories();
    // fetchTags();
    fetchBlogs();
  }, [Search, categoryFilter, orderBy, order]);

  /* --------------------------------------------- X -------------------------------------------- */

  const filterMb = () => {
    if (window.innerWidth <= 450) {
      categoryFilterMb.current.classList.toggle("active");
    }
  };

  // const Addtags = (value) => {
  //   const findval = tagsFilter.filter(x => x == value)
  //   if (findval.length == 0) {
  //     settagsFilter([...tagsFilter, value])
  //   } else {
  //     settagsFilter(
  //       tagsFilter.filter(x => {
  //         return x != value
  //       })
  //     )
  //   }
  // }

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const params = new URLSearchParams(location.search);
    params.set('page', selected.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   fetchCurrentCategory(categoryFilter);
  // }, [categories]);

  /* --------------------------------------------- X -------------------------------------------- */

  // useEffect(() => {
  //   fetchCurrentCategory(categoryFilter);
  // }, [categoryFilter]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <section className="wrapper BlogsArchive">
      <div ref={categoryFilterMb} className="shop-category-inner-left">
        <div className="bg" onClick={filterMb} />
        <div className="mobileFiltersDiv">
          <div className="filter-close closeFilterMb">Filter
            <img onClick={filterMb} src={close} alt="" />
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
              {categories?.map((e, i) => {
                return (
                  <div key={i}>
                    <input
                      type="radio"
                      checked={categoryFilter === e.id}
                      value={e.id}
                      onChange={(e) => setcategoryFilter(e.target.value)}
                      name="shop-category-category"
                      id={e.id}
                    />
                    <label htmlFor={e?.id}>{e?.name}</label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div style={{ marginTop: "20px" }} className="filter-option-heading-box shop-category-inner-tags-category">
          <p>POPULAR TAGS</p>
          <div className="shop-category-inner-left-tags-container">
            {tags?.map((e, i) => {
              return (
                <div key={i}>
                  <input value={e?.name} onClick={() => Addtags(e?.id)} type="checkbox" name="shop-category-tags" id={e?.id} />
                  <label htmlFor={e?.id} >{e?.name}</label>
                </div>
              );
            })}
          </div>
        </div> */}

          <div className="filter-option-heading-box latestBlogs">
            <h1>Latest Blogs</h1>
            <div className="blogs">
              {blogs?.data?.slice(0, 3).map((blog, index) => (
                <div key={index} className="blog">
                  <img src={fixUrl(blog?.thumbnail?.media?.url) ?? blogThumbnail} alt="" />
                  <div className="title">
                    <Link to={blog?.id}><h2>{blog.name ?? 'Curabitur pulvinar aliquam lectus, non blandit erat.'}</h2></Link>
                    <p>{formatDate(blog.created_at) ?? '28 Nov, 2015'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mainBlogs">
        <div className="top">
          <div className="search">
            <input type="text" placeholder="Search..." onChange={() => setSearch(event.target.value)} />
            <svg onClick={handleSearch} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.798 21.8098C17.6943 21.8098 21.6635 17.8406 21.6635 12.9444C21.6635 8.04817 17.6943 4.07898 12.798 4.07898C7.9018 4.07898 3.93262 8.04817 3.93262 12.9444C3.93262 17.8406 7.9018 21.8098 12.798 21.8098Z" stroke="#191C1F" strokeWidth="2.02638" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19.0674 19.2135L24.1967 24.3428" stroke="#191C1F" strokeWidth="2.02638" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg onClick={filterMb} className="filterMb" width="46" height="52" viewBox="0 0 46 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="52" rx="8" fill="#222222" />
              <path d="M31.75 19.75H29.02C28.7638 19.0205 28.2877 18.3883 27.6573 17.9406C27.0269 17.4928 26.2732 17.2516 25.5 17.25C24.7268 17.2516 23.9731 17.4928 23.3427 17.9406C22.7123 18.3883 22.2362 19.0205 21.98 19.75H14.25C13.9185 19.75 13.6005 19.8817 13.3661 20.1161C13.1317 20.3505 13 20.6685 13 21C13 21.3315 13.1317 21.6495 13.3661 21.8839C13.6005 22.1183 13.9185 22.25 14.25 22.25H21.98C22.2362 22.9795 22.7123 23.6117 23.3427 24.0594C23.9731 24.5072 24.7268 24.7484 25.5 24.75C26.2732 24.7484 27.0269 24.5072 27.6573 24.0594C28.2877 23.6117 28.7638 22.9795 29.02 22.25H31.75C32.0815 22.25 32.3995 22.1183 32.6339 21.8839C32.8683 21.6495 33 21.3315 33 21C33 20.6685 32.8683 20.3505 32.6339 20.1161C32.3995 19.8817 32.0815 19.75 31.75 19.75ZM31.75 29.75H24.02C23.764 29.0204 23.2879 28.3881 22.6575 27.9403C22.0271 27.4926 21.2733 27.2514 20.5 27.25C19.7268 27.2516 18.9731 27.4928 18.3427 27.9406C17.7123 28.3883 17.2362 29.0205 16.98 29.75H14.25C13.9185 29.75 13.6005 29.8817 13.3661 30.1161C13.1317 30.3505 13 30.6685 13 31C13 31.3315 13.1317 31.6495 13.3661 31.8839C13.6005 32.1183 13.9185 32.25 14.25 32.25H16.98C17.2362 32.9795 17.7123 33.6117 18.3427 34.0594C18.9731 34.5072 19.7268 34.7484 20.5 34.75C21.2732 34.7484 22.0269 34.5072 22.6573 34.0594C23.2877 33.6117 23.7638 32.9795 24.02 32.25H31.75C32.0815 32.25 32.3995 32.1183 32.6339 31.8839C32.8683 31.6495 33 31.3315 33 31C33 30.6685 32.8683 30.3505 32.6339 30.1161C32.3995 29.8817 32.0815 29.75 31.75 29.75Z" fill="white" />
            </svg>
          </div>
          <div className="sort">
            <p>Sort</p>
            <select name="sort" id="sortSelect" onChange={handleSorting}>
              <option value="created_at_desc">Most Recent</option>
              <option value="popularity_desc">Most Popular</option>
              <option value="relevance_desc">Most Relevant</option>
            </select>
          </div>
        </div>

        <button className="filterButtonPc  filterButton" onClick={filterMb}>
          <input onClick={() => setfilterInputChecked(!filterInputChecked)} type="checkbox" checked={filterInputChecked} />
          <img className="filter-setting" src={setting} alt="" />
          Fitler
        </button>

        <div className="blogs">
          {blogs == '' ?
            (<div style={{ justifyContent: 'left', alignItems: 'flex-start' }} className="noProducts">
              <h2>No Blogs Found!</h2>
            </div>)
            :
            blogs?.data?.map((blog, index) => (
              (<div key={index} className="blog">
                <img onClick={() => navigate(`/blogs/${blog.id}`)} src={fixUrl(blog?.thumbnail?.media?.url) ?? blogThumbnail} alt="" />
                <div className="details">
                  <div className="author">
                    <img src={user} alt="" />
                    <p>{blog?.shop?.shop?.name}</p>
                  </div>
                  <div className="date">
                    <img src={calender} alt="" />
                    <p>{formatDate(blog.created_at)}</p>
                  </div>
                  {/* <div className="comments">
                  <img src={chat} alt="" />
                  <p>738</p>
                </div> */}
                </div>
                <p className="title">
                  <Link to={`/blogs/${blog.id}`}>{blog.name}</Link>
                </p>
                <div className="description" >{blog.description.replace(/<\/?[^>]+(>|$)/g, "")}</div>
                <button>
                  <Link to={`/blogs/${blog.id}`}>
                    Read More <img src={arrow} alt="" />
                  </Link>
                </button>
              </div>)
            ))
          }
        </div>

        {blogs?.data?.length < blogs?.total &&
          <ul className="pagination">
            {/* {blogs?.prev_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(blogs?.prev_page_url).search).get('page'))}><img src={ArrowLeft} alt="Previous" /></button>
                  </li>
                )} */}
            {blogs?.links?.map((link, index) => (
              link?.url && (
                <li key={index} className={`${link.active ? 'active' : ''} page-item`}>
                  <button onClick={() => handlePageChange(new URLSearchParams(new URL(link?.url).search).get('page'))}>{link?.label.replace(/&laquo;|&raquo;/g, '')}</button>
                </li>
              )
            ))}
            {/* {blogs?.next_page_url && (
                  <li>
                    <button onClick={() => handlePageChange(new URLSearchParams(new URL(blogs?.next_page_url).search).get('page'))}><img src={ArrowRight} alt="Previous" /></button>
                  </li>
                )} */}
          </ul>
        }
      </div>
    </section>
  );
};

export default blogArchive;
