import React, { useEffect, useState } from 'react';
import MEMBERSHIP_PLANS from '../../client/membershipPlansClient';
import { useNavigate } from 'react-router-dom';
import './style.css';

const ClubBenefits = () => {
  const levels = [
    { level: 1, invest: 'less than $50', discount: '15%', referral: '3%' },
    { level: 2, invest: '$50 - $99.99', discount: '16%', referral: '3%' },
    { level: 3, invest: '$100 - $149.99', discount: '17%', referral: '3%' },
    { level: 4, invest: '$150 - $199.99', discount: '18%', referral: '3%' },
    { level: 5, invest: '$200 - $299.99', discount: '19%', referral: '3%' },
    { level: 6, invest: '$300 - $399.99', discount: '20%', referral: '3%' },
    { level: 7, invest: '$400 - $499.99', discount: '20%', referral: '3%', bonus: '$10 Credit' },
    { level: 8, invest: '$500 - $599.99', discount: '20%', referral: '3%', bonus: '$15 Credit' },
    { level: 9, invest: '$600 & More', discount: '20%', referral: '3%', bonus: '$20 Credit' },
  ];

  const navigate = useNavigate();
  const [membershipPlans, setMembershipPlans] = useState({
    data: [],
    current_page: 1,
    prev_page_url: '',
    next_page_url: '',
    links: [],
  });
  const [currentPage, setCurrentPage] = useState(1);

  /* --------------------------------------------- X -------------------------------------------- */

  const fetchMembershipPlans = async () => {
    const columns = [];
    const ApiParams = {
      with: "thumbnail,shop",
      filterJoin: "OR",
      orderBy: "created_at",
      order: "asc",
      page: currentPage,
      // per_page: 10,
    };

    columns.push({ column: "user_type", value: "reseller", operator: "=" });

    if (columns.length > 0) {
      ApiParams.filterByColumns = {
        filterJoin: 'AND',
        columns: columns,
      }
    }

    const { data, error } = await MEMBERSHIP_PLANS.getMembershipPlans(ApiParams);
  
    if (data) {
      setMembershipPlans(data?.membership_plans || {
        data: [],
        current_page: 1,
        prev_page_url: '',
        next_page_url: '',
        links: [],
      });
    }

    if (error) {
      setMembershipPlans(
        {
          data: [],
          current_page: 1,
          prev_page_url: '',
          next_page_url: '',
          links: [],
        }
      );
      console.error("Error fetching membership plans:", error);
    }
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    fetchMembershipPlans();
  }, [currentPage]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className="wrapper reseller-program">


      <main className="container" >
        <section className="section">
          <h2>How It Works</h2>
          <div className="steps">
            {[
              { title: "Start with just $50", description: "Begin your reseller journey with a minimum purchase of $50." },
              { title: "Unlock discounts and bonuses", description: "The more you invest, the more you save! Plus, earn bonus credits as you go." },
              { title: "Enjoy the benefits", description: "Free delivery on all orders and exclusive offers for resellers." }
            ].map((step, index) => (
              <div key={index} className="step">
                <h3>{`${index + 1}. ${step.title}`}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Discount, Bonus, & Referral Earning Levels</h2>
          <div className="levels">
            {membershipPlans?.data?.map((level, index) => (
              <div key={index} className="level">
                <h3>{level?.name}</h3>
                <h1>Invest {`$${level?.features?.membership_plan_features.find((feature) => feature?.name === 'min-spent')?.value}` || ""}</h1>
                <ul>
                  <li>Discount: {`${level?.features?.membership_plan_features.find((feature) => feature?.name === 'checkout-discount')?.value}%` || ""}</li>
                  <li>Referral Earning: {`${level?.features?.membership_plan_features.find((feature) => feature?.name === 'referrel-earnings')?.value}%` || ""}</li>
                  <li>Bonus: {`$${level?.features?.membership_plan_features.find((feature) => feature?.name === 'bonus-amount')?.value}` || ""}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubBenefits;