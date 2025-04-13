import React, { useEffect, useState } from "react";

import AccordionOpen from './assets/accordionopen.svg'
import AccordionClose from './assets/accordionclose.svg'

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };
  return (
    <div className={`faq ${isActive ? "active" : ""}`}>
      <div className="">
        <div className="title" onClick={toggleAccordion}>
          <div>{title}</div>
          <div>{isActive ? <img src={AccordionOpen} alt="" /> : <img src={AccordionClose} alt="" /> }</div>
          
        </div>
        {isActive && <div className="description">{content}</div>}
      </div>
    </div>
  );
};

export default Accordion;
