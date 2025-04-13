import { useState, React, useEffect } from "react";
import JOBS from "@client/jobsClient";
import JOB_APPLICATIONS from "@client/jobApplicationsClient";
import { useNavigate, useParams } from "react-router-dom";
import SideAdProductImg from "./assets/side-ad-product-img.svg";
import uploadIcon from "./assets/uploadIcon.png";
import upload from "./assets/upload.png";
import SinginPopup from "@components/signInPopup/index";
import { usePopup } from "@components/DataContext";
import { useAuth } from "@contexts/Auth";
import { toast } from "react-toastify";
import "./style.css";
import { fixUrl, formatDate } from "../../helpers/helpers";
import MEDIA from "@client/mediaClient";
import axiosClient from "@client/axiosClient";
import COUNTRIES from "@client/countriesClient";
import STATES from "@client/statesClient";
import CITIES from "@client/citiesClient";

const SingleJob = ({ }) => {
  const [cities, setCities] = useState({});
  const [states, setStates] = useState({});
  const [countries, setCountries] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { showPopup, setopenSigninPopup } = usePopup();
  const [job, setJob] = useState({});
  const { currentUser } = useAuth();
  const [application, setApplication] = useState({
    firstName: currentUser?.first_name,
    lastName: currentUser?.last_name,
    date_of_birth: "",
    streetAddress: '',
    country_id: '',
    zipcode: '',
    city_id: '',
    state_id: '',
    email: currentUser?.email,
    phone: '',
    linkedin: '',
    source_of_landing: '',
    start_date: '',
    desired_rate: '',
    employmentStatus: '',
    coverLetter: '',
    cv: null,
  });
  const [userAddress, setUserAddress] = useState({});

  /* -------------------------------------------------------------------------------------------- */
  /*                                        Fetch Jobs                                        */
  /* -------------------------------------------------------------------------------------------- */

  const fetchJob = async () => {
    const { data, error } = await JOBS.getJob(id, {
      with: "image,shop",
    });
    if (data) setJob(data.job);
    error && console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const insertThumbnail = async (event) => {
    const { data, error } = await MEDIA.createMedia({
      media: event.target.files
    });

    if (data) {
      setApplication((prevApplication) => ({ ...prevApplication, cv: data.media[0]?.id }));
    }
    if (error) {
      toast.error(error.data.message);
    }
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Fetch States                                         */
  /* -------------------------------------------------------------------------------------------- */

  const fetchCountries = async () => {
    const { data, error } = await COUNTRIES.getCountries({});
    if (data) setCountries(data.countries);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchStates = async (countryId) => {
    const { data, error } = await STATES.getStates(countryId, {});
    if (data) setStates(data.states);
    if (data) fetchCities(data.states[0]?.id)
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchCities = async (stateId) => {
    const { data, error } = await CITIES.getCities(stateId);
    if (data) setCities(data.cities);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCountryChange = (e) => {
    fetchStates(e.target.value);
    setApplication((prev) => { return { ...prev, country_id: e.target.value } });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleStateChange = (e) => {
    fetchCities(e.target.value);
    setApplication((prev) => { return { ...prev, state_id: e.target.value } });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleCityChange = (e) => {
    setApplication((prev) => { return { ...prev, city_id: e.target.value } });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSubmit = async (e) => {
    if (currentUser?.id == '' || currentUser?.id == null || currentUser?.id == undefined) {
      // showPopup(true);
      setopenSigninPopup(true)
      return;
    }
    e.preventDefault();
    const formData = new FormData();

    if (application.firstName == '' || application.firstName == null || application.firstName == undefined) {
      toast.error('First name is required!');
      return;
    } else {
      formData.append("first_name", application.firstName);
    }

    if (application.lastName == '' || application.lastName == null || application.lastName == undefined) {
      toast.error('Last name is required!');
      return;
    } else {
      formData.append("last_name", application.lastName);
    }

    if (application.date_of_birth == '' || application.date_of_birth == null || application.date_of_birth == undefined) {
      toast.error('Date of birth is required!');
      return;
    } else {
      formData.append("date_of_birth", application.date_of_birth);
    }

    if (application.streetAddress == '' || application.streetAddress == null || application.streetAddress == undefined) {
      toast.error('Street address is required!');
      return;
    } else {
      formData.append("street_address", application.streetAddress);
    }

    if (application.country_id == '' || application.country_id == null || application.country_id == undefined) {
      toast.error('Country is required!');
      return;
    } else {
      formData.append("country_id", application.country_id);
    }

    if (application.city_id == '' || application.city_id == null || application.city_id == undefined) {
      toast.error('City is required!');
      return;
    } else {
      formData.append("city_id", application.city_id);
    }

    if (application.state_id == '' || application.state_id == null || application.state_id == undefined) {
      toast.error('State is required!');
      return;
    } else {
      formData.append("state_id", application.state_id);
    }

    if (application.email == '' || application.email == null || application.email == undefined) {
      toast.error('Email is required!');
      return;
    } else {
      formData.append("email", application.email);
    }

    if (application.phone == '' || application.phone == null || application.phone == undefined) {
      toast.error('Phone number is required!');
      return;
    } else {
      formData.append("phone", application.phone);
    }

    if (application.cv == '' || application.cv == null || application.cv == undefined) {
      toast.error('CV is required!');
      return;
    } else {
      formData.append("cv", application.cv);
    }

    // Optional fields
    if (application.zipcode) formData.append("zipcode", application.zipcode);
    if (application.linkedin) formData.append("linkedin", application.linkedin);
    if (application.source_of_landing) formData.append("source_of_landing", application.source_of_landing);
    if (application.start_date) formData.append("start_date", application.start_date);
    if (application.desired_rate) formData.append("desired_rate", application.desired_rate);
    if (application.employmentStatus) formData.append("employmentStatus", application.employmentStatus);
    if (application.coverLetter) formData.append("cover_letter", application.coverLetter);

    const { data, error } = await JOB_APPLICATIONS.insertJobApplication(id, formData);
    if (data) {
      toast.success(data.message);
      navigate(`/jobs`);
    }
    if (error) toast.error(error.data.message);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                         Handle Change                                        */
  /* -------------------------------------------------------------------------------------------- */

  const handleChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                               Call These When Component Mounts                               */
  /* -------------------------------------------------------------------------------------------- */

  useEffect(() => {
    fetchJob();
    fetchCountries();
    fetchStates(1);
    fetchCities(1);
  }, []);

  return (
    <>
      <section className="wrapper serviceDetailsTop">
        <SinginPopup />
        <div className="shop-category-heading-top applyJob">
          <h2>{job?.title}</h2>
          <p>Home / Jobs / {job?.title ?? 'UI/UX Designer'}</p>
        </div>
      </section>
      <section className="wrapper single-job-details-sec applyJob">
        <div className="main-sec">
          <div className="details-sec">
            <div className="jobTitle">
              <img src={fixUrl(job?.thumbnail?.media?.url)} alt="" />
              <div className="title">
                <h2>{job?.title ?? 'UI/UX Designer'}</h2>
                <p>
                  {job?.city?.name} <span /> {job?.state?.name} <span /> {job?.country?.name}
                </p>
              </div>
            </div>
            <div className="apply-form-sec">
              <h2>Job Application Form</h2>
              <div className="inputGroups">
                <div className="inputgroup">
                  <label htmlFor="">
                    First Name <span>*</span>
                  </label>
                  <input type="text" name="firstName" value={application?.firstName} onChange={handleChange} />
                </div>
                {/* <div className="inputgroup">
                  <label htmlFor="">Middle Name</label>
                  <input type="text" name="middleName" onChange={handleChange} />
                </div> */}
                <div className="inputgroup">
                  <label htmlFor="">
                    Last Name <span>*</span>
                  </label>
                  <input type="text" name="lastName" value={application?.lastName} onChange={handleChange} />
                </div>
              </div>
              {/* <div className="inputGroups DOB">
                <div className="inputgroup">
                  <label htmlFor="">
                    Date Of Birth<span>*</span>
                  </label>
                  <select name="birthMonth" value={application?.birthMonth} id="" onChange={handleChange}>
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">Febuary</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div className="inputgroup">
                  <select name="birthDate" id="" value={application?.birthDate} onChange={handleChange}>
                    <option value="">Day</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                </div>
                <div className="inputgroup">
                  <select name="birthYear" id="" value={application?.birthYear} onChange={handleChange}>
                    <option value="">Year</option>
                    <option value="2000">2000</option>
                    <option value="2001">2001</option>
                    <option value="2002">2002</option>
                    <option value="2003">2003</option>
                    <option value="2004">2004</option>
                    <option value="2005">2005</option>
                    <option value="2006">2006</option>
                    <option value="2007">2007</option>
                    <option value="2008">2008</option>
                    <option value="2009">2009</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </div> */}
              <div className="inputGroups">

                <div className="inputgroup address">
                  <label htmlFor="">
                    Date Of Birth <span>*</span>
                  </label>
                  <input type="date" name="date_of_birth" value={application?.date_of_birth} onChange={handleChange} />
                </div>
                <div className="inputgroup address">
                  <label htmlFor="">
                    Zip Code <span>*</span>
                  </label>
                  <input type="number" name="zipcode" value={application?.zipcode} onChange={handleChange} />
                </div>
              </div>
              <div className="inputgroup address">
                <label htmlFor="">
                  Current Address <span>*</span>
                </label>
                <input type="text" name="streetAddress" value={application?.streetAddress} placeholder="Street Address" onChange={handleChange} />
              </div>
              {/* <div className="inputgroup">
                <label htmlFor="">Other Address</label>
                <input type="text" name="otherAddress" value={application?.otherAddress} placeholder="Street Address Line 2" onChange={handleChange} />
              </div> */}
              <div className="inputGroups ">
                <div className="inputgroup">
                  <label htmlFor="">Country</label>
                  <select name="country" id="" value={application.country_id} onChange={handleCountryChange}>
                    {countries.length > 0 && countries?.map(country => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inputgroup">

                  <select name="state" id="state" value={application.state_id} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {states.length > 0 &&
                      states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="inputgroup">
                  <select name="city" id="city" value={application.city_id} onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {cities.length > 0 &&
                      cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>
                {/* <div className="inputgroup">
                  <label htmlFor="">Postal / Zip Code</label>
                  <input type="number" name="zipcode" placeholder="City" value={application?.zipcode} onChange={handleChange} />
                </div> */}
              </div>
              <div className="inputGroups contactDetails">
                <div className="inputgroup">
                  <label htmlFor="">
                    Email Address <span>*</span>
                  </label>
                  <input type="email" name="email" placeholder="ex: myname@example.com" value={application?.email} onChange={handleChange} />
                </div>
                <div className="inputgroup">
                  <label htmlFor="">Phone Number </label>
                  <input type="tel" name="phone" placeholder="(0000)-000-0000" value={application?.phone} onChange={handleChange} />
                </div>
                <div className="inputgroup">
                  <label htmlFor="">Linkedln</label>
                  <input type="url" name="linkedin" value={application?.linkedin} onChange={handleChange} />
                </div>
              </div>
              <div className="inputGroups">
                <div className="inputgroup">
                  <label htmlFor="">
                    How did you hear about us <span>*</span>
                  </label>
                  <select name="source_of_landing" id="" value={application?.source_of_landing} onChange={handleChange}>
                    <option value="">Please Select</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Youtube">Youtube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
                <div className="inputgroup">
                  <label htmlFor="">
                    Available Start Date <span>*</span>{" "}
                  </label>
                  <input type="date" name="start_date" value={application?.start_date} onChange={handleChange} />
                </div>
                <div className="inputgroup">
                  <label htmlFor="">
                    Rate Desired ($) <span>*</span>
                  </label>
                  <input type="number" name="desired_rate" value={application?.desired_rate} placeholder="$0" onChange={handleChange} />
                </div>
              </div>
              <div className="inputGroups checkInputs">
                <h2>What is your current employment status? *</h2>
                <div className="inputgroup">
                  <input type="radio" name="employmentStatus" value={"employed"} onChange={handleChange} />
                  <label htmlFor="">Employed</label>
                </div>
                <div className="inputgroup">
                  <input type="radio" name="employmentStatus" value={"un-employed"} onChange={handleChange} />
                  <label htmlFor="">Un- Employed</label>
                </div>
                <div className="inputgroup">
                  <input type="radio" name="employmentStatus" value={"self-emmployed"} onChange={handleChange} />
                  <label htmlFor="">Self-Employed</label>
                </div>
                <div className="inputgroup">
                  <input type="radio" name="employmentStatus" value={"student"} onChange={handleChange} />
                  <label htmlFor="">Student</label>
                </div>
              </div>
              <div className="inputgroup">
                <label htmlFor="">Cover Letter</label>
                <textarea onChange={handleChange} name="coverLetter" value={application?.coverLetter} id="" cols="30" rows="10" placeholder="Write cover letter here..." />
              </div>
              <div className="inputgroup">
                <label htmlFor="">Resume</label>
                <div className="fileinput">
                  <input type="file" accept={'.txt,.pdf,.docx'} name="cv" onChange={insertThumbnail} />
                  <img src={uploadIcon} alt="" />
                  <p>{application?.cv ? `Uploaded File: ${application?.cv}` : 'Browse and chose the files you want to upload from your computer'}</p>
                  <img src={upload} alt="" />
                </div>
              </div>
              <button onClick={(e) => handleSubmit(e)} className="submit" type="submit">
                Apply Now
              </button>
            </div>
          </div>
        </div >
      </section >
    </>
  );
};

export default SingleJob;
