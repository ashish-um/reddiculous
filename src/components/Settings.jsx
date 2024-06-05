import React, { useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import { useState } from "react";
import Toggle from "./Toggle";
import DropdownV2 from "./DropdownV2";
import Radio from "./Radio";
import BatSvg from "../assets/BatSvg";
import LightSvg from "../assets/LightSvg";
import DarkSvg from "../assets/DarkSvg";
import ColorPicker from "./ColorPicker";
import {
  DARK_PURPLE,
  DARK_GREEN,
  DARK_BLUE,
  DARK_MULL,
  LIGHT_PURPLE,
  LIGHT_GREEN,
  LIGHT_BLUE,
  LIGHT_MULL,
  BLACK_PURPLE,
  BLACK_GREEN,
  BLACK_BLUE,
  BLACK_MULL,
} from "../assets/themes/DefaultTheme";

function Settings() {
  const [themeActive, SetThemeActive] = useState(null);
  const colors = ["#7a61c1", "#008170", "#1F6E8C", "#872341"];
  const [themeColor, SetThemeColor] = useState(null);
  const isInitialMount = useRef(true);

  const loadTheme = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));

    document.documentElement.style.setProperty(
      "--body-background",
      theme.background
    );
    document.documentElement.style.setProperty(
      "--card-background",
      theme.cardBackground
    );
    // import "../assets/themes/default.css";
    document.documentElement.style.setProperty(
      "--card-element",
      theme.cardElement
    );
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primary
    );
    document.documentElement.style.setProperty(
      "--success-color",
      theme.success
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondaryColor
    );
    document.documentElement.style.setProperty("--text-color", theme.text);
  };

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      let themeType = JSON.parse(
        localStorage.getItem("theme")
      ).theme[0].toLowerCase();
      SetThemeActive(themeType[0].toUpperCase() + themeType.slice(1));
      let themeColorType = JSON.parse(localStorage.getItem("theme")).theme[1];
      if (themeColorType === "PURPLE") SetThemeColor(colors[0]);
      if (themeColorType === "GREEN") SetThemeColor(colors[1]);
      if (themeColorType === "BLUE") SetThemeColor(colors[2]);
      if (themeColorType === "MULL") SetThemeColor(colors[3]);

      // console.log(
      //   "THEME ACTIVE",
      //   themeType[0].toUpperCase() + themeType.slice(1)
      // );
    }
  }, []);

  useEffect(() => {
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;

    //   return;
    // }
    console.log(`Active: ${themeActive}, Color: ${themeColor}`);

    if (themeActive == "Light") {
      if (themeColor == colors[0]) loadTheme(LIGHT_PURPLE);
      if (themeColor == colors[1]) loadTheme(LIGHT_GREEN);
      if (themeColor == colors[2]) loadTheme(LIGHT_BLUE);
      if (themeColor == colors[3]) loadTheme(LIGHT_MULL);
    }
    if (themeActive == "Dark") {
      if (themeColor == colors[0]) loadTheme(DARK_PURPLE);
      if (themeColor == colors[1]) loadTheme(DARK_GREEN);
      if (themeColor == colors[2]) loadTheme(DARK_BLUE);
      if (themeColor == colors[3]) loadTheme(DARK_MULL);
    }
    if (themeActive == "Black") {
      if (themeColor == colors[0]) loadTheme(BLACK_PURPLE);
      if (themeColor == colors[1]) loadTheme(BLACK_GREEN);
      if (themeColor == colors[2]) loadTheme(BLACK_BLUE);
      if (themeColor == colors[3]) loadTheme(BLACK_MULL);
    }
  }, [themeActive, themeColor]);

  return (
    <>
      <h1 style={{ marginBottom: "10px" }}>Settings</h1>
      {/* <br /> */}
      <hr />
      <br />
      <div
        style={{
          display: "flex",
          // justifyContent: "",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>Theme</h2>
        <Radio setItem={SetThemeActive} active={themeActive}>
          <div>
            <div
              style={{ width: "20px", height: "20px", pointerEvents: "none" }}
            >
              <DarkSvg />
            </div>
            Dark
          </div>
          <div>
            <div
              style={{ width: "20px", height: "20px", pointerEvents: "none" }}
            >
              <LightSvg />
            </div>
            Light
          </div>
          <div>
            <div
              style={{ width: "30px", height: "20px", pointerEvents: "none" }}
            >
              <BatSvg />
            </div>
            Black
          </div>
        </Radio>
        {/* <Radio active="Primary">
          <div key={1}>
            <div
              style={{ width: "20px", height: "20px", background: "red" }}
            ></div>
          </div>
          <div key={2}>Secondary</div>
          <div key={3}>Success</div>
          <div key={4}>Red</div>
        </Radio> */}
        {/* <DropdownV2 parent={true} current_active="System">
          <div className="element">System</div>
          <div className="element">Dark</div>
          <div className="element">Light</div>
        </DropdownV2> */}
      </div>
      {/* <br /> */}
      {/* <hr /> */}
      <div
        style={{
          display: "flex",
          marginBlock: "10px",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <h4>color picker:</h4>
        <ColorPicker
          colors={colors}
          setItem={SetThemeColor}
          active={themeColor}
        />
      </div>
    </>
  );
}

export default Settings;
