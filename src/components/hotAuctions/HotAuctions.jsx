import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import PRODUCTS from "@client/productsClient";
import AuctionCard from '@components/AuctionCard';

import loadingGif from "@assets/loading.gif"
import arrowRight from "./assets/arrow-right.png"
import arrowLeft from "./assets/arrow-left.png"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HotAuctions.css";
import SectionHeading from "../ui/SectionHeading";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", right: "40px", }} onClick={onClick}  >
      <img src={arrowRight} alt="" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", left: "40px", }} onClick={onClick} >
      <img src={arrowLeft} alt="" />
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

function HotAuctions({ className, shopId = null }) {
  const [auctionsProducts, setAuctionProducts] = useState([{}, {}, {}, {}, {}, {}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setperPage] = useState(6)
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth)
  const [totalItems, setTotalItems] = useState(null);
  const [IsInitial, setIsInitial] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const componentRef = useRef();

  const settings = {
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 3,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchAuctionProducts = async () => {
    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "AND",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'product_type',
            operator: '=',
            value: 'auction',
          },
          {
            column: 'status',
            operator: '=',
            value: 'active',
          }
        ]
      },
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: perPage,
    };

    if (shopId !== null) ApiParams.filterByColumns.columns.push({ column: 'shop_id', operator: '=', value: shopId, });

    const { data, error } = await PRODUCTS.getProducts(ApiParams);

    if (data) {
      if (IsInitial) {
        setAuctionProducts(data.products.data);
        setIsInitial(false);
      } else {
        setAuctionProducts((prev) => [...prev, ...data.products.data]);
      }
      setTotalItems(data.products.total);
    }

    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchAuctionProducts();
  }, [perPage, currentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setperPage(window.innerWidth <= 500 ? 6 : 20)
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreProducts = async () => {
    setCurrentPage(currentPage + 1)
  }

  /* --------------------------------- INFINITE SCROLL FUNCTION --------------------------------- */

  useEffect(() => {
    if (windowsWidth <= 500) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchMoreProducts();
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
  }, [auctionsProducts]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`${className} auctionParent`}>
      <div className={`auction-products-container`}>
        <div className="feature-products-container-heading-row wrapper">
          <SectionHeading heading="Hot Auctions" />
          <button><Link to={'/shop/products?filter_by_column=auction'}>View All</Link></button>
        </div>
        {windowsWidth <= 500 ?
          auctionsProducts?.map((e, i) => (
            <AuctionCard key={i} detail={e} />
          ))
          :
          <Slider {...settings}>
            {auctionsProducts?.map((e, i) => (
              <AuctionCard key={i} detail={e} isDragging={isDragging} />
            ))}
          </Slider>
        }
        {windowsWidth <= 500 && auctionsProducts?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
      </div>
    </div>
  );
}

export default HotAuctions;
