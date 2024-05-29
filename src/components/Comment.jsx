import React from "react";
import { Link } from "react-router-dom";

function Comment({ data, className, color, first }) {
  const Threadcolor = Math.random() * 360;

  function decodeHtml(l_html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = l_html;
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
        className={"comment-parent animate-load"}
        style={{
          background: `color-mix(in srgb, hsl(${
            color || Threadcolor
          }, 30%, 20%) 5%,var(--card-background))`,
          border: "1px solid #00000040",
          marginLeft: first && 0,
          borderRadius: first && "var(--card-border-radius)",
          boxShadow: !first && `#00000090 0 0px 6px`,
        }}
      >
        <div
          className={className}
          style={{ background: `hsl(${color || Threadcolor}, 50%, 70%)` }}
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
          <span style={{ opacity: "0.6" }}>• {handleDate(data.created)}</span>
        </div>
        <div
          style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
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
                    color={Threadcolor}
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
