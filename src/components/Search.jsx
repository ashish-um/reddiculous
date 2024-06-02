import React, { useEffect, useState } from "react";
import Posts from "./Posts";
import SearchSubs from "./SearchSubs";
import { BrowserView, MobileView } from "react-device-detect";

function Search() {
  const [postsLoaded, SetPostsLoaded] = useState(false);
  const [showPosts, SetShowPosts] = useState(true);

  if (window.innerWidth < 1200) {
    return (
      <div>
        <div
          className="banner-data-holder"
          style={{
            padding: "10px",
            display: "flex",
            gap: "8px",
            marginInline: "auto",
            height: "auto",
          }}
        >
          <div
            className={`label clickable ${showPosts && "active"}`}
            onClick={() => {
              SetShowPosts(true);
            }}
          >
            Posts
          </div>
          <div
            className={`label clickable ${!showPosts && "active"}`}
            onClick={() => {
              SetShowPosts(false);
            }}
          >
            Subreddits
          </div>
        </div>
        {showPosts ? <Posts /> : <SearchSubs setPostLoad={true} />}
      </div>
    );
  }

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Posts setPostLoad={SetPostsLoaded} />

          <SearchSubs setPostLoad={true} />
        </div>
      </div>
    </>
  );
}

export default Search;
