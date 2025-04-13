import React, { useEffect, useState } from "react";
import "./Faq.css";
import POSTS from "@client/postsClient";
import ContactForm from "../ContactForm/index";
import { usePopup } from "@components/DataContext";

function Faq({ ids, limit, className = '' }) {
  const { accountCreateBtn } = usePopup();
  const [faqs, setFaqs] = useState([])
  const [activeIndex, setActiveIndex] = useState(null);
  const [contactPopup, setcontactPopup] = useState(false);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchFAQ = async () => {
    const ApiParams = {
      ids: ids,
      filterJoin: "OR",
      filterByColumns: {
        filterJoin: "OR",
        columns: [
          {
            column: 'post_type',
            value: 'faqs',
            operator: '=',
          }
        ]
      },
      per_page: 3,
    }

    const { data, error } = await POSTS.getPosts(ApiParams);

    if (data) setFaqs(data.posts);

    if (error) console.error(error);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchFAQ()
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <section className={`wrapper faq-section ${className} `}>
      <div className="bg">
        <div className="faq-red-box-empty" />
        <div className="faq-gray-box-empty" />
      </div>
      <div className="main">
        {contactPopup && (
          <ContactForm />
        )}
        <div className="become-a-seller-box">
          <p className="become-a-seller-heading">Become A Seller</p>
          <p className="become-a-seller-description">Tjara provides the perfect space for you to grow your brand and connect with customers who appreciate your craft. Sign up now and start your journey with Tjara!</p>
          <button onClick={accountCreateBtn} className="become-a-seller-btn button">Register Seller Account</button>
        </div>
        <div className="faq-box">
          <p className="faq-heading">Frequently Asked Questions</p>
          <p className="faq-description">Here, you'll find answers to some of the most frequently asked questions about our multivendor e-commerce platform. Whether you're a buyer looking for information on how to make a purchase, or a seller seeking guidance on how to list your products, we've got you covered. From account setup and payment processes to shipping options and dispute resolution, our goal is to provide you with all the information you need to have a smooth and enjoyable experience on our site.</p>
          <div className="accordion">
            {faqs?.data?.map((faq, index) => (
              <div className="accordion-item" onClick={() => toggleAccordion(index)} key={index}>
                <div className={`accordion-title ${index === activeIndex ? "active" : ""}`} >{faq.name} <span>{index === activeIndex ? "-" : "+"}</span></div>
                <div className={`accordion-content ${index === activeIndex ? "active" : ""}`} dangerouslySetInnerHTML={{ __html: faq?.description }} />
              </div>
            ))}
          </div>
          <button className="button faq-contact-btn" onClick={() => setcontactPopup(!contactPopup)}>Contact Us</button>
        </div>
      </div>
    </section>
  );
}

export default Faq;
