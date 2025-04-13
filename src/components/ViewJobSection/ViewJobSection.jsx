import React, { useEffect, useState } from "react";
import "./ViewJobSection.css";
import { Link } from "react-router-dom";
import BgImg from "./view-job-sec-bg-min.webp";
import ViewJobSectionImg from "./view-job-img.webp";

function viewJobSection({ className }) {
  const [form, setform] = useState({});
  const [viewJob, setViewJob] = useState({
    heading: "Are you looking for a job?",
    description: "Find your next career adventure with us. We offer a range of positions across various industries and skill levels. Whether you’re a seasoned professional or just starting out, we have something for you.",
    img: null
  });

  /* --------------------------------------------- X -------------------------------------------- */

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`view-job-section ${className}`}>
      <img className="view-job-section-bg" src={viewJob.img ? viewJob.img : BgImg} alt="" />
      <div className="view-job-left-sec">
        <p className="view-job-section-heading">{viewJob?.heading}</p>
        <p className="view-job-section-description">
          {viewJob?.description}
        </p>
        <div className="inputdiv">
          <input
            onChange={() => handleChange(event)}
            name="job title"
            className="view-job-section-input-field"
            type="text"
            placeholder="Search Job"
          />
          <input
            onChange={() => handleChange(event)}
            name="city"
            className="view-job-section-input-field"
            type="text"
            placeholder="City or postcode"
          />
          <Link to={`/jobs?jobName=${form.jobName}&location=${form.city}`} className="view-job-section-button">
            View Jobs
          </Link>
        </div>
      </div>
      <img className="view-job-section-img" src={viewJob.img ? viewJob.img : ViewJobSectionImg} alt="" />
    </div>
  );
}

export default viewJobSection;
