import React from "react";
import { Link } from "react-router-dom";
import JoinSubBtn from "./JoinSubBtn";

function SubCard({ data, showJoinBtn = false }) {
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
    <div
      // to={data.url}
      style={{
        background: `color-mix(in srgb, ${
          data.primary_color || "var(--card-background)"
        } 10%, var(--card-background))`,
      }}
      className="subcard  animate-load"
    >
      <Link to={"/" + data.display_name_prefixed}>
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
      </Link>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link
            to={"/" + data.display_name_prefixed}
            style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
          >
            {data.display_name_prefixed}
          </Link>
          {showJoinBtn && (
            <JoinSubBtn
              sub={data.display_name_prefixed}
              image={
                data.icon_img ||
                data.community_icon.replaceAll("amp;", "") ||
                "/reddiculous/icon_big.png"
              }
            />
          )}

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
        </div>

        {/* | Disc:{data.public_description}  */}
        {data.subscribers && (
          <Link to={"/" + data.display_name_prefixed} style={{ opacity: ".6" }}>
            {SetMembers(data.subscribers)} members
          </Link>
        )}
      </div>
    </div>
  );
}

export default SubCard;
