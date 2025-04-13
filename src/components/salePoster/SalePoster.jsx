import React, { useEffect, useState } from "react";
import PosterOne from "@assets/sale-poster-one.svg";
import PosterTwo from "@assets/sale-poster-two.svg";
import PosterThree from "@assets/sale-poster-three.svg";
import PosterFour from "@assets/sale-poster-four.svg";
import POSTS from "@client/postsClient";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import "./SalePoster.css";

function SalePoster({ ids, limit, className }) {
  const [saleBanners, setSaleBanners] = useState(null);
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);

  /* --------------------------------------------- Fetch Banners -------------------------------------------- */
  const fetchSaleBanners = async () => {
    const ApiParams = {
      ids,
      with: 'thumbnail',
      filterByColumns: {
        filterJoin: "OR",
        columns: [
          {
            column: 'post_type',
            value: 'sale_banners',
            operator: '=',
          }
        ]
      },
      per_page: 4,
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) setSaleBanners(data.posts);
    if (error) console.error(error);
  };

  useEffect(() => {
    fetchSaleBanners();
  }, []);

  /* --------------------------------------------- Window Resize -------------------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      setwindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                              Swiper                                          */
  /* -------------------------------------------------------------------------------------------- */

  return (
    saleBanners ?
      (<div className={`${className} salePoster`} >
        {windowWidth <= 768 ?
          (<Swiper
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{ delay: 2000 }}
            pagination={{ clickable: true }}
            className="salePosterMb"
          >
            {saleBanners?.data?.map((img, index) => (
              <SwiperSlide key={index}>
                <div className={`div${index} salePosters`}>
                  <img key={index} src={img?.thumbnail?.media?.url} alt={`Sale banner ${index}`} />
                  <Link to={img?.meta?.button_text ?? '/shop/products?filter_by_column=sale'}>
                    {img?.meta?.button_text ?? 'Visit Shop'}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>)
          :
          <div className="sale-poster-container wrapper parent">
            {saleBanners?.data?.map((img, index) => (
              <div key={index} className={`div${index} salePosters`}>
                <img key={index} src={img?.thumbnail?.media?.url} alt={`Sale banner ${index}`} />
                <Link to={img?.meta?.button_text ?? '/shop/products?filter_by_column=sale'}>
                  {img?.meta?.button_text ?? 'Visit Shop'}
                </Link>
              </div>
            ))}
          </div>
        }
      </div>) : null
  );
}

export default SalePoster;
