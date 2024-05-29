import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Nav({ param }) {
  const navigate = useNavigate();
  const [searchValue, SetSearchValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/r/${searchValue}`);
  }

  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <img
            src="/reddiculous/icon_small.png"
            width={30}
            height={30}
            alt=""
          />
        </Link>
        <Link to={"/" + param}>
          <h1 style={{ padding: "10px", fontSize: "25px" }}>{param}</h1>
        </Link>
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
            name=""
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
