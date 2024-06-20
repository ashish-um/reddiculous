import React, { useEffect } from "react";
import { useState } from "react";
import { createSearchParams, useNavigate, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Navbar.css";
import { BrowserView, MobileView } from "react-device-detect";
import Settings from "./Settings";
import SettingsSvg from "../assets/SettingsSvg";
import SearchSvg from "../assets/SearchSvg";
import MenuSvg from "../assets/MenuSvg";
import SideBar from "./SideBar";

// import "../assets/themes/DefaultTheme.jsx";
function Nav() {
  const navigate = useNavigate();
  const [searchValue, SetSearchValue] = useState("");
  const [showSearch, SetShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const { sub, user } = useParams();
  const [title, SetTitle] = useState();
  const matchSub = useMatch("/r/:sub/*");
  const matchUser = useMatch("/u/:user/");
  const [showSettings, SetShowSettings] = useState(false);
  const [showSidebar, SetShowSidebar] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    SetShowSearch(false);
    // SetSearchParams({ search: searchValue });
    navigate({
      pathname: `/search`,
      search: createSearchParams({ q: searchValue }).toString(),
    });
  }

  const loadTheme = (theme) => {
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

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      loadTheme(JSON.parse(localStorage.getItem("theme")));
    }
  }, []);

  useEffect(() => {
    if (matchSub) {
      SetTitle(`r/${matchSub.params.sub}`);
    } else if (matchUser) {
      SetTitle(`u/${matchUser.params.user}`);
    } else {
      SetTitle("Reddiculous");
    }
  }, [matchSub, matchUser]);

  function TitleHeading() {
    return (
      <div style={{ width: "100%", overflow: "hidden" }}>
        <h1
          style={{
            width: "0",
            padding: "10px",
            fontSize: "clamp(14px, 2vw, 25px)",
          }}
        >
          {title}
        </h1>
      </div>
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className="navsize"
        // className="header"
      ></div>
      <div className={`header ${scrolled ? "header-border" : ""}`}>
        <BrowserView>
          <div className="header-content">
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="menu-btn"
                onClick={() => SetShowSidebar((val) => !val)}
                style={{
                  width: "35px",
                  height: "35px",
                  opacity: ".8",
                  marginRight: "12px",
                  background: "none",
                  border: "none",
                }}
              >
                <MenuSvg />
              </button>
              {/* <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "clamp(20px, 2vw,35px)",
                  // opacity: "0.4",
                  marginRight: "20px",
                }}
              >
                menu
              </span> */}
              <Link
                className="noselect"
                style={{ height: "clamp(20px, 2vw,30px)" }}
                to="/"
              >
                <img
                  src="/reddiculous/icon_small.png"
                  width={"100%"}
                  height={"100%"}
                  alt=""
                />
              </Link>

              <Link className="noselect" to="/" style={{ width: "400px" }}>
                <TitleHeading />
                {/* <h1
                style={{ padding: "10px", fontSize: "clamp(20px, 2vw,25px)" }}
              >
                Reddiculous
              </h1> */}
              </Link>
            </div>
            <form
              className="browser-form"
              // style={{ display: "flex" }}
              action=""
              onSubmit={(e) => handleSubmit(e)}
            >
              {/* <h1>r/</h1> */}
              <div className="sub-input">
                <input
                  type="search"
                  name="search"
                  placeholder="Search posts, title, users..."
                  value={searchValue}
                  onChange={(e) => SetSearchValue(e.target.value)}
                />
                <div
                  className="search"
                  style={{ width: "35px", height: "35px" }}
                >
                  <SearchSvg />
                </div>
              </div>
              {/* <Link to={`/r/${searchValue}`}>Go</Link> */}
            </form>
            <div
              onClick={() => {
                SetShowSettings((val) => !val);
              }}
              className="label noselect clickable settings-icon"
            >
              <div style={{ width: "30px", height: "30px" }}>
                <SettingsSvg />
              </div>
              <h3 style={{ fontSize: "clamp(10px, 2vw,20px)" }}>Settings</h3>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <div className="header-content">
            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
              <div
                onClick={() => SetShowSidebar((val) => !val)}
                className="menu-btn"
                style={{
                  width: "35px",
                  height: "35px",
                  marginRight: "12px",
                }}
              >
                <MenuSvg />
              </div>
              <Link
                className="noselect"
                style={{ display: "flex", alignItems: "center" }}
                to="/"
              >
                <img
                  src="/reddiculous/icon_small.png"
                  width={"25px"}
                  height={"25px"}
                  alt=""
                />
              </Link>

              <Link to="/" style={{ width: "100%" }}>
                <TitleHeading />
                {/* <h1
                style={{ padding: "10px", fontSize: "clamp(20px, 2vw,25px)" }}
              >
                Reddiculous
              </h1> */}
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ height: "30px", width: "30px", marginRight: "10px" }}
                onClick={() => SetShowSearch(true)}
              >
                <SearchSvg />
              </div>
              <div
                className="settings-icon"
                onClick={() => {
                  SetShowSettings((val) => !val);
                }}
                style={{ width: "28px", height: "28px" }}
              >
                <SettingsSvg />
              </div>
            </div>
            {showSearch && (
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background: "var(--body-background)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <form
                  // style={{ width: "90%" }}
                  className="mobile-form"
                  action=""
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="mobile-sub-input">
                    <input
                      type="search"
                      name="search"
                      autoFocus
                      placeholder="Search posts, title, users..."
                      value={searchValue}
                      onChange={(e) => SetSearchValue(e.target.value)}
                    />
                    <span className="search">
                      <div style={{ width: "25px", height: "25px" }}>
                        <SearchSvg />
                      </div>
                    </span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </MobileView>
      </div>

      {/* {showSettings && ( */}
      <div>
        <div>
          <div
            className={`settings ${
              showSettings ? "show-settings" : "no-interact"
            }`}
          >
            <Settings />
          </div>
        </div>
        <div
          onClick={() => {
            SetShowSettings(false);
            // document.body.style.overflow = "visible";
          }}
          className={`settings-backdrop ${
            showSettings ? "show-backdrop" : "no-interact"
          }`}
        ></div>
      </div>
      {/* )} */}

      <div
        className={`sidebar-holder ${
          showSidebar ? "sidebar-show" : "sidebar-hide"
        }`}
      >
        <SideBar setShowSidebar={SetShowSidebar} />
      </div>
      <MobileView>
        <div
          onClick={() => {
            SetShowSidebar(false);
            // document.body.style.overflow = "visible";
          }}
          className={`settings-backdrop ${
            showSidebar ? "show-backdrop" : "no-interact"
          }`}
        ></div>
      </MobileView>
    </>
  );
}

export default Nav;
