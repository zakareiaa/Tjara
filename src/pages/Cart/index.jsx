import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SinginPopup from "@components/signInPopup/index";
import ProductsFeature from "@components/ProductCard";
import PRODUCTS from "@client/productsClient";
import CART from "@client/cartItemsClient";
import { fixUrl, formatPrice } from "@helpers/helpers";
import { usePopup } from "@components/DataContext";
import { useAuth } from "@contexts/Auth";
import WISHLIST from "@client/wishlistClient";
import ResellerProgressBar from '@components/ResellerProgressBar';

import PaymentCertifiedOne from "./assets/pci.svg";
import PaymentCertifiedTwo from "./assets/visa-secure.svg";
import PaymentCertifiedThree from "./assets/mastercard.svg";
import PaymentCertifiedFour from "./assets/safe-ke.svg";
import PaymentCertifiedFive from "./assets/protect-buy.svg";
import PaymentCertifiedSix from "./assets/jcb-secure.svg";
import PaymentCertifiedSeven from "./assets/trusted-si.svg";
import StoreTwo from "./assets/store-second.svg";
import PaymentMethodOne from "./assets/paypal.svg";
import PaymentMethodTwo from "./assets/visa.svg";
import PaymentMethodThree from "./assets/mastercard.svg";
import PaymentMethodFour from "./assets/american-express.svg";
import PaymentMethodFive from "./assets/discover.svg";
import PaymentMethodSix from "./assets/diners-club.svg";
import PaymentMethodSeven from "./assets/maestro.svg";
import PaymentMethodEight from "./assets/jcb.svg";
import PaymentMethodNine from "./assets/apple-pay.svg";
import PaymentMethodTen from "./assets/clear-pay.svg";
import PaymentWish from "./assets/whish.png";
import CashOnDeliver from "@assets/cod.png";

import "./style.css";
import SectionHeading from "../../components/ui/SectionHeading";
import { Helmet } from "react-helmet-async";

