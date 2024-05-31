import React, { useEffect, useState } from "react";
import "../Dropdown.css";
import { useParams } from "react-router-dom";

function Dropdown({ l_elements, current_active, l_active }) {
  const [show, SetShow] = useState(0);
  const [elements, SetElements] = useState(l_elements);
  const { sub } = useParams();
  const [active, SetActive] = useState("Hot");

  useEffect(() => {
    SetElements(l_elements);
    SetActive(current_active);
  }, []);

  return (
    <div className="dropdown ">
      <div
        className="element dropdown-active clickable"
        onClick={() => {
          SetShow((show) => (show == 1 ? 2 : 1));
        }}
      >
        {active}
        <i className="bx bx-chevron-down"></i>
      </div>
      <div
        className={`elements ${
          (show == 1 && "show-dropdown") || (show == 2 && "collapse-dropdown")
        }`}
      >
        {elements &&
          elements.map((item, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  SetActive(e.target.innerText);
                  SetShow((show) => (show == 1 ? 2 : 1));
                  l_active(e.target.innerText);
                  // console.log(e);
                }}
                className="element "
              >
                {item}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dropdown;
