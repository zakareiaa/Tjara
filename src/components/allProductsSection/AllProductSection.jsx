import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import Slider from "react-slick";

import ProductsFeature from "../ProductCard";
import PRODUCTS from "@client/productsClient";
import SectionHeading from "../ui/SectionHeading";

import cartIcon from "../../assets/cartPlusIcon.svg"
import loadingGif from "@assets/loading.gif"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-loading-skeleton/dist/skeleton.css';

function AllProductSection({ className, shopId = null }) {
  const navigate = useNavigate()
  const [allProducts, setAllProducts] = useState([{}, {}, {}, {}, {}, {}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth);
  const componentRef = useRef(null);
  const [IsInitial, setIsInitial] = useState(true);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchAllProducts = async () => {
    const ApiParams = {
      with: "thumbnail,shop,variations",
      filterJoin: "AND",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'status',
            operator: '=',
            value: 'active',
          }
        ]
      },
      orderBy: "created_at",
      order: "desc",
      per_page: 6,
      page: currentPage,
    };

    if (shopId !== null) ApiParams.filterByColumns.columns.push({ column: 'shop_id', operator: '=', value: shopId, });

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setAllProducts(data.products.data);
        setIsInitial(false);
      } else {
        setAllProducts((prev) => [...prev, ...data.products.data]);
      }
      setTotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
    }
  };
  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchAllProducts();
  }, [currentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreProducts = async (currentPage) => {
    setCurrentPage(parseInt(currentPage + 1));
  }

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth);
  })

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchMoreProducts(currentPage)
        setTimeout(() => { }, 3000);
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
  }, [allProducts]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`${className} feature-products allProducts`}>
      <div className={` feature-products-container`}>
        <div className="feature-products-container-heading-row">
          <SectionHeading heading="All Products" />
          <button onClick={() => navigate('/global/products')}>View All</button>
        </div>
        <div className="feature-products-items-container" >
          {allProducts?.map((e, i) => {
            return <ProductsFeature cartIcon={cartIcon} key={i} detail={e} />;
          })}
          {windowsWidth <= 500 && allProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
        </div>
        {windowsWidth > 500 && allProducts?.length < totalItems && (
          <div className="load-more-btn-row">
            <button className="button" onClick={() => fetchMoreProducts(currentPage)}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProductSection;
