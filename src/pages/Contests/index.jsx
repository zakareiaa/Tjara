import { React, useState, useEffect } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";

import CONTESTS from "@client/contestsClient";
import { daysLeft, fixUrl, isExpired } from "../../helpers/helpers.jsx";

import Star from "./assets/star-full.svg";
import StarHalf from "./assets/star-half.svg";
import Views from "./assets/views.svg";
import Likes from "./assets/likes.svg";
import Comments from "./assets/comments.svg";
import Share from "./assets/share.svg";
import ArrowLeft from "./assets/ArrowLeft.svg";
import ArrowRight from "./assets/ArrowRight.svg";
import Contest1 from "./assets/contest1.png";

import "./style.css";
import { Helmet } from "react-helmet-async";

const Contest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [contests, setContests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setsearchTerm] = useState(params.get("search"))

  /* --------------------------------------------- X -------------------------------------------- */

  const handlePageChange = (selected) => {
    setCurrentPage(selected);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                Function To Fetch The Contests                                */
  /* -------------------------------------------------------------------------------------------- */

  const fetchContests = async () => {
    const { data, error } = await CONTESTS.getContests({
      with: "image,shop",
      orderBy: "created_at",
      order: "desc",
      search: searchTerm,
    });
    if (data) {
      setContests(data.contests);
    }
    if (error) {
      console.error(error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchContests();
  }, [currentPage, searchTerm]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setsearchTerm(params.get("search"));
  }, [params])

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <Helmet>
        <title>Exciting Contests | Participate & Win on Tjara</title>
        <meta name="description" content="Join exciting contests on Tjara and win amazing prizes! Participate in giveaways, competitions, and exclusive challenges. Don't miss your chance to win!" />
        <meta name="keywords" content="Tjara contests, giveaways, win prizes, online competitions, rewards, participate and win, shopping rewards, ecommerce contests" />
        <meta property="og:title" content="Exciting Contests | Participate & Win on Tjara" />
        <meta property="og:description" content="Enter Tjara's latest contests and win big! Join now and compete for amazing prizes and exclusive rewards." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tjara.com/contests" />
        <meta property="og:image" content="https://www.tjara.com/assets/images/tjara-contests-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Exciting Contests | Participate & Win on Tjara" />
        <meta name="twitter:description" content="Take part in Tjara contests and win exciting prizes. Join now and start competing!" />
        <meta name="twitter:image" content="https://www.tjara.com/assets/images/tjara-contests-preview.jpg" />
      </Helmet>

      <section className="wrapper banner-sec contestsContainer">
        <div className="main-sec">
          <div className="heading-sec2">
            <p>Home / contests</p>
            <h2>Contests - ({contests?.total}) results found</h2>
          </div>
          <div className="contests">
            {contests?.data?.map((e, index) => (
              <div key={index} className="contest">
                <div onClick={() => navigate(`/contests/${e.id}`)} className="contest-top">
                  <img src={fixUrl(e?.thumbnail?.media?.url) ?? Contest1} alt="" />
                </div>
                <div className="contest-mid">
                  <div className="store-name">
                    {/* <h3>Store :  {e?.shop?.shop?.name}</h3> */}
                    {/* <div className="rating">
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                    <img src={StarHalf} alt="" />
                  </div> */}
                  </div>
                  <h2 className="contest-title">
                    <Link to={`/contests/${e.id}`}>{e.name}</Link>
                  </h2>
                  <p className="contest-description" dangerouslySetInnerHTML={{ __html: e.description }} />
                  <Link to={`/contests/${e.id}`}>
                    <button className="participate">
                      {isExpired(e.end_time) ? "View Details" : "Participate"}
                    </button>
                  </Link>
                  <p className="expiry-date">
                    Expiry Date: <span className="date expired">{isExpired(e.end_time) ? "Expired" : daysLeft(e.end_time)}</span>
                  </p>
                </div>
                <div className="contest-bottom">
                  <div className="views">
                    <img src={Views} alt="" />
                    <p>{e?.meta?.views > 0 ? e?.meta?.views : 0} Views</p>
                  </div>
                  <div className="likes">
                    <img src={Likes} alt="" />
                    <p>{e?.meta?.likes > 0 ? e?.meta?.likes : 0} Likes</p>
                  </div>
                  {/* <div className="comments">
                  <img src={Comments} alt="" />
                  <p>{e?.rating > 0 ? e?.rating : 0} Comments</p>
                </div> */}
                  {/* <div className="share">
                  <img src={Share} alt="" />
                  <p>Share</p>
                </div> */}
                </div>
              </div>
            ))}
          </div>
          <ul className="pagination">
            {contests?.prev_page_url && (
              <li>
                <button onClick={() => handlePageChange(new URLSearchParams(new URL(contests?.prev_page_url).search).get('page'))}><img src={ArrowLeft} alt="Previous" /></button>
              </li>
            )}
            {/* {contests?.links?.map((link, index) => (
              link?.url && (
                <li key={index} className={`${link.active ? 'active' : ''} page-item`}>
                  <button onClick={() => handlePageChange(new URLSearchParams(new URL(link?.url).search).get('page'))}>{link?.label.replace(/&laquo;|&raquo;/g, '')}</button>
                </li>
              )
            ))} */}
            {contests?.next_page_url && (
              <li>
                <button onClick={() => handlePageChange(new URLSearchParams(new URL(contests?.next_page_url).search).get('page'))}><img src={ArrowRight} alt="Previous" /></button>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Contest;
