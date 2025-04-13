import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const SECRET_KEY = 'toroJamoKeDaNazaraNashe'; // Replace with your own secret key

/* ---------------------------------------------------------------------------------------------- */
/*                                           Format Date                                          */
/* ---------------------------------------------------------------------------------------------- */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    throw new Error("Invalid time value");
  }
  const day = date.getDate().toString().padStart(2, '0'); // Add zero-padding
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/* ---------------------------------------------------------------------------------------------- */
/*                  Helper Function To Get Cookie Options Based On Current Domain                 */
/* ---------------------------------------------------------------------------------------------- */
const getCookieOptions = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isTjara = hostname.includes('tjara.com');
  const isLebanBuy = hostname.includes('lebanbuy.com');

  let domain;
  if (isLocalhost) {
    domain = 'localhost';
  } else if (isTjara) {
    domain = '.tjara.com';
  } else if (isLebanBuy) {
    domain = '.lebanbuy.com';
  } else {
    // Default fallback - you might want to handle this differently
    domain = hostname;
  }

  return {
    domain,
    path: '/',
    secure: !isLocalhost, // 'secure' should be false for localhost
    sameSite: 'strict'
  };
};

/* ---------------------------------------------------------------------------------------------- */
/*                     Helper Function To Split The Encrypted Data Into Chunks                    */
/* ---------------------------------------------------------------------------------------------- */
export const setChunkedCookies = (key, data, chunkSize = 3000) => {
  const numChunks = Math.ceil(data.length / chunkSize);
  const cookieOptions = getCookieOptions();

  for (let i = 0; i < numChunks; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    Cookies.set(`${key}_chunk_${i}`, chunk, cookieOptions);
  }
  Cookies.set(`${key}_chunk_count`, numChunks, cookieOptions);
};

/* ---------------------------------------------------------------------------------------------- */
/*                      Helper Function To Retrieve And Recombine The Chunks                      */
/* ---------------------------------------------------------------------------------------------- */
export const getChunkedCookies = (key) => {
  const numChunks = parseInt(Cookies.get(`${key}_chunk_count`), 10);
  if (!numChunks) return null;

  let data = '';
  for (let i = 0; i < numChunks; i++) {
    const chunk = Cookies.get(`${key}_chunk_${i}`);
    if (chunk) data += chunk;
  }
  return data;
};

/* ---------------------------------------------------------------------------------------------- */
/*                            Helper Function To Remove Chunked Cookies                           */
/* ---------------------------------------------------------------------------------------------- */
export const removeChunkedCookies = (key) => {
  const numChunks = parseInt(Cookies.get(`${key}_chunk_count`), 10);
  if (!numChunks) return;

  const cookieOptions = getCookieOptions();

  for (let i = 0; i < numChunks; i++) {
    Cookies.remove(`${key}_chunk_${i}`, cookieOptions);
  }
  Cookies.remove(`${key}_chunk_count`, cookieOptions);
};

/* ---------------------------------------------------------------------------------------------- */
/*                                           Expiry Date                                          */
/* ---------------------------------------------------------------------------------------------- */
export const expiryDate = (endTime) => {
  const currentDate = new Date();
  const endDate = new Date(endTime);
  const timeDiff = endDate - currentDate;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired";
};

