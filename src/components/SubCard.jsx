import React from "react";
import { Link } from "react-router-dom";

function SubCard({ data }) {
  function SetMembers(members) {
    if (members > 999999) {
      return `${(members / 1000000).toFixed(1)}M`;
    } else if (members > 999) {
      return `${(members / 1000).toFixed(1)}K`;
    } else {
      return `${members}`;
    }
  }

  return (
    <Link
      to={data.url}
      style={{
        background: `color-mix(in srgb, ${
          data.primary_color || "var(--card-background)"
        } 10%, var(--card-background))`,
      }}
      className="subcard  animate-load"
    >
      <img
        src={
          data.icon_img ||
          data.community_icon.replaceAll("amp;", "") ||
          "/reddiculous/icon_big.png"
        }
        width={40}
        height={40}
        style={{ objectFit: "cover" }}
      />
      <div>
        <h3 style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {data.display_name_prefixed}
          <Link // This gives errors cant use Link tag here
            to="/"
            className="label clickable"
            style={{
              fontSize: "13px",
              padding: "2px 8px",
              background: "var(--success-color)",
            }}
          >
            join
          </Link>
          {data.over18 && (
            <span
              className="label"
              style={{
                background: "darkred",
                fontSize: "13px",
                padding: "2px 8px",
              }}
            >
              nsfw
            </span>
          )}
        </h3>
        {/* | Disc:{data.public_description}  */}
        <div style={{ opacity: ".6" }}>
          {SetMembers(data.subscribers)} members
        </div>
      </div>
    </Link>
  );
}

export default SubCard;
