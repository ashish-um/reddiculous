import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { BrowserView, MobileView } from "react-device-detect";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Card({ children, data, crosspost }) {
  const [shared, SetShared] = useState(false);
  const { sub, user, post, id } = useParams();
  const [localDataLoaded, SetLocalDataLoaded] = useState(false);

  function handleDate(l_date) {
    const m_date = new Date(l_date * 1000);
    const nowDate = new Date();

    const yearDiff = nowDate.getFullYear() - m_date.getFullYear();
    const monthDiff = nowDate.getMonth() - m_date.getMonth() + yearDiff * 12;
    const dateDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60 * 24));
    const hourDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60));

    if (monthDiff > 0 && monthDiff < 12) {
      return monthDiff == 1 ? "1 month" : `${monthDiff} months`;
    } else if (monthDiff >= 12) {
      return `${Math.floor(monthDiff / 12)} years`;
    } else if (dateDiff > 0) {
      return dateDiff == 1 ? `1 day` : `${dateDiff} days`;
    } else {
      return hourDiff == 0 ? "now" : hourDiff == 1 ? `1 h` : `${hourDiff} h`;
    }
  }

  useEffect(() => {
    if (post && id) {
      SetLocalDataLoaded(true);
    } else {
      setTimeout(() => SetLocalDataLoaded(true), 340);
    }
  }, []);

  return (
    <div
      className={`card ${localDataLoaded && "animate-load"}`}
      style={{ opacity: 0 }}
    >
      <div className="card-header">
        <div className="card-header-data">
          {(!sub || sub == "popular" || sub == "all") && (
            <Link
              className="label clickable"
              style={{ background: "var(--secondary-color)" }}
              to={"/" + data.subreddit_name_prefixed}
            >
              {data.subreddit_name_prefixed}
            </Link>
          )}
          {!(user || sub == "popular" || sub == "all") && sub && (
            <Link className="label clickable" to={"/u/" + data.author}>
              u/{data.author}
            </Link>
          )}
          {data.over_18 && (
            <span className="label" style={{ background: "darkred" }}>
              NSFW
            </span>
          )}
          {data.spoiler && (
            <span className="label" style={{ background: "darkcyan" }}>
              spoiler
            </span>
          )}
          {crosspost && (
            <span className="label" style={{ background: "darkgreen" }}>
              crosspost
            </span>
          )}
          <span style={{ opacity: ".6" }}>• {handleDate(data.created)}</span>
        </div>
        <div>
          <h2
            className="card-title"
            dangerouslySetInnerHTML={{
              __html: `${data.title}`,
            }}
          ></h2>
        </div>
      </div>
      {children}
      <div className="card-footer">
        {/* <span>Created: {handleDate(item.data.created)} hrs ago</span> */}
        {/* <span style={{ color: "red" }}>{props.fullname}</span> */}

        <Link to={data.permalink} className="label clickable">
          <i className="bx bxs-comment-detail"></i> {data.num_comments}
        </Link>

        <span className="label">
          <i
            className="bx bxs-upvote"
            style={{ transform: "translateY(-2px)" }}
          ></i>{" "}
          {data.ups}
          <span className="separator"></span>
          <i
            className="bx bxs-downvote"
            style={{ transform: "translateY(-1px)" }}
          ></i>{" "}
          {Math.round(data.ups / data.upvote_ratio - data.ups)}
        </span>
        <BrowserView
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin +
                  window.location.pathname +
                  "#" +
                  data.permalink
              );
              SetShared(true);

              setTimeout(() => {
                SetShared(false);
              }, 1000);
            }}
            className="label clickable"
          >
            <i className="bx bxs-share" style={{ transform: "scaleX(-1)" }}></i>
            Share
          </div>
          {shared ? (
            <span
              style={{
                background: "var(--success-color)",
                fontSize: "12px",
                width: "max-content",
                height: "65%",
                position: "absolute",
                left: "0",
              }}
              className="label animate-shared"
            >
              Copied to clipboard
            </span>
          ) : (
            ""
          )}
        </BrowserView>
        <MobileView
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <RWebShare
            data={{
              text: data.title,
              url:
                window.location.origin +
                window.location.pathname +
                "#" +
                data.permalink,
              title: "Share",
            }}
            onClick={() => {
              SetShared(true);
              setTimeout(() => {
                SetShared(false);
              }, 1000);
            }}
          >
            <Link className="label">
              <i
                className="bx bxs-share"
                style={{ transform: "scaleX(-1)" }}
              ></i>
              Share
            </Link>
            {/* <button>Share 🔗</button> */}
          </RWebShare>
          {shared ? (
            <span
              style={{
                background: "var(--success-color)",
                fontSize: "12px",
                width: "max-content",
                height: "65%",
                position: "absolute",
                left: "0",
              }}
              className="label animate-shared"
            >
              Shared Successfully
            </span>
          ) : (
            ""
          )}
        </MobileView>
      </div>
    </div>
  );
}

export default Card;
