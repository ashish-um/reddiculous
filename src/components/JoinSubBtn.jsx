import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";

function JoinSubBtn({ sub, image }) {
  const [joined, SetJoined] = useState(false);

  function checkItem(item) {
    return item.some((element) => element.display_name_prefixed === sub);
  }
  useEffect(() => {
    const subs = JSON.parse(localStorage.getItem("subscriptions"));
    if (subs) {
      console.log(checkItem(subs));
      SetJoined(checkItem(subs));
    }
  }, []);

  function handleClick() {
    console.log("clicked");
    SetJoined((join) => !join);
    const subs = JSON.parse(localStorage.getItem("subscriptions")) || [];
    if (!checkItem(subs)) {
      subs.push({ icon_img: image, display_name_prefixed: sub });
      localStorage.setItem("subscriptions", JSON.stringify(subs));
      console.log(subs);
      window.dispatchEvent(new Event("channelsUpdated"));
    } else {
      const removedSub = subs.filter(
        (element) => element.display_name_prefixed !== sub
      );

      localStorage.setItem("subscriptions", JSON.stringify(removedSub));
      window.dispatchEvent(new Event("channelsUpdated"));
    }
    sessionStorage.clear();
  }

  return (
    <div
      onClick={handleClick}
      className="label noselect clickable"
      style={{
        background: joined ? "var(--success-color)" : "",
        fontSize: "clamp(12px,2vw,15px)",
        padding: "0 8px",
      }}
    >
      {joined ? "Joined" : "join"}
    </div>
  );
}

export default JoinSubBtn;
