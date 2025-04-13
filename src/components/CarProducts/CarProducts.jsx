import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useheaderFooter } from "@contexts/globalHeaderFooter";

import PRODUCTS from "@client/productsClient";
import ProductsFeature from "../ProductCard";

import cartIcon from "../../assets/cartPlusIcon.svg"
import loadingGif from "@assets/loading.gif"

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SectionHeading from "../ui/SectionHeading";

function CarProducts({ className }) {
  const componentRef = useRef();
  const navigate = useNavigate();
  const { globalSettings } = useheaderFooter();
  const [carProducts, setCarProducts] = useState([{}, {}, {}, {}, {}, {}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const [IsInitial, setIsInitial] = useState(true);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCarProducts = async () => {
    const featuredCarsSortedIDs = globalSettings?.featured_cars_sort_order?.split(',');

    if (featuredCarsSortedIDs == null || featuredCarsSortedIDs == "" || featuredCarsSortedIDs == undefined) { return };

    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "AND",
      orderBy: "ids",
      order: featuredCarsSortedIDs,
      // ids: featuredCarsSortedIDs,
      paginated: true,
      page: currentPage,
      per_page: 6,
    };

    let columns = [];

    columns.push({ column: 'product_group', operator: '=', value: 'car', });

    if (window.innerWidth > 550) {
      // columns.push({ column: 'is_featured', operator: '=', value: 1, });
    }

    if (columns.length > 0) {
      ApiParams.filterByColumns = {
        filterJoin: "AND",
        columns: columns,
      }
    }

    ApiParams.customOrder = 'featured_products_first';

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setCarProducts(data.products.data);
        setIsInitial(false);
      } else {
        setCarProducts((prev) => [...prev, ...data.products.data]);
      }
      setTotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
      setCarProducts([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreProducts = async () => {
    setCurrentPage(currentPage + 1)
  }

  /* ---------------------------------------- Fetch Products ------------------------------------ */

  useEffect(() => {
    fetchCarProducts();
  }, [currentPage, globalSettings]);

  /* ---------------------------------------- Window Resize ------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------- INFINITE SCROLL FUNCTION --------------------------------- */

  useEffect(() => {
    if (windowsWidth <= 500) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchMoreProducts()
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
  }, [carProducts]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`${className} carProducts feature-products`}>
      <div className={`feature-products-container`}>
        <div className="feature-products-container-heading-row">
          <SectionHeading heading="Featured Cars" />
          <button onClick={() => navigate('/cars/products?filter_by_column=featured_cars')}>View All</button>
        </div>
        <div className="feature-products-items-container">
          {carProducts?.map((e, i) => (
            <ProductsFeature cartIcon={cartIcon} key={i} detail={e} />
          ))}
          {windowsWidth <= 500 && carProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
        </div>
        {windowsWidth > 500 && carProducts?.length < totalItems && (
          <div className="load-more-btn-row">
            <button className="button" onClick={fetchMoreProducts}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarProducts;