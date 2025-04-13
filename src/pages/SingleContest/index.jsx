import { useState, React, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Reply, Sparkles } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { toast } from "react-toastify";

import CONTESTS from "@client/contestsClient";
import CONTEST_PARTICIPATIONS from "@client/contestParticipationsClient";
import CONTEST_COMMENTS from "@client/contestCommentsClient";
import { formatDate, expiryDate, isExpired, fixUrl, daysLeft, timeAgo } from '../../helpers/helpers';
import { useAuth } from "@contexts/Auth";
import { usePopup } from "@components/DataContext";
import SinginPopup from "@components/signInPopup/index";
import ImageWithFallback from "@components/ImageWithFallback/ImageWithFallback";
import SocialSharePopup from "@components/SocialSharePopup";
import ContestExpiryTimer from "../../components/ContestExpiryTimer";
import ContestPrizeNotice from "../../components/ContestPrizeNotice";
import LightiningDeals from "@components/lightningDeals";

import Star from "./assets/star-full.svg";
import StarHalf from "./assets/star-half.svg";
import Views from "./assets/views.svg";
import Likes from "./assets/likes.svg";
import Comments from "./assets/comments.svg";
import Share from "./assets/share.svg";
import Achievement from "./assets/achievement.svg";
import Author from "./assets/author.jpg";
import Contest1 from "./assets/contest1.png";
import whatsapp from "../../assets/whatsapp.png";
import facebook from "../../assets/facebook.png";
import twitter from "../../assets/twitter.png";
import linkedin from "../../assets/linkedin.png";
import pinterest from "../../assets/pinterest.png";
import copyLink from "../../assets/copyLink.png";
// import Contest1 from "./assets/contest1.png";
// import { toast } from "react-toastify";
import bgAudioFile from "./assets/bgWinningAudio.mp3"
import epicWinCelebrationAudio from "./assets/epicWinCelebrationAudio.mp3"

import "./style.css";
import "./contest.css";

