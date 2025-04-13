import { React, useState, useEffect } from "react";
import Faq from "../../components/faqSection/Faq";
import POSTS from '@client/postsClient'
import "./style.css";
const PrivacyPolicy = () => {
  const [faqs, setFaqs] = useState([])
  const [activeIndex, setActiveIndex] = useState(null);

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
      <section className="wrapper privacy-policy-section">
        <div className="main">
          <div className="bread-crumbs-heading">
            <p>Home / Privacy Policy</p>
          </div>
          <h2 className="heading">Privacy Policy</h2>
          <div className="content">
            <p>
              Welcome to our Privacy Policy. Your privacy is critically important to us. This policy explains how we
              collect, use, and protect your personal information when you visit or use our services.
            </p>

            <h3 className="sub-heading">1. Information We Collect</h3>
            <p>
              We collect personal data that you voluntarily provide, including your name, email, and usage data.
              Automatically collected information includes IP address, browser type, and session data.
            </p>

            <h3 className="sub-heading">2. How We Use Your Information</h3>
            <ul>
              <li>To provide and maintain our service.</li>
              <li>To communicate with you, including updates and support.</li>
              <li>To improve user experience and analyze website performance.</li>
              <li>To ensure security and prevent fraud.</li>
              <li>To comply with legal obligations and enforce our terms of service.</li>
            </ul>

            <h3 className="sub-heading">3. Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to collect data for analytics, improve functionality,
              and enhance user experience. You can disable cookies in your browser settings, but this may limit certain
              features of our site.
            </p>

            <h3 className="sub-heading">4. Third-Party Services</h3>
            <p>
              We may share your data with trusted third-party services, including:
            </p>
            <ul>
              <li><strong>Analytics Providers:</strong> To analyze and improve our site’s performance.</li>
              <li><strong>Payment Processors:</strong> To securely handle transactions.</li>
              <li><strong>Hosting Services:</strong> For data storage and infrastructure.</li>
              <li><strong>Marketing Tools:</strong> To send newsletters or promotional content (only with consent).</li>
            </ul>

            <h3 className="sub-heading">5. Data Security</h3>
            <p>
              We implement robust security measures to protect your data. However, no method of transmission over the
              internet or electronic storage is 100% secure.
            </p>

            <h3 className="sub-heading">6. Your Rights</h3>
            <p>
              You have the following rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Access:</strong> View the data we hold about you.</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data.</li>
              <li><strong>Object:</strong> Restrict how we process your data.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at <strong>support@example.com</strong>.
            </p>

            <h3 className="sub-heading">7. Changes to This Policy</h3>
            <p>
              We may update our Privacy Policy periodically. Any changes will be posted on this page with an updated
              effective date. We encourage you to review this policy regularly to stay informed about how we protect
              your data.
            </p>
          </div>

        </div>
      </section>
      <Faq />
    </>
  );
};

export default PrivacyPolicy;
