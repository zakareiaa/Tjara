import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useheaderFooter } from "@contexts/globalHeaderFooter";

import PRODUCTS from "@client/productsClient";
import ProductsFeature from "../ProductCard";

import cartIcon from "../../assets/cartPlusIcon.svg"
import loadingGif from "@assets/loading.gif"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-loading-skeleton/dist/skeleton.css';
import "./FeaturedProduct.css";
import SectionHeading from "../ui/SectionHeading";

function FeaturedProduct({ className, shopId = null }) {
  const navigate = useNavigate()
  const { globalSettings } = useheaderFooter();
  const [featuredProducts, setFeaturedProducts] = useState([{}, {}, {}, {}, {}, {}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth)
  const componentRef = useRef(null);
  const [IsInitial, setIsInitial] = useState(true);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchFeaturedProducts = async () => {
    const featuredProductsSortedIDs = globalSettings?.featured_products_sort_order?.split(',');

    if (featuredProductsSortedIDs == null || featuredProductsSortedIDs == "" || featuredProductsSortedIDs == undefined) { return };

    const ApiParams = {
      with: "shop,variations",
      filterJoin: "AND",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'is_featured',
            operator: '=',
            value: 1,
          },
          {
            column: 'product_group',
            operator: '=',
            value: 'global',
          },
          {
            column: 'status',
            operator: '=',
            value: 'active',
          }
        ]
      },
      orderBy: "ids",
      order: featuredProductsSortedIDs,
      // ids: featuredProductsSortedIDs,
      page: currentPage,
      per_page: 6,
    };

    if (shopId !== null) ApiParams.filterByColumns.columns.push({ column: 'shop_id', operator: '=', value: shopId, });

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setFeaturedProducts(data.products.data);
        setIsInitial(false);
      } else {
        setFeaturedProducts((prev) => [...prev, ...data.products.data]);
      }
      setTotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
      setFeaturedProducts([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreProducts = async () => {
    setCurrentPage(currentPage + 1)
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchFeaturedProducts();
  }, [currentPage, globalSettings]);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------------------- X -------------------------------------------- */

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
  }, [featuredProducts]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div ref={componentRef} className={`${className} featuredProducts feature-products`}>
      {<div className={`feature-products-container`}>
        <div className="feature-products-container-heading-row">
          {/* <p className="feature-product-heading-name">Featured Products</p> */}
          <SectionHeading heading="Featured Products" />
          <button onClick={() => navigate('/shop/products?filter_by_column=featured')}>View All</button>
        </div>
        <div className="feature-products-items-container">
          {featuredProducts?.map((e, i) => (
            <ProductsFeature cartIcon={cartIcon} key={i} detail={e} />
          ))}
          {windowsWidth <= 500 && featuredProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
        </div>
        {windowsWidth > 500 && featuredProducts?.length < totalItems && (
          <div className="load-more-btn-row">
            <button className="button" onClick={fetchMoreProducts}>Load More</button>
          </div>
        )}
      </div>
      }
    </div>
  );
}

export default FeaturedProduct;