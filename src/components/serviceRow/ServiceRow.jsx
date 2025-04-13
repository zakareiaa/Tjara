import React from "react";
import Slider from "react-slick";

import { useheaderFooter } from "../../contexts/globalHeaderFooter";

import Tick from "./assets/tick.webp"
import Gaddi from "./assets/gaddi.webp"
import Banda from "./assets/banda.webp"
import GolTick from "./assets/goltick.webp"

import "./style.css";

function ServiceRow() {
  const { globalSettings } = useheaderFooter();
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true,
  }

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    window.innerWidth <= 500 ?
      (<div className="service-row">
        <div className="container">
          <div className="service-row-item bar" dir={globalSettings?.website_features_promo_dir ? globalSettings?.website_features_promo_dir : "ltr"}>
            <div className="service-row-sec" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={Tick} alt="tick-icon" />
              <p>{globalSettings?.website_features_promo1 ? globalSettings?.website_features_promo1 : "Tjara's Commitment"}</p>
            </div>
            <Slider {...settings}>
              <p>{globalSettings?.website_features_promo2 ? globalSettings?.website_features_promo2 : "Low Prices"}</p>
              <p>{globalSettings?.website_features_promo3 ? globalSettings?.website_features_promo3 : "Wide Selection"}</p>
              <p>{globalSettings?.website_features_promo4 ? globalSettings?.website_features_promo4 : "Exceptional Customer Service"}</p>
            </Slider>
          </div>
        </div>
      </div>)
      :
      (<div className="service-row">
        <div className="container">
          <div className="service-row-item">
            <img src={Tick} alt="tick-icon" />
            <p>Safe Payment</p>
          </div>
          <div className="service-row-item">
            <img src={Gaddi} alt="van-icon" />
            <p>Home Delivery</p>
          </div>
          <div className="service-row-item">
            <img src={Banda} alt="man-icon" />
            <p>24/7 Support</p>
          </div>
          <div className="service-row-item">
            <img src={GolTick} alt="circle-tick-icon" />
            <p>Verified Users</p>
          </div>
        </div>
      </div>)
  );
}

export default ServiceRow;
