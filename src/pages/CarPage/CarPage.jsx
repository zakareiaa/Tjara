import React, { useState, useEffect } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import axiosClient from "@client/axiosClient";
import { useNavigate, Link, Router, useParams } from "react-router-dom";
import "./style.css";

import ProductsFeature from "@components/ProductsFeature";

import car1 from "./assets/car1.png";
import car2 from "./assets/car2.png";
import car3 from "./assets/car3.png";
import car4 from "./assets/car4.png";
import car5 from "./assets/car5.png";
import car6 from "./assets/car6.png";
import car7 from "./assets/car7.png";
import car8 from "./assets/car8.png";

import prodCar1 from "./assets/prodCar1.png";
import prodCar2 from "./assets/prodCar2.png";
import prodCar3 from "./assets/prodCar3.png";
import prodCar4 from "./assets/prodCar4.png";
import prodCar5 from "./assets/prodCar5.png";
import prodCar6 from "./assets/prodCar6.png";
import prodCar7 from "./assets/prodCar7.png";
import prodCar8 from "./assets/prodCar8.png";

import SideAdProductImg from "./assets/ferrari.png";

import ArrowLeft from "./assets/ArrowLeft.svg";
import ArrowRight from "./assets/ArrowRight.svg";

const Shop = () => {
  const [modelPopup, setModelPopup] = useState(false);
  const [yearPopup, setYearPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  function handleModelYearClick(selectedYear) {
    // Update state variable or perform other actions based on selected year
  }

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null); // Reset selected model when a new brand is selected
  };

  const handleModelClick = (model) => {
    setSelectedModel(model);
  };
  // All Products State/var
  // const [products, setProducts] = useState([]);

  // All auctions state
  // const [auctions, setAuctions] = useState([]);

  // Navigate State
  // const navigate = useNavigate();

  /* -------------------------------------------------------------------------------------------- */
  /*                                Function To Fetch The Products                                */
  /* -------------------------------------------------------------------------------------------- */

  const categories = ["Auto Clutch", "Auto Engine", "Body Parts", "Brake System", "Cars", "Exterior Accessories", "Fuel System", "Interior Accessories", "Lubrication System", "Suspension System", "Vehicle Equipment", "Vehicle Equipment"];
  //   const prices = [
  //     "All Price",
  //     "Under $20",
  //     "$25 to $100",
  //     "$100 to $300",
  //     "$300 to $500",
  //     "$500 to $1,000",
  //     "$1,000 to $10,000",
  //   ];
  //   const popularCarBrands = [
  //     "BMW",
  //     "Ferrari",
  //     "Lamborghini",
  //     "Bugatti",
  //     "Jaguar",
  //     "Dodge",
  //     "Mazda",
  //     "Porsche",
  //     "Aston Martin",
  //     "Mercedes Benz",
  //     "Ford Mustang",
  //     "Bugatti",
  //     "Lexus",
  //   ];
  const carBrandsAndModels = {
    BMW: [
      { model: "3 Series", year: [2003, 2004] },
      { model: "5 Series", year: [2003, 2004] },
      { model: "7 Series", year: [2003, 2004] },
      // Add more BMW models and years as needed
    ],
    Ferrari: [
      { model: "488 GTB", year: [2003, 2004] },
      { model: "812 Superfast", year: [2003, 2004] },
      // Add more Ferrari models and years as needed
    ],
    Lamborghini: [
      { model: "Huracan", year: [2003, 2004] },
      { model: "Aventador", year: [2003, 2004] },
      // Add more Lamborghini models and years as needed
    ],
    Bugatti: [
      { model: "Chiron", year: [2003, 2004] },
      // Add more Bugatti models and years as needed
    ],
    Jaguar: [
      { model: "F-Type", year: [2003, 2004] },
      // Add more Jaguar models and years as needed
    ],
    Dodge: [
      { model: "Challenger", year: [2003, 2004] },
      { model: "Charger", year: [2003, 2004] },
      // Add more Dodge models and years as needed
    ],
    Mazda: [
      { model: "MX-5 Miata", year: [2003, 2004] },
      // Add more Mazda models and years as needed
    ],
    Porsche: [
      { model: "911", year: [2003, 2004] },
      // Add more Porsche models and years as needed
    ],
    "Aston Martin": [
      { model: "DB11", year: [2003, 2004] },
      // Add more Aston Martin models and years as needed
    ],
    "Mercedes Benz": [
      { model: "E-Class", year: [2003, 2004] },
      // Add more Mercedes Benz models and years as needed
    ],
    "Ford Mustang": [
      { model: "Mustang GT", year: [2003, 2004] },
      // Add more Ford Mustang models and years as needed
    ],
    Lexus: [
      { model: "LFA", year: [2003, 2004] },
      // Add more Lexus models and years as needed
    ],
  };
  const popularTags = ["Game", "Heater", "Asus Laptops", "Lights", "SSD", "Graphics Card", "Power Bank", "Smart TV", "Speaker", "AC", "Microwave", "Play Station"];

  const subCategoryItems = [
    {
      img: [car1],
      name: "Hatchback ",
    },
    {
      img: [car2],
      name: "Sport Utility vehicles",
    },
    {
      img: [car3],
      name: "Convertible",
    },
    {
      img: [car4],
      name: "Sedan",
    },
    {
      img: [car5],
      name: "Coupe",
    },
    {
      img: [car6],
      name: "Cross Over",
    },
    {
      img: [car7],
      name: "Sports car",
    },
    {
      img: [car8],
      name: "Grand Tourer",
    },
  ];

  // const products = [

  // ];

  const productdata = {
    data: [
      {
        img: prodCar1,
        productSituation: "Feature",
        storename: "Store One",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar2,
        productSituation: "Feature",
        storename: "Store Two",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar3,
        productSituation: "Feature",
        storename: "Store Three",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 18,
        discountedprice: 15,
      },
      {
        img: prodCar4,
        productSituation: "Feature",
        storename: "Store Four",
        productname: "Product Name Here",
        rating: 1,
        originalprice: 15,
        discountedprice: 10,
      },
      {
        img: prodCar5,
        productSituation: "Feature",
        storename: "Store Five",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 22,
        discountedprice: 17,
      },
      {
        img: prodCar6,
        productSituation: "Feature",
        storename: "Store Six",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar7,
        productSituation: "Feature",
        storename: "Store Seven",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 25,
        discountedprice: 16,
      },
      {
        img: prodCar8,
        productSituation: "Feature",
        storename: "Store Eight",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar1,
        productSituation: "Feature",
        storename: "Store One",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar2,
        productSituation: "Feature",
        storename: "Store Two",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar3,
        productSituation: "Feature",
        storename: "Store Three",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 18,
        discountedprice: 15,
      },
      {
        img: prodCar4,
        productSituation: "Feature",
        storename: "Store Four",
        productname: "Product Name Here",
        rating: 1,
        originalprice: 15,
        discountedprice: 10,
      },
      {
        img: prodCar5,
        productSituation: "Feature",
        storename: "Store Five",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 22,
        discountedprice: 17,
      },
      {
        img: prodCar6,
        productSituation: "Feature",
        storename: "Store Six",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar7,
        productSituation: "Feature",
        storename: "Store Seven",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 25,
        discountedprice: 16,
      },
      {
        img: prodCar8,
        productSituation: "Feature",
        storename: "Store Eight",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar1,
        productSituation: "Feature",
        storename: "Store One",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar2,
        productSituation: "Feature",
        storename: "Store Two",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar3,
        productSituation: "Feature",
        storename: "Store Three",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 18,
        discountedprice: 15,
      },
      {
        img: prodCar4,
        productSituation: "Feature",
        storename: "Store Four",
        productname: "Product Name Here",
        rating: 1,
        originalprice: 15,
        discountedprice: 10,
      },
      {
        img: prodCar5,
        productSituation: "Feature",
        storename: "Store Five",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 22,
        discountedprice: 17,
      },
      {
        img: prodCar6,
        productSituation: "Feature",
        storename: "Store Six",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar7,
        productSituation: "Feature",
        storename: "Store Seven",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 25,
        discountedprice: 16,
      },
      {
        img: prodCar8,
        productSituation: "Feature",
        storename: "Store Eight",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar1,
        productSituation: "Feature",
        storename: "Store One",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar2,
        productSituation: "Feature",
        storename: "Store Two",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar3,
        productSituation: "Feature",
        storename: "Store Three",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 18,
        discountedprice: 15,
      },
      {
        img: prodCar4,
        productSituation: "Feature",
        storename: "Store Four",
        productname: "Product Name Here",
        rating: 1,
        originalprice: 15,
        discountedprice: 10,
      },
      {
        img: prodCar5,
        productSituation: "Feature",
        storename: "Store Five",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 22,
        discountedprice: 17,
      },
      {
        img: prodCar6,
        productSituation: "Feature",
        storename: "Store Six",
        productname: "Product Name Here",
        rating: 3,
        originalprice: 20,
        discountedprice: 15,
      },
      {
        img: prodCar7,
        productSituation: "Feature",
        storename: "Store Seven",
        productname: "Product Name Here",
        rating: 5,
        originalprice: 25,
        discountedprice: 16,
      },
      {
        img: prodCar8,
        productSituation: "Feature",
        storename: "Store Eight",
        productname: "Product Name Here",
        rating: 4,
        originalprice: 20,
        discountedprice: 15,
      },
    ],
    links: {
      first: "http://yourapp.com/api/items?page=1",
      last: "http://yourapp.com/api/items?page=10",
      prev: null,
      next: "http://yourapp.com/api/items?page=2",
    },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 10,
      path: "http://yourapp.com/api/items",
      per_page: 15,
      to: 15,
      total: 60,
    },
  };
  const [TotalPages, setTotalPages] = useState(Math.ceil(productdata.data.length / 24));
  const [minValue, set_minValue] = useState(25);
  const [maxValue, set_maxValue] = useState(75);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  // Pagination State
  const [pageNumber, setPageNumber] = useState(1);
  const productsPerPage = 24; // Number of products per page

  const handlePageChange = (selected) => {
    setPageNumber(selected);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const pageParam = queryParams.get("page");
    if (pageParam) {
      setPageNumber(parseInt(pageParam));
    }
  }, []);

  const openFilterMenu = (element) => {
    const allElements = document.querySelectorAll(".filter-option-heading");
    allElements.forEach((e) => {
      if (element.target != e) {
        e.parentElement.querySelector(".filters-inner-option").classList.remove("toggle-filter-option");
      }
    });
    element.target.parentElement.querySelector(".filters-inner-option").classList.toggle("toggle-filter-option");
  };
  return (
    <div className="wrapper shop-category-container">
      <div className="shop-category-heading-top">
        <p>
          Home / Shop / Shop Grid / <span>Cars</span>
        </p>
      </div>
      <div className="shop-category-inner-container">
        <div className="shop-category-inner-left filter-options-row">
          <div className="shop-category-inner-left-category filter-option-heading-box">
            <p className="filter-option-heading" onClick={openFilterMenu}>
              CATEGORY
            </p>
            <div className="shop-category-inner-left-categories-container filters-inner-option">
              {categories.map((e, i) => {
                return (
                  <div key={i}>
                    <input type="radio" name="shop-category-category" id={e} />
                    <label htmlFor={e}>{e}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="shop-category-inner-left-price filter-option-heading-box">
            <p className="filter-option-heading" onClick={openFilterMenu}>
              PRICE RANGE
            </p>
            <div className="filters-inner-option">
              <div></div>
              <div className="shop-category-inner-left-price-min-max-input">
                <input type="number" placeholder="Min price" />
                <input type="number" placeholder="Max price" />
              </div>
            </div>
          </div>
          {/* Brands */}
          <div className="shop-category-inner-brands-category filter-option-heading-box">
            <p className="filter-option-heading" onClick={() => setSelectedBrand(null)}>
              POPULAR BRANDS
            </p>
            <div className="shop-category-inner-left-brands-container filters-inner-option">
              {Object.keys(carBrandsAndModels).map((brand, i) => (
                <div key={i}>
                  <input type="radio" name="shop-category-brands" id={brand} checked={selectedBrand === brand} onChange={() => setSelectedBrand(brand)} />
                  <label htmlFor={brand}>{brand}</label>
                </div>
              ))}
            </div>
          </div>

          {selectedBrand && (
            <div className="shop-category-inner-brands-category filter-option-heading-box">
              <p className="filter-option-heading" onClick={() => setSelectedModel(null)}>
                POPULAR MODELS
              </p>
              <div className="shop-category-inner-left-brands-container filters-inner-option">
                {carBrandsAndModels[selectedBrand].map((modelObj, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      name="shop-category-models"
                      id={modelObj.model}
                      checked={selectedModel === modelObj.model}
                      onChange={() => {
                        setSelectedModel(modelObj.model);
                      }}
                    />
                    <label htmlFor={modelObj.model}>{modelObj.model}</label>
                  </div>
                ))}
              </div>
              <button className="button" onClick={() => setModelPopup(true)}>
                Show More{" "}
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5422 8.25049L10.3338 14.4588L4.12549 8.25049" stroke="white" stroke-width="1.8625" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          )}
          {modelPopup && (
            <div className="customerServicePopup model-popup">
              <div className="bg" onClick={() => setModelPopup(false)}></div>
              <div className="container">
                <h2>MODEL PAPER</h2>
                <div className="options">
                  {carBrandsAndModels[selectedBrand].map((modelObj, i) => (
                    <div key={i} className="opt">
                      <input
                        type="radio"
                        name="shop-category-models"
                        id={modelObj.model}
                        checked={selectedModel === modelObj.model}
                        onChange={() => {
                          setSelectedModel(modelObj.model);
                        }}
                      />
                      <label htmlFor={modelObj.model}>{modelObj.model}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {selectedModel && (
            <div className="shop-category-inner-brands-category filter-option-heading-box">
              <p className="filter-option-heading">POPULAR MODEL YEAR</p>
              <div className="shop-category-inner-left-brands-container filters-inner-option">
                {typeof carBrandsAndModels[selectedBrand].find((modelObj) => modelObj.model === selectedModel)?.year === "object" && carBrandsAndModels[selectedBrand].find((modelObj) => modelObj.model === selectedModel)?.year.length > 0 ? (
                  carBrandsAndModels[selectedBrand]
                    .find((modelObj) => modelObj.model === selectedModel)
                    .year.map((year, i) => (
                      <div key={i}>
                        <input type="radio" name="shop-category-years" id={year} onClick={() => handleModelYearClick(year)} />
                        <label htmlFor={year}>{year}</label>
                      </div>
                    ))
                ) : (
                  <p>select model to see years.</p>
                )}
              </div>
              <button className="button" onClick={() => setYearPopup(true)}>
                Show More{" "}
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5422 8.25049L10.3338 14.4588L4.12549 8.25049" stroke="white" stroke-width="1.8625" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          )}
          {yearPopup && (
            <div className="customerServicePopup model-popup">
              <div className="bg" onClick={() => setYearPopup(false)}></div>
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
          )}
          <div className="shop-category-inner-left-ad-product">
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
              VIEW DETAILS{" "}
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.13281 13.175H21.2057" stroke="#D21642" strokeWidth="2.235" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.2188 6.19067L21.2031 13.175L14.2188 20.1594" stroke="#D21642" strokeWidth="2.235" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="shop-category-inner-right shop-page-category-inner-right">
          <div className="shop-category-inner-right-sub-category">
            <p className="shop-category-inner-right-sub-category-heading">SUB CATEGORY</p>
            <div className="shop-category-inner-right-sub-category-container">
              {subCategoryItems.map((e, i) => {
                return <SubCategory key={i} data={e}></SubCategory>;
              })}
            </div>
          </div>
          <div className="shop-category-inner-right-sort-filter-row">
            <p>Sort by:</p>
            <select name="" id="">
              <option value="">Most Popular</option>
              <option value="">Most Relevant</option>
            </select>
          </div>
          <div className="shop-category-inner-right-active-filter-row">
            <div className="shop-category-inner-right-active-filter-row-left">
              <p>Active Filters:</p>
              <span>Cars</span>
              <span>Sports Car</span>
            </div>
            <div className="shop-category-inner-right-active-filter-row-right">
              <p>65,867</p>
              <span>Results found.</span>
            </div>
          </div>
          {/* <div className="shop-category-inner-right-products-container">
            {products.map((e, i) => {
              return <ProductsFeature detail={e}></ProductsFeature>;
            })}
          </div> */}
          <div className="shop-category-inner-right-products-container">
            {/* Display products for the current page */}
            {productdata.data.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage).map((e, i) => (
              <ProductsFeature key={i} detail={e} />
            ))}
          </div>
          {/* Pagination */}
          {/* <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            previousLabel={<img src={ArrowLeft} alt="Previous" />}
            nextLabel={<img src={ArrowRight} alt="Next" />}
            breakLabel={""}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
            onPageChange={handlePageChange}
          /> */}
          <ul className="pagination">
            {/* // productdata.data
            // .slice(
            //   pageNumber * productsPerPage,
            //   (pageNumber + 1) * productsPerPage
            // )
            // .map((e, i) => ( */}
            <li>
              <a href={`/?page=${pageNumber == 1 ? 1 : pageNumber - 1}`}>
                <img src={ArrowLeft} alt="Previous" />
              </a>
            </li>
            {Array.from({ length: TotalPages }, (_, index) => (
              <li key={index} className="page-item">
                <a href={`/?page=${index + 1}`}>{index + 1}</a>
              </li>
            ))}
            <li>
              <a href={`/?page=${pageNumber == TotalPages ? TotalPages : pageNumber + 1}`}>
                <img src={ArrowRight} alt="Previous" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const SubCategory = ({ data }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const randomTime = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(true); // Trigger fade effect
      setTimeout(() => {
        setCurrentImgIndex((prevIndex) => (prevIndex + 1) % data.img.length);
        setFade(false); // Reset fade effect after changing image
      }, 500);
    }, randomTime * 1000); // Change image every randomTime seconds

    return () => clearInterval(intervalId);
  }, [data.img.length, randomTime]);

  let currentImg = data.img[currentImgIndex];

  return (
    <div className="all-category-slider-single-item">
      <div className="all-category-item-img-box">
        <img src={currentImg} alt="" style={{ opacity: fade ? 0 : 1, transition: "opacity 0.5s ease" }} />
      </div>
      <p>{data.name}</p>
    </div>
  );
};

export default Shop;