const SingleContest = () => {
  const [canParticipate, setcanParticipate] = useState(true)
  const { currentUser } = useAuth();
  const [share, setshare] = useState(false)
  const { showPopup, setopenSigninPopup } = usePopup();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const { id } = useParams();
  const [commentFormData, setCommentFormData] = useState({
    contest_id: id,
    description: "",
    parent_id: null,
    comment_media: null,
  });
  const [contest, setContest] = useState({
    name: "",
    description: "",
    starting_date: "",
    end_date: "",
    thumbnail: null,
    questions: [],
    meta: {
      likes: 0,
      views: 0
    }
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});  // Track answers for each question
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spinningWheelParts, setSpinningWheelParts] = useState([]);
  const [SelectedAnswere, setSelectedAnswere] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState('');
  const [winner, setWinner] = useState(null);
  const [audio, setAudio] = useState(null);
  const [bgCasinoAudio, setBgCasinoAudio] = useState(null);
  const [winnerAudio, setWinnerAudio] = useState(null);
  const [replyToComment, setReplyToComment] = useState('');
  const [hasSharedForSubmission, setHasSharedForSubmission] = useState(false);

  /* --------------------------------------------- X -------------------------------------------- */

  const currentUrl = window.location.href;

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  useEffect(() => {
    if (share) {
      const element = document.getElementById('contestShareBtns');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [share]);

  /* --------------------------------------------- X -------------------------------------------- */

  // const staticParts = [
  //   {
  //     participant: {
  //       id: '1',
  //       first_name: 'something',
  //     },
  //   },
  //   {
  //     participant: {
  //       id: '1',
  //       first_name: 'something',
  //     },
  //   },
  // ];

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    if (contest?.participants?.participants?.length > 0) {

      // Filter participants whose correct_answer matches contest.meta.correct_answer
      let filteredParticipants = contest?.participants?.participants?.filter(
        (participant) => participant?.participant?.correct_answer === contest?.meta?.correct_answer
      );

      let parts = filteredParticipants?.slice(0, 20).map((participant) => ({
        option: participant?.participant?.first_name || 'Unknown', // Fallback if first_name is undefined
        style: {
          backgroundColor: participant?.participant?.id === contest?.winner_id ? '#c7f9cc' : '#ff8080'
        },
      }));

      // Find the winner and move them to the first position
      const winnerIndex = filteredParticipants.findIndex(
        (participant) => participant?.participant.id === contest?.winner_id
      );

      if (winnerIndex !== -1) {
        const winner = parts.splice(winnerIndex, 1)[0]; // Remove the winner from its current position
        parts.unshift(winner); // Add the winner to the beginning of the array
      }

      // If there are more than 20 participants, add the "20+" static participant
      if (filteredParticipants?.length > 20) {
        parts.push({
          option: '20+',
          style: {
            backgroundColor: '#d3d3d3', // You can choose a different color if needed
          },
        });
      }

      setSpinningWheelParts(parts);
      setPrizeNumber(0); // The prize number is set to 0 since the winner is now the first participant
    }
  }, [contest?.winner_id, contest?.participants?.participants]);

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSpinClick = () => {
    if (!mustSpin) {
      setMustSpin(true);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  // Handle share functionalities
  const handleShare = (platform) => {
    const contestUrl = window.location.href;
    const message = `Check out this amazing contest: ${contest.name}!`;

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + contestUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contestUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(contestUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(contestUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(contestUrl)}&description=${encodeURIComponent(message)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Fetch Contests                                        */
  /* -------------------------------------------------------------------------------------------- */

  const fetchContest = async () => {
    const ApiParams = {
      with: 'comments',
    };

    const { data, error } = await CONTESTS.getContest(id, ApiParams);

    if (data) {
      setContest(data?.contest);
    }

    if (error) {
      console.error(error);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                      Handle Form Submit                                      */
  /* -------------------------------------------------------------------------------------------- */

  const handleSubmitParticiaption = async (e) => {
    e.preventDefault();

    if (canParticipate) {
      // Check if user is logged in
      if (!currentUser?.authToken) {
        setopenSigninPopup(true);
        return;
      }

      // Validate answers
      if (!selectedAnswers || Object.keys(selectedAnswers).length === 0) {
        toast.error("Please select one of the options!");
        return;
      }

      // Check if the user has shared the contest
      if (!hasSharedForSubmission) {
        setShowSharePopup(true);
        return;
      }

      // Create formData with the correct format
      const formData = new FormData();

      // Format answers as an array of objects with question_id and answer
      Object.entries(selectedAnswers).forEach(([questionId, answer], index) => {
        formData.append(`answers[${index}][question_id]`, questionId);
        formData.append(`answers[${index}][answer]`, answer);
      });

      const { data, error } = await CONTEST_PARTICIPATIONS.insertContestParticipation(id, formData);

      if (data) {
        // Show appropriate toast based on answer correctness
        if (data.is_correct) {
          toast.success(data.message);
        } else {
          toast.info(data.message);
        }

        // Update UI state
        setcanParticipate(false);
        setSelectedAnswere('');
        fetchContest();
        setShowSharePopup(true);
      }

      if (error) {
        console.error(error);
        toast.error(error.data?.message || "Failed to submit participation");
      }
    } else {
      toast.error("Sorry! You can't participate in this contest");
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!currentUser?.authToken) {
      setopenSigninPopup(true);
      return;
    }

    if (!commentFormData?.description) {
      toast.error('Please enter a comment');
      return;
    }

    const { data, error } = await CONTEST_COMMENTS.insertComment(commentFormData);

    if (data) {
      toast.success(data.message);
      commentFormData({});
      fetchContest();
      document.location.reload();
    }

    if (error) {
      toast.error(error.data.message);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCommentMediaChange = (e) => {
    commentFormData((prev) => {
      return { ...prev, comment_media: [...e.target.files[0]], };
    });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const copyLinkToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy:', error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const LikeContest = async (e) => {
    let likes = parseInt(contest.meta.likes);
    let Newlike = likes ? likes += 1 : 1;

    const { data, error } = await CONTESTS.updateContestMeta(id, {
      key: 'likes',
      value: Newlike,
    });

    if (data) {
      toast.success("Contest liked successfully!");
      fetchContest();
    }
    if (error) {
      console.error(error);
    }
  }

  /* --------------------------------------------- X -------------------------------------------- */

  const ViewContest = async () => {
    const currentViews = parseInt(contest.meta.views) || 0;
    const newViews = currentViews + 1;

    const { data, error } = await CONTESTS.updateContestMeta(id, {
      key: 'views',
      value: newViews,
    });

    if (error) {
      console.error('Error updating contest views:', error);
    }
  }

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (contest?.id) {
      // Handle view count
      ViewContest();

      // Check if user has participated and set their answers
      if (contest?.participants?.participants?.length > 0 && currentUser?.id) {
        const participantData = contest.participants.participants.find(
          participant => participant.participant.id === currentUser?.id
        );

        if (participantData) {
          setcanParticipate(false);

          // Set the participant's previous answers if they exist
          if (participantData.answers) {
            try {
              const parsedAnswers = JSON.parse(participantData.answers);
              const previousAnswers = {};
              parsedAnswers.forEach(answer => {
                previousAnswers[answer.question_id] = answer.given_answer;
              });
              setSelectedAnswers(previousAnswers);
            } catch (error) {
              console.error('Error parsing answers:', error);
            }
          }
        }
      }
    }
  }, [contest?.id, currentUser?.id]);

  /* --------------------------------------------- X -------------------------------------------- */

  // const letsSpin = () => {
  //   var x = 1024; //min value
  //   var y = 9999; //max value
  //   var deg = Math.floor(Math.random() * (x - y)) + y;
  //   document.getElementById('wheel').style.transform = "rotate(" + deg + "deg)";
  // }

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    // Load the bgCasinoAudio when the component is mounted
    const bgCasinoNewAudio = new Audio(bgAudioFile); // Replace with the actual path of your bgCasinoNewAudio file
    bgCasinoNewAudio.loop = true; // Make the sound loop
    setBgCasinoAudio(bgCasinoNewAudio);

    // Load the bgCasinoAudio when the component is mounted
    const winnerNewAudio = new Audio(epicWinCelebrationAudio); // Replace with the actual path of your winnerNewAudio file
    winnerNewAudio.loop = false; // Make the sound loop
    setWinnerAudio(winnerNewAudio);

    return () => {
      // Cleanup on component unmount
      if (bgCasinoNewAudio) {
        bgCasinoNewAudio.pause();
        bgCasinoNewAudio.currentTime = 0;
      }
      if (winnerNewAudio) {
        winnerNewAudio.pause();
        winnerNewAudio.currentTime = 0;
      }
    };
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  const selectWinner = () => {
    if (!contest?.participants?.participants?.length) {
      toast.error('No participants available');
      return;
    }

    setIsSelecting(true);
    // Create an bgCasinoAudio instance for the background sound
    bgCasinoAudio.loop = true; // Make the sound loop
    bgCasinoAudio.play().catch((err) => {
      console.error('Error playing bgCasinoAudio:', err);
    });

    let filteredParticipants = contest?.participants?.participants?.filter(
      (participant) => participant?.participant?.correct_answer === contest?.meta?.correct_answer
    );

    // Find the winner based on winner_id
    const winner = filteredParticipants.find(
      (participant) => participant?.participant?.id === contest?.winner_id
    );

    let counter = 0;
    const maxIterations = 60; // Number of animation iterations
    const interval = setInterval(() => {
      // Pick a random participant to show for the animation
      const randomIndex = Math.floor(Math.random() * filteredParticipants.length);
      const randomParticipant = filteredParticipants[randomIndex];
      setCurrentParticipant(randomParticipant?.participant?.first_name || 'Unknown');

      counter++;
      if (counter >= maxIterations) {
        clearInterval(interval);
        setIsSelecting(false);

        // Set the final winner
        setWinner(winner);
        setCurrentParticipant(winner?.participant?.first_name || 'Unknown');

        // Stop the background sound when winner is selected
        bgCasinoAudio.pause();
        bgCasinoAudio.currentTime = 0; // Reset the bgCasinoAudio to the start
        winnerAudio.play();
        // Here you would typically call your API to update the contest winner
        // updateContestWinner(winner.participant.id);
      }
    }, 100);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                               Call These When Component Mounts                               */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    fetchContest();
  }, []);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      {showPopup && <SinginPopup />}

      <SocialSharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        contestName={contest.name}
        contestUrl={window.location.href}
        onShareComplete={() => setHasSharedForSubmission(true)}
      />

      <section className="wrapper contest-details-sec">
        <div className="main-sec">
          <div className="heading-sec2">
            <p>Home / contests</p>
            <h2>Contests</h2>
          </div>
        </div>
        <div className="details-sec">
          <div className="contest">
            <div className="contest-top">
              <img src={fixUrl(contest?.thumbnail?.media?.url) ?? Contest1} alt="" />
            </div>
            <div className="contest-mid">
              <div className="store-name">
                <h3>{contest?.shop?.shop?.name}</h3>
                {/* <div className="rating">
                  <img src={Star} alt="" />
                  <img src={Star} alt="" />
                  <img src={Star} alt="" />
                  <img src={Star} alt="" />
                  <img src={StarHalf} alt="" />
                </div> */}
              </div>
              <h2 className="contest-title">{contest?.name}</h2>
              <p className="contest-description" dangerouslySetInnerHTML={{ __html: contest.description }} />
              {/* notice for user about how much answeres he has to correct to enter in name picker */}
              {contest?.meta?.required_correct_answers ? (
                <div className="notice-container">
                  <div className="notice-content">
                    <div className="notice-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="notice-text">
                      <h4>Required Correct Answers</h4>
                      <p>Get {contest.meta.required_correct_answers} correct answers to enter the prize draw! 🎯</p>
                    </div>
                  </div>
                </div>
              ) : contest?.questions?.length > 0 ? (
                <div className="notice-container">
                  <div className="notice-content">
                    <div className="notice-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="notice-text">
                      <h4>Required Correct Answers</h4>
                      <p>Get All correct answers to enter the prize draw! 🎯</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {/* -------------------------------------------------------------------------------- */}
              {/*                                 Question Answeres                                */}
              {/* -------------------------------------------------------------------------------- */}
              {/* Question Answers Section */}
              <div className="contest-questions">
                {contest?.questions?.map((question, index) => (
                  <div key={question.id} className="question-block">
                    <h2>Question {index + 1}: {question.question}</h2>
                    <div className="options">
                      {[1, 2, 3, 4].map((optNum) => (
                        <div key={optNum} className="option">
                          <label htmlFor={`question_${question.id}_option_${optNum}`}>
                            <input
                              type="radio"
                              id={`question_${question.id}_option_${optNum}`}
                              name={`question_${question.id}`}
                              value={question[`option_${optNum}`]}
                              disabled={!canParticipate}
                              checked={selectedAnswers[question.id] === question[`option_${optNum}`]}
                              onChange={(e) => setSelectedAnswers(prev => ({
                                ...prev,
                                [question.id]: e.target.value
                              }))}
                            />
                            {question[`option_${optNum}`]}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button disabled={isExpired(contest?.end_time)} style={canParticipate ? {} : { opacity: ".6", pointerEvents: "none" }} onClick={handleSubmitParticiaption} className="participate">{isExpired(contest.end_time) ? 'Expired' : canParticipate ? 'Participate' : 'Already Participated'}</button>

              <ContestPrizeNotice
                prize={contest?.meta?.contest_prize_details}
                isExpired={isExpired(contest.end_time)}
                hasWinner={!!contest?.winner_id}
                winner={winner}
                isSelecting={isSelecting}
                currentParticipant={currentParticipant}
                onSelectWinner={selectWinner}
                endTime={contest.end_time}  // Added this prop
              />

              {/* <button onClick={handleSpinClick}>SPIN</button> */}
              {isExpired(contest.end_time) && contest?.winner_id && (
                <div className="achievement">
                  <img src={Achievement} alt="" />
                  🎉 We have our lucky winner! Congratulations! <br /> Stay tuned for more contests and exciting prizes. Join us for more chances to win! 🌟
                </div>
              )}
            </div>
            <div className="contest-bottom">
              <div className="views">
                <img src={Views} alt="" />
                <p>{contest?.meta?.views > 0 ? contest?.meta?.views : 0} Views</p>
              </div>
              <div className="likes liked" onClick={() => LikeContest(event)}>
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.1668 8.33398C19.1668 7.89196 18.9912 7.46803 18.6787 7.15547C18.3661 6.84291 17.9422 6.66732 17.5002 6.66732H12.2335L13.0335 2.85898C13.0502 2.77565 13.0585 2.68398 13.0585 2.59232C13.0585 2.25065 12.9168 1.93398 12.6918 1.70898L11.8085 0.833984L6.32516 6.31732C6.01683 6.62565 5.8335 7.04232 5.8335 7.50065V15.834C5.8335 16.276 6.00909 16.6999 6.32165 17.0125C6.63421 17.3251 7.05814 17.5007 7.50016 17.5007H15.0002C15.6918 17.5007 16.2835 17.084 16.5335 16.484L19.0502 10.609C19.1252 10.4173 19.1668 10.2173 19.1668 10.0007V8.33398ZM0.833496 17.5007H4.16683V7.50065H0.833496V17.5007Z" fill="#767676" />
                </svg>
                <p>{contest?.meta?.likes > 0 ? contest?.meta?.likes : 0} Likes</p>
              </div>
              <div className="comments">
                <img src={Comments} alt="" />
                <p>{contest?.comments?.comments?.total_comments > 0 ? contest?.comments?.comments?.total_comments : 0} Comments</p>
              </div>
              <div className="share" onClick={() => { setshare(!share); setShowSharePopup(true) }}>
                <img src={Share} alt="" />
                <p>Share</p>
              </div>
            </div>
            <div id="contestShareBtns" className={`shareIcons ${share ? "active" : ""}`}>
              <Link onClick={shareToWhatsApp}><img src={whatsapp} alt="" /></Link>
              <Link onClick={shareToFacebook}><img src={facebook} alt="" /></Link>
              <Link onClick={shareToTwitter}><img src={twitter} alt="" /></Link>
              <Link onClick={shareToLinkedIn}><img src={linkedin} alt="" /></Link>
              <Link onClick={() => copyLinkToClipboard(window.location.href)} ><img src={copyLink} alt="" /></Link>
            </div>
          </div>
          {contest?.comments?.comments?.comments.length > 0 && (
            <div className="page-comments">
              {contest?.comments?.comments?.comments?.map((comment, index) => (
                <div key={index} className={`comment ${comment?.parent_id !== null ? "reply" : ""}`}>
                  <div className="profile">
                    <ImageWithFallback url={comment?.user?.user?.thumbnail?.media?.url} name={comment?.user?.user?.first_name} />
                  </div>
                  <div className="content">
                    <div className="name-date">
                      <h2>{comment?.user?.user?.first_name} {comment?.user?.user?.last_name}</h2>
                      <p>{timeAgo(comment?.created_at)}</p>
                    </div>
                    <div className="comment-content">{comment?.description}</div>
                    <div className="like-share">
                      {/* <div className="likes">
                        <img src={Likes} alt="" />
                        <p>{comment?.likes} Likes</p>
                      </div>
                      <div className="share">
                        <img src={Share} alt="" />
                        <p>Share</p>
                      </div> */}
                      <div onClick={() => {
                        setCommentFormData((prev) => {
                          return { ...prev, parent_id: comment?.id, };
                        });
                        setReplyToComment(`${comment?.user?.user?.first_name}`);
                      }} className="reply">
                        <Reply />
                        <p>Reply</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="add-comment">
            <h2>Comments</h2>
            <fieldset style={replyToComment ? { borderColor: 'var(--main-red-color)' } : {}}>
              {replyToComment && (
                <legend>{replyToComment ? 'Reply to' : 'Post'} : {replyToComment}</legend>
              )}
              <textarea name="comment"
                value={commentFormData?.description}
                id=""
                cols="30"
                rows="10"
                placeholder="Write a Comment"
                onChange={(e) => {
                  setCommentFormData((prev) => {
                    return { ...prev, description: e.target.value, };
                  });
                }} />
            </fieldset>
            {/* <input type="file" onChange={handleCommentMediaChange} className="choose-file" /> */}
            <div className="submit-comment">
              <button onClick={handleSubmitComment}>Submit Comment</button>
            </div>
          </div>
        </div>
        <div className="super-deals">
          <LightiningDeals />
        </div>
      </section>
    </>
  );
};

export default SingleContest;
