import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import { useheaderFooter } from "@contexts/globalHeaderFooter";
import SectionHeading from "../ui/SectionHeading";
import PRODUCTS from "@client/productsClient";
import ProductsFeature from "../ProductCard";

import cartIcon from "../../assets/cartPlusIcon.svg"
import loadingGif from "@assets/loading.gif"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-loading-skeleton/dist/skeleton.css';

function SaleProduct({ className, shopId = null }) {
  const navigate = useNavigate()
  const componentRef = useRef(null);
  const [onSaleProducts, setOnSaleProducts] = useState([{}, {}, {}, {}, {}, {}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const [IsInitial, setIsInitial] = useState(true);
  const { globalSettings } = useheaderFooter();

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchOnSaleProducts = async () => {
    const sortedSaleProductIds = globalSettings?.sale_products_sort_order?.split(',');

    if (sortedSaleProductIds == null || sortedSaleProductIds == "" || sortedSaleProductIds == undefined) { return };

    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "AND",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'sale_price',
            operator: '>',
            value: 0,
          },
          {
            column: 'status',
            operator: '=',
            value: 'active',
          }
        ]
      },
      orderBy: "ids",
      order: sortedSaleProductIds,
      // customOrder: "recent_updated_products_first", // recent_updated_products_first | featured_products_first
      // ids: sortedSaleProductIds,
      page: currentPage,
      per_page: 6,
    };

    if (shopId !== null) ApiParams.filterByColumns.columns.push({ column: 'shop_id', operator: '=', value: shopId, });

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setOnSaleProducts(data.products.data);
        setIsInitial(false);
      } else {
        setOnSaleProducts((prev) => [...prev, ...data.products.data]);
      }

      setTotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
      setOnSaleProducts([]);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreProducts = async () => {
    setCurrentPage(currentPage + 1)
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchOnSaleProducts();
  }, [currentPage, globalSettings?.sale_products_sort_order]);

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
  }, [onSaleProducts]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`${className} saleproducts feature-products`}>
      <div className={` feature-products-container`}>
        <div className="feature-products-container-heading-row">
          <SectionHeading heading="Products On Sale" />
          <button onClick={() => navigate('/shop/products?filter_by_column=sale')}>View All</button>
        </div>
        <div className="feature-products-items-container">
          {onSaleProducts?.map((e, i) => (
            <ProductsFeature cartIcon={cartIcon} key={i} detail={e} />
          ))}
          {windowsWidth <= 500 && onSaleProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
        </div>
        {windowsWidth > 500 && onSaleProducts?.length < totalItems && (
          <div className="load-more-btn-row">
            <button className="button" onClick={fetchMoreProducts}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SaleProduct;
