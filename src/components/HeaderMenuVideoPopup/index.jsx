import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaEye, FaShare, FaLink } from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import { toast } from 'react-toastify';

import { usePopup } from '../DataContext';
import { useAuth } from '@contexts/Auth';
import POSTS from "@client/postsClient";
import { fixUrl } from "../../helpers/helpers";
import logger from '../../utils/logger';

import Whatsapp from "../../assets/whatsapp.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import pinterest from "../../assets/pinterest.png";
import copyLink from "../../assets/copyLink.png";

import 'swiper/css';
import 'swiper/css/pagination';
import "./style.css";

const index = () => {
  const { headerMenuVideoPopup, setopenSigninPopup, openHeaderMenuVideoPopup } = usePopup();
  const { currentUser } = useAuth();
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const iframeRefs = useRef([]);
  const playerRefs = useRef({});
  const activeVideoRef = useRef(null);
  const navigate = useNavigate();
  const [videoArr, setVideoArr] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewedSlides, setViewedSlides] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoUnmuted, setIsVideoUnmuted] = useState(false);
  const [iframesMuted, setIframesMuted] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [likeState, setLikeState] = useState({});
  const [viewState, setViewState] = useState({});
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [activeVideoForShare, setActiveVideoForShare] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  // const [interactedVideos, setInteractedVideos] = useState(new Set());

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    // console.log("Attempting to load Player.js library");

    if (!window.playerjs) {
      // console.log("Player.js not found, loading script");
      // Initialize players for any existing iframes after library loads
      setTimeout(() => {
        // console.log("Initializing players after script load");
        initializePlayers();
      }, 500); // Added delay to ensure lib is fully ready
    }
  }, []);

  const initializePlayers = () => {
    // console.log("initializePlayers called - videoArr length:", videoArr.length);

    if (!window.playerjs) {
      console.error("Player.js library not available");
      return;
    }

    if (!videoArr.length) {
      // console.log("No videos to initialize");
      return;
    }

    videoArr.forEach((video, index) => {
      // console.log(`Checking video ${index} for streaming:`, video?.video?.media?.is_streaming);

      if (video?.video?.media?.is_streaming) {
        // console.log(`Video ${index} is streaming, checking iframe ref`);

        // Check if we have a valid iframe reference
        const iframeEl = iframeRefs.current[index]?.current;

        if (!iframeEl) {
          console.error(`No iframe reference for index ${index}`);
          return;
        }

        // console.log(`Iframe element found for index ${index}`);

        // Check if we already have a player for this index
        if (playerRefs.current[index]) {
          // console.log(`Player already exists for index ${index}, skipping initialization`);
          return;
        }

        try {
          // console.log(`Creating new Player.js instance for index ${index}`);

          // Create a new player instance
          playerRefs.current[index] = new window.playerjs.Player(iframeEl);

          // Set up event handlers
          playerRefs.current[index].on('ready', () => {
            // console.log(`Player ${index} ready event fired`);

            // Check if this is the current slide
            if (index === currentSlideIndex) {
              // console.log(`This is the current slide (${index}), attempting to play`);

              // Try playing the video with multiple attempts
              const attemptPlay = (attempts = 0) => {
                if (attempts > 3) {
                  console.error(`Failed to play video ${index} after multiple attempts`);
                  return;
                }

                // console.log(`Play attempt ${attempts + 1} for video ${index}`);

                try {
                  playerRefs.current[index].play();

                  // Schedule another attempt just to be sure
                  setTimeout(() => {
                    if (playerRefs.current[index] && index === currentSlideIndex) {
                      // console.log(`Additional play attempt for video ${index}`);
                      playerRefs.current[index].play();
                    }
                  }, 1000);
                } catch (error) {
                  console.error(`Error playing video ${index}:`, error);

                  // Try again after a delay
                  setTimeout(() => attemptPlay(attempts + 1), 500);
                }
              };

              // Start the attempts after a delay
              setTimeout(() => attemptPlay(), 500);
            } else {
              // console.log(`Not the current slide (${index}), pausing`);
              playerRefs.current[index].pause();
            }

            // Always ensure the video is muted (required for autoplay)
            // console.log(`Muting video ${index}`);
            playerRefs.current[index].mute();
          });

          // Error handler
          playerRefs.current[index].on('error', (error) => {
            console.error(`Player ${index} error:`, error);
          });

        } catch (error) {
          console.error(`Error initializing player ${index}:`, error);
        }
      } else {
        // console.log(`Video ${index} is not streaming, skipping Player.js initialization`);
      }
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const currentUrl = (videoSlug) => `${window.location.origin}?video=${videoSlug}`;
  const shareTitle = (videoName) => videoName || "Check this out!";

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl(activeVideoForShare?.slug))}`, '_blank');
    setShowSharePopup(false);
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl(activeVideoForShare?.slug))}`, '_blank');
    setShowSharePopup(false);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl(activeVideoForShare?.slug))}&text=${encodeURIComponent(shareTitle(activeVideoForShare?.name))}`, '_blank');
    setShowSharePopup(false);
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl(activeVideoForShare?.slug))}`, '_blank');
    setShowSharePopup(false);
  };

  const copyLinkToClipboard = () => {
    const link = currentUrl(activeVideoForShare?.slug);
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success('Copied to clipboard!');
        setShowSharePopup(false);
      }
    ).catch(err => console.error("Failed to copy link: ", err));
  };

  const handleShare = (video) => {
    const shareData = {
      title: video?.name,
      text: `Check out this video: ${video?.name}`,
      url: currentUrl(video?.slug),
    };

    setActiveVideoForShare(video);

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.error("Error sharing:", err));
    } else {
      setShowSharePopup(true);
    }
  };

  const handleCopyLink = (video) => {
    const link = currentUrl(video?.slug);
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success('Copied to clipboard!');
      }
    ).catch(err => console.error("Failed to copy link: ", err));
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const pauseAllMedia = () => {
    // console.log("pauseAllMedia called");

    // Pause regular videos
    videoRefs.current.forEach((ref, index) => {
      if (ref?.current && document.body.contains(ref.current)) {
        try {
          // console.log(`Pausing regular video ${index}`);
          ref.current.pause();
          ref.current.currentTime = 0;
        } catch (error) {
          // console.log(`Error pausing video ${index}:`, error);
        }
      }
    });

    // Pause all player.js instances
    Object.keys(playerRefs?.current)?.forEach(index => {
      try {
        const player = playerRefs?.current[index];
        if (player && typeof player?.pause === 'function') {
          // console.log(`Pausing Player.js instance ${index}`);
          player.pause();
        }
      } catch (error) {
        // console.log(`Error pausing player ${index}: Player might be detached`, error);
        // Remove reference to avoid future errors
        delete playerRefs.current[index];
      }
    });

    // console.log("Clearing activeVideoRef");
    activeVideoRef.current = null;
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const preloadVideo = (videoUrl) => {
    if (!videoUrl || preloadedVideos.has(videoUrl)) return;
    const video = document.createElement('video');
    video.src = videoUrl;
    video.preload = 'none';
    video.load();
    setPreloadedVideos(prev => new Set([...prev, videoUrl]));
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // Get iframe URL for a streaming video
  const getIframeUrl = (video) => {
    if (!video?.video?.media?.is_streaming) {
      // console.log("Not a streaming video, no iframe URL needed");
      return null;
    }

    // console.log("Getting iframe URL for streaming video:", video?.video?.media?.cdn_url);

    const match = video?.video?.media?.cdn_url?.match(/\/play\/(\d+)\/([\w-]+)/);
    if (!match) {
      // console.log("Failed to match URL pattern for:", video?.video?.media?.cdn_url);
      return null;
    }

    const libraryId = match[1];
    const videoId = match[2];

    // console.log(`Creating iframe URL with libraryId:${libraryId}, videoId:${videoId}`);
    // Set explicit parameters for best autoplay compatibility
    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&muted=true&controls=true&loop=true&preload=true`;
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // Play or pause media based on current slide
  const handleSlideChange = () => {
    // console.log("handleSlideChange called, videoArr length:", videoArr.length);

    if (!videoArr.length) {
      // console.log("No videos available, exiting handleSlideChange");
      return;
    }

    // console.log("Pausing all media");
    pauseAllMedia();

    const activeIndex = currentSlideIndex;
    // console.log(`Current slide index: ${activeIndex}`);

    // Handle iframe video
    if (videoArr[activeIndex]?.video?.media?.is_streaming) {
      // console.log(`Active video ${activeIndex} is streaming, using Player.js`);

      const player = playerRefs.current[activeIndex];

      if (player) {
        // console.log(`Player found for index ${activeIndex}, attempting to play`);

        // Try playing multiple times with increasing delays
        setTimeout(() => {
          try {
            // console.log(`First play attempt for video ${activeIndex}`);
            player.play();

            // Additional attempts
            [500, 1000, 2000].forEach((delay) => {
              setTimeout(() => {
                if (playerRefs.current[activeIndex] && currentSlideIndex === activeIndex) {
                  // console.log(`Additional play attempt after ${delay}ms for video ${activeIndex}`);
                  playerRefs.current[activeIndex].play();
                }
              }, delay);
            });
          } catch (error) {
            console.error(`Error playing video ${activeIndex}:`, error);
          }
        }, 200);
      } else if (window.playerjs && iframeRefs.current[activeIndex]?.current) {
        // Try to create a new player
        // console.log(`No player for index ${activeIndex}, creating one`);

        try {
          // console.log(`Initializing player for index ${activeIndex}`);
          playerRefs.current[activeIndex] = new window.playerjs.Player(iframeRefs.current[activeIndex].current);

          playerRefs.current[activeIndex].on('ready', () => {
            // console.log(`Newly created player ${activeIndex} ready, playing`);
            playerRefs.current[activeIndex].play();

            if (iframesMuted) {
              // console.log(`Muting player ${activeIndex}`);
              playerRefs.current[activeIndex].mute();
            }
          });
        } catch (error) {
          console.error(`Error creating player ${activeIndex}:`, error);
        }
      } else {
        console.error(`Cannot create player: playerjs=${!!window.playerjs}, iframe=${!!iframeRefs.current[activeIndex]?.current}`);
      }
      return;
    }

    // Handle regular video
    // console.log(`Active video ${activeIndex} is regular video, not streaming`);
    const newActiveVideo = videoRefs.current[activeIndex]?.current;

    if (newActiveVideo && document.body.contains(newActiveVideo)) {
      // console.log(`Video element found for index ${activeIndex}, attempting to play`);
      activeVideoRef.current = newActiveVideo;

      if (newActiveVideo.readyState >= 2) {
        // console.log(`Video ${activeIndex} is ready, playing immediately`);
        newActiveVideo.play().catch(error => {
          console.error(`Video play error for index ${activeIndex}:`, error);
        });
      } else {
        // console.log(`Video ${activeIndex} not ready, adding loadedmetadata listener`);
        newActiveVideo.addEventListener('loadedmetadata', () => {
          // console.log(`Video ${activeIndex} metadata loaded, playing`);
          newActiveVideo.play().catch(error => {
            console.error(`Video play error after metadata loaded for index ${activeIndex}:`, error);
          });
        }, { once: true });
      }
    } else {
      console.error(`No valid video element for index ${activeIndex}`);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // Handle video click for mute/unmute
  const handleVideoClick = (e) => {
    e.stopPropagation();
    // console.log("handleVideoClick called");

    // For regular videos
    if (e.target.tagName.toLowerCase() === 'video') {
      // console.log("Click on regular video element");
      const video = e.target;
      video.muted = !video.muted;
      setIsVideoUnmuted(!video.muted);
      // console.log("Video muted state:", video.muted);
    }
    // For iframe container - use a more direct approach
    else if (e.currentTarget.classList.contains('iframe-container')) {
      // console.log("Click on iframe container");

      // Get the index directly from the data attribute
      const index = parseInt(e.currentTarget.dataset.index, 10);
      // console.log(`Iframe index: ${index}`);

      if (isNaN(index)) {
        console.error("Invalid index from data attribute");
        return;
      }

      const player = playerRefs.current[index];

      if (!player) {
        console.error(`No player found for index ${index}`);
        return;
      }

      // Toggle the mute state
      const newMutedState = !iframesMuted;
      // console.log(`Toggling mute state to: ${newMutedState ? 'muted' : 'unmuted'}`);

      try {
        if (newMutedState) {
          // console.log(`Muting player ${index}`);
          player.mute();
        } else {
          // console.log(`Unmuting player ${index}`);
          player.unmute();
        }

        // Update state after action is completed
        setIframesMuted(newMutedState);
      } catch (error) {
        console.error(`Error toggling mute state for player ${index}:`, error);
      }
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const updatePostMeta = async (postId, key, value) => {
    if (!postId) return null;
    const { data, error } = await POSTS.updatePostMeta(postId, { key, value: value.toString() });
    if (error) {
      logger.error(`Error updating ${key}:`, error);
      return null;
    }
    return data;
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const updateVideoArrMeta = (videoId, key, value) => {
    setVideoArr(prevVideos =>
      prevVideos.map(item =>
        item.id === videoId ? { ...item, meta: { ...item.meta, [key]: value.toString() } } : item
      )
    );
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const handleBeforeUnload = () => {
      const viewedVideos = JSON.parse(sessionStorage.getItem("viewedVideos")) || [];
      viewedVideos.forEach(videoId => {
        localStorage.removeItem(videoId);
      });
      sessionStorage.removeItem("viewedVideos");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Clean up all player instances with error handling
      Object.keys(playerRefs.current).forEach(index => {
        try {
          const player = playerRefs.current[index];
          if (player && typeof player?.destroy === 'function') {
            player?.destroy();
          }
        } catch (error) {
          // console.log(`Error destroying player ${index}: Player might be detached`);
        }
        // Always delete the reference regardless of errors
        delete playerRefs.current[index];
      });
      playerRefs.current = {};
    };
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    // This effect runs when the popup display state changes
    if (!headerMenuVideoPopup.display) {
      // The popup is being closed, clean up
      try {
        // First safely pause all media
        pauseAllMedia();

        // Then properly clean up player references
        Object.keys(playerRefs.current).forEach(index => {
          try {
            const player = playerRefs.current[index];
            if (player && typeof player?.destroy === 'function') {
              player?.destroy();
            }
          } catch (error) {
            // console.log(`Error destroying player ${index}`);
          }
          // Always clean up references
          delete playerRefs.current[index];
        });

        // Reset state
        playerRefs.current = {};
        activeVideoRef.current = null;
      } catch (error) {
        // console.log("Error during player cleanup:", error);
      }
    }
  }, [headerMenuVideoPopup.display]); // Only run when display state changes

  /* --------------------------------------------- X -------------------------------------------- */

  const ViewStory = async (video) => {
    if (!video || !video.id) return false;
    const localstoragevideo = JSON.parse(localStorage.getItem(video.id));

    // Get current views from our state or from storage/meta
    const currentViewState = viewState[video.id] || {};
    let views;

    if (localstoragevideo) {
      views = parseInt(localstoragevideo?.views) || 0;
    } else {
      views = currentViewState.views !== undefined ? currentViewState.views : (parseInt(video?.meta?.views) || 0);
    }

    const newViews = views + 1;
    const data = await updatePostMeta(video.id, 'views', newViews);

    if (data) {
      const storedViews = { views: data.value }
      localStorage.setItem(data?.post_id, JSON.stringify(storedViews));

      // Instead of updating videoArr, update our separate viewState
      setViewState(prev => ({
        ...prev,
        [video.id]: { views: newViews }
      }));

      const viewedVideos = JSON.parse(sessionStorage.getItem("viewedVideos")) || [];
      if (!viewedVideos.includes(video.id)) {
        viewedVideos.push(video.id);
        sessionStorage.setItem("viewedVideos", JSON.stringify(viewedVideos));
      }
      return true;
    }
    return false;
  };


  /* --------------------------------------------- X -------------------------------------------- */

  const Likevideo = async (e, video) => {
    e.stopPropagation(); // Prevent event from bubbling up to video
    if (!video || !video.id) return;

    const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || {};
    const hasLiked = likedVideos[video.id] === true;

    // Get the current likes either from our state or from the video meta
    const currentLikeState = likeState[video.id] || {};
    let likes = currentLikeState.likes !== undefined ? currentLikeState.likes : (parseInt(video?.meta?.likes) || 0);

    if (hasLiked) {
      const newLikes = Math.max(0, likes - 1); // Ensure we don't go below 0
      const data = await updatePostMeta(video.id, 'likes', newLikes);
      if (data) {
        delete likedVideos[video.id];
        localStorage.setItem("likedVideos", JSON.stringify(likedVideos));

        // Only update likeState, not videoArr
        setLikeState(prev => ({ ...prev, [video.id]: { likes: newLikes, isLiked: false } }));
      }
    } else {
      const newLikes = likes + 1;
      const data = await updatePostMeta(video.id, 'likes', newLikes);
      if (data) {
        likedVideos[video.id] = true;
        localStorage.setItem("likedVideos", JSON.stringify(likedVideos));

        // Only update likeState, not videoArr
        setLikeState(prev => ({ ...prev, [video.id]: { likes: newLikes, isLiked: true } }));
      } else {
        setopenSigninPopup(true);
      }
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const setupSwiperEventHandlers = () => {
    if (!swiperRef.current) return;
    swiperRef.current.off('slideChangeTransitionStart');
    swiperRef.current.off('slideChangeTransitionEnd');

    swiperRef.current.on('slideChangeTransitionStart', () => {
      setIsTransitioning(true);
      pauseAllMedia();

      const newIndex = swiperRef.current.activeIndex;
      const currentVideo = videoArr[newIndex];
      setCurrentSlideIndex(newIndex);

      if (currentVideo && !viewedSlides.has(currentVideo.id)) {
        setViewedSlides(prev => new Set([...prev, currentVideo.id]));
      }

      ViewStory(currentVideo);
    });

    swiperRef.current.on('slideChangeTransitionEnd', () => {
      setIsTransitioning(false);
      handleSlideChange();
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (headerMenuVideoPopup?.display && headerMenuVideoPopup?.video) {
      const selectedVideoWrapper = headerMenuVideoPopup.video;
      const selectedVideo = selectedVideoWrapper.video;
      const allVideos = selectedVideoWrapper.allVideos;
      if (allVideos && Array.isArray(allVideos) && allVideos.length > 0) {
        const startIndex = allVideos.findIndex(v => v.id === selectedVideo.id) || 0;

        // Get liked videos from localStorage
        const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || {};

        // Add isLiked property to each video
        const videosWithLikeState = allVideos.map(video => ({ ...video, isLiked: likedVideos[video.id] === true }));

        setVideoArr(videosWithLikeState);
        setCurrentSlideIndex(startIndex >= 0 ? startIndex : 0);
        setLoadingStates(allVideos.reduce((acc, v) => ({ ...acc, [v.id]: true }), {}));

        const initialVideo = [
          fixUrl(selectedVideo?.video?.media?.url),
          fixUrl(allVideos[(startIndex + 1) % allVideos.length]?.video?.media?.url)
        ].filter(Boolean);

        initialVideo.forEach(preloadVideo);

        if (selectedVideo.id) {
          ViewStory(selectedVideo);
          setViewedSlides(new Set([selectedVideo.id]));
        }

        const initialLikeState = {};
        const initialViewState = {};

        videosWithLikeState.forEach(video => {
          // Set up initial like state
          initialLikeState[video.id] = {
            likes: parseInt(video?.meta?.likes) || 0,
            isLiked: video.isLiked || false
          };

          // Set up initial view state
          initialViewState[video.id] = {
            views: parseInt(video?.meta?.views) || 0
          };
        });

        setLikeState(initialLikeState);
        setViewState(initialViewState);
      } else {
        logger.error("No valid video array provided in headerMenuVideoPopup", { selectedVideo, allVideos });
        setVideoArr([]);
      }
    }

    return () => pauseAllMedia();
  }, [headerMenuVideoPopup?.display]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (swiperRef.current && videoArr.length > 0) {
      setupSwiperEventHandlers();
      if (swiperRef.current.activeIndex !== currentSlideIndex) {
        swiperRef.current.slideTo(currentSlideIndex, 0);
      }
      handleSlideChange();
    }
  }, [swiperRef.current, videoArr.length, currentSlideIndex]);

  /* --------------------------------------------- X -------------------------------------------- */

  // When current slide index changes, handle media playback
  useEffect(() => {
    if (!isTransitioning && videoArr.length > 0) {
      handleSlideChange();
    }
  }, [currentSlideIndex, isTransitioning]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (headerMenuVideoPopup?.video && !headerMenuVideoPopup?.video?.video?.video?.media?.is_streaming) {
      const videoElement = document.createElement("video");
      const videoUrl = headerMenuVideoPopup?.video?.video?.video?.media?.url || "";
      const fallbackUrl = headerMenuVideoPopup?.video?.video?.video?.media?.local_url || "";
      videoElement.src = videoUrl; // Get the video URL
      videoElement.preload = "auto";
      videoElement.muted = true;
      setVideoReady(true);

      videoElement.onerror = (error) => {
        console.error("Error loading video", error);
        videoElement.src = fallbackUrl;
      };
    }
    else if (headerMenuVideoPopup?.video?.video?.video?.media?.is_streaming == true) {
      setVideoReady(true);
    }
  }, [headerMenuVideoPopup?.video]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  const renderVideoSlide = (video, index) => {
    if (!videoRefs.current[index]) {
      videoRefs.current[index] = React.createRef();
    }

    // Add iframe refs
    if (!iframeRefs.current[index]) {
      iframeRefs.current[index] = React.createRef();
    }

    const videoUrl = (() => {
      const cdnUrl = fixUrl(video?.video?.media?.cdn_url);
      const fallbackUrl = fixUrl(video?.video?.media?.local_url);
      const isBunnyCdn = cdnUrl?.includes("bunnycdn.com");

      if (isBunnyCdn) {
        return video?.video?.media?.cdn_url;
      }

      return video?.video?.media?.url || fallbackUrl;
    })();

    const fallbackUrl = fixUrl(video?.video?.media?.local_url);
    const thumbnailUrl = fixUrl(video?.thumbnail?.media?.url);

    const isActive = index === currentSlideIndex;
    const isLoading = loadingStates[video.id];

    // Generate iframe URL for streaming videos
    const iframeUrl = getIframeUrl(video);
    const isStreaming = video?.video?.media?.is_streaming;

    // Check if this video is already liked by the user
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || {};
    const videoLikeState = likeState[video.id] || {};
    const isLiked = videoLikeState.isLiked !== undefined ? videoLikeState.isLiked : (video.isLiked || likedVideos[video.id] === true);
    const likeCount = videoLikeState.likes !== undefined ? videoLikeState.likes : (video?.meta?.likes || 0);

    // Get views from viewState or localStorage
    const localStorageViews = JSON.parse(localStorage.getItem(video?.id))?.views;
    const videoViewState = viewState[video.id] || {};
    const viewCount = localStorageViews || videoViewState.views !== undefined ? videoViewState.views : (video?.meta?.views || 0);

    return (
      <SwiperSlide key={video.id || index} className="videoContainer">
        {(!isActive || isLoading) && thumbnailUrl && !isStreaming && (
          <img
            src={thumbnailUrl}
            alt={video?.name || "Video thumbnail"}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
          />
        )}

        {isLoading && !isStreaming && (
          <div className="loading-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', }} />
          </div>
        )}

        {isStreaming ? (
          <div
            className="iframe-container"
            data-index={index}
            onClick={handleVideoClick}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {/* Show thumbnail when slide is not active */}
            {!isActive && thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={video?.name || "Video thumbnail"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  zIndex: 4
                }}
              />
            )}

            {/* Always include the iframe for Player.js to work with */}
            <iframe
              id={`iframe-player-${index}`}
              ref={iframeRefs.current[index]}
              src={iframeUrl}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
              frameBorder="0"
              style={{
                position: 'relative',
                zIndex: isActive ? 5 : 1 // Lower z-index when not active
              }}
            />

            {isStreaming && (
              <div
                className="manual-play-overlay"
                onClick={(e) => {
                  e.stopPropagation();
                  // console.log(`Manual play button clicked for video ${index}`);
                  try {
                    const player = playerRefs.current[index];
                    if (player) {
                      // console.log(`Manually playing video ${index}`);
                      player.play();

                      // Try to unmute if needed
                      if (!iframesMuted) {
                        // console.log(`Unmuting video ${index}`);
                        player.unmute();
                      }
                    } else {
                      console.error(`No player found for index ${index}`);
                    }
                  } catch (error) {
                    console.error(`Error manually playing video ${index}:`, error);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 20,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Play Video
              </div>
            )}

            {/* Mute indicator for iframes */}
            <div
              className="mute-toggle-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent other handlers from firing
                // console.log("Mute toggle button clicked");

                const index = parseInt(e.currentTarget.parentElement.dataset.index, 10);
                // console.log(`Button for player ${index}`);

                if (isNaN(index)) {
                  console.error("Invalid index for mute toggle button");
                  return;
                }

                const player = playerRefs.current[index];

                if (!player) {
                  console.error(`No player found for index ${index}`);
                  return;
                }

                // Toggle mute state
                const newMutedState = !iframesMuted;

                try {
                  if (newMutedState) {
                    // console.log(`Explicit mute for player ${index}`);
                    player.mute();
                  } else {
                    // console.log(`Explicit unmute for player ${index}`);
                    player.unmute();
                  }

                  // Update state after successful action
                  setIframesMuted(newMutedState);
                } catch (error) {
                  console.error(`Error in mute toggle button for player ${index}:`, error);
                }
              }}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 30,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px 15px',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {iframesMuted ? (
                // Muted icon - show unmute symbol
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              ) : (
                // Unmuted icon - show volume symbol
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              )}
            </div>

          </div>
        ) : (
          <video
            ref={videoRefs.current[index]}
            className="custom-video-player"
            data-no-player="true"
            src={isActive ? videoUrl : undefined}
            playsInline
            muted={true}
            preload={isActive ? "auto" : "none"}
            loop
            onClick={handleVideoClick}
            onCanPlay={() => {
              setLoadingStates(prev => ({ ...prev, [video.id]: false }));
              if (isActive && activeVideoRef.current === videoRefs.current[index].current) {
                videoRefs.current[index].current.play().catch(error => logger.error("Video play error:", error));
              }
            }}
            onError={(e) => {
              console.error("Error loading video, switching to fallback URL");
              if (fallbackUrl) {
                e.target.src = fallbackUrl;
                e.target.play().catch(err => console.error("Fallback video play error:", err));
              }
            }}
            onPlay={(e) => {
              if (activeVideoRef.current !== e.target) {
                e.target.pause();
              }
            }}
            style={{
              display: isLoading && !isActive ? 'none' : 'block',
            }}
          />
        )}

        {!isStreaming && (
          <div className="videoContainer">
            <div
              className="unmute-indicator"
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                zIndex: 10,
                display: currentSlideIndex === index ? 'block' : 'none',
              }}
            >
              {activeVideoRef.current?.muted && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '25px', height: '25px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="buttons">
          <button className={`like ${isLiked ? 'liked' : ''}`} onClick={(e) => Likevideo(e, video)} >
            <p>{likeCount}</p>
          </button>
          <button>
            <FaEye />
            <p className="views-count">{viewCount}</p>
          </button>

          <button >
            <FaShare onClick={() => handleShare(video)} />
          </button>

          <button>
            <FaLink onClick={() => handleCopyLink(video)} />
          </button>
        </div>
        <div className="videoDetails">
          <img onClick={() => navigate(`/store/${video?.shop?.shop?.slug}`)} src={fixUrl(video?.shop?.shop?.thumbnail?.media?.optimized_media_cdn_url)} alt="" />
          <Link to={video?.meta?.link} className="text">
            <h2>{video?.name?.slice(0, 20)}...</h2>
            <p>{video?.description?.slice(0, 30)}...</p>
          </Link>
        </div>
      </SwiperSlide>
    );
  };

  return (
    <>
      {headerMenuVideoPopup.display && videoReady && (
        <div className="headerMenuvideoPopup">
          <div className="bg" onClick={() => openHeaderMenuVideoPopup(null)} />

          {/* Up navigation button */}
          <button
            className="nav-button prev-button"
            onClick={() => swiperRef.current?.slidePrev()}
            style={{
              position: 'absolute',
              top: '15vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Swiper
            style={{
              height: '90vh',
              borderRadius: '20px',
              top: '5vh',
              border: '5px solid #ccc',
            }}
            direction="vertical"
            slidesPerView={1}
            initialSlide={currentSlideIndex}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="mySwiper"
          >
            {videoArr.map((video, index) => renderVideoSlide(video, index))}
          </Swiper>

          {/* Down navigation button */}
          <button
            className="nav-button next-button"
            onClick={() => swiperRef.current?.slideNext()}
            style={{
              position: 'absolute',
              bottom: '15vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Share Popup */}
          {showSharePopup && (
            <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
              <div className="share-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="share-popup-header">
                  <h3>Share This Video</h3>
                  <button className="close-button" onClick={() => setShowSharePopup(false)}>×</button>
                </div>
                <div className="share-buttons-grid">
                  <button onClick={shareToWhatsApp} className="share-button whatsapp">
                    <div className="share-icon">
                      <img src={Whatsapp} alt="" />
                    </div>
                    <span>WhatsApp</span>
                  </button>
                  <button onClick={shareToFacebook} className="share-button facebook">
                    <div className="share-icon">
                      <img src={facebook} alt="" />
                    </div>
                    <span>Facebook</span>
                  </button>
                  <button onClick={shareToTwitter} className="share-button twitter">
                    <div className="share-icon">
                      <img src={twitter} alt="" />
                    </div>
                    <span>Twitter</span>
                  </button>
                  <button onClick={shareToLinkedIn} className="share-button linkedin">
                    <div className="share-icon">
                      <img src={linkedin} alt="" />
                    </div>
                    <span>LinkedIn</span>
                  </button>
                  <button onClick={copyLinkToClipboard} className="share-button copylink">
                    <div className="share-icon">
                      <img src={copyLink} alt="" />
                    </div>
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Share Popup Styles */
        .headerMenuvideoPopup .share-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .headerMenuvideoPopup .share-popup-content {
          background-color: white;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .headerMenuvideoPopup .share-popup-content .share-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .headerMenuvideoPopup .share-popup-content .share-popup-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }

        .headerMenuvideoPopup .share-popup-content .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .headerMenuvideoPopup .share-popup-content .close-button:hover {
          background-color: #f5f5f5;
          color: #333;
        }

        .headerMenuvideoPopup .share-popup-content .share-buttons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        @media (min-width: 768px) {
          .share-buttons-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .headerMenuvideoPopup .share-popup-content .share-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px 10px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .headerMenuvideoPopup .share-popup-content .share-button span {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .headerMenuvideoPopup .share-popup-content .share-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .headerMenuvideoPopup .share-popup-content .whatsapp {
          background-color: #25D366;
        }

        .headerMenuvideoPopup .share-popup-content .facebook {
          background-color: #1877F2;
        }

        .headerMenuvideoPopup .share-popup-content .twitter {
          background-color: #1DA1F2;
        }

        .headerMenuvideoPopup .share-popup-content .linkedin {
          background-color: #0A66C2;
        }

        .headerMenuvideoPopup .share-popup-content .copylink {
          background-color: #6c757d;
        }

        .headerMenuvideoPopup .share-popup-content .share-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          filter: brightness(1.05);
        }

        .headerMenuvideoPopup .share-popup-content .share-button:active {
          transform: translateY(-1px);
        }

        /* Spinner animation for loading states */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Navigation button hover effects */
        .nav-button:hover {
          background: rgba(0,0,0,0.7) !important;
          transform: translateX(-50%) scale(1.1) !important;
        }
        
        .nav-button {
          transition: all 0.2s ease !important;
        }
        
        .nav-button:active {
          transform: translateX(-50%) scale(0.95) !important;
        }
      `}</style>
    </>
  );
};

export default index;