const Cart = () => {
  const { currentUser } = useAuth();
  const paymentMethods = [CashOnDeliver, PaymentWish, PaymentMethodOne, PaymentMethodTwo, PaymentMethodThree, PaymentMethodFour, PaymentMethodFive, PaymentMethodSix, PaymentMethodSeven, PaymentMethodEight, PaymentMethodNine, PaymentMethodTen];
  const paymentCertified = [PaymentCertifiedOne, PaymentCertifiedTwo, PaymentCertifiedThree, PaymentCertifiedFour, PaymentCertifiedFive, PaymentCertifiedSix, PaymentCertifiedSeven];
  const [relatedProducts, setRelatedProducts] = useState([{}, {}, {}]);
  const [currentPage, setCurrentpage] = useState(1);
  const [cart, setCart] = useState({ cartItems: [], cartTotal: 0 });
  const { cartsItemCount } = usePopup();
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Fetch The Cart                                   */
  /* -------------------------------------------------------------------------------------------- */

  const fetchCart = async () => {
    const { data, error } = await CART.getCartItems({});
    if (data) setCart(data);
    if (error) toast.error(error.message);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchProducts = async () => {
    const { data, error } = await PRODUCTS.getProducts({
      page: currentPage,
      per_page: 10,
    });
    if (data) setRelatedProducts(data?.products?.data);
    if (error) console.error(error);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Add To Wishlist                                       */
  /* -------------------------------------------------------------------------------------------- */

  const AddtoWishlist = async (productId) => {
    const { data, error } = await WISHLIST.insertWishlistItem({
      product_id: productId,
      user_id: currentUser?.id
    });
    if (data) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
      setopenSigninPopup(true);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Delete Cart Item                                 */
  /* -------------------------------------------------------------------------------------------- */

  const deleteCartItem = async (cartItemId) => {
    const { data, error } = await CART.deleteCartItem(cartItemId);
    // if (data) setCart({ cartItems: cart.cartItems.filter((cartItem) => cartItem?.id !== cartItemId) });
    if (data) {
      cartsItemCount();
      fetchCart();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.message);
    }
  }

  /* -------------------------------------------------------------------------------------------- */
  /*                               Function To Update Cart Item                                   */
  /* -------------------------------------------------------------------------------------------- */

  const updateCartItem = async (cartItemId, number) => {
    const { data, error } = await CART.updateCartItem(cartItemId, {
      quantity: number
    });
    if (data) {
      fetchCart();
      cartsItemCount();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      fetchCart();
    }
    fetchProducts();
  }, [currentUser]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                     Get Max Delivery Date                                    */
  /* -------------------------------------------------------------------------------------------- */

  function getEstimatedDeliveryDate(items) {
    if (!items || items.length === 0) return 'No items available';

    const shippingTimes = items.map(item => item?.meta?.shipping_time_to || 0);

    const maxShippingTime = Math.max(...shippingTimes);

    const currentDate = new Date();

    const estimatedDeliveryDate = new Date(currentDate);
    estimatedDeliveryDate.setDate(currentDate.getDate() + maxShippingTime);

    const options = { month: 'short', day: 'numeric' };
    return estimatedDeliveryDate.toLocaleDateString('en-US', options);
  }

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  // Function to render the summary section within cart items
  const renderShopSummaryInCart = (e, i) => {
    return (
      <div key={i} className="summary-container">
        {(e?.shopDiscount > 0 || e?.shopBonus > 0 || e?.displayDiscount > 0 || e?.displayBonus > 0) && (
          <div className="summary-card">
            {/* Shop Total */}
            <div className="summary-row header-container">
              <span>Shop Subtotal</span>
              <span className="amount">{formatPrice(e?.shopTotal)}</span>
            </div>

            {/* Show actual discount if exists */}
            {e?.shopDiscount > 0 && (
              <div className="summary-row discount">
                <div className="label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 14.25L15 8.25M9.75 8.625H9.76M14.25 14.625H14.26M8.28 3.75H15.72C17.148 3.75 17.862 3.75 18.431 4.043C18.9288 4.30004 19.3294 4.7146 19.57 5.22C19.847 5.805 19.847 6.536 19.847 8V16C19.847 17.464 19.847 18.195 19.57 18.78C19.3294 19.2854 18.9288 19.7 18.431 19.957C17.862 20.25 17.148 20.25 15.72 20.25H8.28C6.852 20.25 6.138 20.25 5.569 19.957C5.07124 19.7 4.67064 19.2854 4.43 18.78C4.153 18.195 4.153 17.464 4.153 16V8C4.153 6.536 4.153 5.805 4.43 5.22C4.67064 4.7146 5.07124 4.30004 5.569 4.043C6.138 3.75 6.852 3.75 8.28 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Discount Applied</span>
                </div>
                <span className="amount">-{formatPrice(e?.shopDiscount)}</span>
              </div>
            )}

            {/* Show display discount if no actual discount exists */}
            {!e?.shopDiscount && e?.displayDiscount > 0 && (
              <div className="summary-row discount">
                <div className="label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 14.25L15 8.25M9.75 8.625H9.76M14.25 14.625H14.26M8.28 3.75H15.72C17.148 3.75 17.862 3.75 18.431 4.043C18.9288 4.30004 19.3294 4.7146 19.57 5.22C19.847 5.805 19.847 6.536 19.847 8V16C19.847 17.464 19.847 18.195 19.57 18.78C19.3294 19.2854 18.9288 19.7 18.431 19.957C17.862 20.25 17.148 20.25 15.72 20.25H8.28C6.852 20.25 6.138 20.25 5.569 19.957C5.07124 19.7 4.67064 19.2854 4.43 18.78C4.153 18.195 4.153 17.464 4.153 16V8C4.153 6.536 4.153 5.805 4.43 5.22C4.67064 4.7146 5.07124 4.30004 5.569 4.043C6.138 3.75 6.852 3.75 8.28 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Potential Discount</span>
                </div>
                <span className="amount">-{formatPrice(e?.displayDiscount)}</span>
              </div>
            )}

            {/* Show actual bonus if exists */}
            {e?.shopBonus > 0 && (
              <div className="summary-row bonus">
                <div className="label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bonus Amount</span>
                </div>
                <span className="amount">+{formatPrice(e?.shopBonus)}</span>
              </div>
            )}

            {/* Show display bonus if no actual bonus exists */}
            {!e?.shopBonus && e?.displayBonus > 0 && (
              <div className="summary-row bonus">
                <div className="label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12M12 16H12.01M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Potential Bonus</span>
                </div>
                <span className="amount">+{formatPrice(e?.displayBonus)}</span>
              </div>
            )}

            {/* Final Total */}
            {(e?.shopDiscount > 0 || e?.displayDiscount > 0) && (
              <div className="summary-row total">
                <span>Shop Total</span>
                <span className="amount">
                  {formatPrice(e?.shopTotal - (e?.shopDiscount || e?.displayDiscount || 0))}
                </span>
              </div>
            )}

            {/* Level Progress Section */}
            {e?.isEligibleForDiscount && e?.levelProgress && (
              <div className="level-card">
                <div className="level-header">
                  <div className="current-level">
                    <h4>{e?.levelProgress?.currentLevel ?
                      `Current Level : ${e?.levelProgress?.currentLevel?.level}` :
                      e?.nextTierMessage !== '' ? e?.nextTierMessage?.replace(/-/g, '') : 'Start Shopping to Reach Level 1'}</h4>
                    {e?.levelProgress?.currentLevel && (
                      <p className="benefits">
                        {e?.levelProgress?.currentLevel?.discount}% discount
                        {e?.levelProgress?.currentLevel?.bonus > 0 &&
                          ` + ${formatPrice(e?.levelProgress?.currentLevel?.bonus)} bonus`}
                      </p>
                    )}
                  </div>
                  {e?.levelProgress?.nextLevel && (
                    <div className="next-level">
                      <p>Next Level Benefits:</p>
                      <p className="benefits">
                        {e?.levelProgress?.nextLevel?.discount}% discount
                        {e?.levelProgress?.nextLevel?.bonus > 0 &&
                          ` + ${formatPrice(e?.levelProgress?.nextLevel?.bonus)} bonus`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                  <div
                    className="progress-fill"
                    style={{ width: `${e?.levelProgress?.progress}%` }}
                  />
                </div>

                {/* Next Level Alert */}
                {e?.levelProgress?.nextLevel && (
                  <div className="level-alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                      Add {formatPrice(e?.levelProgress?.amountToNextLevel)} more to reach Level {e?.levelProgress?.nextLevel?.level}
                    </span>
                  </div>
                )}

                {/* Levels Table */}
                {/* <table className="levels-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Min Spent</th>
                      <th>Discount</th>
                      <th>Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e?.levelProgress?.levels.map((level, index) => (
                      <tr key={index} className={e?.levelProgress?.currentLevel?.level === level.level ? 'active' : ''}>
                        <td>Level {level.level}</td>
                        <td>{formatPrice(level.minSpent)}</td>
                        <td>{level.discount}%</td>
                        <td>{level.bonus > 0 ? formatPrice(level.bonus) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                   Function To Render The Shop Summary In The Right Sidebar                   */
  /* -------------------------------------------------------------------------------------------- */
  const renderShopOrderSummary = (e, i) => {
    return (
      <div key={i} style={{ marginTop: i = 0 ? "20px" : null }} className="cart-order-summary-box">
        <h5 style={{ textAlign: 'center' }}>{e?.shop?.shop?.name}</h5>
        <h5>Order Summary</h5>

        <div className="cart-order-summary-box-inner-row">
          <p>Sub-total</p>
          <span>{e?.shopTotal > 0 ? formatPrice(e?.shopTotal) : "---"}</span>
        </div>

        <div className="cart-order-summary-box-inner-row">
          <div className="shipping" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <p>Delivery Fee</p>
          </div>
          <span>
            {e?.freeShipping || e?.displayHasLevelFreeShipping ? "Free" :
              (!e?.freeShipping && e?.maxShippingFee > 0) ? formatPrice(e?.maxShippingFee) : "---"}
          </span>
        </div>

        {/* Show actual discount if exists */}
        {e?.shopDiscount > 0 && (
          <div className="cart-order-summary-box-inner-row">
            <p>{e?.shop?.shop?.name} Discount {e?.currentDiscountInPercentage > 0 ? `(${e?.currentDiscountInPercentage}%)` : null}</p>
            <span style={{ color: 'red' }}>- {formatPrice(e?.shopDiscount)}</span>
          </div>
        )}

        {/* Show display discount if no actual discount exists */}
        {!e?.shopDiscount && e?.displayDiscount > 0 && (
          <div className="cart-order-summary-box-inner-row">
            <p>{e?.shop?.shop?.name} Potential Discount</p>
            <span style={{ color: '#666' }}>- {formatPrice(e?.displayDiscount)}</span>
          </div>
        )}

        <hr />

        <div className="cart-order-summary-box-total-row">
          <p>Total</p>
          <span>
            {e?.shopTotal > 0 ?
              formatPrice(
                (parseFloat(e?.shopTotal) +
                  parseFloat(e?.freeShipping || e?.displayHasLevelFreeShipping ? 0 : (e?.maxShippingFee > 0 ? e?.maxShippingFee : 0))) -
                parseFloat((e?.shopDiscount > 0 ? e?.shopDiscount : e?.displayDiscount || 0))
              ) : "---"}
          </span>
        </div>

        <hr style={{ margin: '20px 0' }} />

        {/* Show actual bonus if exists */}
        {e?.shopBonus > 0 && (
          <div className="cart-order-summary-box-inner-row">
            <p style={{ color: 'green' }}>
              🎁 Bonus: {formatPrice(e?.shopBonus)} (Gets Added to your wallet after checkout)
            </p>
          </div>
        )}

        {/* Show display bonus if no actual bonus exists */}
        {!e?.shopBonus && e?.displayBonus > 0 && (
          <div className="cart-order-summary-box-inner-row">
            <p style={{ color: '#666' }}>
              🎁 Potential Bonus: {formatPrice(e?.displayBonus)} (When minimum purchase is met)
            </p>
          </div>
        )}

        {e?.isEligibleForDiscount && !e?.levelProgress?.currentLevel ? (
          <div className="cart-order-summary-box-inner-row">
            <p>{e?.nextTierMessage === '' ? 'Start Shopping to Reach Level 1' : e?.nextTierMessage?.replace(/-/g, '')}</p>
          </div>
        ) : null}
      </div>
    );
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart | Tjara</title>
        <meta name="description" content="Review your selected products in your Tjara cart. Secure checkout, fast delivery, and the best deals await. Shop now and enjoy a seamless shopping experience!" />
        <meta name="keywords" content="Tjara cart, shopping cart, online shopping, checkout, e-commerce, best deals, secure payment, free delivery, multivendor marketplace, buy online" />
        <meta property="og:title" content="Your Shopping Cart | Tjara" />
        <meta property="og:description" content="Check out your selected products and complete your order on Tjara. Enjoy unbeatable deals, secure payments, and fast delivery!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com/cart" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-cart-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Shopping Cart | Tjara" />
        <meta name="twitter:description" content="Finalize your shopping with secure checkout, great discounts, and fast delivery on Tjara." />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-cart-preview.jpg" />
      </Helmet>

      <div className="wrapper cart-section">
        <SinginPopup />
        <div className="shop-category-heading-top">
          <p>
            Home / <span>Shopping Cart</span>
          </p>
        </div>
        <div className="cart-outer-container">
          <div className="cart-outer-container-left">
            {/* {cart?.resellerProgress && (
              <div className="reseller-progress">
                <ResellerProgressBar resellerProgressBar={cart.resellerProgress} />
              </div>
            )} */}
            {cart?.cartItems?.length == 0 ? (
              <p>No Items in Cart</p>
            ) : (
              cart?.cartItems?.map((e, i) => {
                return (
                  <div className="cart-products-container" key={i}>
                    <div className="cart-product-store-info-container">
                      <div className="display-flex align-center" style={{ gap: "15px" }}>
                        {e?.shop?.shop?.thumbnail?.media?.url ?
                          <img onClick={() => navigate(`/store/${e?.shop?.shop?.slug}`)} style={{ width: "80px", height: "80px", borderRadius: "100%", cursor: "pointer" }} src={fixUrl(e?.shop?.shop?.thumbnail?.media?.url)} alt="" />
                          :
                          <div className="store-logo" onClick={() => navigate(`/store/${e?.shop?.shop?.slug}`)}>{e?.shop?.shop?.name.charAt(0)}</div>
                        }

                        <div className="shop-name">
                          <p style={{ cursor: "pointer" }} className="cart-product-store-name" onClick={() => navigate(`/store/${e?.shop?.shop?.slug}`)}>
                            {e?.shop?.shop?.name}
                          </p>

                          {/* Show actual free shipping notice */}
                          {e?.freeShipping && (
                            <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                              {e?.freeShippingNotice ? e?.freeShippingNotice : "You've got free shipping from this store!"}
                            </p>
                          )}

                          {/* Show potential free shipping notice when displayHasLevelFreeShipping is true */}
                          {!e?.freeShipping && e?.displayHasLevelFreeShipping && (
                            <p className="cart-product-store-desc" style={{ margin: '5px 0', color: '#666' }}>
                              {e?.freeShippingNotice ? e?.freeShippingNotice : "You'll get free shipping when you reach the minimum purchase amount!"}
                            </p>
                          )}

                          {/* Show other shipping notices (like threshold-based) */}
                          {!e?.freeShipping && !e?.displayHasLevelFreeShipping && e?.freeShippingNotice ? (
                            <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                              {e?.freeShippingNotice}
                            </p>
                          ) : null}

                          {/* Show shipping fees when no free shipping (actual or potential) applies */}
                          {!e?.freeShipping && !e?.displayHasLevelFreeShipping && e?.maxShippingFee > 0 && (
                            <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                              {`Shipping Fees : ${formatPrice(e?.maxShippingFee)}`}
                            </p>
                          )}

                          {/* {e?.freeShipping && (
                          <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                            {e?.freeShippingNotice ? e?.freeShippingNotice : "You've got free shipping from this store!"}
                          </p>
                        )}

                        {!e?.freeShipping && e?.freeShippingNotice ? (
                          <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                            {e?.freeShippingNotice ? e?.freeShippingNotice : ""}
                          </p>
                        ) : null}

                        {!e?.freeShipping && e?.maxShippingFee > 0 && (
                          <p className="cart-product-store-desc" style={{ margin: '5px 0' }}>
                            {e?.maxShippingFee > 0 ? `Shipping Fees : ${formatPrice(e?.maxShippingFee)}` : ""}
                          </p>
                        )} */}
                        </div>
                      </div>

                      <div className="delivery-date">
                        Est. Delivery : {getEstimatedDeliveryDate(e?.items)}
                      </div>
                    </div>

                    {e?.items?.map((cartItem, index) => {
                      const stock = cartItem?.product?.product_type == "variable" ? cartItem?.product_variation?.product_variation?.stock : cartItem?.product?.stock
                      return (
                        <div className="cart-product-single" key={index}>
                          <div className="cart-product-image-title display-flex align-center" style={{ gap: "16px", width: '50%' }}>
                            <img onClick={() => navigate(`/product/${cartItem.product?.slug}`)} style={{ width: '100px', height: '100px', borderRadius: '10px', cursor: "pointer" }} src={fixUrl(cartItem?.thumbnail?.media?.url)} alt="" />
                            <div className="cart-product-title-info-box">
                              <p style={{ cursor: "pointer" }} onClick={() => navigate(`/product/${cartItem.product?.slug}`)} className="cart-product-title">{cartItem?.product.name}</p>
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

                              {/* {cartItem?.discounted_price && cartItem?.discounted_price > 0 ? (
                              <>
                                <div style={{ textDecoration: 'line-through' }} className="cart-product-original-price">{formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}</div>
                                <span style={{ margin: '0 10px' }}>-</span>
                                <div className="cart-product-discounted-price">{formatPrice(cartItem?.discounted_price)}</div>
                              </>
                            ) : (
                              <div className="cart-product-discounted-price">{formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}</div>
                            )} */}

                              {(cartItem?.discounted_price || cartItem?.displayDiscountedPrice) ? (
                                <>
                                  <div style={{ textDecoration: 'line-through' }} className="cart-product-original-price">
                                    {formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}
                                  </div>
                                  <span style={{ margin: '0 10px' }} />
                                  <div className="cart-product-discounted-price">
                                    {formatPrice(cartItem?.discounted_price || cartItem?.displayDiscountedPrice)}
                                  </div>
                                  {!cartItem?.discounted_price && (
                                    <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '5px' }}>
                                      {/* (potential) */}
                                    </span>
                                  )}
                                </>
                              ) : (cartItem?.final_price) ? (
                                <>
                                  <div style={{ textDecoration: 'line-through' }} className="cart-product-original-price">
                                    {formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}
                                  </div>
                                  <span style={{ margin: '0 10px' }} />
                                  <div className="cart-product-discounted-price">
                                    {formatPrice(cartItem?.final_price)}
                                  </div>
                                </>
                              ) : (
                                <div className="cart-product-discounted-price">
                                  {formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="cart-product-quatity-box">
                            <button onClick={() => { updateCartItem(cartItem?.id, cartItem?.quantity - 1) }}>-</button>
                            <span>{cartItem?.quantity}</span>
                            <button onClick={() => { cartItem.quantity >= stock ? toast.error(`Sorry only ${stock} items are available`) : updateCartItem(cartItem?.id, cartItem?.quantity + 1) }}>+</button>
                          </div>
                          <div className="cart-product-bookmark-delete-box">
                            <svg className="add-to-wishlist-btn" onClick={() => AddtoWishlist(cartItem?.product?.id)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.765 4.70229L12 5.52422L11.235 4.70229C9.12233 2.43257 5.69709 2.43257 3.58447 4.70229C1.47184 6.972 1.47184 10.6519 3.58447 12.9217L10.4699 20.3191C11.315 21.227 12.685 21.227 13.5301 20.3191L20.4155 12.9217C22.5282 10.6519 22.5282 6.972 20.4155 4.70229C18.3029 2.43257 14.8777 2.43257 12.765 4.70229Z" stroke="#8E8F91" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            <svg onClick={() => deleteCartItem(cartItem?.id)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 9L18.2841 18.3068C18.1238 20.3908 16.386 22 14.2959 22H9.70412C7.61398 22 5.87621 20.3908 5.71591 18.3068L5 9M21 7C18.4021 5.73398 15.3137 5 12 5C8.68635 5 5.59792 5.73398 3 7M10 5V4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4V5M10 11V17M14 11V17" stroke="#8E8F91" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}

                    <div className="summary-container">
                      {renderShopSummaryInCart(e, i)}
                    </div>

                    {/* <div className="summary-container">
                    {(e?.shopDiscount > 0 || e?.shopBonus > 0) && (
                      <div className="summary-card">
                        Shop Total
                        <div className="summary-row header-container">
                          <span>Shop Subtotal</span>
                          <span className="amount">{formatPrice(e?.shopTotal)}</span>
                        </div>

                        Discount Section
                        {e?.shopDiscount > 0 && (
                          <div className="summary-row discount">
                            <div className="label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 14.25L15 8.25M9.75 8.625H9.76M14.25 14.625H14.26M8.28 3.75H15.72C17.148 3.75 17.862 3.75 18.431 4.043C18.9288 4.30004 19.3294 4.7146 19.57 5.22C19.847 5.805 19.847 6.536 19.847 8V16C19.847 17.464 19.847 18.195 19.57 18.78C19.3294 19.2854 18.9288 19.7 18.431 19.957C17.862 20.25 17.148 20.25 15.72 20.25H8.28C6.852 20.25 6.138 20.25 5.569 19.957C5.07124 19.7 4.67064 19.2854 4.43 18.78C4.153 18.195 4.153 17.464 4.153 16V8C4.153 6.536 4.153 5.805 4.43 5.22C4.67064 4.7146 5.07124 4.30004 5.569 4.043C6.138 3.75 6.852 3.75 8.28 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>Discount Applied</span>
                            </div>
                            <span className="amount">-{formatPrice(e?.shopDiscount)}</span>
                          </div>
                        )}

                        Bonus Section
                        {e?.shopBonus > 0 && (
                          <div className="summary-row bonus">
                            <div className="label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12M12 16H12.01M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>Bonus Amount</span>
                            </div>
                            <span className="amount">+{formatPrice(e?.shopBonus)}</span>
                          </div>
                        )}

                        Final Total
                        {e?.shopDiscount > 0 && (
                          <div className="summary-row total">
                            <span>Shop Total</span>
                            <span className="amount">{formatPrice(e?.shopTotal - e?.shopDiscount)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    Level Progress Section
                    {e?.isEligibleForDiscount && e?.levelProgress && (
                      <div className="level-card">
                        <div className="level-header">
                          <div className="current-level">
                            <h4>{e?.levelProgress?.currentLevel ?
                              `Current Level : ${e?.levelProgress?.currentLevel?.level}` :
                              e?.nextTierMessage !== '' ? e?.nextTierMessage?.replace(/-/g, '') : 'Start Shopping to Reach Level 1'}</h4>
                            {e?.levelProgress?.currentLevel && (
                              <p className="benefits">
                                {e?.levelProgress?.currentLevel?.discount}% discount
                                {e?.levelProgress?.currentLevel?.bonus > 0 &&
                                  ` + ${formatPrice(e?.levelProgress?.currentLevel?.bonus)} bonus`}
                              </p>
                            )}
                          </div>
                          {e?.levelProgress?.nextLevel && (
                            <div className="next-level">
                              <p>Next Level Benefits:</p>
                              <p className="benefits">
                                {e?.levelProgress?.nextLevel?.discount}% discount
                                {e?.levelProgress?.nextLevel?.bonus > 0 &&
                                  ` + ${formatPrice(e?.levelProgress?.nextLevel?.bonus)} bonus`}
                              </p>
                            </div>
                          )}
                        </div>

                        Progress Bar
                        <div className="progress-bar-container">
                          <div
                            className="progress-fill"
                            style={{ width: `${e?.levelProgress?.progress}%` }}
                          />
                        </div>

                        Next Level Alert
                        {e?.levelProgress?.nextLevel && (
                          <div className="level-alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>
                              Add {formatPrice(e?.levelProgress?.amountToNextLevel)} more to reach Level {e?.levelProgress?.nextLevel?.level}
                            </span>
                          </div>
                        )}

                        Levels Table
                        <table className="levels-table">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Min Spent</th>
                              <th>Discount</th>
                              <th>Bonus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {e?.levelProgress?.levels.map((level, index) => (
                              <tr key={index} className={e?.levelProgress?.currentLevel?.level === level.level ? 'active' : ''}>
                                <td>Level {level.level}</td>
                                <td>{formatPrice(level.minSpent)}</td>
                                <td>{level.discount}%</td>
                                <td>{level.bonus > 0 ? formatPrice(level.bonus) : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div> */}
                  </div>
                );
              })
            )}

            {/* After all cart items mapping */}
            {cart?.cartItems?.length > 0 && cart?.resellerProgress?.levels && (
              <div className="reseller-levels-overview" style={{
                margin: '24px 0',
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{
                  marginBottom: '20px',
                  borderBottom: '1px solid #E5E7EB',
                  paddingBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Reseller Levels & Benefits
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                    Available discounts and bonuses for each level
                  </p>
                </div>

                {/* All Levels Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  {cart?.resellerProgress?.levels.map((level, index) => (
                    <div key={index} style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                    }}>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '12px'
                      }}>
                        Level {level.level}
                      </h4>

                      <div style={{ marginBottom: '16px' }}>
                        <p style={{
                          color: '#6B7280',
                          fontSize: '0.9rem',
                          marginBottom: '4px'
                        }}>
                          Minimum Purchase
                        </p>
                        <p style={{
                          color: '#111827',
                          fontSize: '1.1rem',
                          fontWeight: '500'
                        }}>
                          {formatPrice(level.minSpent)}
                        </p>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <p style={{
                          color: '#6B7280',
                          fontSize: '0.9rem',
                          marginBottom: '4px'
                        }}>
                          Discount Rate
                        </p>
                        <p style={{
                          color: '#059669',
                          fontSize: '1.1rem',
                          fontWeight: '500'
                        }}>
                          {level.discount}%
                        </p>
                      </div>

                      {level.bonus > 0 && (
                        <div>
                          <p style={{
                            color: '#6B7280',
                            fontSize: '0.9rem',
                            marginBottom: '4px'
                          }}>
                            Bonus Amount
                          </p>
                          <p style={{
                            color: '#6366F1',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}>
                            {formatPrice(level.bonus)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="cart-products-related-products-container">
              {/* <p className="feature-product-heading-name">Find Related Products!</p> */}
              <SectionHeading heading="Find Related Products!" />

              <div className="cart-products-related-products-container-inner">
                {relatedProducts?.map((e, i) => {
                  return <ProductsFeature key={i} detail={e} />;
                })}
              </div>
              {/* {relatedProducts.total < relatedProducts.length && (
              <div className="load-more-btn-row">
                <button className="button" onClick={loadMoreRelatedProducts}>
                  Load More
                </button>
              </div>
            )} */}
            </div>
          </div>
          <div className="cart-outer-container-right">
            {cart?.cartItems && cart?.cartItems?.length > 0 ?
              cart?.cartItems?.map((e, i) => (
                renderShopOrderSummary(e, i)
              )) : null
            }


            {/* {cart?.cartItems && cart?.cartItems?.length > 0 ?
            cart?.cartItems?.map((e, i) => (
              <div key={i} style={{ marginTop: i > 0 ? "20px" : null }} className="cart-order-summary-box">
                <h5 style={{ textAlign: 'center' }}>{e?.shop?.shop?.name}</h5>

                <h5>Order Summary</h5>

                <div className="cart-order-summary-box-inner-row">
                  <p>Sub-total</p>
                  <span>{e?.shopTotal > 0 ? formatPrice(e?.shopTotal) : ("---")}</span>
                </div>

                <div className="cart-order-summary-box-inner-row">
                  <div className="shipping" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <p>Delivery Fee</p>
                  </div>
                  <span>{e?.freeShipping ? ("Free") : !e?.freeShipping && e?.maxShippingFee > 0 ? (formatPrice(e?.maxShippingFee)) : ("---")}</span>
                </div>

                {e?.shopDiscount > 0 && (
                  <div className="cart-order-summary-box-inner-row">
                    <p>{e?.shop?.shop?.name} Discount {e?.currentDiscountInPercentage > 0 ? `(${e?.currentDiscountInPercentage}%)` : null}</p>
                    <span style={{ color: 'red' }}>{e?.shopDiscount > 0 ? `- ${formatPrice(e?.shopDiscount)}` : ("---")}</span>
                  </div>
                )} */}

            {/* <div className="cart-order-summary-box-inner-row">
                  <p>Tax</p>
                  <span>{cart?.cartItems?.length == 0 ? "---" : `$0`}</span>
                </div> */}

            {/* <hr />

                <div className="cart-order-summary-box-total-row">
                  <p>Total</p>
                  <span>{e?.shopTotal > 0 ? formatPrice((parseFloat(e?.shopTotal) + parseFloat(e?.freeShipping ? 0 : (e?.maxShippingFee > 0 ? e?.maxShippingFee : 0))) - parseFloat((e?.shopDiscount > 0 ? e?.shopDiscount : 0))) : ("---")}</span>
                </div>

                <hr style={{ margin: '20px 0' }} />

                {e?.shopBonus > 0 ?
                  <div className="cart-order-summary-box-inner-row">
                    <p style={{ color: 'green' }}>🎁 Bonus : {e?.shopBonus > 0 ? `${formatPrice(e?.shopBonus)} (Gets Added to your wallet after checkout)` : ("---")}</p>
                  </div> : null
                }

                {e?.isEligibleForDiscount && !e?.levelProgress?.currentLevel ? (
                  <h4>{e?.nextTierMessage === '' ? 'Start Shopping to Reach Level 1' : e?.nextTierMessage?.replace(/-/g, '')}</h4>
                ) : null}

                {e?.discountMessage ? (<p className="shipping-free-heading">{cart?.discountMessage}</p>) : ('')} */}

            {/* {cart?.cartItems?.length !== 0 &&
                  <>
                    <p className="shipping-free-heading">Shipping Fee Discount</p>
                    <div className="cart-order-summary-promo-code-row">
                      <input type="text" placeholder="Promo Code" />
                      <button>Apply</button>
                    </div>
                  </>
                } */}

            {/* </div>
            )) : null
          } */}

            {cart?.cartItems?.length !== 0 && cart?.cartItems?.map((e, i) => {
              return (
                e?.isEligibleForDiscount && !e?.levelProgress?.currentLevel ? (
                  <>
                    <h4 style={{ marginTop: '20px', color: 'red' }}>Notice From {e?.shop?.shop?.name} :</h4>
                    <h4 style={{ margin: '5px 0' }}>{e?.nextTierMessage === '' ? 'Start Shopping to Reach Level 1' : e?.nextTierMessage?.replace(/-/g, '')}</h4>
                  </>
                ) : null
              );
            })}

            {/* Store Discount Messages */}
            {cart?.discountMessages?.length > 0 && (
              <div className="store-discount-messages">
                {cart.discountMessages.map((message, index) => (
                  message !== null ?
                    (<div key={index} className={`discount-message ${message?.includes('Add') ? 'qualification' : 'active'}`}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 10.625L9.375 12.5L12.5 8.75M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {message}
                    </div>) : null
                ))}
              </div>
            )}

            <button disabled={cart?.cartItems?.length == 0} className="button proceed-to-checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.42218 17.2817H27.9929" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.7595 8.04822L27.993 17.2817L18.7595 26.5152" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* uncomment this if you want to show the cart total instead of the shop total */}

            {/* {cart?.cartItems && cart?.cartItems?.length <= 0 ? null :
            <div className="cart-order-summary-box">
              <h5>Order Summary</h5>

              <div className="cart-order-summary-box-inner-row">
                <p>Sub-total</p>
                <span>{cart?.cartTotal > 0 ? formatPrice(cart?.cartTotal) : ("---")}</span>
              </div>

              <div className="cart-order-summary-box-inner-row">
                <div className="shipping" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <p>Delivery Fee</p>
                  <div className="shop-shipping-fees">
                    {cart?.cartItems?.reduce((acc, e, i) => e?.maxShippingFee > 0 ? [...acc, <span style={{ fontSize: '12px' }} key={i}>{acc.length ? '+ ' : ''}({formatPrice(e.maxShippingFee)})</span>] : acc, [])}
                  </div>
                </div>
                <span>{cart?.totalShippingFees > 0 ? formatPrice(cart?.totalShippingFees) : ("---")}</span>
              </div>

              <div className="cart-order-summary-box-inner-row">
                <p>Tjara Store Discount {cart?.currentDiscountInPercentage > 0 ? `(${cart?.currentDiscountInPercentage}%)` : null}</p>
                <span style={{ color: 'red' }}>{cart?.totalDiscounts > 0 ? `- ${formatPrice(cart?.totalDiscounts)}` : ("---")}</span>
              </div>

              <div className="cart-order-summary-box-inner-row">
                <p>Tax</p>
                <span>{cart?.cartItems?.length == 0 ? "---" : `$0`}</span>
              </div>

              <hr />

              <div className="cart-order-summary-box-total-row">
                <p>Total</p>
                <span>{cart?.grandTotal > 0 ? formatPrice(cart?.grandTotal) : ("---")}</span>
              </div>

              <hr style={{ margin: '20px 0' }} />

              {cart?.totalBonuses > 0 ?
                <div className="cart-order-summary-box-inner-row">
                  <p style={{ color: 'green' }}>🎁 Bonus : {cart?.totalBonuses > 0 ? `${formatPrice(cart?.totalBonuses)} (Gets Added to your wallet after checkout)` : ("---")}</p>
                </div> : null
              }

              {cart?.cartItems?.length !== 0 && cart?.cartItems?.map((e, i) => {
                return (
                  e?.isEligibleForDiscount && !e?.levelProgress?.currentLevel ? (
                    <h4>{e?.nextTierMessage === '' ? 'Start Shopping to Reach Level 1' : e?.nextTierMessage?.replace(/-/g, '')}</h4>
                  ) : null
                );
              })}

              {cart?.discountMessage ? (<p className="shipping-free-heading">{cart?.discountMessage}</p>) : ('')}

              {cart?.cartItems?.length !== 0 &&
                <>
                  <p className="shipping-free-heading">Shipping Fee Discount</p>
                  <div className="cart-order-summary-promo-code-row">
                    <input type="text" placeholder="Promo Code" />
                    <button>Apply</button>
                  </div>
                </>
              }

              <button disabled={cart?.cartItems?.length == 0} className="button proceed-to-checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.42218 17.2817H27.9929" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.7595 8.04822L27.993 17.2817L18.7595 26.5152" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          } */}

            <div className="payment-options-container">
              <p className="payment-options-heading">Safe Payment Options</p>
              <li>
                <span className="text-green">Tjara is committed to protecting your payment information.</span>
                We follow PCI DSS standards, use strong encryption, and perform regular reviews of its system to protect your privacy.
              </li>

              <p className="payment-options-subheading">1. Payment methods</p>
              <div className="cart-payment-methods-container">
                {paymentMethods.map((e, i) => {
                  const style = (i === 0 || i === 1)
                    ? {
                      height: '50px',
                      width: 'auto',
                      ...(i === 0 ? { border: '2px solid #80808040' } : {})
                    }
                    : {};

                  return <img key={i} src={e} alt="e" style={style} />;
                })}
              </div>

              <p className="payment-options-subheading">Security certification</p>
              <div className="cart-payment-methods-container">
                {paymentCertified.map((e, i) => {
                  return <img key={i} src={e} alt="" />;
                })}
              </div>

              <p className="payment-options-heading">Secure logistics</p>
              <li className="text-green">Package safety</li>
              <p className="text-gray-payment-methods-cart"> Full refund for your damaged or lost package.</p>
              <li className="text-green">Delivery guaranteed</li>
              <p>Accurate and precise order tracking.</p>
              <p className="payment-options-heading">Purchase protection</p>
              <li className="text-gray-payment-methods-cart">Shop confidently on Tjara knowing that if something goes wrong, we've always got your back.</li>
              <p className="payment-options-heading">Customer service</p>
              <li className="text-gray-payment-methods-cart">Our customer service team is always here if you need help.</li>
              <div className="cart-payment-method-faq-livechat-container">
                <div onClick={() => navigate('/help-and-center')}><svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="46.5" cy="46.6326" r="46" fill="#E0E0E0" /> <path d="M37.5 62.6326H60.5L66.5 68.6326V47.6326C66.5 45.4326 64.7 43.6326 62.5 43.6326H37.5C35.3 43.6326 33.5 45.4326 33.5 47.6326V58.6326C33.5 60.8326 35.3 62.6326 37.5 62.6326Z" fill="#558B2F" /> <path d="M51.3008 55.4325H47.7008L47.0008 57.5325H44.8008L48.5008 47.5325H50.4008L54.1008 57.5325H51.9008L51.3008 55.4325ZM48.2008 53.8325H50.7008L49.5008 50.0325L48.2008 53.8325Z" fill="#1B5E20" /> <path d="M55.5 47.6326H32.5L26.5 53.6326V30.6326C26.5 28.4326 28.3 26.6326 30.5 26.6326H55.5C57.7 26.6326 59.5 28.4326 59.5 30.6326V43.6326C59.5 45.8326 57.7 47.6326 55.5 47.6326Z" fill="#8BC34A" /> <path d="M47.9016 36.8325C47.9016 37.8325 47.7016 38.6325 47.4016 39.3325C47.1016 40.0325 46.7016 40.6325 46.1016 41.0325L47.8016 42.3325L46.5016 43.5325L44.3016 41.8325C44.1016 41.8325 43.8016 41.9325 43.5016 41.9325C42.9016 41.9325 42.3016 41.8325 41.7016 41.6325C41.2016 41.4325 40.7016 41.0325 40.3016 40.6325C39.9016 40.2325 39.6016 39.6325 39.4016 39.0325C39.2016 38.4325 39.1016 37.7325 39.1016 36.9325V36.5325C39.1016 35.7325 39.2016 35.0325 39.4016 34.4325C39.6016 33.8325 39.9016 33.2325 40.3016 32.8325C40.7016 32.4325 41.1016 32.0325 41.7016 31.8325C42.2016 31.6325 42.8016 31.5325 43.5016 31.5325C44.1016 31.5325 44.7016 31.6325 45.3016 31.8325C45.8016 32.0325 46.3016 32.4325 46.7016 32.8325C47.1016 33.2325 47.4016 33.8325 47.6016 34.4325C47.8016 35.0325 47.9016 35.7325 47.9016 36.5325V36.8325ZM45.7016 36.3325C45.7016 35.2325 45.5016 34.4325 45.1016 33.9325C44.7016 33.3325 44.2016 33.1325 43.5016 33.1325C42.8016 33.1325 42.2016 33.4325 41.9016 33.9325C41.5016 34.5325 41.3016 35.3325 41.3016 36.3325V36.8325C41.3016 37.3325 41.4016 37.8325 41.5016 38.2325C41.6016 38.6325 41.7016 39.0325 41.9016 39.2325C42.1016 39.5325 42.3016 39.7325 42.6016 39.8325C42.9016 39.9325 43.2016 40.0325 43.5016 40.0325C44.2016 40.0325 44.8016 39.7325 45.1016 39.2325C45.5016 38.6325 45.7016 37.8325 45.7016 36.7325V36.3325Z" fill="white" /> </svg>FAQ</div>
                {/* <div>
                <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="46.5" cy="46.6326" r="46" fill="#E0E0E0" />
                  <g clipPath="url(#clip0_1_814)">
                    <path d="M46.5 70.6326C59.7548 70.6326 70.5 59.8875 70.5 46.6326C70.5 33.3778 59.7548 22.6326 46.5 22.6326C33.2452 22.6326 22.5 33.3778 22.5 46.6326C22.5 59.8875 33.2452 70.6326 46.5 70.6326Z" fill="#1C98F7" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M46.92 57.6201C47.9755 57.5468 49.0219 57.3761 50.046 57.1101C51.3098 57.4958 52.6458 57.5831 53.949 57.3651C54.0006 57.3568 54.0528 57.3528 54.105 57.3531C54.57 57.3531 55.1805 57.6231 56.07 58.1931V57.2556C56.0702 57.0934 56.1135 56.9342 56.1955 56.7942C56.2774 56.6543 56.3951 56.5386 56.5365 56.4591C56.9235 56.2401 57.2835 55.9881 57.612 55.7106C58.908 54.6126 59.64 53.1486 59.64 51.5976C59.64 51.0771 59.5575 50.5716 59.4015 50.0886C59.793 49.3581 60.1095 48.5901 60.342 47.7936C61.0937 48.9201 61.4965 50.2433 61.5 51.5976C61.5 53.7051 60.519 55.6701 58.8225 57.1071C58.5393 57.3468 58.2412 57.5682 57.93 57.7701V59.9616C57.93 60.7161 57.06 61.1496 56.4465 60.7011C55.8664 60.2675 55.2657 59.862 54.6465 59.4861C54.4692 59.38 54.2847 59.2863 54.0945 59.2056C53.5845 59.2821 53.0625 59.3211 52.536 59.3211C50.418 59.3211 48.4605 58.6866 46.92 57.6201ZM35.721 53.2371C33.045 50.9676 31.5 47.8761 31.5 44.5626C31.5 37.7931 37.887 32.3826 45.6855 32.3826C53.4855 32.3826 59.8725 37.7931 59.8725 44.5626C59.8725 51.3336 53.484 56.7441 45.6855 56.7441C44.8095 56.7441 43.9425 56.6766 43.0935 56.5416C42.726 56.6286 41.2575 57.5016 39.141 59.0466C38.3745 59.6076 37.287 59.0661 37.287 58.1226V54.3846C36.7389 54.0391 36.2156 53.6556 35.721 53.2371ZM43.1445 54.2361C43.209 54.2361 43.275 54.2406 43.3395 54.2511C44.1045 54.3801 44.8905 54.4461 45.6855 54.4461C52.2735 54.4461 57.546 49.9791 57.546 44.5626C57.546 39.1476 52.2735 34.6806 45.6855 34.6806C39.1005 34.6806 33.825 39.1476 33.825 44.5626C33.825 47.1816 35.0565 49.6476 37.2345 51.4926C37.782 51.9546 38.3835 52.3746 39.0285 52.7406C39.39 52.9446 39.6135 53.3256 39.6135 53.7366V55.8921C41.2875 54.7686 42.3885 54.2361 43.1445 54.2361ZM39.639 46.8621C38.6115 46.8621 37.779 46.0371 37.779 45.0231C37.779 44.0076 38.6115 43.1841 39.639 43.1841C40.6665 43.1841 41.499 44.0076 41.499 45.0231C41.499 46.0386 40.6665 46.8621 39.639 46.8621ZM45.6855 46.8621C44.658 46.8621 43.8255 46.0371 43.8255 45.0231C43.8255 44.0076 44.658 43.1841 45.6855 43.1841C46.713 43.1841 47.5455 44.0076 47.5455 45.0231C47.5455 46.0386 46.713 46.8621 45.6855 46.8621ZM51.732 46.8621C50.7045 46.8621 49.872 46.0371 49.872 45.0231C49.872 44.0076 50.7045 43.1841 51.732 43.1841C52.7595 43.1841 53.592 44.0076 53.592 45.0231C53.592 46.0386 52.7595 46.8621 51.732 46.8621Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_814">
                      <rect width="48" height="48" fill="white" transform="translate(22.5 22.6326)" />
                    </clipPath>
                  </defs>
                </svg>
                Live Chat
              </div> */}
              </div>
            </div>
          </div>
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
    </>
  );
};

export default Cart;