import React, { useEffect, useRef, useState } from "react";
import "./Contests.css";
import ContestOne from "./assets/contest-one.png";
import { Link, useNavigate } from "react-router-dom";
import loadingGif from "@assets/loading.gif"
import CONTESTS from "@client/contestsClient";
import { daysLeft, fixUrl, getOptimizedThumbnailUrl } from "../../helpers/helpers";
import Skeleton from "react-loading-skeleton";
import SectionHeading from "../ui/SectionHeading";

function Contests({ ids, limit, className }) {
  const [contests, setContests] = useState([{}, {}])
  const navigate = useNavigate();
  const componentRef = useRef()
  const [windowsWidth, setwindowsWidth] = useState(window.innerWidth)
  const [totalItems, settotalItems] = useState(null)
  const [currentPage, setcurrentPage] = useState(1);
  const [IsInitial, setIsInitial] = useState(true);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchContests = async () => {
    const ApiParams = {
      ids: ids,
      with: "thumbnail,shop",
      orderBy: "created_at",
      order: "desc",
      page: currentPage,
      per_page: 2,
    }

    const { data, error } = await CONTESTS.getContests(ApiParams);

    if (data) {
      if (IsInitial) {
        setContests(data.contests.data);
        setIsInitial(false);
      } else {
        setContests((prev) => [...prev, ...data.contests.data]);
      }
      settotalItems(data.contests.total);
    }

    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMoreContests = async () => {
    setcurrentPage(currentPage + 1);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchContests();
  }, [currentPage]);

  /* --------------------------------------------- X -------------------------------------------- */

  window.addEventListener("resize", () => {
    setwindowsWidth(window.innerWidth)
  })

  /* --------------------------------- INFINITE SCROLL FUNCTION --------------------------------- */

  useEffect(() => {
    if (windowsWidth <= 500) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchMoreContests()
          setTimeout(() => {
          }, 3000);
        }
      });
      if (componentRef.current) {
        observer.observe(componentRef.current);
      }
      return () => {
        if (componentRef.current) {
          observer.unobserve(componentRef.current);
        }
      };
    }
  }, [contests]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`${className} contest-container wrapper `}>
      <div className="feature-products-container-heading-row">
        <SectionHeading heading="Contests" />
        <button onClick={() => navigate('/contests/')}>View All</button>
      </div>
      <div className="contest-box-container">
        {contests?.map((contest, index) => {
          return (
            <div key={index} className="contest-box">
              <img className="contest-box-img" width={218} fetchpriority="low" height={250} src={getOptimizedThumbnailUrl(contest?.thumbnail) ?? ContestOne} alt="" />
              <div className="contest-box-right">
                <p className="contest-box-days-left">{daysLeft(contest?.end_time)}</p>
                <Link to={`/contests/${contest.id}`} className="contest-box-title">
                  {contest?.name ? contest?.name : <Skeleton width={200} />}
                </Link>
                <p className="contest-box-description" dangerouslySetInnerHTML={{ __html: contest?.description }} />
                <div className="contest-box-btn-row">
                  {contest?.id ? <button onClick={() => navigate(`/contests/${contest?.id}`)}>Participate</button> : <Skeleton width={100} height={40} />}
                </div>
              </div>
            </div>
          );
        })}
        {windowsWidth <= 500 && contests?.length < totalItems && <div ref={componentRef} className="loadingAnimGif"><img src={loadingGif} alt="" /></div>}
      </div>
    </div>
  )
}

export default Contests;