/* ---------------------------------------------------------------------------------------------- */
/*                                           Is Expired                                           */
/* ---------------------------------------------------------------------------------------------- */
export const isExpired = (endTime) => {
  const currentDate = new Date();
  const endDate = new Date(endTime);
  const timeDiff = endDate - currentDate;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysRemaining <= 0 ? true : false;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                        Is Auction Ended                                        */
/* ---------------------------------------------------------------------------------------------- */
export function isAuctionEnded(auctionEndTime) {
  const auctionEndDate = new Date(auctionEndTime);
  const currentDate = new Date();
  return currentDate > auctionEndDate;
}

/* ---------------------------------------------------------------------------------------------- */
/*                                             Fix Url                                            */
/* ---------------------------------------------------------------------------------------------- */
export const fixUrl = (inputString) => {
  const regex = /(https?:\/\/\S+)(https?:\/\/\S+)/;
  return regex.test(inputString) ? inputString.replace(regex, '$2') : inputString;
}

/* ---------------------------------------------------------------------------------------------- */
/*                                 Helper Function For Video URLs                                 */
/* ---------------------------------------------------------------------------------------------- */
export const getOptimizedVideoUrl = (video) => {
  // First priority: Optimized CDN URL if available
  if (video?.media?.optimized_media_cdn_url &&
    video.media.optimized_media_cdn_url.trim() !== '') {
    return video.media.optimized_media_cdn_url;
  }

  // Second priority: CDN URL if available
  if (video?.media?.cdn_url &&
    video.media.cdn_url.trim() !== '') {
    return video.media.cdn_url;
  }

  // Third priority: Optimized media URL if available
  if (video?.media?.optimized_media_url &&
    video.media.optimized_media_url.trim() !== '') {
    return video.media.optimized_media_url;
  }

  // Fourth priority: Original URL
  if (video?.media?.url &&
    video.media.url.trim() !== '') {
    return video.media.url;
  }

  return null;
};

/* ---------------------------------------------------------------------------------------------- */
/*                               Helper Function For Thumbnail URLs                               */
/* ---------------------------------------------------------------------------------------------- */
export const getOptimizedThumbnailUrl = (thumbnail) => {
  // First priority: Optimized CDN URL if available
  if (thumbnail?.media?.optimized_media_cdn_url &&
    thumbnail.media.optimized_media_cdn_url.trim() !== '') {
    return thumbnail.media.optimized_media_cdn_url;
  }

  // Second priority: CDN URL if available
  if (thumbnail?.media?.cdn_url &&
    thumbnail.media.cdn_url.trim() !== '') {
    return thumbnail.media.cdn_url;
  }

  // Third priority: Optimized media URL if available
  if (thumbnail?.media?.optimized_media_url &&
    thumbnail.media.optimized_media_url.trim() !== '') {
    return thumbnail.media.optimized_media_url;
  }

  // Fourth priority: Original URL
  if (thumbnail?.media?.url &&
    thumbnail.media.url.trim() !== '') {
    return thumbnail.media.url;
  }

  return null;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                            Days Left                                           */
/* ---------------------------------------------------------------------------------------------- */
export const daysLeft = (endTime) => {
  const end = new Date(endTime);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 'Expired' : `${diffDays} days left`;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                          Encrypt Data                                          */
/* ---------------------------------------------------------------------------------------------- */
export const encryptData = (data) => {
  try {
    const encJson = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    const encData = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encJson)
    );
    return encData;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                                          Dycrypt Data                                          */
/* ---------------------------------------------------------------------------------------------- */
export const decryptData = (encryptedData) => {
  try {
    // Verify the base64 string
    if (!/^[A-Za-z0-9+/=]+$/.test(encryptedData)) {
      throw new Error("Invalid base64 string");
    }

    // Parse the base64 encoded data
    const base64Decoded = CryptoJS.enc.Base64.parse(encryptedData);

    // Convert base64 decoded data to a UTF-8 string
    const encJson = base64Decoded.toString(CryptoJS.enc.Utf8);

    // Decrypt the AES encrypted string
    const decrypted = CryptoJS.AES.decrypt(encJson, SECRET_KEY);

    // Convert decrypted data to UTF-8 string (which should be JSON)
    const decryptedJson = decrypted.toString(CryptoJS.enc.Utf8);

    // Parse the decrypted JSON string back to an object
    const decryptedData = JSON.parse(decryptedJson);

    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error.message);
    return null; // Handle the error appropriately
  }
};

/* ---------------------------------------------------------------------------------------------- */
/*                             Helper Function To Convert Hex To UTF-8                            */
/* ---------------------------------------------------------------------------------------------- */
function hexToUtf8(hexString) {
  try {
    return decodeURIComponent(
      hexString.replace(/\s+/g, '') // remove spaces
        .replace(/[0-9a-f]{2}/g, '%$&') // add % to each hex pair
    );
  } catch (e) {
    console.error('Error in hexToUtf8:', e);
    return null;
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                       Helper Function To Check If A String Is Valid JSON                       */
/* ---------------------------------------------------------------------------------------------- */
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------------------------------------------------------------------------------------------- */
/*                                          Render Stars                                          */
/* ---------------------------------------------------------------------------------------------- */
export const renderStars = (averageRating, RatedStar, EmptyStar) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= averageRating) {
      stars.push(<img key={i} src={RatedStar} alt="" />);
    } else {
      stars.push(<img key={i} src={EmptyStar} alt="" />);
    }
  }
  return stars;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                 Render Component When Viewed                                   */
/* ---------------------------------------------------------------------------------------------- */
export const ViewPortComponent = (component, setIsTrue) => {
  const handleScroll = () => {
    if (component.current) {
      const rect = component.current.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
        window.removeEventListener('scroll', handleScroll);
        setIsTrue(true);
      }
    }
  };
  window.addEventListener('scroll', () => { handleScroll() });
  handleScroll();
  return () => {
    window.removeEventListener('scroll', () => { handleScroll() });
  };
}

/* ---------------------------------------------------------------------------------------------- */
/*                                          What Time Ago                                         */
/* ---------------------------------------------------------------------------------------------- */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const interval in intervals) {
    const value = Math.floor(secondsAgo / intervals[interval]);
    if (value >= 1) {
      return value === 1 ? `1 ${interval} ago` : `${value} ${interval}s ago`;
    }
  }
  return "just now";
}

