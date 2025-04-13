import React from "react";
import "./ServiceCategories.css";
import { useState } from "react";
import Auction from "../../assets/auction.svg";
import ProductBoxes from "../../assets/product-boxes.svg";
import Job from "../../assets/briefcase.svg";
import Contest from "../../assets/trophy-star.svg";
import Services from "../../assets/services.svg";
import { Link } from "react-router-dom";

function ServiceCategories({ className }) {
  const [items, setItems] = useState([
    {
      img: Auction,
      name: "Auctions",
      description: "Lorem Ipsum is simply dummy text of the printing",
      view: "View Auction",
      link: "/shop/auctions",
    },
    {
      img: ProductBoxes,
      name: "Products",
      description: "Lorem Ipsum is simply dummy text of the printing",
      view: "View Products",
      link: "/shop/products",
    },
    {
      img: Job,
      name: "Jobs",
      description: "Lorem Ipsum is simply dummy text of the printing",
      view: "View Jobs",
      link: "/jobs",
    },
    {
      img: Contest,
      name: "Contests",
      description: "Lorem Ipsum is simply dummy text of the printing",
      view: "View Contest",
      link: "/contests",
    },
    {
      img: Services,
      name: "Services",
      description: "Lorem Ipsum is simply dummy text of the printing",
      view: "View Service",
      link: "/services",
    },
  ]);

  return (
    <div className={`${className} serviceCategories`}>
      <div className="service-category-container serviceCategoriesContainer">
        <div className="service-category-container-inner">
          {items?.map((e, i) => (
            <Link to={e.link} key={i} className="service-category-item-single">
              <div className="service-category-item-single-img-box">
                <img src={e.img} alt="" />
              </div>
              <p className="service-category-item-single-name">{e.name}</p>
              {/* <p className="service-category-item-single-desc">{e.description}</p> */}
              <div className="service-category-item-single-view">
                {e.view}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.03815 16.5839C7.06705 17.6128 8.37795 18.3135 9.80507 18.5974C11.2322 18.8813 12.7115 18.7356 14.0558 18.1787C15.4001 17.6219 16.5491 16.6789 17.3575 15.4691C18.1659 14.2592 18.5974 12.8368 18.5974 11.3817C18.5974 9.92663 18.1659 8.50422 17.3575 7.29436C16.5491 6.0845 15.4001 5.14153 14.0558 4.5847C12.7115 4.02786 11.2322 3.88217 9.80507 4.16604C8.37795 4.44991 7.06705 5.1506 6.03815 6.1795C4.66039 7.56025 3.88662 9.43115 3.88662 11.3817C3.88662 13.3323 4.66039 15.2032 6.03815 16.5839ZM12.9744 8.42166C13.2996 8.42171 13.6114 8.55089 13.8413 8.78079C14.0712 9.0107 14.2004 9.32251 14.2004 9.64764V13.3265H12.9744V10.5147L9.07277 14.4163L8.20574 13.5493L12.1074 9.64764H9.2956V8.42166L12.9744 8.42166Z" fill="#D21642" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceCategories;
