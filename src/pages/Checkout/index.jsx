import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { fixUrl, formatPrice } from "@helpers/helpers";
import ORDERS from "@client/ordersClient";
import CART from "@client/cartItemsClient";
import COUNTRIES from "@client/countriesClient";
import STATES from "@client/statesClient";
import CITIES from "@client/citiesClient";
import RESELLER_PROGRAMS from "@client/resellerProgramsClient";
import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";

import paypal from "../../assets/paypal.png";
import cod from "../../assets/cod.png";
import whish from "./assets/whish.png";
import wallet from "./assets/wallet.png";
import visa from "../../assets/visa.png";
import mastercard from "../../assets/mastercard.png";
import americanExpress from "../../assets/americanExpress.png";
import discover from "../../assets/discover.png";
import dclubs from "../../assets/dclubs.png";
import maestro from "../../assets/maestro.png";
import jsb from "../../assets/jsb.png";
import applepay from "../../assets/applepay.png";
import clearpay from "../../assets/clearpay.png";
import CheckCircle from "./assets/CheckCircle.png";

import "../Cart/style.css";
import "./style.css";
import PhoneInput from "react-phone-input-2";

const Checkout = () => {
  const { cartsItemCount } = usePopup()
  const [cart, setCart] = useState({});
  const { currentUser } = useAuth();
  const [activePromotions, setActivePromotions] = useState({});
  const [UserWallet, setUserWallet] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [userAddress, setUserAddress] = useState({
    postal_code: '',
    street_address: '',
    country_id: '',
    state_id: '',
    city_id: ''
  });
  // const [userPaymentDetails, setUserPaymentDetails] = useState({});
  const [cities, setCities] = useState({});
  const [states, setStates] = useState({});
  const [countries, setCountries] = useState({});
  const [successOrder, setsuccessOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayementMethod, setselectedPayementMethod] = useState("cash-on-delivery");
  const [WalletCheckoutAmount, setWalletCheckoutAmount] = useState(0);
  const params = new URLSearchParams(location.search);
  const [loading, setloading] = useState(false);
  const [CartGrandTotal, setCartGrandTotal] = useState(0);
  const paymentMethods = [
    { value: 'cash-on-delivery', image: cod },
    // { value: 'wallet', image: wallet },
    { value: 'whish', image: whish },
    // { value: 'paypal', image: paypal },
    // { value: 'stripe', image: visa },
    // { value: 'stripe', image: mastercard },
    // { value: 'americanExpress', image: americanExpress },
    // { value: 'discover', image: discover },
    // { value: 'dclubs', image: dclubs },
    // { value: 'maestro', image: maestro },
    // { value: 'jsb', image: jsb },
    // { value: 'applepay', image: applepay },
    // { value: 'clearpay', image: clearpay },
  ];

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Fetch The Cart                                   */
  /* -------------------------------------------------------------------------------------------- */

  const fetchCart = async () => {
    const { data, error } = await CART.getCartItems({});
    if (data) {
      setCart(data);
      setCartGrandTotal(data?.grandTotal)
    }
    if (error) toast.error(error.message);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                            Function To Fetch The Active Promotions                           */
  /* -------------------------------------------------------------------------------------------- */

  // const fetchActivePromotions = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_CUSTOMER_API_ENDPOINT}/active-promotions`);
  //     if (response.status == 200) {
  //       setActivePromotions((prev) => response.data.globalPromotions);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  /* -------------------------------------------------------------------------------------------- */
  /*                              Function To Fetch The User Details                              */
  /* -------------------------------------------------------------------------------------------- */

  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_API_ENDPOINT}/user`);
  //     if (response.status == 200) {
  //       setUserDetails(response.data.user);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  /* -------------------------------------------------------------------------------------------- */
  /*                              Function To Fetch The User Address                              */
  /* -------------------------------------------------------------------------------------------- */

  // const fetchUserAddress = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_API_ENDPOINT}/address`);
  //     if (response.status == 200) {
  //       setUserAddress(response.data.address);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  /* -------------------------------------------------------------------------------------------- */
  /*                             Function To Fetch The Payment Details                            */
  /* -------------------------------------------------------------------------------------------- */

  // const fetchUserPaymentDetails = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_API_ENDPOINT}/payment-methods`);
  //     if (response.status == 200) {
  //       setUserPaymentDetails(response.data.payment_methods);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };

  /* -------------------------------------------------------------------------------------------- */
  /*                             Function To Fetch The Payment Details                            */
  /* -------------------------------------------------------------------------------------------- */

  const fetchCountries = async () => {
    const { data, error } = await COUNTRIES.getCountries({});
    if (data) setCountries(data.countries);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchStates = async (countryId) => {
    const { data, error } = await STATES.getStates(countryId, {});
    if (data) setStates(data.states);
    if (data) fetchCities(data.states[0]?.id)
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCities = async (stateId) => {
    const { data, error } = await CITIES.getCities(stateId);
    if (data) setCities(data.cities);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchUserResellerProgramWallet = async () => {
    const UserId = currentUser?.id ?? null;
    const { data, error } = await RESELLER_PROGRAMS.getResellerProgramByUserId(UserId);
    if (data) setUserWallet(data.reseller_program);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCountryChange = (e) => {
    fetchStates(e.target.value);
    setUserAddress((prev) => ({ ...prev, country_id: e.target.value }))
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleStateChange = (e) => {
    fetchCities(e.target.value);
    setUserAddress((prev) => ({ ...prev, state_id: e.target.value }))
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCityChange = (e) => {
    setUserAddress((prev) => ({ ...prev, city_id: e.target.value }))
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                      Handle Order Submit                                     */
  /* -------------------------------------------------------------------------------------------- */

  const handleSubmitOrder = async () => {
    setloading(true);
    if (userDetails.email == '' || userDetails.email == undefined || userDetails.email == null) {
      toast.error('Email number is required!');
      setloading(false);
      return
    }

    if (userDetails.phone == '' || userDetails.phone == undefined || userDetails.phone == null) {
      toast.error('Phone number is required!');
      setloading(false);
      return
    }

    if (userAddress.street_address == '' || !userAddress.street_address || userAddress.country_id == '' || !userAddress.country_id || userAddress.state_id == '' || !userAddress.state_id) {
      toast.error('All Address fields are required!');
      setloading(false);
      return
    }

    if (userAddress.postal_code.length < 5 || !userAddress.postal_code) {
      toast.error('Zip/Postal code must be 5 or above!');
      setloading(false);
      return
    }

    const ApiParams = {
      user_details: userDetails,
      user_address: userAddress,
      payment_method: selectedPayementMethod,
      success_url: `${import.meta.env.VITE_WEBSITE_ENDPOINT}/checkout`,
      cancel_url: `${import.meta.env.VITE_WEBSITE_ENDPOINT}/checkout`
    };

    if (WalletCheckoutAmount > 0) {
      ApiParams.wallet_checkout_amount = WalletCheckoutAmount;
    }

    const { data, error } = await ORDERS.createOrder(ApiParams);

    if (data) {
      toast.success(data.message);

      if (data?.checkout_url) {
        document.location.href = data?.checkout_url;
      } else {
        document.location.href = '/checkout?payment=success';
      }
    }

    if (error) {
      toast.error(error.data.message);
    }

    setloading(false);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                 Function To Delete Cart Item                                 */
  /* -------------------------------------------------------------------------------------------- */

  const deleteCartItem = async (cartItemId) => {
    const { data, error } = await CART.deleteCartItem(cartItemId);
    // if (data) setCart({ cartItems: cart?.cartItems?.filter((cartItem) => cartItem?.id !== cartItemId) });
    if (data) {
      fetchCart();
      cartsItemCount();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }

  /* --------------------------------------------- X -------------------------------------------- */

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
      toast.error(error.data.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const updateOrderStatus = async (orderStatus) => {
    const id = params.get('order_id');
    if (!id) return;
    const { data, error } = await ORDERS.updateOrder(id, {
      status: orderStatus
    })
    if (data) {
      toast.success(data.message)
      navigate('/orders/placed-orders')
    }
    if (error) {
      toast.error(error.data.message)
    }
  }
  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (params.get('payment') === 'success') {
      updateOrderStatus('processing');
      setsuccessOrder(true);
    }
  }, [params.get('payment')]);

  /* -------------------------------------------------------------------------------------------- */
  /*                              Functions To Run On Component Mount                             */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    if (currentUser?.authToken) {
      fetchCart();
      setUserDetails(currentUser);
      setUserAddress(currentUser?.address?.address);
      fetchStates(currentUser?.address?.address?.country_id);
      fetchCities(currentUser?.address?.address?.state_id);
    }
    // fetchActivePromotions();
    // fetchUserDetails();
    // fetchUserAddress();
    // fetchUserPaymentDetails();
    fetchCountries();
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
  /*                                     Get Max Shipping Fees                                    */
  /* -------------------------------------------------------------------------------------------- */

  function getMaxShippingFees(items) {
    if (!items || items.length === 0) return 0;

    const shippingFees = items.map(item => item?.meta?.shipping_fees || 0);

    return Math.max(...shippingFees);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const handleWalletCheckoutAmount = (amount) => {
    if (amount > UserWallet?.balance) {
      // toast.warning("Amount exceeded the available wallet balance.")
      return;
    }
    setWalletCheckoutAmount(amount);
    setCartGrandTotal(cart?.grandTotal - amount);
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (currentUser?.meta?.role) {
      const roles = currentUser?.meta?.role?.split(",") || [];
      if (roles.includes("reseller")) {
        fetchUserResellerProgramWallet();
      }
    }
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className="wrapper checkout-page">
      {successOrder && (
        <div className="successOrder">
          <div className="bg" onClick={() => setsuccessOrder(false)} />
          <div className="container">
            <img src={CheckCircle} alt="" />
            <h2 style={{ marginBottom: '40px' }}>Your order is successfully placed</h2>
            {/* <p>Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p> */}
            <div className="buttons">
              <button onClick={() => { window.location.href = `${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/` }}>
                Go to dashboard
                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clipPath="url(#clip0_2_36904)">   <path d="M4.77051 22L16.7705 29L28.7705 22" stroke="#D21642" strokeWidth="2.11957" strokeLinecap="round" strokeLinejoin="round" />   <path d="M4.77051 16L16.7705 23L28.7705 16" stroke="#D21642" strokeWidth="2.11957" strokeLinecap="round" strokeLinejoin="round" />   <path d="M4.77051 10L16.7705 17L28.7705 10L16.7705 3L4.77051 10Z" stroke="#D21642" strokeWidth="2.11957" strokeLinecap="round" strokeLinejoin="round" /> </g> <defs>   <clipPath id="clip0_2_36904">     <rect width="32" height="32" fill="white" transform="translate(0.770508)" />   </clipPath> </defs></svg>
              </button>

              <button onClick={() => { window.location.href = `${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/orders/placed-orders` }}>
                View order
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.98438 17H28.5551" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" /><path d="M19.3213 7.7666L28.5548 17.0001L19.3213 26.2336" stroke="white" strokeWidth="2.05189" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="shop-category-heading-top checkout-heading-top">
        <p className="breadcrumbs-sec">
          Home / Shopping Cart / <span>Checkout</span>
        </p>
      </div>
      <div className="checkout-outer-container">
        <div className="checkout-outer-container-left">
          <p className="checkout-field-top-heading">Billing Information</p>
          <div className="checkout-fields-row">
            <div className="checkout-field-single-box">
              <label htmlFor="">First Name</label>
              <input type="text" name="first_name" value={userDetails?.first_name ?? ""} placeholder="John" onChange={(e) => setUserDetails((prev) => ({ ...prev, first_name: e.target.value }))} />
            </div>
            <div className="checkout-field-single-box">
              <label htmlFor="">Last Name</label>
              <input type="text" name="last_name" value={userDetails?.last_name ?? ""} placeholder="Robert" onChange={(e) => setUserDetails((prev) => ({ ...prev, last_name: e.target.value }))} />
            </div>
          </div>

          <div className="checkout-fields-row">
            <div className="checkout-field-single-box">
              <label htmlFor="">Email<i style={{ color: "red" }}>*</i></label>
              <input type="email" name="email" value={userDetails?.email ?? ""} placeholder="something@example.com" onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="checkout-field-single-box">
              <label htmlFor="">Phone Number <i style={{ color: "red" }}>*</i></label>
              {/* <input type="tel" name="phone" placeholder="9234514789" value={userDetails?.phone} onChange={(e) => setUserDetails((prev) => ({ ...prev, phone: e.target.value }))} /> */}
              <PhoneInput country={'lb'} value={userDetails?.phone} excludeCountries={['il']} onChange={(e) => setUserDetails((prev) => ({ ...prev, phone: e }))} />
            </div>
          </div>

          <div className="checkout-fields-row checkout-four-fields-row">
            <div className="checkout-field-single-box">
              <label htmlFor="">Address<i style={{ color: "red" }}>*</i></label>
              <input type="text" name="street_address" value={userAddress?.street_address ?? ""} placeholder="Your Address" onChange={(e) => setUserAddress((prev) => ({ ...prev, street_address: e.target.value }))} />
            </div>
            <div className="checkout-field-single-box">
              <label htmlFor="">Zip Code<i style={{ color: "red" }}>*</i></label>
              <input type="text" value={userAddress?.postal_code} onChange={(e) =>
                setUserAddress((prev) => ({ ...prev, postal_code: e.target.value }))
              } />
            </div>
          </div>

          <div className="checkout-fields-row checkout-four-fields-row">
            <div className="checkout-field-single-box">
              <label htmlFor="">Country<i style={{ color: "red" }}>*</i></label>
              <select name="country" id="country" value={userAddress?.country_id} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.length > 0 &&
                  countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="checkout-field-single-box">
              <label htmlFor="">Region/State<i style={{ color: "red" }}>*</i></label>
              <select name="state" id="state" value={userAddress?.state_id} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.length > 0 &&
                  states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="checkout-field-single-box">
              <label htmlFor="">City</label>
              <select name="city" id="city" value={userAddress?.city_id} onChange={handleCityChange}>
                <option value="">Select City</option>
                {cities.length > 0 &&
                  cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="checkout-checkbox-text-row">
            {/* <input type="checkbox" name="" id="ship-differnet-checkout" />
            <label htmlFor="ship-differnet-checkout">Ship into different address</label> */}
          </div>

          {/* <p className="checkout-field-top-heading">Additional Information</p>
          <div className="checkout-fields-row">
            <div className="checkout-field-single-box">
              <label htmlFor="">
                Order Notes <span>(Optional)</span>
              </label>
              <textarea name="" id="" cols="30" rows="10" placeholder="Notes about your order, e.g. special notes for delivery" />
            </div>
          </div> */}
          {/* <div className="checkout-sumbit-btn-row">
            <button className="button">Submit</button>
          </div> */}

          <p className="checkout-field-top-heading">Select Payment Method</p>
          <div className="checkout-fields-row">
            <div className="checkout-field-single-box">
              {/* <label htmlFor="">Select Payment Method</label> */}
              <div className="checkBoxes">
                {paymentMethods.map((method, index) => (
                  <label htmlFor={method?.value} key={index} className="paymentMethod">
                    <input
                      type="radio"
                      id={method?.value}
                      value={method?.value}
                      checked={selectedPayementMethod == method?.value}
                      onChange={(e) => setselectedPayementMethod(e.target.value)}
                      name="paymentMethod"
                    />
                    <img src={method.image} alt={method.value} />
                    {method.value?.toUpperCase()?.replace(/-/g, ' ')}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <p className="checkout-field-top-heading" style={{ marginTop: '50px' }}>Order Items</p>
          <div className="cart-outer-container-left">
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

                          {e?.freeShipping && (
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
                          )}
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
                              {cartItem?.discounted_price && cartItem?.discounted_price > 0 ? (
                                <>
                                  <div style={{ textDecoration: 'line-through' }} className="cart-product-original-price">{formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}</div>
                                  <span style={{ margin: '0 10px' }}>-</span>
                                  <div className="cart-product-discounted-price">{formatPrice(cartItem?.discounted_price)}</div>
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
                                <div className="cart-product-discounted-price">{formatPrice(cartItem?.product?.product_type == 'variable' ? cartItem?.product_variation?.product_variation?.price : cartItem?.product?.sale_price > 0 ? cartItem?.product?.sale_price : cartItem?.product?.price)}</div>
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
                      {(e?.shopDiscount > 0 || e?.shopBonus > 0) && (
                        <div className="summary-card">
                          {/* Shop Total */}
                          <div className="summary-row header-container">
                            <span>Shop Subtotal</span>
                            <span className="amount">{formatPrice(e?.shopTotal)}</span>
                          </div>

                          {/* Discount Section */}
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

                          {/* Bonus Section */}
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

                          {/* Final Total */}
                          {e?.shopDiscount > 0 && (
                            <div className="summary-row total">
                              <span>Shop Total</span>
                              <span className="amount">{formatPrice(e?.shopTotal - e?.shopDiscount)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Level Progress Section */}
                      {e?.isEligibleForDiscount && e?.levelProgress && (
                        <div className="level-card">
                          <div className="level-header">
                            <div className="current-level">
                              <h4>{e?.levelProgress?.currentLevel ?
                                `Current Level : ${e?.levelProgress?.currentLevel?.level}` :
                                e?.nextTierMessageCheckout !== '' ? e?.nextTierMessageCheckout?.replace(/-/g, '') : 'Start Shopping to Reach Level 1'}</h4>
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
                  </div>
                );
              })
            )}

          </div>
        </div>
        <div className="checkout-outer-container-right">
          <div className="cart-order-summary-box">
            <h5>Order Summary</h5>
            {/* <div className="cart-order-summary-box-inner-row voucher">
              <p>Tjara Voucher</p>
              <span>No Applicable Voucher</span>
            </div> */}
            <div className="cart-order-summary-box-inner-row">
              <p>Items Total</p>
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
              <p>Discounts {cart?.currentDiscountInPercentage > 0 ? `(${cart?.currentDiscountInPercentage}%)` : null}</p>
              <span style={{ color: 'red' }}>{cart?.totalDiscounts > 0 ? `- ${formatPrice(cart?.totalDiscounts)}` : ("---")}</span>
            </div>
            {/* <div className="cart-order-summary-box-inner-row">
              <p>Tax</p>
              <span>{cart?.cartItems?.length == 0 ? "---" : `$0`}</span>
            </div> */}

            {/* {UserWallet?.balance ?
              (<div className="checkout-field-single-box">
                <label htmlFor="">Available Balance (${UserWallet?.balance})</label>
                {UserWallet?.balance <= 0 ? (
                  <p style={{ fontSize: '20px', color: 'var(--main-red-color)' }}>Your Wallet balance is ${UserWallet?.balance}.</p>
                ) : (
                  <input type="number" name="wallet" disabled={UserWallet?.balance <= 0} value={WalletCheckoutAmount} max={UserWallet?.balance} min={0} placeholder="$0" onChange={(e) => handleWalletCheckoutAmount(e.target.value)} />
                )}
              </div>) : null
            } */}

            {/* {UserWallet?.balance ? (
              <div className="cart-order-summary-box-inner-row">
                <p>Checkout Using Wallet ?</p>
                <input type="checkbox" name="wallet-checkout" onChange={} />
              </div>
            ) : null} */}

            {/* {UserWallet?.balance ? (
              <div className="cart-order-summary-box-inner-row">
                <p>Applied Wallet Payment</p>
                <span style={{ color: 'red' }}>{WalletCheckoutAmount <= 0 ? "---" : `$${WalletCheckoutAmount}`}</span>
              </div>
            ) : null} */}

            {UserWallet?.balance ? (
              <>
                <p className="shipping-free-heading">Available Wallet Balance (${UserWallet?.balance - WalletCheckoutAmount}) {/* {cart?.totalBonuses > 0 ? ` + ${formatPrice(cart?.totalBonuses)} Bonus` : null} */}</p>
                <div className="cart-order-summary-promo-code-row">
                  {UserWallet?.balance <= 0 ? (
                    <p style={{ fontSize: '20px', color: 'var(--main-red-color)' }}>Your Wallet balance is ${UserWallet?.balance}.</p>
                  ) : (
                    <fieldset>
                      <legend>Paid From Wallet</legend>
                      <input
                        type="number"
                        name="wallet"
                        disabled={UserWallet?.balance <= 0}
                        value={WalletCheckoutAmount}
                        max={UserWallet?.balance}
                        min={0}
                        placeholder="$0"
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(UserWallet?.balance, Number(e.target.value)));
                          handleWalletCheckoutAmount(value);
                        }}
                      />
                    </fieldset>
                  )}
                  {/* <button className="apply-coupon">Apply</button> */}
                </div>
              </>
            ) : null}

            <div className="cart-order-summary-box-total-row">
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Payment</p>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{CartGrandTotal > 0 ? formatPrice(CartGrandTotal) : ("---")}</span>
            </div>

            <hr style={{ margin: '20px 0' }} />

            {cart?.totalBonuses > 0 ?
              <div className="cart-order-summary-box-inner-row">
                <p style={{ color: 'green' }}>🎁 Bonus : {cart?.totalBonuses > 0 ? `${formatPrice(cart?.totalBonuses)} (Gets Added to your wallet)` : ("---")}</p>
              </div> : null
            }

            {cart?.cartItems?.length !== 0 && cart?.cartItems?.map((e, i) => {
              return (
                e?.isEligibleForDiscount && !e?.levelProgress?.currentLevel ? (
                  <>
                    <h4 style={{ color: 'red' }}>Notice From {e?.shop?.shop?.name} :</h4>
                    <h4 style={{ margin: '5px 0' }}>{e?.nextTierMessageCheckout === '' ? 'Start Shopping to Reach Level 1' : e?.nextTierMessageCheckout?.replace(/-/g, '')}</h4>
                  </>
                ) : null
              );
            })}

            {cart?.discountMessage ? (<p style={{ textAlign: 'left' }} className="shipping-free-heading">{cart?.discountMessage}</p>) : ('')}

            {/* <p className="vat" style={{ textAlign: 'left' }}>VAT included, where applicable</p> */}

            <button className="button proceed-to-checkout-btn" onClick={handleSubmitOrder}>{loading ? 'Wait...' : 'Place Order'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
