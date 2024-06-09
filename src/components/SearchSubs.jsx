import { React, useState, useEffect, useRef, Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SubCard from "./SubCard";
import { MobileView } from "react-device-detect";

function SearchSubs({ setPostLoad }) {
  const [searchParam, SetSearchParams] = useSearchParams({ q: "" });
  const [m_data, SetData] = useState([]);
  const [loader, SetLoader] = useState(false);
  const [after, setAfter] = useState("");
  // const [postsLoaded, SetPostsLoaded] = useState(false);
  const prevSearchQuery = useRef(searchParam.get("q"));
  const [loading, SetLoading] = useState(true);
  const URL = `https://old.reddit.com/search.json`;
  const [error, SetError] = useState("");

  useEffect(() => {
    // Set Default State
    SetData([]);
    setAfter("");
    SetLoading(true);
    if (prevSearchQuery.current != searchParam.get("q")) {
      SetLoader((loader) => !loader);
    }
  }, [searchParam.get("q")]);

  useEffect(() => {
    var options = {
      method: "GET",
      url: URL,
      params: {
        q: searchParam.get("q"),
        type: "sr",
        include_over_18:
          localStorage.getItem("show_nsfw") === "true" ? "on" : "",
        after: after,
      },
    };

    axios
      .request(options)
      .then((response) => {
        SetData((data) => [...data, ...response.data.data.children]);
        setAfter(response.data.data.after);
        SetLoading(false);
      })
      .catch((reject) => {
        SetError(reject.message);
      });
  }, [loader]);

  // console.log(m_data);

  return (
    <>
      {!error ? (
        <div className="search-sub">
          {m_data.length && setPostLoad ? (
            <div>
              {m_data.map((item) => {
                return (
                  <Fragment key={item.data.id}>
                    <SubCard showJoinBtn={true} data={item.data} />
                  </Fragment>
                );
              })}
              {!loading ? (
                <div
                  style={{ marginBottom: "20px" }}
                  className="label clickable"
                  onClick={() => {
                    SetLoader((loader) => !loader);
                    SetLoading(true);
                  }}
                >
                  Show More
                </div>
              ) : (
                <img
                  style={{
                    width: "-webkit-fill-available",
                    objectFit: "contain",
                  }}
                  src="/reddiculous/spinner2.gif"
                  // width={50}
                  height={50}
                  alt="Loading..."
                />
              )}
            </div>
          ) : (
            <div>
              {window.innerWidth < 1200 && (
                <img
                  style={{
                    width: "-webkit-fill-available",
                    objectFit: "contain",
                  }}
                  src="/reddiculous/spinner2.gif"
                  // width={50}
                  height={100}
                  alt="Loading..."
                />
              )}
            </div>
          )}
        </div>
      ) : (
        `Error: ${error}`
      )}
    </>
  );
}

export default SearchSubs;
