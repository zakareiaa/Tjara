import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import arrow from './assets/right-arrow.svg';
import PRODUCT_ATTRIBUTE_ITEMS from '@client/productAttributeItemsClient';
import PRODUCT_ATTRIBUTES from '@client/productAttributesClient';
import { fixUrl, getOptimizedThumbnailUrl } from '../../helpers/helpers';
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { usePopup } from "../DataContext";
import './style.css';
import AllCategories from '../allCategories/AllCategories';
import ImageWithFallback from "../ImageWithFallback/ImageWithFallback";

const MegaMenu = ({ homeSubcategoryId }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const { ShowMegaMenu, setShowMegaMenu } = usePopup();
    const { globalSettings } = useheaderFooter();

    const fetchSubcategories = async (parentId) => {
        const { data, error } = await PRODUCT_ATTRIBUTE_ITEMS.getProductAttributeItems({
            attribute_slug: 'categories',
            with: 'thumbnail',
            parent_id: parentId ?? 'NULL',
            hide_empty: true,
            limit: 'all',
        });

        if (data) {
            setSubcategories(data.product_attribute_items);
        }
        if (error) console.error(error);
    };
    /* --------------------------------------------- X -------------------------------------------- */

    const fetchCategories = async () => {
        const ApiParams = {
            hide_empty: true,
            limit: 50,
            with: "thumbnail,have_sub_categories",
            //   parent_id: 'NULL',
            ids: globalSettings?.header_categories?.split(',')
        }

        const { data, error } = await PRODUCT_ATTRIBUTES.getProductAttribute('categories', ApiParams);

        if (data) {
            const headerCategoriesArray = globalSettings?.header_categories?.split(',') || [];
            const sortedCategories = data?.product_attribute?.attribute_items?.product_attribute_items?.sort((a, b) => {
                return headerCategoriesArray.indexOf(a.id.toString()) - headerCategoriesArray.indexOf(b.id.toString());
            });
            setCategories(sortedCategories);
        }

        if (error) {
            console.error(error);
            setCategories([]);
        }
    };

    /* -------------------------------------------- X ------------------------------------------- */

    const handleCategoryClick = (category) => {
        // if (categoriesWithSubs[category.id]) {
        setIsSubmenuOpen(true);
        setActiveCategory(category.id === activeCategory ? null : category);
        fetchSubcategories(category.id);
        // }
    };

    /* -------------------------------------------- X ------------------------------------------- */


    useEffect(() => {
        if (globalSettings?.header_categories?.split(',')?.length > 0) {
            fetchCategories();
        }
    }, [globalSettings?.header_categories?.split(',')?.length > 0]);

    /* ------------------------------------------- X ------------------------------------------ */

    // useEffect(() => {
    //     if (window.innerWidth < 500) {
    //         fetchSubcategories(homeSubcategoryId);
    //     }
    // }, [homeSubcategoryId]);

    /* ------------------------------------------------------------------------------------------ */
    /*                                              X                                             */
    /* ------------------------------------------------------------------------------------------ */

    return (
        <div className={`mega-menu ${ShowMegaMenu ? 'active' : ''}`}>
            <div className={`categoriesDropdown ${ShowMegaMenu ? 'active' : ''}`}>
                <h2 className='categories-title'>
                    Categories
                    <svg id='categories-close-btn' onClick={() => { setIsSubmenuOpen(false); setShowMegaMenu(false); }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M14.825 1.18656C14.7248 1.08614 14.6057 1.00646 14.4747 0.952095C14.3436 0.897732 14.2031 0.869749 14.0612 0.869749C13.9194 0.869749 13.7789 0.897732 13.6478 0.952095C13.5168 1.00646 13.3977 1.08614 13.2975 1.18656L8 6.47323L2.7025 1.17573C2.6022 1.07543 2.48313 0.995873 2.35209 0.941593C2.22104 0.887312 2.08059 0.859375 1.93875 0.859375C1.79691 0.859375 1.65645 0.887312 1.52541 0.941593C1.39436 0.995873 1.27529 1.07543 1.175 1.17573C1.0747 1.27603 0.995141 1.3951 0.94086 1.52614C0.88658 1.65719 0.858643 1.79764 0.858643 1.93948C0.858643 2.08132 0.88658 2.22177 0.94086 2.35282C0.995141 2.48386 1.0747 2.60293 1.175 2.70323L6.4725 8.00073L1.175 13.2982C1.0747 13.3985 0.995141 13.5176 0.94086 13.6486C0.88658 13.7797 0.858643 13.9201 0.858643 14.062C0.858643 14.2038 0.88658 14.3443 0.94086 14.4753C0.995141 14.6064 1.0747 14.7254 1.175 14.8257C1.27529 14.926 1.39436 15.0056 1.52541 15.0599C1.65645 15.1141 1.79691 15.1421 1.93875 15.1421C2.08059 15.1421 2.22104 15.1141 2.35209 15.0599C2.48313 15.0056 2.6022 14.926 2.7025 14.8257L8 9.52823L13.2975 14.8257C13.3978 14.926 13.5169 15.0056 13.6479 15.0599C13.779 15.1141 13.9194 15.1421 14.0612 15.1421C14.2031 15.1421 14.3435 15.1141 14.4746 15.0599C14.6056 15.0056 14.7247 14.926 14.825 14.8257C14.9253 14.7254 15.0049 14.6064 15.0591 14.4753C15.1134 14.3443 15.1414 14.2038 15.1414 14.062C15.1414 13.9201 15.1134 13.7797 15.0591 13.6486C15.0049 13.5176 14.9253 13.3985 14.825 13.2982L9.5275 8.00073L14.825 2.70323C15.2367 2.29156 15.2367 1.59823 14.825 1.18656Z" fill="#717171" />
                    </svg>
                </h2>

                <div className="categories" style={{ display: window.innerWidth < 500 && 'none' }}>
                    {
                        // window.innerWidth > 500 
                        // ?
                        categories.map((category, index) => (
                            <p key={index}
                                onClick={() => {
                                    handleCategoryClick(category);
                                    category.have_sub_categories ? null : setShowMegaMenu(false);
                                }}
                                className={category.have_sub_categories ? 'has-submenu' : ''}
                            >
                                <Link key={index}
                                    to={`/shop/${category.slug}`}
                                    onClick={() => handleCategoryClick(category)}
                                    className='category-name'
                                >
                                    {category.name}
                                </Link>
                                {category.have_sub_categories && <img className='category-arrow' src={arrow} alt="arrow" />}
                            </p>
                        ))
                        // :
                        // subcategories?.map((item, index) => (
                        //     <p
                        //         key={index}
                        //         onClick={() => {
                        //             handleCategoryClick(item);
                        //             item.have_sub_categories ? null : setShowMegaMenu(false);
                        //         }}
                        //         className={item.have_sub_categories ? 'has-submenu' : ''}
                        //     >
                        //         {item.name}
                        //         {item.have_sub_categories && <img src={arrow} alt="arrow" />}
                        //     </p>
                        // ))
                    }
                </div>

                <div id="mobile-side-categories" style={{ display: window.innerWidth > 500 && 'none' }}>
                    <AllCategories />
                </div>

                <div className={`SubMenu ${isSubmenuOpen ? 'active' : ''}`}>
                    <h2>Sub Categories</h2>
                    <div>
                        {subcategories.map((category, index) => (
                            <Link key={index}
                                to={`/shop/${category.slug}`}
                                onClick={() => {
                                    handleCategoryClick(category);
                                    setShowMegaMenu(false);
                                }}
                            >
                                {fixUrl(category?.thumbnail?.media?.url) ?
                                    <ImageWithFallback url={getOptimizedThumbnailUrl(category?.thumbnail)} name={category?.name} /> :
                                    <div className='category-image'
                                        style={{
                                            fontSize: '25px',
                                            fontWeight: '600',
                                            color: '#fff',
                                        }}
                                    >
                                        {category?.name.charAt(0)}
                                    </div>
                                }
                                {category?.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="bg"
                onClick={() => {
                    setIsSubmenuOpen(false);
                    setShowMegaMenu(false);
                }}
            />
        </div>
    );
};

export default MegaMenu;