import React, { useEffect, useState, cloneElement, useRef, act } from "react";
import "../Radio.css";

function Radio({ children, active, setItem }) {
  const [currentactive, SetActive] = useState(null);

  const handleClick = (event) => {
    const clickedElement = event.target.textContent.replaceAll(" ", "");
    // console.log(clickedElement);
    SetActive(clickedElement);
    setItem(clickedElement);
  };

  const renderChildrenWithClickHandler = (l_active = null) => {
    return React.Children.map(children, (child) => {
      // console.log("l_active", l_active);
      // console.log(
      //   Array.isArray(child.props.children)
      //     ? child.props.children.includes(l_active)
      //     : "child.props.children"
      // );
      //   console.log(Array.isArray(child.props.children.length));

      if (React.isValidElement(child)) {
        if (
          Array.isArray(child.props.children) &&
          child.props.children.includes(l_active)
        ) {
          return cloneElement(child, {
            onClick: handleClick,
            className: "radio-element radio-active",
          });
        }

        if (
          !l_active &&
          Array.isArray(child.props.children) &&
          child.props.children.includes(active)
        ) {
          return cloneElement(child, {
            onClick: handleClick,
            className: "radio-element radio-active",
          });
        }

        if (!l_active && child.props.children == active) {
          return cloneElement(child, {
            onClick: handleClick,
            className: "radio-element radio-active",
          });
        }

        if (child.props.children == l_active) {
          return cloneElement(child, {
            onClick: handleClick,
            className: "radio-element radio-active",
          });
        }
        return cloneElement(child, {
          onClick: handleClick,
          className: "radio-element",
        });
      }
      return child;
    });
  };

  return (
    <div className="radio noselect">
      {renderChildrenWithClickHandler(currentactive)}
    </div>
  );
}

export default Radio;
