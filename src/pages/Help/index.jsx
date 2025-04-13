import React from "react";
import "./style.css";
import Accordion from "./Accordion";

export const Help = () => {
  const accordions = [
    { title: "Contact Us: +96181915454", content: "Content for accordion 1" },
    { title: "What's the currency exchange rate on Tjara?", content: "Content for accordion 2" },
    { title: "What is a Reserved Price? ما هو السعر المحفوظ؟", content: "Content for accordion 1" },
    { title: "How to add discounts?", content: "Content for accordion 2" },
    { title: "Contact Us: +96181915454", content: "Content for accordion 1" },
    { title: "What's the currency exchange rate on Tjara? ", content: "Content for accordion 2" },
    // Add more accordions as needed
  ];

  return (
    <div className="wrapper help-page">
      <div className="main-sec">
        <div className="heading-sec2">
          <p>Home / Help-Center</p>
          <h2>Help-Center</h2>
        </div>
      </div>
      <div className="faqs-section">
        {accordions.map((accordion, index) => (
          <Accordion
            key={index}
            title={accordion.title}
            content={accordion.content}
          />
        ))}
      </div>
    </div>
  );
};
