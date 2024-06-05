import React, { useEffect, useState } from "react";
import "../ColorPicker.css";
import CheckSvg from "../assets/CheckSvg";

function ColorPicker({ colors, setItem, active }) {
  const [l_active, SetActive] = useState(null);

  useEffect(() => {
    if (active) SetActive(active);
  }, [active]);

  function handleClick(item) {
    SetActive(item);
    // console.log(item);
    setItem(item);
  }

  return (
    <div className="color-picker">
      {colors.map((item) => {
        return (
          <div
            className={`color-elements${
              item == l_active ? " color-element-active" : ""
            }`}
            style={{ background: item }}
            key={item}
            onClick={() => handleClick(item)}
          >
            {l_active == item && (
              <div style={{ width: "20px", height: "20px" }}>
                <CheckSvg />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ColorPicker;
