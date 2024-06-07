import React from "react";
import SubCard from "./SubCard";

function SideBar() {
  const data = {
    icon_img:
      "https://b.thumbs.redditmedia.com/VZX_KQLnI1DPhlEZ07bIcLzwR1Win808RIt7zm49VIQ.png",
    display_name_prefixed: "r/all",
    subscribers: 20000,
  };
  return (
    <>
      {/* <h1>Subreddits</h1> */}

      <h3>Subscribed subs</h3>
      <SubCard data={data} />
      <SubCard data={data} />
      <SubCard data={data} />
      <SubCard data={data} />
    </>
  );
}

export default SideBar;
