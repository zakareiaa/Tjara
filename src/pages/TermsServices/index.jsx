import { React, useState, useEffect } from "react";
import Faq from "../../components/faqSection/Faq";
import POSTS from '@client/postsClient'
import "./style.css";
const TermServices = () => {
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
      <section className="wrapper terms-service-section">
        <div className="main">
          <div className="bread-crumbs-heading">
            <p>Home / Terms & Service</p>
          </div>
          <h2 className="heading">Terms & Service</h2>
          <div className="content">
            <p>
              Welcome to our website. By accessing or using our services, you agree to comply with and be bound by
              these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h3 className="sub-heading">1. Acceptance of Terms</h3>
            <p>
              By accessing or using our website, you confirm that you have read, understood, and agreed to be bound by
              these Terms of Service, as well as any applicable laws and regulations. We reserve the right to update
              or modify these terms at any time without prior notice.
            </p>

            <h3 className="sub-heading">2. Use of Services</h3>
            <ul>
              <li>You must be at least 18 years old or have legal parental/guardian consent to use our services.</li>
              <li>You agree to use our website for lawful purposes only and not for any illegal or unauthorized activities.</li>
              <li>You must not attempt to interfere with the operation or functionality of our website.</li>
              <li>All content you submit or share must not infringe on any third-party rights, including intellectual property.</li>
            </ul>

            <h3 className="sub-heading">3. User Accounts</h3>
            <p>
              If our services require account creation:
            </p>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate and up-to-date information during registration.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>

            <h3 className="sub-heading">4. Intellectual Property</h3>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of
              our company or our licensors and is protected by applicable copyright and trademark laws.
            </p>
            <ul>
              <li>You may not copy, reproduce, distribute, or create derivative works from our content without prior written consent.</li>
              <li>Unauthorized use of our intellectual property may result in legal action.</li>
            </ul>

            <h3 className="sub-heading">5. Limitations of Liability</h3>
            <p>
              To the maximum extent permitted by law, we will not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising out of your use of our services. This includes but is not
              limited to loss of data, business interruption, or personal injury.
            </p>

            <h3 className="sub-heading">6. Third-Party Links</h3>
            <p>
              Our website may contain links to third-party websites or services that are not under our control. We are
              not responsible for the content, privacy policies, or practices of any third-party sites.
            </p>

            <h3 className="sub-heading">7. Termination</h3>
            <p>
              We reserve the right to suspend or terminate your access to our services at any time without notice if
              we believe you have violated these Terms of Service. Upon termination, your right to use our services
              will cease immediately.
            </p>

            <h3 className="sub-heading">8. Indemnification</h3>
            <p>
              You agree to defend, indemnify, and hold us harmless from any claims, liabilities, damages, losses, or
              expenses (including legal fees) arising out of your use of our services or any breach of these terms.
            </p>

            <h3 className="sub-heading">9. Changes to These Terms</h3>
            <p>
              We may revise these Terms of Service at any time. When we do, we will update the effective date at the
              top of this page. Continued use of our website after such changes constitutes your acceptance of the
              updated terms.
            </p>

            <h3 className="sub-heading">10. Governing Law</h3>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of [Your Country/State],
              without regard to its conflict of law provisions. Any disputes arising from these terms will be subject
              to the exclusive jurisdiction of the courts in [Your Location].
            </p>
          </div>


        </div>
      </section>
      <Faq />
    </>
  );
};

export default TermServices;
