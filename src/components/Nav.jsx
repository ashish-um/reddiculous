import React from "react";
import { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BrowserView } from "react-device-detect";

function Nav() {
  const navigate = useNavigate();
  const [searchValue, SetSearchValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // SetSearchParams({ search: searchValue });
    navigate({
      pathname: `/search`,
      search: createSearchParams({ q: searchValue }).toString(),
    });
  }

  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link style={{ height: "30px" }} to="/">
          <img
            src="/reddiculous/icon_small.png"
            width={30}
            height={30}
            alt=""
          />
        </Link>
        <BrowserView>
          <Link to="/">
            <h1 style={{ padding: "10px", fontSize: "25px" }}>Reddiculous</h1>
          </Link>
        </BrowserView>
      </div>
      <form
        style={{ display: "flex" }}
        action=""
        onSubmit={(e) => handleSubmit(e)}
      >
        {/* <h1>r/</h1> */}
        <div className="sub-input">
          <input
            type="search"
            name="search"
            placeholder="search..."
            value={searchValue}
            onChange={(e) => SetSearchValue(e.target.value)}
          />
        </div>
        {/* <Link to={`/r/${searchValue}`}>Go</Link> */}
      </form>
    </div>
  );
}

export default Nav;
