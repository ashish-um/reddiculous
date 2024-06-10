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
  const childHeadingfontClamp = "clamp(18px, 2vw, 22px)";
  const headingfontClamp = "clamp(20px, 2vw, 24px)";

  function SetDefaultSettings() {
    if (!localStorage.getItem("video_autoplay")) {
      localStorage.setItem("video_autoplay", true);
    }
  }

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
    document.documentElement.style.setProperty("--nsfw", theme.nsfw);
    document.documentElement.style.setProperty("--crosspost", theme.crosspost);
  };

  function ToggleElement({ children, name, refresh = false }) {
    const val = localStorage.getItem(name) === "true" ? true : false;

    const [toggle, SetToggle] = useState(val);

    useEffect(() => {
      if (toggle != val) {
        console.log(name, toggle);
        localStorage.setItem(name, toggle);
        if (name === "show_nsfw") {
          sessionStorage.clear();
        }
      }
    }, [toggle]);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // marginInline: "10px",
        }}
      >
        <div>
          <h2 style={{ fontSize: childHeadingfontClamp }}>{children}</h2>
          {refresh && toggle != val && (
            <p style={{ color: "var(--success-color)" }}>requires refresh</p>
          )}
        </div>
        <Toggle setToggle={SetToggle} toggle_default={val} />
      </div>
    );
  }

  function HeadingElement({ children }) {
    return (
      <div
        style={{
          background: "var(--card-element)",
          padding: "4px 20px",
          borderRadius: "var(--card-border-radius)",
          marginBlock: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: headingfontClamp }}>{children}</h2>
      </div>
    );
  }

  function ButtonElement({ children, items = [] }) {
    const [clicked, SetCLicked] = useState(false);

    function handleClick() {
      SetCLicked(true);
      if (items.includes("all")) {
        localStorage.clear();
      } else {
        items.forEach((element) => {
          localStorage.removeItem(element);
        });
      }
    }

    return (
      <div
        style={{
          display: "flex",
          // justifyContent: "",
          gap: "20px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: childHeadingfontClamp }}>{children}</h2>
          {clicked && (
            <p style={{ color: "var(--success-color)" }}>requires refresh</p>
          )}
        </div>
        <div
          className="label clickable"
          style={{
            background: clicked ? "var(--success-color)" : "var(--nsfw)",
            padding: "0 14px",
          }}
          onClick={handleClick}
        >
          {clicked ? "cleared" : "clear"}
        </div>
      </div>
    );
  }

  function DropElement({ children, sizes = [] }) {
    const [sizeActive, SetSizeActive] = useState(null);
    const [currentActive, SetCurrentActive] = useState("");

    function work(variable, value) {
      localStorage.setItem(variable, value);
      document.documentElement.style.setProperty(variable, value);
    }

    useEffect(() => {
      if (!sizeActive) {
        if (localStorage.getItem(sizes[0].var)) {
          console.log("Exists", sizes[0].var);
          document.documentElement.style.setProperty(
            sizes[0].var,
            localStorage.getItem(sizes[0].var)
          );
        }

        if (!localStorage.getItem(sizes[0].var)) SetCurrentActive("Normal");
        else
          sizes.forEach((element, index) => {
            if (element.val === localStorage.getItem(sizes[0].var))
              SetCurrentActive(["Small", "Normal", "Large"].at(index));
          });

        return;
      }
      if (sizeActive === "Small") {
        work(sizes[0].var, sizes[0].val);
        // SetCurrentActive(sizeActive);
      }
      if (sizeActive === "Normal") {
        // SetCurrentActive(sizeActive);
        work(sizes[0].var, sizes[1].val);
      }
      if (sizeActive === "Large") {
        // SetCurrentActive(sizeActive);
        work(sizes[0].var, sizes[2].val);
      }
    }, [sizeActive]);

    return (
      <div
        style={{
          display: "flex",
          // justifyContent: "",
          gap: "20px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: childHeadingfontClamp }}>{children}</h2>
        <DropdownV2
          parent={true}
          current_active={currentActive}
          L_Activate={SetSizeActive}
        >
          <div className="element">Small</div>
          <div className="element">Normal</div>
          <div className="element">Large</div>
        </DropdownV2>
      </div>
    );
  }

  useEffect(() => {
    SetDefaultSettings();

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
    } else {
      SetThemeActive("Dark");
      SetThemeColor(colors[0]);
    }
  }, []);

  useEffect(() => {
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
      <HeadingElement>Change Theme</HeadingElement>
      <div
        style={{
          display: "flex",
          // justifyContent: "",
          gap: "20px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: childHeadingfontClamp }}>Theme</h2>
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
      </div>
      <div
        style={{
          display: "flex",
          marginBlock: "10px",
          gap: "20px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: childHeadingfontClamp }}>Varient</h2>
        <ColorPicker
          colors={colors}
          setItem={SetThemeColor}
          active={themeColor}
        />
      </div>
      <br />
      <hr style={{ opacity: ".3", width: "90%", margin: "auto" }} />
      <HeadingElement>Video Settings</HeadingElement>
      <ToggleElement refresh={true} name={"video_mute"}>
        Mute Video
      </ToggleElement>
      <ToggleElement refresh={true} name={"video_autoplay"}>
        Auto Play
      </ToggleElement>
      <ToggleElement refresh={true} name={"video_loop"}>
        Loop Video
      </ToggleElement>
      <br />
      <hr style={{ opacity: ".3", width: "90%", margin: "auto" }} />
      <HeadingElement>Nsfw & Spoiler</HeadingElement>
      <ToggleElement refresh={true} name={"show_nsfw"}>
        Enable Nsfw
      </ToggleElement>
      <br />
      <hr style={{ opacity: ".3", width: "90%", margin: "auto" }} />
      <HeadingElement>Layout</HeadingElement>
      <DropElement
        sizes={[
          { var: "--comment-font", val: "clamp(12px, 3vw, 16px)" },
          { val: "clamp(16px, 3vw, 20px)" },
          { val: "clamp(18px, 3vw, 22px)" },
        ]}
      >
        Comment Font
      </DropElement>
      <br />
      <DropElement
        sizes={[
          { var: "--title-font", val: "clamp(16px, 2vw, 21px)" },
          { val: "clamp(19px, 2vw, 25px)" },
          { val: "clamp(22px, 2vw, 27px)" },
        ]}
      >
        Title Font
      </DropElement>
      <br />
      <DropElement
        sizes={[
          { var: "--max-card-height", val: "400px" },
          { val: "600px" },
          { val: "800px" },
        ]}
      >
        Post Height
      </DropElement>
      <br />
      <DropElement
        sizes={[
          { var: "--max-card-width", val: "650px" },
          { val: "800px" },
          { val: "1000px" },
        ]}
      >
        Post Width
      </DropElement>
      <br />
      <hr style={{ opacity: ".3", width: "90%", margin: "auto" }} />
      <HeadingElement>History & Privacy</HeadingElement>
      <ButtonElement items={["liked_posts"]}>Clear Liked</ButtonElement>
      <br />
      <ButtonElement items={["subscriptions"]}>
        Clear Subscriptions
      </ButtonElement>
      <br />
      <ButtonElement
        items={[
          "video_mute",
          "video_autoplay",
          "video_loop",
          "theme",
          "show_nsfw",
          "--max-card-width",
          "--max-card-height",
          "--title-font",
          "--comment-font",
        ]}
      >
        Reset Settings
      </ButtonElement>
      <br />
      <ButtonElement items={["all"]}>Clear All Data</ButtonElement>
      <br />
    </>
  );
}

export default Settings;
