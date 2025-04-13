import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules';
import SaleBannerFront from "../../assets/sale-art-bg.svg";
import SaleBannerBg from "./sale-art-front-min.webp";
import POSTS from "@client/postsClient";
import { fixUrl, getOptimizedThumbnailUrl } from "../../helpers/helpers";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import "./SaleBanner.css";
import { useNavigate } from "react-router-dom";

function SaleBanner({ ids, limit, className }) {
  const [Imgs, setImgs] = useState(null);
  const navigate = useNavigate();

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchSaleBannerImgs = async () => {
    const ApiParams = {
      with: 'thumbnail',
      filterByColumns: {
        filterJoin: "OR",
        columns: [
          {
            column: 'post_type',
            value: 'discount_banners',
            operator: '=',
          }
        ]
      },
      per_page: 4,
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) setImgs(data.posts);

    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchSaleBannerImgs();
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    Imgs ? (
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        className={`sale-banner-Container ${className}`}
      >
        {Imgs?.data?.map((e, index) => (
          <SwiperSlide key={index} onClick={() => navigate(`/global/products?filter_by_column=sale`)} className="sale-banner wrapper">
            <img className="sale-banner-front" src={getOptimizedThumbnailUrl(e?.thumbnail) ?? SaleBannerFront} alt="" />
            <img className="sale-banner-bg" src={e?.banner_background_image ?? SaleBannerBg} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    ) : null
  );
}

export default SaleBanner;