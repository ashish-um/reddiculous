import React, { useEffect, useState, cloneElement, useRef } from "react";

function DropdownV2({ children, current_active, parent = false, L_Activate }) {
  const [show, SetShow] = useState(0);
  //   const [elements, SetElements] = useState(l_elements);
  const [active, SetActive] = useState("Hot");
  const dropdownRef = useRef(null);

  useEffect(() => {
    SetActive(current_active);
  }, [current_active]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        show === 1 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        SetShow(2); // Collapse the dropdown if it is open
      }
    };

    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]); // Depend on `show` to ensure the listener checks the current state

  const handleClick = (event) => {
    const clickedElement = event.target.textContent;
    L_Activate && L_Activate(clickedElement);
    // console.log("Clicked element:", clickedElement);
    SetActive(clickedElement); // Update active state
    SetShow((show) => (show == 1 ? 2 : 1));
  };

  const renderChildrenWithClickHandler = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return cloneElement(child, {
          onClick: handleClick,
        });
      }
      return child;
    });
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
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
        className={`elements ${!parent && "embed-elements"} ${
          (show == 1 && "show-dropdown") || (show == 2 && "collapse-dropdown")
        }`}
      >
        {renderChildrenWithClickHandler()}
      </div>
    </div>
  );
}

export default DropdownV2;
