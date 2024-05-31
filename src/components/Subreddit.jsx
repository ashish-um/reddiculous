import { React, useState, useEffect } from "react";
import axios from "axios";
import Posts from "./Posts";
import { useParams } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

function Subreddit() {
  const { sub } = useParams();
  const [data, SetData] = useState({});
  const [error, SetError] = useState("");
  useEffect(() => {
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
    console.log("requesting");
    axios
      .request(options)
      .then((response) => {
        console.log(
          response.data.data.children.filter(
            (item) => item.data.display_name_prefixed == "r/" + sub
          )[0].data
          // response.data.data.children
        );
        SetData(
          response.data.data.children.filter(
            (item) => item.data.display_name_prefixed == "r/" + sub
          )[0].data
        );
      })
      .catch((reject) => {
        SetError(reject.message);
      })
      .then(() => {
        console.log("requested");
      });
  }, []);

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
      {!error ? (
        Object.keys(data).length !== 0 ? (
          <div>
            <div className="sub-banner">
              {data.banner_background_image || data.mobile_banner_image ? (
                <>
                  <BrowserView>
                    <div className="sub-banner-img">
                      <img
                        width="100%"
                        // style={{ objectFit: "cover" }}
                        src={
                          data.banner_background_image.replaceAll("amp;", "") ||
                          data.mobile_banner_image.replaceAll("amp;", "")
                        }
                      />
                    </div>
                  </BrowserView>
                  <MobileView>
                    <div className="sub-banner-img">
                      <img
                        width="100%"
                        // height={70}
                        style={{ objectFit: "cover" }}
                        src={
                          data.mobile_banner_image.replaceAll("amp;", "") ||
                          data.banner_background_image.replaceAll("amp;", "")
                        }
                      />
                    </div>
                  </MobileView>
                </>
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
                      background:
                        data.primary_color || "var(--body-background)",
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
                          paddingInline: "4px",
                          opacity: ".8",
                          fontSize: "clamp(15px,2vw,17px)",
                        }}
                      >
                        {" "}
                        {data.public_description.slice(0, 170) ||
                          data.header_title}
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
            <Posts />
          </div>
        ) : (
          ""
        )
      ) : (
        `Error: ${error}`
      )}
    </>
  );
}

export default Subreddit;
