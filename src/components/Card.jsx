import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { BrowserView, MobileView } from "react-device-detect";
import { useState } from "react";
import { useParams } from "react-router-dom";
import UpvoteSvg from "../assets/UpvoteSvg";
import axios from "axios";

function Card({ children, data, crosspost }) {
  const [shared, SetShared] = useState(false);
  const { sub, user, post, id } = useParams();
  const [localDataLoaded, SetLocalDataLoaded] = useState(0);
  const [upvoted, SetUpvoted] = useState(false);
  const [downvoted, SetDownvoted] = useState(false);
  const [subImage, SetSubImage] = useState("");

  const testImageData = [
    { sub: "r/all", img: "example.png" },
    { sub: "r/all", img: "example.png" },
    { sub: "r/all", img: "example.png" },
    { sub: "r/all", img: "example.png" },
  ];

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

  function SetMembers(members) {
    if (members > 999999) {
      return `${(members / 1000000).toFixed(1)}M`;
    } else if (members > 999) {
      return `${(members / 1000).toFixed(0)}K`;
    } else {
      return members;
    }
  }

  function getSubImage() {
    const storedImages = JSON.parse(localStorage.getItem("sub_images")) || [];
    const exists = storedImages.some(
      (elem) => elem.sub === data.subreddit_name_prefixed
    );

    // [{sub:"r/all", img="https://www.example.png"}]
    if (exists) {
      SetSubImage(
        storedImages.filter(
          (elem) => elem.sub === data.subreddit_name_prefixed
        )[0].img
      );
    } else {
      axios
        .get(`https://www.reddit.com/r/${data.subreddit}/about/.json`)
        .then((response) => {
          const image =
            response.data.data.community_icon.replaceAll("amp;", "") ||
            response.data.data.icon_img;
          storedImages.push({ sub: data.subreddit_name_prefixed, img: image });
          localStorage.setItem("sub_images", JSON.stringify(storedImages));
          console.log(storedImages);
          SetSubImage(image);
        })
        .catch((err) => {
          SetSubImage("/reddiculous/icon_big.png");
        });
    }
  }

  const cardRef = useRef(null);
  useEffect(() => {
    const cardElement = cardRef.current;

    // Function to handle the intersection changes
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          getSubImage();
          // console.log("Intersecting", data);
          // SetPlay(true); intersectings
        } else {
          // SetPlay(false);  not intersecting
        }
      });
    };

    // Create an IntersectionObserver instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "600px",
    });

    // Observe the video element
    if (!sub) {
      observer.observe(cardElement);
      // localStorage.setItem("sub_images", JSON.stringify(testImageData));
      // Cleanup the observer on component unmount
      return () => {
        observer.unobserve(cardElement);
      };
    }
  }, []);

  useEffect(() => {
    if (post && id) {
      SetLocalDataLoaded(true);
    } else {
      setTimeout(() => SetLocalDataLoaded(1), 340);
      setTimeout(() => SetLocalDataLoaded(2), 1240);
    }
  }, []);

  return (
    <div
      className={`card${localDataLoaded === 1 ? " animate-load" : ""}`}
      style={{ opacity: localDataLoaded ? 1 : 0 }}
    >
      <div className="card-header">
        <div className="card-header-data">
          {(!sub || sub == "popular" || sub == "all") && (
            <Link
              ref={cardRef}
              className="label clickable"
              style={{ background: "var(--secondary-color)" }}
              to={"/" + data.subreddit_name_prefixed}
            >
              <img
                src={subImage}
                alt=""
                width={30}
                height={30}
                style={{ borderRadius: "100vw" }}
              />
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
        <Link to={data.permalink}>
          <h2
            className="card-title"
            dangerouslySetInnerHTML={{
              __html: `${data.title}`,
            }}
          ></h2>
        </Link>
      </div>
      {children}
      <div className="card-footer">
        {/* <span>Created: {handleDate(item.data.created)} hrs ago</span> */}
        {/* <span style={{ color: "red" }}>{props.fullname}</span> */}

        <Link to={data.permalink} className="label clickable">
          <i className="bx bxs-comment-detail"></i> {data.num_comments}
        </Link>

        <span className="label">
          <div
            className="cursor-pointer"
            onClick={() => {
              SetUpvoted((vote) => !vote);
              SetDownvoted(false);
            }}
            style={{
              display: "flex",
              borderRadius: "100vw",
              paddingRight: "8px",
            }}
          >
            <div
              className={`wh30 ${upvoted ? "upvoted" : ""}`}
              style={{ transform: "translateY(-2px)" }}
            >
              <UpvoteSvg />
            </div>

            <p>{SetMembers(data.ups + upvoted)}</p>
          </div>
          <span className="separator"></span>
          <div
            className="cursor-pointer"
            onClick={() => {
              SetDownvoted((vote) => !vote);
              SetUpvoted(false);
            }}
            style={{
              display: "flex",
              borderRadius: "100vw",
              paddingRight: "8px",
            }}
          >
            <div
              className={`wh30 ${downvoted ? "downvoted" : ""}`}
              style={{ transform: "scale(-1) translateY(-1px)" }}
            >
              <UpvoteSvg />
            </div>
            <p>
              {SetMembers(
                Math.round(data.ups / data.upvote_ratio - data.ups) - downvoted
              )}
            </p>
          </div>
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
