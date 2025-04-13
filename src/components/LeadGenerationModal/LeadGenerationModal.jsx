import { useEffect, useState } from "react";
import { X, Minimize, Maximize } from 'lucide-react';
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2';

import AUTH from "@client/authClient";
import POPUPS from "@client/popupsClient";
import { usePopup } from "@components/DataContext";
import { getOptimizedThumbnailUrl } from "../../helpers/helpers";

import LeadGenerationModalLayout from "./assets/LeadGenerationModal.png";
import tjaraLogo from "./assets/tjara-logo.png";

import "./LeadGenerationModal.css";
import 'react-phone-input-2/lib/style.css';

const STORAGE_KEY = 'leadGen_isMinimized';

function LeadGenerationModal() {
  const { leadGenerationPopup, setLeadGenerationPopup } = usePopup();
  const [popups, setPopups] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('leadGen_isMinimized') === 'true';
  });
  const [hasAutoDisplayed, setHasAutoDisplayed] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  /* -------------------------------------------------------------------------------------------- */
  /*                        Check If Popup Should Be Shown Based On Timing                        */
  /* -------------------------------------------------------------------------------------------- */
  const isPopupActive = (popup) => {
    if (!popup) return false;

    // Get current client time
    const now = new Date();

    try {
      // Helper function to safely parse dates
      const parseDate = (dateString) => {
        if (!dateString) return null;

        // First try parsing as ISO string
        let date = new Date(dateString);

        // If invalid, try adding time if it's just a date
        if (date.toString() === 'Invalid Date') {
          date = new Date(dateString + 'T00:00:00');
        }

        // If still invalid, try parsing as UTC
        if (date.toString() === 'Invalid Date') {
          date = new Date(dateString.replace(' ', 'T') + 'Z');
        }

        return date.toString() === 'Invalid Date' ? null : date;
      };

      // Parse start and end times
      const startTime = parseDate(popup.start_time);
      const endTime = parseDate(popup.end_time);

      // If no dates are set, consider it always active
      if (!startTime && !endTime) {
        return popup.is_active;
      }

      // Check if current time is within the range
      const isWithinTimeRange = (!startTime || now >= startTime) &&
        (!endTime || now <= endTime);

      return isWithinTimeRange && popup.is_active;

    } catch (error) {
      console.error('Error calculating popup timing:', error);
      console.error('Date strings:', {
        start: popup.start_time,
        end: popup.end_time,
        raw: popup
      });
      return false;
    }
  };

  const shouldShowOnCurrentPage = (popup) => {
    if (!popup?.page_location) return false;

    // Helper function to clean URLs and remove domain
    const cleanUrl = (url) => {
      try {
        // If it's already a path (starts with /), just clean it
        if (url.startsWith('/')) {
          return url.toLowerCase().trim();
        }

        // Try to create URL object
        const urlObj = new URL(url);
        return urlObj.pathname.toLowerCase().trim();
      } catch (e) {
        // If URL parsing fails, just clean and return the string
        return url.toLowerCase().trim()
          .replace(/^https?:\/\/[^\/]+/, '') // Remove domain if present
          .replace(/\/{2,}/g, '/'); // Replace multiple slashes with single
      }
    };

    // Get current path
    const currentPath = cleanUrl(window.location.pathname);

    // Split and clean the locations
    const popupLocations = popup.page_location.split(',').map(loc => cleanUrl(loc)).filter(Boolean); // Remove empty strings

    // Check for 'all' location
    if (popupLocations.includes('all')) {
      return true;
    }

    // Check if any location matches the current path
    return popupLocations.some(location => {
      // Check for exact match first
      if (currentPath === location) {
        return true;
      }

      // Handle cases where the location might be a base path
      if (location.endsWith('/')) {
        return currentPath.startsWith(location);
      } else {
        return currentPath.startsWith(location + '/') ||
          currentPath === location;
      }
    });
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                    Fetch Active Popups Data                                  */
  /* -------------------------------------------------------------------------------------------- */
  const fetchActivePopups = async () => {
    setIsLoading(true);

    try {
      const ApiParams = {
        filterByColumns: {
          filterJoin: 'AND',
          columns: [
            { column: 'is_active', value: 1, operator: '=' },
          ]
        },
      };

      const { data, error } = await POPUPS.getPopups(ApiParams);

      if (data?.popups) {
        const allPopups = data.popups.data || [];

        // Filter popups based on:
        // 1. Active timing
        // 2. Either "all" pages or specific page match
        const activePopups = allPopups.filter(popup =>
          isPopupActive(popup) && shouldShowOnCurrentPage(popup)
        );

        setPopups(activePopups);

        // Check if already minimized 
        const isCurrentlyMinimized = localStorage.getItem(STORAGE_KEY) === 'true';

        if (isCurrentlyMinimized) {
          // Just make sure the minimized popup is visible
          setIsMinimized(true);
          setLeadGenerationPopup(true);
        } else if (activePopups.length > 0 && !hasAutoDisplayed) {
          // Show first popup with appropriate delay
          const firstPopup = activePopups[0];
          if (firstPopup.display_delay > 0) {
            setTimeout(() => {
              setLeadGenerationPopup(true);
              setHasAutoDisplayed(true);
              setIsMinimized(false);
            }, firstPopup.display_delay * 1000);
          } else {
            setLeadGenerationPopup(true);
            setHasAutoDisplayed(true);
            setIsMinimized(false);
          }
        }
      }

      if (error) {
        console.error('Error fetching popups:', error);
      }
    } catch (error) {
      console.error('Error in fetchActivePopups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                   Handle Form Input Changes                                  */
  /* -------------------------------------------------------------------------------------------- */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /* ------------------------------------------------------------------------------------------- */
  /*                                    Handle Form Submission                                   */
  /* ------------------------------------------------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        toast.error(`${key.replace('_', ' ').toUpperCase()} is required!`);
        return;
      }
    }

    setLoading(true);

    try {
      const { data, error } = await AUTH.registerContact(formData);

      if (data) {
        toast.success(data.message);
        handleClosePopup();

        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: ""
        });
      }

      if (error) {
        toast.error(error.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                              Handle Popup Minimizing/Maximizing                              */
  /* -------------------------------------------------------------------------------------------- */
  const handleMinimizePopup = () => {
    setIsMinimized(true);
    // Save minimized state to localStorage
    localStorage.setItem('leadGen_isMinimized', 'true');
    // Keep popup open but in minimized state
    setLeadGenerationPopup(true);
  };

  const handleMaximizePopup = () => {
    setIsMinimized(false);
    // Update localStorage
    localStorage.setItem('leadGen_isMinimized', 'false');
    setLeadGenerationPopup(true);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                    Handle Popup Closing                                      */
  /* -------------------------------------------------------------------------------------------- */
  const handleClosePopup = () => {
    // Instead of closing, minimize the popup
    handleMinimizePopup();

    // Move to next popup after a brief delay (if there are more popups)
    setTimeout(() => {
      if (currentPopupIndex < popups.length - 1) {
        setCurrentPopupIndex(prev => prev + 1);
        // Show next popup
        setLeadGenerationPopup(true);
        setIsMinimized(false);
        // Update localStorage
        localStorage.setItem('leadGen_isMinimized', 'false');
      }
    }, 500);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                  Navigation Event Handling                                   */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    // Function to check URL changes
    const checkForUrlChanges = () => {
      const currentPathNow = window.location.pathname;
      if (currentPath !== currentPathNow) {
        setCurrentPath(currentPathNow);
      }
    };

    // Check for URL changes in these cases:
    // 1. History API usage (pushState, replaceState)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkForUrlChanges();
    };

    window.history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkForUrlChanges();
    };

    // 2. When back/forward buttons are used
    window.addEventListener('popstate', checkForUrlChanges);

    // 3. Regular interval check (fallback)
    const intervalId = setInterval(checkForUrlChanges, 500);

    // 4. When DOM changes (for framework-specific routing)
    const observer = new MutationObserver(checkForUrlChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Clean up
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', checkForUrlChanges);
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, [currentPath]);

  /* -------------------------------------------------------------------------------------------- */
  /*                              Fetch Popups When The Path Changes                              */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    fetchActivePopups();
  }, [currentPath]);

  /* -------------------------------------------------------------------------------------------- */
  /*                               Initial Setup On Component Mount                               */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    // Ensure minimized state is correctly applied on initial load
    const savedMinimizedState = localStorage.getItem(STORAGE_KEY);

    if (savedMinimizedState === 'true') {
      setIsMinimized(true);
      setLeadGenerationPopup(true);
    }

    fetchActivePopups();
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                           Check Current Popup and Rendering Logic                           */
  /* -------------------------------------------------------------------------------------------- */
  // Return null while loading
  if (isLoading) return null;

  // Return null if no popups are available
  if (!popups.length) return null;

  // Get current popup safely
  const currentPopup = popups[currentPopupIndex];

  // Return null if no current popup
  if (!currentPopup) return null;

  /* -------------------------------------------------------------------------------------------- */
  /*                                      Minimized Popup View                                    */
  /* -------------------------------------------------------------------------------------------- */
  if (isMinimized && leadGenerationPopup) {
    return (
      <div className="minimized-popup-container">
        <button
          className="maximize-popup-btn"
          onClick={handleMaximizePopup}
          aria-label="Maximize popup"
        >
          <img style={{ width: '50px', height: '50px' }} src={tjaraLogo} alt="" />
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------- */
  /*                                     Full Popup View                                          */
  /* -------------------------------------------------------------------------------------------- */
  return (
    <div className={`LeadGenerationModal ${leadGenerationPopup ? "active" : ""}`}>
      <div
        className="background-transparent-layer"
        onClick={handleMinimizePopup}
      />

      {currentPopup.type === "banner_popup" ? (
        <div className="banner-modal-container">
          <div className="popup-controls">
            <button type="button" className="minimize-btn" onClick={handleMinimizePopup}>
              <Minimize size={18} />
            </button>
            <button type="button" id="leadGenModalCross" onClick={handleClosePopup}>
              <X size={18} />
            </button>
          </div>
          <a href={currentPopup.link_url || '/'} className="popup-banner-link">
            <img src={getOptimizedThumbnailUrl(currentPopup.thumbnail) || LeadGenerationModalLayout} alt={currentPopup.name} />
          </a>
        </div>
      ) : (
        <div className="login-modal-container lead-capture-modal">
          <div className="popup-controls">
            <button type="button" className="minimize-btn" onClick={handleMinimizePopup}>
              <Minimize size={18} />
            </button>
            <button type="button" id="leadGenModalCross" onClick={handleClosePopup}>
              <X size={18} />
            </button>
          </div>
          <p className="sign-to-heading">{currentPopup.name}</p>
          {currentPopup.description && (
            <div dangerouslySetInnerHTML={{ __html: currentPopup.description }} />
          )}

          <div className="twin-fields" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div className="sign-to-field-box">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
            </div>

            <div className="sign-to-field-box">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
            </div>
          </div>

          <div className="sign-to-field-box">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
          </div>

          <div className="sign-to-field-box">
            <label htmlFor="phone">Phone</label>
            <PhoneInput country={'lb'} value={formData.phone} excludeCountries={['il']} onChange={(value) => handleInputChange('phone', value)} />
          </div>

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}

export default LeadGenerationModal;