import { React, useState, useEffect } from "react";
import { usePopup } from "@components/DataContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import serviceImg from "./assets/services.png";
import RatedStar from "../../assets/rated-star.svg";
import SERVICES from "@client/servicesClient";
import SERVICE_ENQUIRIES from "@client/serviceEnquiriesClient";
import SinginPopup from "@components/signInPopup/index";
import { useAuth } from "@contexts/Auth";
import "./style.css";
import { fixUrl } from "../../helpers/helpers";

const SingleService = () => {
  const { id } = useParams();
  const [inquireNowPopup, setinquireNowPopup] = useState(false);
  const [services, setServices] = useState([]);
  const { showPopup, setopenSigninPopup } = usePopup();
  const { currentUser } = useAuth();
  const [service, setService] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    regular_price: "",
  });
  const navigate = useNavigate();

  /* --------------------------------------------- X -------------------------------------------- */

  const [enquiry, setEnquiry] = useState({
    full_name: `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`,
    phone: '',
    serviceName: service?.name,
    message: ''
  });

  /* --------------------------------------------- X -------------------------------------------- */

  const resizeScreenFunction = () => {
    if (window.innerWidth <= 400) {
      setDisplayedProducts(1);
    } else if (window.innerWidth <= 550) {
      setDisplayedProducts(2);
    } else if (window.innerWidth <= 850) {
      setDisplayedProducts(3);
    } else if (window.innerWidth <= 1640) {
      setDisplayedProducts(4);
    }
    if (window.innerWidth <= 450) {
      setverticalSlider(false);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await SERVICE_ENQUIRIES.insertServiceEnquiry(id, {
      full_name: enquiry.full_name,
      phone_number: enquiry.phone,
      service_name: enquiry.serviceName,
      message: enquiry.message
    });
    if (data) {
      toast.success(data.message);
      setinquireNowPopup(false);
    }
    if (error) console.error(error);
    if (error) setopenSigninPopup(true);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchService = async () => {
    const { data, error } = await SERVICES.getService(id, {});
    if (data) setService(data.service);
    setEnquiry({ ...enquiry, serviceName: data.service.name });
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchServices = async () => {
    const { data, error } = await SERVICES.getServices({
      paginated: true,
    });
    if (data) setServices(data.services.data);
    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchService();
    fetchServices();
    window.addEventListener("resize", () => {
      resizeScreenFunction();
    });
  }, [window.innerWidth]);

  /* --------------------------------------------- X -------------------------------------------- */

  return (
    <>
      <SinginPopup />

      {inquireNowPopup && (
        <div className="inquireNowPopup">
          <div className="bg" onClick={() => setinquireNowPopup(false)} />
          <div className="container">
            <svg onClick={() => setinquireNowPopup(false)} className="close" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8257 1.18559C14.7255 1.08516 14.6065 1.00548 14.4754 0.951119C14.3443 0.896755 14.2039 0.868773 14.062 0.868773C13.9201 0.868773 13.7796 0.896755 13.6486 0.951119C13.5175 1.00548 13.3985 1.08516 13.2982 1.18559L8.00073 6.47225L2.70323 1.17475C2.60293 1.07446 2.48386 0.994897 2.35282 0.940616C2.22177 0.886336 2.08132 0.858398 1.93948 0.858398C1.79764 0.858398 1.65719 0.886336 1.52614 0.940616C1.3951 0.994897 1.27603 1.07446 1.17573 1.17475C1.07543 1.27505 0.995873 1.39412 0.941593 1.52517C0.887312 1.65621 0.859375 1.79666 0.859375 1.9385C0.859375 2.08035 0.887312 2.2208 0.941593 2.35184C0.995873 2.48289 1.07543 2.60196 1.17573 2.70225L6.47323 7.99975L1.17573 13.2973C1.07543 13.3975 0.995873 13.5166 0.941593 13.6477C0.887312 13.7787 0.859375 13.9192 0.859375 14.061C0.859375 14.2028 0.887312 14.3433 0.941593 14.4743C0.995873 14.6054 1.07543 14.7245 1.17573 14.8248C1.27603 14.925 1.3951 15.0046 1.52614 15.0589C1.65719 15.1132 1.79764 15.1411 1.93948 15.1411C2.08132 15.1411 2.22177 15.1132 2.35282 15.0589C2.48386 15.0046 2.60293 14.925 2.70323 14.8248L8.00073 9.52725L13.2982 14.8248C13.3985 14.925 13.5176 15.0046 13.6486 15.0589C13.7797 15.1132 13.9201 15.1411 14.062 15.1411C14.2038 15.1411 14.3443 15.1132 14.4753 15.0589C14.6064 15.0046 14.7254 14.925 14.8257 14.8248C14.926 14.7245 15.0056 14.6054 15.0599 14.4743C15.1141 14.3433 15.1421 14.2028 15.1421 14.061C15.1421 13.9192 15.1141 13.7787 15.0599 13.6477C15.0056 13.5166 14.926 13.3975 14.8257 13.2973L9.52823 7.99975L14.8257 2.70225C15.2374 2.29059 15.2374 1.59725 14.8257 1.18559Z" fill="#717171" /></svg>
            <h2>Send Inquire</h2>
            <form>
              <input onChange={handleChange} name="full_name" value={enquiry.full_name} type="text" placeholder="Full Name" />
              <input onChange={handleChange} name="phone" value={enquiry.phone} type="text" placeholder="Phone Number" />
              <input onChange={handleChange} name="serviceName" value={enquiry.serviceName} type="text" placeholder="Service Name" />
              <textarea onChange={handleChange} name="message" value={enquiry.message} cols="30" rows="10" placeholder="Message" />
              <div className="buttons">
                <button onClick={(e) => handleSubmit(e)}>Submit</button>
                <p><span /> Or <span /></p>
                <Link target="_blank" to={`https://api.whatsapp.com/send?phone=${service?.shop?.shop?.meta?.phone}&text=Inquiry%20for%20${enquiry.serviceName}`}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.79 0.63953L11.22 0.55953C9.50693 0.312188 7.75885 0.556886 6.17954 1.2651C4.60023 1.97331 3.25476 3.11585 2.3 4.55953C1.28416 5.93951 0.678585 7.57827 0.552979 9.28722C0.427373 10.9962 0.786836 12.7059 1.59 14.2195C1.6722 14.3712 1.72337 14.5378 1.74054 14.7095C1.75771 14.8812 1.74053 15.0546 1.69 15.2195C1.28 16.6295 0.9 18.0495 0.5 19.5395L1 19.3895C2.35 19.0295 3.7 18.6695 5.05 18.3395C5.33494 18.2803 5.63112 18.3082 5.9 18.4195C7.1112 19.0107 8.43482 19.3359 9.78205 19.3733C11.1293 19.4108 12.4689 19.1597 13.7111 18.6368C14.9533 18.1139 16.0692 17.3313 16.9841 16.3416C17.899 15.352 18.5915 14.178 19.0153 12.8987C19.4392 11.6193 19.5844 10.2641 19.4414 8.92394C19.2983 7.5838 18.8703 6.28977 18.1859 5.12869C17.5016 3.9676 16.5769 2.96632 15.4737 2.19205C14.3706 1.41778 13.1146 0.888435 11.79 0.63953ZM14.31 13.7595C13.9466 14.0849 13.5034 14.3082 13.0256 14.4065C12.5478 14.5049 12.0524 14.4749 11.59 14.3195C9.49456 13.7295 7.67661 12.4148 6.46 10.6095C5.99529 9.97106 5.6217 9.27101 5.35 8.52953C5.20285 8.0993 5.17632 7.637 5.27327 7.19276C5.37023 6.74853 5.58698 6.33932 5.9 6.00953C6.05239 5.81505 6.25981 5.67096 6.49526 5.59605C6.7307 5.52113 6.98325 5.51886 7.22 5.58953C7.42 5.63953 7.56 5.92953 7.74 6.14953C7.886 6.56253 8.057 6.96653 8.25 7.35953C8.39642 7.56004 8.45758 7.81033 8.42011 8.05577C8.38263 8.3012 8.24958 8.52185 8.05 8.66953C7.6 9.06953 7.67 9.39953 7.99 9.84953C8.69745 10.8687 9.6736 11.6718 10.81 12.1695C11.13 12.3095 11.37 12.3395 11.58 12.0095C11.67 11.8795 11.79 11.7695 11.89 11.6495C12.47 10.9195 12.29 10.9295 13.21 11.3295C13.503 11.4525 13.787 11.5965 14.06 11.7595C14.33 11.9195 14.74 12.0895 14.8 12.3295C14.8577 12.5899 14.8425 12.8611 14.7561 13.1134C14.6696 13.3657 14.5153 13.5893 14.31 13.7595Z" fill="white" /> </svg>Whatsapp</Link>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="wrapper serviceDetailsTop">
        <div className="shop-category-heading-top">
          <h2>{service?.name}</h2>
          <p>Home / Jobs / {service?.name}</p>
        </div>
      </section>

      <section className="wrapper banner-sec serviceDetails">
        <div className="left">
          <img src={fixUrl(service?.thumbnail?.media?.url)} alt="" />
        </div>
        <div className="ServiceDetails">
          <div className="Top">
            {/* <div className="rating">
              <img src={RatedStar} alt="" />
              <img src={RatedStar} alt="" />
              <img src={RatedStar} alt="" />
              <img src={RatedStar} alt="" />
              <img src={RatedStar} alt="" />
              <p>(4.5)</p>
            </div> */}
            <h2>{service?.name}</h2>
            <p>{service?.city?.name} <span /> {service?.state?.name} <span /> {service?.country?.name}</p>
          </div>
          <div className="description">
            <h2>Description:</h2>
            <p dangerouslySetInnerHTML={{ __html: service?.description }} />
            <div className="buttons">
              <button onClick={() => setinquireNowPopup(true)}>Inquire Now</button>
              {/* <button>
                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.1154 18.6417L11.9987 18.7583L11.8704 18.6417C6.3287 13.6133 2.66536 10.2883 2.66536 6.91667C2.66536 4.58333 4.41536 2.83333 6.7487 2.83333C8.54537 2.83333 10.2954 4 10.9137 5.58667H13.0837C13.702 4 15.452 2.83333 17.2487 2.83333C19.582 2.83333 21.332 4.58333 21.332 6.91667C21.332 10.2883 17.6687 13.6133 12.1154 18.6417ZM17.2487 0.5C15.2187 0.5 13.2704 1.445 11.9987 2.92667C10.727 1.445 8.7787 0.5 6.7487 0.5C3.15536 0.5 0.332031 3.31167 0.332031 6.91667C0.332031 11.315 4.2987 14.92 10.307 20.3683L11.9987 21.9083L13.6904 20.3683C19.6987 14.92 23.6654 11.315 23.6654 6.91667C23.6654 3.31167 20.842 0.5 17.2487 0.5Z" fill="#9E9E9E" />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper serviceDetailsBottom">
        <div className="topHeading">
          <h2>Related Services</h2>
          <button onClick={() => navigate(`/services`)}>View All</button>
        </div>
        <div className="jobs services">
          {services?.map((e, i) => {
            return (
              <div key={i} className="job service">
                <div className="Top">
                  <img src={fixUrl(e?.thumbnail?.media?.url)} alt="" />
                </div>
                <div className="title">
                  <div className="rating">
                    <img src={RatedStar} alt="" />
                    <img src={RatedStar} alt="" />
                    <img src={RatedStar} alt="" />
                    <img src={RatedStar} alt="" />
                    <img src={RatedStar} alt="" />
                  </div>
                  <Link to={`/services/${e?.id}`}>
                    <h2 className="job-name">
                      {e?.name}
                    </h2>
                  </Link>
                  <p>
                    {e?.state?.name} <span /> {e?.country?.name}
                  </p>
                </div>
                <Link to={`/services/${e?.id}`}>
                  <button>Inquire Now</button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {/* {displayedProducts < products.length && (
        <div className="load-more-btn-row">
          <button className="button" onClick={loadMoreProducts}>
            Load More
          </button>
        </div>
      )} */}
    </>
  );
};

export default SingleService;
