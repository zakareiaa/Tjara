import { React, useState, useEffect } from "react";
import Faq from "../../components/faqSection/Faq";
import POSTS from '@client/postsClient'
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import "./style.css";

const HelpAndCenter = () => {
  const [faqs, setFaqs] = useState([])
  const [activeIndex, setActiveIndex] = useState(null);
  const { globalSettings } = useheaderFooter();

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchFAQs = async () => {
    const ApiParams = {
      filterJoin: "OR",
      filterByColumns: {
        filterJoin: "AND",
        columns: [
          {
            column: 'post_type',
            value: 'faqs',
            operator: '=',
          }
        ]
      },
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) setFaqs(data.posts.data);

    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchFAQs()
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <>
      <section className="wrapper help-and-center-section">
        <div className="main">
          <div className="bread-crumbs-heading">
            <p>Home / Help Center</p>
          </div>
          <h2 className="heading">Help Center</h2>

          {/* Contact Information Section */}
          <div className="contact-info-section">
            <div className="contact-card">
              <div className="icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#34A853" />
                </svg>
              </div>
              <h3>Email Us</h3>
              <p><a target="_blank" href={`mailto:${globalSettings?.website_email}`}>{globalSettings?.website_email}</a></p>
              {/* <p>info@tjara.com</p> */}
            </div>

            <div className="contact-card">
              <div className="icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="#34A853" />
                </svg>
              </div>
              <h3>Call Us</h3>
              <p><a target="_blank" href={`tel:${globalSettings?.website_whatsapp_number}`}>{globalSettings?.website_whatsapp_number}</a></p>
              <p>Mon - Fri, 9:00 AM - 6:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#34A853" />
                </svg>
              </div>
              <h3>Visit Us</h3>
              <p>76G8+R62 Al-Sahili center</p>
              <p>Tyre, Lebanon</p>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="map-section">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3335.59791271545!2d35.21552330000001!3d33.2770174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e87d7ebe1cd13%3A0x6aefe34343451c51!2sTjara.com!5e0!3m2!1sen!2s!4v1736252996427!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <h2 className="heading">FAQs</h2>

          <div className="accordions-sec">
            <div className="accordians">
              {faqs?.slice(0, faqs?.length / 2).map((faq, key) => (
                <div key={key} className={`accordian ${faq.id === activeIndex ? "active" : ""}`}>
                  <div className="accordianButton" onClick={() => toggleAccordion(faq.id)}>
                    {faq.name}
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" /></svg>
                  </div>
                  <div className="accordianBody" dangerouslySetInnerHTML={{ __html: faq?.description }} />
                </div>
              ))}
            </div>
            <div className="accordians">
              {faqs?.slice(faqs?.length / 2, faqs?.length).map((faq, key) => (
                <div key={key} className={`accordian ${faq.id === activeIndex ? "active" : ""}`}>
                  <div className="accordianButton" onClick={() => toggleAccordion(faq.id)}>
                    {faq.name}
                    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9568 0.615581C16.7224 0.381242 16.4045 0.249597 16.073 0.249597C15.7416 0.249597 15.4237 0.381242 15.1893 0.61558L9.00177 6.80308L2.81427 0.615579C2.57852 0.387882 2.26277 0.261889 1.93502 0.264737C1.60727 0.267584 1.29376 0.399045 1.062 0.630806C0.830239 0.862566 0.698779 1.17608 0.695931 1.50383C0.693084 1.83157 0.819075 2.14733 1.04677 2.38308L8.11802 9.45433C8.35243 9.68867 8.67032 9.82031 9.00177 9.82031C9.33323 9.82031 9.65111 9.68867 9.88552 9.45433L16.9568 2.38308C17.1911 2.14867 17.3228 1.83079 17.3228 1.49933C17.3228 1.16788 17.1911 0.84999 16.9568 0.615581Z" fill="#898989" /></svg>
                  </div>
                  <div className="accordianBody" dangerouslySetInnerHTML={{ __html: faq?.description }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
};

export default HelpAndCenter;
