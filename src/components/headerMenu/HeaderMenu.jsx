import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import "./HeaderMenu.css";
import { usePopup } from "../DataContext";
import MegaMenu from '@components/MegaMenu';
import PRODUCT_ATTRIBUTES from "@client/productAttributesClient";
import { isDarkColor } from "../../helpers/helpers";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { BadgePercent, CircleX, Menu } from "lucide-react";


function HeaderMenu() {
  const { category } = useParams()
  const { globalSettings } = useheaderFooter();
  const navigate = useNavigate();
  const { homeSubcategoryId, currentHeaderColor, megaMenuPopup } = usePopup();
  const mbMenu = useRef(null);
  const [categoriesArr, setcategoriesArr] = useState(null)

  /* --------------------------------------------- X -------------------------------------------- */

  const mobileNavbar = () => {
    if (window.innerWidth <= 1024) {
      mbMenu.current.classList.toggle("active");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCategories = async () => {
    const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', {
      hide_empty: true,
      ids: globalSettings?.header_categories?.split(','),
      order_by: 'name',
      order: 'asc',
    });
    if (data) setcategoriesArr(data?.product_attribute?.attribute_items?.product_attribute_items);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchCategories()
  }, [globalSettings?.header_categories?.split(',')?.length > 0]);

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    <>
      <MegaMenu homeSubcategoryId={homeSubcategoryId} />

      <div className={`header-menu ${isDarkColor(currentHeaderColor) ? "IsDark" : null}`} style={window.innerWidth <= 500 ? { backgroundColor: 'var(--main-red-color)' /* currentHeaderColor */ } : null}>
        <div className="header-menu-browse-category-container">
          <Menu size={20} onClick={() => window.innerWidth < 500 ? mobileNavbar() : megaMenuPopup()} />
          <h4 className="heading" onClick={() => megaMenuPopup()}>Browse Categories</h4>

          <div className="categories-scroller">
            <p className={`${window.location.pathname == "/" ? "active" : ""}`} onClick={() => { navigate(`/`) }}>All</p>
            {categoriesArr?.map((x, index) => {
              return (
                <p className={`${category == x.id ? "active" : ""}`} key={index} onClick={() => { navigate(x?.post_type == "product" ? `/shop/${x?.slug}` : x?.post_type == "car" ? `/cars/${x?.slug}` : "/global/products") }}>{x?.name}</p>
              )
            })}
          </div>
        </div>

        <div className="header-bottom-menu-items" ref={mbMenu}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop/products">Shop</NavLink>
          <NavLink to="/cars/products">Cars</NavLink>

          {/* <div className="category" onClick={() => openSubCategory(event)}>
            <Link to="/checkout">
              Checkout
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" />
              </svg>
            </Link>
            <div className="subCategories">
              <Link to={""}>Borjan</Link>
              <Link to={""}>Weixier</Link>
              <Link to={""}>Longwalk</Link>
              <Link to={""}>Weixier</Link>
              <Link to={""}>GUCCI</Link>
              <Link to={""}>Men’s Flair</Link>
            </div>
          </div> */}

          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/contests">Contests</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/club">Tjara Club</NavLink>
          <NavLink to="/help-and-center">Help Center</NavLink>
        </div>

        {globalSettings?.website_deals_percentage && <div className="header-bottom-sale-heading">
          <BadgePercent size={20} color="white" />
          <p>{globalSettings?.website_deals_percentage}% off for new customers <Link style={{ color: "white" }} to={"/shop/products?filter_by_column=percentage_discount"}> View Sale</Link></p>
        </div>}

        <CircleX size={20} color="black" onClick={mobileNavbar} className="closeMbNav" />
      </div>
    </>
  );
}

export default HeaderMenu;
