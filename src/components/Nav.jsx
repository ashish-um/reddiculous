import React, { useEffect } from "react";
import { useState } from "react";
import { createSearchParams, useNavigate, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Navbar.css";
import { BrowserView, MobileView } from "react-device-detect";

function Nav() {
  const navigate = useNavigate();
  const [searchValue, SetSearchValue] = useState("");
  const [showSearch, SetShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const { sub, user } = useParams();
  const [title, SetTitle] = useState();
  const matchSub = useMatch("/r/:sub/*");
  const matchUser = useMatch("/u/:user/");

  function handleSubmit(e) {
    e.preventDefault();
    // SetSearchParams({ search: searchValue });
    navigate({
      pathname: `/search`,
      search: createSearchParams({ q: searchValue }).toString(),
    });
  }

  useEffect(() => {
    if (matchSub) {
      SetTitle(`r/${matchSub.params.sub}`);
    } else if (matchUser) {
      SetTitle(`u/${matchUser.params.user}`);
    } else {
      SetTitle("Reddiculous");
    }
    // if (sub) {`j
    // } else if (user) {
    //   SetTitle(`u/${user}`);
    // } else {
    // }
    // SetTitle("Reddiculous");
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
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "clamp(20px, 2vw,35px)",
                  // opacity: "0.4",
                  marginRight: "20px",
                }}
              >
                menu
              </span>
              <Link style={{ height: "clamp(20px, 2vw,30px)" }} to="/">
                <img
                  src="/reddiculous/icon_small.png"
                  width={"100%"}
                  height={"100%"}
                  alt=""
                />
              </Link>

              <Link to="/" style={{ width: "400px" }}>
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
                <span className="search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="35px"
                    viewBox="0 -960 960 960"
                    width="35px"
                    fill="#e8eaed"
                  >
                    <path d="M380.72-353.69q-95.58 0-162-66.32-66.41-66.32-66.41-161.53 0-95.2 66.32-161.52 66.32-66.32 161.48-66.32 95.17 0 161.79 66.32 66.61 66.32 66.61 161.44 0 41.36-14.77 80.77t-40.41 68.39l242.16 241.33q4.79 4.5 5.18 11.93.38 7.43-5.18 12.74-5.57 5.31-12.61 5.31-7.05 0-12.32-5.57L529.08-408.21q-29.8 26.4-69.18 40.46-39.37 14.06-79.18 14.06Zm-.16-33.85q81.65 0 137.88-56.09 56.23-56.09 56.23-137.91t-56.23-137.91q-56.23-56.09-137.88-56.09-81.77 0-138.09 56.09-56.32 56.09-56.32 137.91t56.32 137.91q56.32 56.09 138.09 56.09Z" />
                  </svg>
                </span>
              </div>
              {/* <Link to={`/r/${searchValue}`}>Go</Link> */}
            </form>
            <div className="label">
              <span className="material-symbols-rounded">settings</span>
              <h3 style={{ fontSize: "clamp(10px, 2vw,20px)" }}>Settings</h3>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <div className="header-content">
            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "clamp(26px, 2vw,35px)",
                  // opacity: "0.4",
                  marginRight: "12px",
                }}
              >
                menu
              </span>
              <Link style={{ display: "flex", alignItems: "center" }} to="/">
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
              <span
                style={{ height: "30px", marginRight: "10px" }}
                onClick={() => SetShowSearch(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="#e8eaed"
                >
                  <path d="M380.72-353.69q-95.58 0-162-66.32-66.41-66.32-66.41-161.53 0-95.2 66.32-161.52 66.32-66.32 161.48-66.32 95.17 0 161.79 66.32 66.61 66.32 66.61 161.44 0 41.36-14.77 80.77t-40.41 68.39l242.16 241.33q4.79 4.5 5.18 11.93.38 7.43-5.18 12.74-5.57 5.31-12.61 5.31-7.05 0-12.32-5.57L529.08-408.21q-29.8 26.4-69.18 40.46-39.37 14.06-79.18 14.06Zm-.16-33.85q81.65 0 137.88-56.09 56.23-56.09 56.23-137.91t-56.23-137.91q-56.23-56.09-137.88-56.09-81.77 0-138.09 56.09-56.32 56.09-56.32 137.91t56.32 137.91q56.32 56.09 138.09 56.09Z" />
                </svg>
              </span>
              <span
                style={{ fontSize: "clamp(20px, 2vw,35px)" }}
                className="material-symbols-rounded label"
              >
                settings
              </span>
            </div>
            {showSearch && (
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <svg
                  style={{ marginInline: "10px" }}
                  onClick={() => SetShowSearch(false)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="#e8eaed"
                >
                  <path d="M275.84-454.87 497.9-233.08q7.18 7.49 7.39 17.53.22 10.04-7.6 17.75-7.82 7.72-17.69 7.82-9.87.11-17.69-7.71L201.87-458.13q-4.89-4.9-7-10.21-2.1-5.32-2.1-11.69 0-6.38 2.1-11.66 2.11-5.28 7-10.18l260.44-260.44q7.23-7.23 17.34-7.42 10.12-.19 18.04 7.42 7.82 7.93 7.82 17.85 0 9.92-7.82 17.49L275.84-505.13h479.03q10.87 0 18 7.14Q780-490.86 780-480q0 10.87-7.13 18-7.13 7.13-18 7.13H275.84Z" />
                </svg>
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
                      placeholder="Search posts, title, users..."
                      value={searchValue}
                      onChange={(e) => SetSearchValue(e.target.value)}
                    />
                    <span className="search">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="25px"
                        viewBox="0 -960 960 960"
                        width="25px"
                        fill="#e8eaed"
                      >
                        <path d="M380.72-353.69q-95.58 0-162-66.32-66.41-66.32-66.41-161.53 0-95.2 66.32-161.52 66.32-66.32 161.48-66.32 95.17 0 161.79 66.32 66.61 66.32 66.61 161.44 0 41.36-14.77 80.77t-40.41 68.39l242.16 241.33q4.79 4.5 5.18 11.93.38 7.43-5.18 12.74-5.57 5.31-12.61 5.31-7.05 0-12.32-5.57L529.08-408.21q-29.8 26.4-69.18 40.46-39.37 14.06-79.18 14.06Zm-.16-33.85q81.65 0 137.88-56.09 56.23-56.09 56.23-137.91t-56.23-137.91q-56.23-56.09-137.88-56.09-81.77 0-138.09 56.09-56.32 56.09-56.32 137.91t56.32 137.91q56.32 56.09 138.09 56.09Z" />
                      </svg>
                    </span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </MobileView>
      </div>
    </>
  );
}

export default Nav;
