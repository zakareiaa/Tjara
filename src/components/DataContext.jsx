import React, { createContext, useContext, useState, useEffect, startTransition, Suspense } from "react";
import { useLocation } from "react-router-dom";
import PRODUCTS from "@client/productsClient";
import CART from "@client/cartItemsClient.js";
import WISHLIST from "@client/wishlistClient.js";
import Loader from "@components/Loader";
import { useAuth } from "@contexts/Auth";

const DataContext = createContext();

export const usePopup = () => useContext(DataContext);

export const DataContextProvider = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [displayBgLayer, setDisplayBgLayer] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);
  const [leadGenerationPopup, setLeadGenerationPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);
  const [forgotPasswordPopup, setForgotPasswordPopup] = useState(false)
  const [resetPasswordPopup, setResetPasswordPopup] = useState(false)
  const [openSigninPopup, setopenSigninPopup] = useState(false);
  const [smsVerificationPopup, setSmsVerificationPopup] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);
  const [fetchWishlistItems, setFetchWishlistItems] = useState([]);
  const location = useLocation();
  const [currentHeaderColor, setcurrentHeaderColor] = useState(null);
  const [homeSubCategoriesTitle, sethomeSubCategoriesTitle] = useState("");
  const [homeSubCategoriesId, sethomeSubCategoriesId] = useState("");
  const [toggleMobileFooter, settoggleMobileFooter] = useState(false);
  const [ShowMegaMenu, setShowMegaMenu] = useState(false);
  const [headerMenuVideoPopup, setheaderMenuVideoPopup] = useState({
    display: false,
    video: ""
  });
  const { currentUser } = useAuth();
  const [isSearching, setIsSearching] = useState(false);

  /* --------------------------------------------- X -------------------------------------------- */

  const showPopup = async (product, toggle) => {
    setIsPopupVisible(toggle);
    setDisplayBgLayer(true);

    try {
      const { data, error } = await PRODUCTS.getProduct(product, {
        with: "thumbnail,gallery,video,rating"
      });
      if (data) {
        startTransition(() => {
          setProductDetails(data?.product);
        });
      }
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const hidePopup = () => {
    startTransition(() => {
      setIsPopupVisible(false);
      setProductDetails(null);
      // setDisplayBgLayer(false);
      setLoginPopup(false);
      setLeadGenerationPopup(false);
      setSignupPopup(false);
      setForgotPasswordPopup(false);
      setResetPasswordPopup(false);
      setSmsVerificationPopup(false);
      setShowMegaMenu(false);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const signInPopup = () => {
    startTransition(() => {
      hidePopup()
      setLoginPopup(true);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const megaMenuPopup = () => {
    startTransition(() => {
      hidePopup()
      setShowMegaMenu(!ShowMegaMenu);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const forgotPassPopup = () => {
    startTransition(() => {
      hidePopup()
      setForgotPasswordPopup(true);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const resetPassPopup = () => {
    startTransition(() => {
      hidePopup()
      setResetPasswordPopup(true);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const accountCreateBtn = () => {
    startTransition(() => {
      hidePopup()
      setSignupPopup(true);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const ShowSmsVerificationPopup = () => {
    startTransition(() => {
      hidePopup()
      setSmsVerificationPopup(true);
    });
  };




  /* --------------------------------------------- X -------------------------------------------- */

  const ReferrelProgramRegisterPopup = () => {
    startTransition(() => {
      hidePopup()
      accountCreateBtn(true);
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const openHeaderMenuVideoPopup = (video, sampleMp4) => {
    startTransition(() => {
      // If we're turning off the popup, just update the state
      // The cleanup will be handled by the useEffect in the video component
      setheaderMenuVideoPopup({
        display: video ? true : false, // Explicitly set to false when video is null
        video,
        sampleMp4
      });
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const cartsItemCount = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await CART.getCartItemCount({});
    if (data) setCartItemsCount(data.cartItemsCount);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchWishlistItemsCount = async () => {
    if (!currentUser || !currentUser?.authToken) { return; }

    const { data, error } = await WISHLIST.getWishlistItemsCount({});
    if (data) setWishlistItemsCount(data.wishlistCount);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    hidePopup();
  }, [location]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const initializeData = async () => {
      try {
        await cartsItemCount();
        await fetchWishlistItemsCount();
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <DataContext.Provider
      value={{
        isPopupVisible,
        productDetails,
        setProductDetails,
        showPopup,
        hidePopup,
        displayBgLayer,
        signInPopup,
        accountCreateBtn,
        loginPopup,
        setLoginPopup,
        leadGenerationPopup,
        setLeadGenerationPopup,
        forgotPasswordPopup,
        setForgotPasswordPopup,
        forgotPassPopup,
        resetPasswordPopup,
        setResetPasswordPopup,
        resetPassPopup,
        signupPopup,
        setSignupPopup,
        openSigninPopup,
        setopenSigninPopup,
        smsVerificationPopup,
        setSmsVerificationPopup,
        ShowSmsVerificationPopup,
        homeSubCategoriesId,
        sethomeSubCategoriesId,
        homeSubCategoriesTitle,
        sethomeSubCategoriesTitle,
        headerMenuVideoPopup,
        openHeaderMenuVideoPopup,
        // fetchPageHeader,
        // fetchPageFooter,
        cartItemsCount,
        setcurrentHeaderColor,
        currentHeaderColor,
        cartsItemCount,
        fetchWishlistItems,
        settoggleMobileFooter,
        toggleMobileFooter,
        setFetchWishlistItems,
        wishlistItemsCount,
        setWishlistItemsCount,
        fetchWishlistItemsCount,
        ReferrelProgramRegisterPopup,
        ShowMegaMenu,
        setShowMegaMenu,
        megaMenuPopup,
        isSearching,
        setIsSearching,
      }}
    >
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </DataContext.Provider>
  );
};
export default DataContext;
