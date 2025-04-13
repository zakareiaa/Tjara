import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { usePopup } from "../DataContext";
import { getOptimizedVideoUrl } from "../../helpers/helpers";
import POSTS from "@client/postsClient";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import "./HeaderMenuSlider.css";

import { useLocation, useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

// Intersection Observer options
const observerOptions = {
  root: null,
  rootMargin: '100px',
  threshold: 0.1
};

function HeaderMenuSlider({ className = '', ids = null, limit = null }) {
  const productsRef = useRef(null);
  const [videoSlides, setVideoSlides] = useState({
    data: Array(10).fill({})
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const { openHeaderMenuVideoPopup } = usePopup();
  const { globalSettings } = useheaderFooter();
  const autoplayTimerRef = useRef(null);
  const [preloadedVideo, setPreLoadedVideos] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const cacheKey = 'headerMenuVideoSlides';
  const location = useLocation();
  const navigate = useNavigate();

  /* --------------------------------------------- X -------------------------------------------- */

  // Lazy load videos only when they're about to be needed
  const preloadVideo = (videoUrl) => {
    if (!videoUrl || preloadedVideo.has(videoUrl) || !isVisible) return;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.preload = 'auto';
    video.load();
    setPreLoadedVideos(prev => new Set([...prev, videoUrl]));
  }

  /* --------------------------------------------- X -------------------------------------------- */

  // Only preload videos when component is visible and data is loaded
  useEffect(() => {
    if (isVisible && dataLoaded && videoSlides.data?.length) {
      // Only preload the active video and the next one
      const activeVideo = videoSlides.data[activeIndex];
      const nextIndex = (activeIndex + 1) % videoSlides.data.length;
      const nextVideo = videoSlides.data[nextIndex];

      const activeVideoUrl = getOptimizedVideoUrl(activeVideo?.video);
      const nextVideoUrl = getOptimizedVideoUrl(nextVideo?.video);

      if (activeVideoUrl) preloadVideo(activeVideoUrl);
      if (nextVideoUrl) preloadVideo(nextVideoUrl);
    }
  }, [isVisible, dataLoaded, activeIndex, videoSlides]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const videoSlug = params.get("video");

    if (videoSlug && dataLoaded && videoSlides.data?.length) {
      const video = videoSlides.data.find(v => v.slug === videoSlug);
      if (video) {
        openHeaderMenuVideoPopup({ video, allVideos: videoSlides.data });
        params.delete("video");
        navigate({ search: params.toString() }, { replace: true });
      }
    }
  }, [location.search, videoSlides.data, dataLoaded]);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchShopStories = async () => {
    if (!isVisible) return; // Don't fetch data until component is visible

    const storiesSortedIDs = globalSettings?.header_stories_sort_order?.split(',');

    if (!storiesSortedIDs) return;

    // const cacheData = localStorage.getItem(cacheKey);

    // if (cacheData) {
    //   const parsedData = JSON.parse(cacheData);
    //   if (parsedData?.data?.length > 0 && parsedData.sortOrder === globalSettings?.header_stories_sort_order) {
    //     setVideoSlides(parsedData);
    //     setDataLoaded(true);
    //     return;
    //   }
    // }

    const ApiParams = {
      orderBy: "ids",
      order: storiesSortedIDs,
      with: 'video',
      filterJoin: "AND",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'post_type',
            value: 'shop_stories',
            operator: '=',
          },
          {
            column: 'status',
            value: 'active',
            operator: '=',
          }
        ]
      },
      per_page: 20,
    };

    try {
      const { data, error } = await POSTS.getPosts(ApiParams);

      if (data) {
        const postsArray = Array.isArray(data.posts?.data) ? data.posts.data : [];
        const newVideoSlides = { data: postsArray, sortOrder: globalSettings?.header_stories_sort_order };
        setVideoSlides(newVideoSlides);
        localStorage.setItem(cacheKey, JSON.stringify(newVideoSlides));
        setDataLoaded(true);
        // console.log(data.posts.data);
      }

      if (error) {
        console.error("Error fetching shop stories:", error);
        setVideoSlides({ data: [] });
        setDataLoaded(true);
      }
    } catch (err) {
      console.error("Exception fetching shop stories:", err);
      setVideoSlides({ data: [] });
      setDataLoaded(true);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const startAutoplayTimer = (remainingTime = 3000) => {
    // Don't start autoplay if not visible
    if (!isVisible) return;

    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    if (!videoSlides.data || videoSlides.data.length === 0 || !videoSlides.data[0]?.id) {
      return;
    }

    autoplayTimerRef.current = setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % videoSlides.data.length);
    }, remainingTime);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // Set up intersection observer to detect when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          // Pause videos and clear timers when not visible
          if (autoplayTimerRef.current) {
            clearTimeout(autoplayTimerRef.current);
          }
        }
      });
    }, observerOptions);

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => {
      if (productsRef.current) {
        observer.unobserve(productsRef.current);
      }
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  // Only fetch data when component is visible
  useEffect(() => {
    if (isVisible && !dataLoaded) {
      fetchShopStories();
    }
  }, [isVisible, globalSettings, dataLoaded]);

  /* --------------------------------------------- X -------------------------------------------- */

  // Start autoplay only when visible and data is loaded
  useEffect(() => {
    if (isVisible && dataLoaded && videoSlides.data && videoSlides.data.length > 0 && videoSlides.data[0]?.id) {
      setActiveIndex(0);
      startAutoplayTimer();
    }
  }, [isVisible, dataLoaded, videoSlides]);

  /* -------------------------------------------- X ------------------------------------------- */

  const swiperProps = {
    freeMode: true,
    slidesPerView: "auto",
    modules: [FreeMode],
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const VideoPlayer = ({ video, index }) => {
    const videoRef = useRef(null);
    const isActive = index === activeIndex;
    const [showVideo, setShowVideo] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoUrl = getOptimizedVideoUrl(video?.video);
    const thumbnailUrl = video?.thumbnail?.media?.url;
    const containerRef = useRef(null);

    /* -------------------------------------------- X ------------------------------------------- */

    // Only load videos when they become active or on hover
    useEffect(() => {
      if (!videoRef.current || !video?.id || !isVisible) return;

      const handleActiveVideo = async () => {
        if (isActive) {
          setShowVideo(true);

          if (!videoLoaded && videoUrl) {
            setVideoLoaded(true);
          }

          try {
            if (videoRef.current.readyState >= 2) {
              videoRef.current.currentTime = 0;
              videoRef.current.muted = true;
              await videoRef.current.play();
              startAutoplayTimer();
            } else {
              // Video not ready yet, use event listener
              const canPlayHandler = async () => {
                videoRef.current.currentTime = 0;
                videoRef.current.muted = true;
                await videoRef.current.play();
                startAutoplayTimer();
                videoRef.current.removeEventListener('canplay', canPlayHandler);
              };
              videoRef.current.addEventListener('canplay', canPlayHandler);
            }
          } catch (err) {
            startAutoplayTimer();
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          setShowVideo(false);
        }
      };

      if (isActive) {
        handleActiveVideo();
      }
    }, [isActive, video, isVisible]);

    /* -------------------------------------------- X ------------------------------------------- */

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !isVisible) return;

      const onMouseEnter = () => {
        setShowVideo(true);

        if (!videoLoaded && videoUrl) {
          setVideoLoaded(true);
        }

        if (videoRef.current && video?.id) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(err => {
            // Silent catch
          });

          if (autoplayTimerRef.current) {
            clearTimeout(autoplayTimerRef.current);
          }
        }
      };

      /* ------------------------------------------- X ------------------------------------------ */

      const onMouseLeave = () => {
        setShowVideo(false);

        if (videoRef.current) {
          videoRef.current.pause();
        }

        if (isActive && videoRef.current && isVisible) {
          const elapsedTime = videoRef.current.currentTime || 0;
          const remainingTime = Math.max(3000 - (elapsedTime * 1000), 0);
          startAutoplayTimer(remainingTime);
        }
      };

      container.addEventListener('mouseenter', onMouseEnter);
      container.addEventListener('mouseleave', onMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', onMouseEnter);
        container.removeEventListener('mouseleave', onMouseLeave);
      };
    }, [video, isActive, isVisible, videoLoaded]);

    /* -------------------------------------------- X ------------------------------------------- */

    const handleClick = () => {
      if (video?.id && videoSlides.data?.length) {
        const nextIndex = (index + 1) % videoSlides.data.length;
        const nextVideoUrl = getOptimizedVideoUrl(videoSlides.data[nextIndex]?.video);
        if (nextVideoUrl) preloadVideo(nextVideoUrl);
        openHeaderMenuVideoPopup({ video, allVideos: videoSlides.data });
      } else {
        console.warn("Cannot open popup: videoSlides.data is not ready", { video, videoSlides });
      }
    };

    const storyVideoUrl = getOptimizedVideoUrl(video?.video);
    const storyThumbnailUrl = video?.thumbnail?.media?.optimized_media_url ? video?.thumbnail?.media?.optimized_media_url : video?.thumbnail?.media?.url;
    const storyGifUrl = video?.video?.media?.optimized_media_url;
    const isGif = storyGifUrl && storyGifUrl.toLowerCase().endsWith('.gif');

    /* ------------------------------------------------------------------------------------------ */
    /*                                              X                                             */
    /* ------------------------------------------------------------------------------------------ */

    return (
      <div ref={containerRef} onClick={handleClick} className={`header-menu-slider-single-item ${isActive ? 'active' : ''}`}>
        {!showVideo && storyThumbnailUrl && (
          <img
            className="story-thumbnail"
            src={storyThumbnailUrl}
            alt={video?.name || "Video thumbnail"}
            style={{ display: "block" }}
            loading="lazy"
          />
        )}

        {/* Only render video element when needed */}
        {!isGif && (videoLoaded || isActive || showVideo) && (
          <video
            ref={videoRef}
            className="story-video"
            src={`${storyVideoUrl}?playsinline=1`}
            muted
            playsInline
            webkit-playsinline="true"
            allowFullScreen={false}
            preload="none"
            poster={storyThumbnailUrl}
            style={{
              display: showVideo ? "block" : "none",
            }}
          />
        )}

        {/* Only render video element when needed */}
        {isGif && (videoLoaded || isActive || showVideo) && (
          <img
            className="story-video"
            src={storyGifUrl}
            alt={video?.name || "Video GIF"}
            style={{ display: showVideo ? "block" : "none", }}
            loading="lazy"
          />
        )}

        {/* Play icon */}
        <PlayCircle size={40} stroke="#ffffffd4" fill="var(--main-green-color)" />

        {/* Title with debug */}
        <p className="video-name">
          {video?.name ?
            `${video?.name?.substring(0, 10)}${video?.name?.length > 10 ? '...' : ''}`
            :
            <Skeleton width={80} />
          }
        </p>
      </div>
    );
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div ref={productsRef} className={`header-menu-slider-container ${className}`}>
      {!dataLoaded ? (
        // Show skeleton until data is loaded
        <Swiper {...swiperProps}>
          {Array(10).fill(0).map((_, index) => (
            <SwiperSlide key={index}>
              <div className="header-menu-slider-single-item">
                <Skeleton height={130} width={125} />
                <p className="video-name"><Skeleton width={80} /></p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : videoSlides?.data?.length > 2 ? (
        <Swiper {...swiperProps}>
          {videoSlides?.data?.map((video, index) => (
            <SwiperSlide key={index}>
              <VideoPlayer key={video.id || index} video={video} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        videoSlides?.data?.map((video, index) => (
          <VideoPlayer key={video.id || index} video={video} index={index} />
        ))
      )}
    </div>
  );
}

export default HeaderMenuSlider;