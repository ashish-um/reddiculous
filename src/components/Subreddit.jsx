import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import Posts from "./Posts";
import { useParams, useSearchParams } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";

function Subreddit() {
  const { sub, sort } = useParams();
  const [data, SetData] = useState({});
  const [error, SetError] = useState("");
  const [searchParams, SetSearchParams] = useSearchParams({ sort: "", t: "" });
  const [sortActive, SetSortActive] = useState(
    sort ? sort[0].toUpperCase() + sort.slice(1, 200) : "Hot"
  );
  const [topActive, SetTopActive] = useState(
    searchParams.get("t") ? searchParams.get("t") : "today"
  );
  const navigate = useNavigate();
  const prevSort = useRef(sortActive);

  const [firstLoad, SetFirstLoad] = useState(false);

  const topValues = [
    "past hour",
    "past 24 hours",
    "past week",
    "past month",
    "past year",
    "all time",
  ];
  // console.log(`sort Active ${sortActive}, prevSort: ${prevSort.current}`);
  // console.log("Active Sort Subredit:", sortActive);

  useEffect(() => {
    if (firstLoad) {
      navigate(`/r/${sub}/${sortActive.toLowerCase()}`);
    }
  }, [sortActive]);

  useEffect(() => {
    if (firstLoad) {
      let value = "";
      if (topActive == topValues[0]) {
        value = "hour";
      } else if (topActive == topValues[1]) {
        value = "day";
      } else if (topActive == topValues[2]) {
        value = "week";
      } else if (topActive == topValues[3]) {
        value = "month";
      } else if (topActive == topValues[4]) {
        value = "year";
      } else if (topActive == topValues[5]) {
        value = "all";
      }
      SetSearchParams({ sort: "top", t: value });
    }
  }, [topActive]);

  useEffect(() => {
    if (sub) {
      document.title = "r/" + sub;
    }
    SetFirstLoad(true);
    var options = {
      method: "GET",
      url: "https://old.reddit.com/r/indiasocial/search.json",
      params: {
        type: "sr",
        q: sub,
        include_over_18: "on",
        // sort: "top",
        // t: "all",
      },
    };
    // console.log("requesting");
    axios
      .request(options)
      .then((response) => {
        // console.log(
        //   response.data.data.children.filter(
        //     (item) => item.data.display_name_prefixed == "r/" + sub
        //   )[0].data
        //   // response.data.data.children
        // );
        SetData(
          response.data.data.children.filter(
            (item) => item.data.display_name_prefixed == "r/" + sub
          )[0].data
        );
      })
      .catch((reject) => {
        SetError(reject.message);
        SetData({});
      });
  }, [sub]);

  function SetMembers(members) {
    if (members > 999999) {
      return `${(members / 1000000).toFixed(1)}M`;
    } else if (members > 999) {
      return `${(members / 1000).toFixed(0)}K`;
    } else {
      return `${members}`;
    }
  }
  return (
    <>
      {Object.keys(data).length !== 0 ? (
        <div
          className={
            !sessionStorage.getItem(`del_sub${sub}`) && `show-dropdown`
          }
        >
          <div className="sub-banner">
            {data.mobile_banner_image || data.banner_background_image ? (
              <div className="sub-banner-img">
                <img
                  width="100%"
                  // height={70}
                  src={
                    data.mobile_banner_image.replaceAll("amp;", "") ||
                    data.banner_background_image.replaceAll("amp;", "")
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  height: "100px",
                  background: "var(--card-background)",
                }}
              ></div>
            )}
            <div className="banner-data-holder">
              <div className="banner-data">
                <img
                  width={80}
                  style={{
                    background: data.primary_color || "var(--body-background)",
                  }}
                  src={
                    data.community_icon.replaceAll("amp;", "") ||
                    data.icon_img ||
                    "/reddiculous/icon_big.png"
                  }
                />
                <div className="banner-subdata">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      // flexWrap: "wrap",
                    }}
                  >
                    <h1 style={{ fontSize: "clamp(15px,2vw,25px)" }}>
                      {data.display_name_prefixed}
                    </h1>
                    <h4
                      style={{
                        color: "var(--primary-color)",
                        fontSize: "clamp(12px,2vw,15px)",
                        // paddingTop: "5px",
                      }}
                    >
                      • {SetMembers(data.subscribers)} users
                    </h4>
                  </div>
                  <div style={{ height: "20px" }}>
                    {/* <h4>{data.title} | </h4> */}
                    <p
                      style={{
                        maxWidth: "600px",
                        paddingRight: "6px",
                        opacity: ".8",
                        fontSize: "clamp(12px,2vw,17px)",
                      }}
                    >
                      {" "}
                      {data.public_description.length > 168
                        ? data.public_description.slice(0, 170) + "..."
                        : data.public_description ||
                          data.header_title ||
                          data.title}
                    </p>
                  </div>
                </div>
                {/* 
                {data.over18 && (
                  <div className="label" style={{ background: "darkred" }}>
                    NSFW
                  </div>
                )} */}
              </div>
            </div>
          </div>
          <div
            className="banner-data-holder"
            style={{ display: "flex", height: "auto" }}
          >
            <Dropdown
              l_active={SetSortActive}
              current_active={sortActive}
              l_elements={["Hot", "New", "Top", "Rising"]}
            />
            {sortActive.toLowerCase() == "top" && (
              <Dropdown
                l_active={SetTopActive}
                current_active={topActive}
                l_elements={topValues}
              />
            )}
          </div>
          <Posts />
        </div>
      ) : (
        <div className="container">
          <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
        </div>
      )}
    </>
  );
}

export default Subreddit;
