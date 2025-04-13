import { useState, React, useEffect } from "react";
import JOBS from "@client/jobsClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import SideAdProductImg from "./assets/side-ad-product-img.svg";
import "./style.css";
import ProductImg from "./assets/side-ad-product-img.svg";
import { fixUrl } from "../../helpers/helpers";

const SingleJob = ({ }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    regular_price: "",
  });


  /* -------------------------------------------------------------------------------------------- */
  /*                                          Fetch Jobs                                          */
  /* -------------------------------------------------------------------------------------------- */

  const fetchJob = async () => {
    const params = {
      with: "image,shop",
    };
    const { data, error } = await JOBS.getJob(id, params);
    if (data) setJob(data.job);
    error && console.error(error);
  };

  const fetchJobs = async () => {
    const params = {
      with: "image,shop",
      orderBy: "created_at",
      order: "desc",
    };
    const { data, error } = await JOBS.getJobs(params);
    if (data) setJobs(data.jobs.data);
    error && console.error(error);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                               Call These When Component Mounts                               */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    fetchJob();
    fetchJobs();
  }, []);

  return (
    <>
      <section className="wrapper serviceDetailsTop">
        <div className="shop-category-heading-top">
          <h2>{job?.title}</h2>
          <p>Home / Jobs / {job?.title ?? 'UI/UX Designer'}</p>
        </div>
      </section>
      <section className="wrapper single-job-details-sec">
        <div className="main-sec">
          <div className="details-sec">
            <div className="jobTitle">
              <img src={fixUrl(job?.thumbnail?.media?.url)} alt="" />
              <div className="title">
                <h2>{job?.title ?? 'Job title here'}</h2>
                <p>
                  {job?.city?.name} <span /> {job?.state?.name} <span /> {job?.country?.name}
                </p>
              </div>
            </div>
            <div className="jobType">
              <p>${job.salary} a month</p>
              <p>{job.job_type}</p>
            </div>
            <div className="description">
              <h2>Full Job Description</h2>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            <p className="jobtype">Job Type: {job.work_type}</p>
            <div className="buttons">
              <button onClick={() => navigate(`/jobs/${id}/apply`)}>Apply Now</button>
              {/* <button>
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1154 18.6417L11.9987 18.7583L11.8704 18.6417C6.3287 13.6133 2.66536 10.2883 2.66536 6.91667C2.66536 4.58333 4.41536 2.83333 6.7487 2.83333C8.54537 2.83333 10.2954 4 10.9137 5.58667H13.0837C13.702 4 15.452 2.83333 17.2487 2.83333C19.582 2.83333 21.332 4.58333 21.332 6.91667C21.332 10.2883 17.6687 13.6133 12.1154 18.6417ZM17.2487 0.5C15.2187 0.5 13.2704 1.445 11.9987 2.92667C10.727 1.445 8.7787 0.5 6.7487 0.5C3.15536 0.5 0.332031 3.31167 0.332031 6.91667C0.332031 11.315 4.2987 14.92 10.307 20.3683L11.9987 21.9083L13.6904 20.3683C19.6987 14.92 23.6654 11.315 23.6654 6.91667C23.6654 3.31167 20.842 0.5 17.2487 0.5Z" fill="#9E9E9E" />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
        <div className="rightSidebar main-sec">
          <div className="jobs">
            {jobs?.slice(0, 3).map((e, index) => (
              <div key={index} className="job">
                <div className="Top">
                  <img src={fixUrl(e?.thumbnail?.media?.url)} alt="" />
                  <div className="title">
                    <Link to={`/jobs/${e.id}`}>
                      <h2 className="job-name">{e.title}</h2>
                    </Link>
                    <p>
                      {e?.state?.name} <span /> {e?.country?.name}
                    </p>
                  </div>
                </div>
                <div className="jobType">
                  <p className="salaryRange">${e.salary} a month</p>
                  <p className="type">{e.job_type}</p>
                </div>
                <p className="job-description" dangerouslySetInnerHTML={{ __html: e.description }}></p>
                {/* <p className="job-price">Salary: {job.salary}.Rs</p> */}
                {/* <p className="job-location">Location: {job.location}</p> */}
                {/* <p className="job-published-date">Published Date: {job.created_at}</p> */}
                <p className="postTime">Active 5 days ago</p>
              </div>))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleJob;
