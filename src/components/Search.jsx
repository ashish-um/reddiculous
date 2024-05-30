import React, { useEffect, useState } from "react";
import Posts from "./Posts";
import SearchSubs from "./SearchSubs";
import { BrowserView, MobileView } from "react-device-detect";

function Search() {
  const [postsLoaded, SetPostsLoaded] = useState(false);
  const [showPosts, SetShowPosts] = useState(true);

  return (
    <>
      <BrowserView>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Posts setPostLoad={SetPostsLoaded} />

          <SearchSubs setPostLoad={postsLoaded} />
        </div>
      </BrowserView>
      <MobileView>
        <div style={{ display: "flex", gap: "8px", margin: "8px 8px 0 8px" }}>
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
      </MobileView>
    </>
  );
}

export default Search;
