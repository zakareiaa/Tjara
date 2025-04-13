import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";
import SinginPopup from "@components/signInPopup/index";
import ProductsFeature from "@components/ProductCard";
import WISHLIST from "../../client/wishlistClient";
import { fixUrl } from "../../helpers/helpers";
import { usePopup } from "@components/DataContext";
import PRODUCTS from "../../client/productsClient";
import { useAuth } from "@contexts/Auth";

const Cart = () => {
  // const { fetchWishlistItems, fetchWishlistItemsCount } = usePopup();
  const [WishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { currentUser } = useAuth();

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Fetch The Cart                                   */
  /* -------------------------------------------------------------------------------------------- */

  const fetchWishlist = async () => {
    const { data, error } = await WISHLIST.getWishlistItems({
      with: "shop,variations,rating",
    });
    if (data) setWishlistItems(data.wishlistItems);
    if (error) toast.error(error.message);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                       Callback function to update parent state                               */
  /* -------------------------------------------------------------------------------------------- */

  const handleWishlistDelete = (deletedItemId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== deletedItemId));
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Delete Cart Item                                 */
  /* -------------------------------------------------------------------------------------------- */

  // const deleteWishlist = async (cartItemId) => {
  //   const { data, error } = await WISHLIST.deleteWishlistItem(cartItemId);
  //   // if (data) setWishlistItems({ cartItems: cart.cartItems.filter((cartItem) => cartItem?.id !== cartItemId) });
  //   if (data) fetchWishlist();
  //   if (data) toast.success(data.message);
  //   if (error) toast.error(error.message);
  // }

  /* -------------------------------------------------------------------------------------------- */
  /*                               Function To Update Cart Item                                   */
  /* -------------------------------------------------------------------------------------------- */

  const fetchProducts = async () => {
    const { data, error } = await PRODUCTS.getProducts({
      with: 'shop,variations,rating',
      page: 1,
      per_page: 10,
    });
    if (data) setRelatedProducts(data?.products?.data);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      fetchWishlist();
    }
  }, [currentUser]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchProducts()
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className="wrapper wishList">
      <SinginPopup />
      <div className="shop-category-heading-top">
        <p>
          Home / <span>Wishlist</span>
        </p>
      </div>
      {/* <div className="cart-outer-container">
        <div className="cart-outer-container-left"> */}
      {/* {cart?.cartItems?.length == 0 ? (
            <p>No Items in Cart</p>
          ) : (
            cart?.cartItems?.map((e, i) => {
              return (
                <div className="cart-products-container" key={i}>
                  <div className="cart-product-store-info-container">
                    <div className="display-flex align-center" style={{ gap: "15px" }}>
                      <img style={{ width: "80px", height: "80px", borderRadius: "100%" }} src={fixUrl(e.shop.shop.thumbnail.media.url)} alt="" />
                      <div className="">
                        <p className="cart-product-store-name">
                          {e?.shop.shop.name}
                        </p>
                        <p className="cart-product-store-desc">
                          You've got free shipping with specific product(s)!
                        </p>
                      </div>
                    </div>
                    <div>
                      Earliest Delivery:26 Mar
                    </div>
                  </div>
                  {e?.items?.map((cartItem, index) => {
                    return (
                      <div className="cart-product-single" key={index}>
                        <div className="display-flex align-center" style={{ gap: "16px" }}>
                          <img style={{ width: '100px', height: '100px', borderRadius: '10px' }} src={cartItem?.thumbnail?.media?.url} alt="" />
                          <div className="cart-product-title-info-box">
                            <p className="cart-product-title">{cartItem?.product.name}</p>
                            <div>
                              <div className="cart-product-color-size-row">
                                {cartItem?.product_variation?.product_variation?.attributes?.product_variation_attribute_items?.map((attribute, index) => (
                                  <div key={index}>{attribute?.attribute?.name}: {attribute?.attribute_item?.name}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="display-flex align-center">
                            <div className="cart-product-discounted-price">${cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation.price : cartItem?.product.sale_price > 0 ? cartItem?.product.sale_price : cartItem?.product.price}</div>
                          </div>
                        </div>
                        <div className="cart-product-quatity-box">
                          <button onClick={() => updateCartItem(cartItem?.id, cartItem?.quantity - 1)}>-</button>
                          <span>{cartItem?.quantity}</span>
                          <button onClick={() => updateCartItem(cartItem?.id, cartItem?.quantity + 1)}>+</button>
                        </div>
                        <div className="cart-product-bookmark-delete-box">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.765 4.70229L12 5.52422L11.235 4.70229C9.12233 2.43257 5.69709 2.43257 3.58447 4.70229C1.47184 6.972 1.47184 10.6519 3.58447 12.9217L10.4699 20.3191C11.315 21.227 12.685 21.227 13.5301 20.3191L20.4155 12.9217C22.5282 10.6519 22.5282 6.972 20.4155 4.70229C18.3029 2.43257 14.8777 2.43257 12.765 4.70229Z" stroke="#8E8F91" strokeWidth="1.5" strokeLinejoin="round" />
                          </svg>
                          <svg onClick={() => deleteCartItem(cartItem?.id)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9L18.2841 18.3068C18.1238 20.3908 16.386 22 14.2959 22H9.70412C7.61398 22 5.87621 20.3908 5.71591 18.3068L5 9M21 7C18.4021 5.73398 15.3137 5 12 5C8.68635 5 5.59792 5.73398 3 7M10 5V4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4V5M10 11V17M14 11V17" stroke="#8E8F91" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )} */}
      <div className="cart-products-related-products-container">
        <p className="feature-product-heading-name">My Favourite Products!</p>
        <div className="cart-products-related-products-container-inner">
          {WishlistItems?.length > 0 ?
            WishlistItems?.map((e, i) => {
              return <ProductsFeature key={i} detail={e?.product.product} isWishlist={true} wishlistItemId={e?.id} onDeleteWishlist={handleWishlistDelete} />;
            })
            :
            "No Items found!"
          }
        </div>
        {/* {WishlistItems.total < WishlistItems.length && (
              <div className="load-more-btn-row">
                <button className="button" onClick={loadMoreRelatedProducts}>
                  Load More
                </button>
              </div>
            )} */}
        {/* </div>
        </div> */}
      </div>
      <div className="cart-products-related-products-container cart-products-related-products-container-mobile">
        <p className="feature-product-heading-name">Find Related Products!</p>
        <div className="cart-products-related-products-container-inner">
          {relatedProducts?.map((e, i) => {
            return <ProductsFeature key={i} detail={e} />;
          })}
        </div>
        {/* {relatedProducts.total < relatedProducts.length && (
          <div className="load-more-btn-row">
            <button className="button" onClick={() => setCurrentpage(currentPage + 1)}>
              Load More
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Cart;
