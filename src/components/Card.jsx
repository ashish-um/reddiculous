import React from "react";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { BrowserView, MobileView } from "react-device-detect";
import { useState } from "react";

function Card(props) {
  const [shared, SetShared] = useState(false);

  return (
    <div className="card animate-load">
      <div className="card-header">
        <div className="card-header-data">
          <Link
            className="label"
            style={{ background: "var(--secondary-color)" }}
            to={"/" + props.subreddit}
          >
            {props.subreddit}
          </Link>
          <Link className="label" to={"/u/" + props.user}>
            u/{props.user}
          </Link>
          {props.over_18 && (
            <span className="label" style={{ background: "darkred" }}>
              NSFW
            </span>
          )}
          {props.spoiler && (
            <span className="label" style={{ background: "darkcyan" }}>
              spoiler
            </span>
          )}
          {props.crosspost && (
            <span className="label" style={{ background: "darkgreen" }}>
              crosspost
            </span>
          )}
          <span style={{ opacity: ".6" }}>• {props.date}</span>
        </div>
        <div>
          <h2
            className="card-title"
            dangerouslySetInnerHTML={{
              __html: `${props.title}`,
            }}
          ></h2>
        </div>
      </div>
      {props.children}
      <div className="card-footer">
        {/* <span>Created: {handleDate(item.data.created)} hrs ago</span> */}
        {/* <span style={{ color: "red" }}>{props.fullname}</span> */}

        <Link to={props.permalink} className="label">
          <i className="bx bxs-comment-detail"></i> {props.comments}
        </Link>

        <span className="label">
          <i
            className="bx bxs-upvote"
            style={{ transform: "translateY(-2px)" }}
          ></i>{" "}
          {props.ups}
          <span className="separator"></span>
          <i
            className="bx bxs-downvote"
            style={{ transform: "translateY(-1px)" }}
          ></i>{" "}
          {props.downs}
        </span>
        <BrowserView
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Link
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin +
                  window.location.pathname +
                  "#" +
                  props.permalink
              );
              SetShared(true);

              setTimeout(() => {
                SetShared(false);
              }, 1000);
            }}
            className="label"
          >
            <i className="bx bxs-share" style={{ transform: "scaleX(-1)" }}></i>
            Share
          </Link>
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
              text: props.title,
              url:
                window.location.origin +
                window.location.pathname +
                "#" +
                props.permalink,
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