/* ---------------------------------------------------------------------------------------------- */
/*                                     Check If Color Is Dark                                     */
/* ---------------------------------------------------------------------------------------------- */
export const isDarkColor = (hex) => {
  // Remove the hash symbol if it exists
  if (!hex) return false
  hex = hex.replace('#', '');
  // Parse the r, g, b values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if luminance is less than 0.5 (dark color), otherwise false (light color)
  return luminance < 0.5;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                        Formate The Price                                       */
/* ---------------------------------------------------------------------------------------------- */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '---';
  const num = Number(price);
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                        Check If Is Video                                       */
/* ---------------------------------------------------------------------------------------------- */
export const isVideo = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'm4v'];
  const urlExtension = url.split('.').pop().toLowerCase();
  return videoExtensions.includes(urlExtension);
};

/* ---------------------------------------------------------------------------------------------- */
/*                                                X                                               */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Navigation helper functions for handling different navigation types 
 * based on device and environment
 */

/* ---------------------------------------------- X --------------------------------------------- */

/**
 * Determines if the current device should use in-app navigation instead of opening a new tab
 * Checks for mobile screens, iOS devices, and WebView environments
 * 
 * @returns {boolean} True if should use in-app navigation, false if can open new tab
 */
export const shouldUseInAppNavigation = () => {
  // Check if screen width is less than 600px
  const isMobile = window.innerWidth < 600;

  // Comprehensive iOS detection that works in WebViews
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    /CriOS|FxiOS|EdgiOS/.test(navigator.userAgent) ||
    window.webkit?.messageHandlers;

  // Check if we're in a WebView
  const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent) ||
    /TJARA/.test(navigator.userAgent); // Custom WebView identifier

  // console.log((!isMobile) || (isMobile && (isIOS || isWebView)));
  // Return true if any condition matches
  return (!isMobile) || (isMobile && (isIOS || isWebView));
};

/* ---------------------------------------------- X --------------------------------------------- */

/**
 * Navigates to the specified URL using the appropriate method based on device type
 * 
 * @param {string} url - The URL to navigate to
 * @param {function} navigateFunction - The navigation function from your router (e.g., React Router's navigate)
 */
export const createNavigationHandler = (url, navigateFunction) => {
  return (event) => {
    // Prevent default behavior if needed
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (shouldUseInAppNavigation()) {
      // console.log(shouldUseInAppNavigation());
      // Use in-app navigation for mobile, iOS, and WebViews
      navigateFunction(url);
    } else {
      // Open in new tab for other devices (desktop, Android)
      window.open(url, "_blank");
    }
  };
};