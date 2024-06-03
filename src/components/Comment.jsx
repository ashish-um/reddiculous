import React from "react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Comment({ data, className, color, first }) {
  const Threadcolor = useRef(Math.random() * 360);
  const [hide, SetHide] = useState(data?.depth > 1 ? 1 : 0);
  const [loaded, SetLoaded] = useState(false);
  const [childrenDisplay, SetChildrenDisplay] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      SetLoaded(true);
      console.log("Loaded");
    }, 1000);
  }, []);

  function decodeHtml(l_html) {
    const txt = document.createElement("textarea");
    if (l_html.includes("preview.redd.it") && !l_html.includes("giphy.com")) {
      console.log("includes");
      txt.innerHTML =
        l_html
          .replaceAll("&lt;a", "<img")
          .replaceAll("href=", "src=")
          .split("&gt;https")[0] +
        "/>" +
        l_html.split("&lt;/a&gt;")[1];
    } else {
      txt.innerHTML = l_html
        .replaceAll('href="/r/', 'href="/reddiculous/#/r/')
        .replaceAll("href=", " target='_blank' href=");
    }
    return txt.value;
  }

  function handleDate(l_date) {
    const m_date = new Date(l_date * 1000);
    const nowDate = new Date();

    const yearDiff = nowDate.getFullYear() - m_date.getFullYear();
    const monthDiff = nowDate.getMonth() - m_date.getMonth() + yearDiff * 12;
    const dateDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60 * 24));
    const hourDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60));

    if (monthDiff > 0 && monthDiff < 12) {
      return monthDiff == 1 ? "1 month ago" : `${monthDiff} months ago`;
    } else if (monthDiff >= 12) {
      return `${Math.floor(monthDiff / 12)} years ago`;
    } else if (dateDiff > 0) {
      return dateDiff == 1 ? `1 day ago` : `${dateDiff} days ago`;
    } else {
      return hourDiff == 0
        ? "just now"
        : hourDiff == 1
        ? `an hour ago`
        : `${hourDiff} hrs ago`;
    }
  }

  return (
    <>
      <div
        className={`comment-parent ${!loaded ? "animate-load" : ""} ${
          hide == 1 ? "collapse" : hide == 2 ? "collapse-reverse" : ""
        }`}
        style={{
          background: `color-mix(in srgb, hsl(${
            color || Threadcolor.current
          }, 30%, 20%) 5%,var(--card-background))`,
          border: "1px solid #00000040",
          borderBottom: "none",
          borderRight: "none",
          // maxHeight: hide && "35px",
          marginLeft: first && 0,
          borderRadius: first && "var(--card-border-radius)",
          boxShadow: !first && `#00000090 0 0px 6px`,
          overflow: first && "hidden",
          paddingBottom: data.replies
            ? data.replies.data.children[0].kind == "more" && "10px"
            : "10px",
          paddingRight: first && "10px",
          clipPath: "inset(-5px 0px 0px -5px)",
        }}
      >
        <div
          className={`${className}`}
          onClick={() => {
            SetHide((hide) => (hide == 1 ? 2 : 1));
            if (hide == 1) {
              SetChildrenDisplay(true);
            } else {
              setTimeout(() => {
                SetChildrenDisplay(false);
              }, 200);
            }
          }}
          style={{
            background: `hsl(${color || Threadcolor.current}, 50%, 70%)`,
          }}
        ></div>
        <div
          className="card-header-data"
          style={{ fontSize: "clamp(12px, 2vw, 16px)", marginBottom: "5px" }}
        >
          <Link to={"/u/" + data.author} className="label">
            u/{data.author}
          </Link>
          <span className="label">
            {data.ups}
            {data.ups > 0 ? (
              <i
                className="bx bxs-upvote"
                style={{ transform: "translateY(-2px)" }}
              ></i>
            ) : (
              <i
                className="bx bxs-downvote"
                style={{ transform: "translateY(-1px)" }}
              ></i>
            )}
          </span>

          <Link
            onClick={() => {
              SetHide((hide) => (hide == 1 ? 2 : 1));
              if (hide == 1) {
                SetChildrenDisplay(true);
              } else {
                setTimeout(() => {
                  SetChildrenDisplay(false);
                }, 200);
              }
            }}
            className="label"
          >
            <i
              className={
                childrenDisplay
                  ? "bx bx-collapse-vertical"
                  : "bx bx-expand-vertical"
              }
            ></i>
          </Link>

          <span style={{ opacity: "0.6" }}>• {handleDate(data.created)}</span>
        </div>
        <div
          style={{
            fontSize: "clamp(16px, 3vw, 20px)",
            padding: "10px",
            opacity: childrenDisplay ? "1" : "0",
          }}
          dangerouslySetInnerHTML={{ __html: decodeHtml(data.body_html) }}
        ></div>

        {data.replies
          ? data.replies.data.children.map((item, index) => {
              return (
                item.data.body && (
                  <Comment
                    className="comment-thread"
                    key={item.data.id}
                    data={item.data}
                    color={Threadcolor.current}
                  />
                )
              );
            })
          : ""}
      </div>
    </>
  );
}

export default Comment;
