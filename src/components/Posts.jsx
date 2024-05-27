import React from "react";
import { useState, useEffect, useRef } from "react";
// import "../App.css";
import axios from "axios";
import Card from "./Card";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import EmbedVideo from "./EmbedVideo";
import GalleryCard from "./GalleryCard";
import { useParams, useNavigate } from "react-router-dom";

function Posts({ setParam }) {
  const [data, setData] = useState([]);
  const [m_after, setAfter] = useState("");
  const [clicked, SetClicked] = useState(false);
  const [reqError, SetReqError] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [searchValue, SetSearchValue] = useState("");
  const loading = useRef(false);
  const { sub } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    // set State Default
    setParam(sub ? `r/${sub}` : "r/all");
    setData([]);
    setAfter("");
    SetReqError("");
    SetClicked((clicked) => !clicked);

    // console.log(true);
    const handleInteraction = () => setHasUserInteracted(true);
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, [sub]);

  useEffect(() => {
    var options = {
      method: "GET",
      url: `https://old.reddit.com/r/${sub ? sub : "all"}.json`,
      params: { after: m_after },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(
        //   response.data.data.children.filter((item) => item.data.is_gallery)
        // );
        // console.log(response.data.data);
        setData((data) => [...data, ...response.data.data.children]);
        setAfter(response.data.data.after);
      })
      .catch((reject) => {
        console.log(reject.message);
        SetReqError(reject.message);
      })
      .finally(() => {
        loading.current = false;
      });
  }, [clicked]);
  //   console.log(sub);

  function handleDate(l_date) {
    const m_date = new Date(l_date * 1000);
    const nowDate = new Date();

    const yearDiff = nowDate.getFullYear() - m_date.getFullYear();
    const monthDiff = nowDate.getMonth() - m_date.getMonth() + yearDiff * 12;
    const dateDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60 * 24));
    const hourDiff = Math.floor((nowDate - m_date) / (1000 * 60 * 60));

    if (monthDiff > 0 && monthDiff < 12) {
      return monthDiff == 1 ? "1 month ago" : `${monthDiff} months ago`;
    } else if (monthDiff >= 12) {
      return `${Math.floor(monthDiff / 12)} years ago`;
    } else if (dateDiff > 0) {
      return dateDiff == 1 ? `1 day ago` : `${dateDiff} days ago`;
    } else {
      return hourDiff == 0
        ? "just now"
        : hourDiff == 1
        ? `an hour ago`
        : `${hourDiff} hrs ago`;
    }
  }
  function decodeHtml(l_html) {
    const txt = document.createElement("textarea");
    // l_html = l_html.replace(" ", " sandbox ");
    txt.innerHTML = l_html;
    // txt.innerHTML = html.replace(`style="position:absolute;"`, "");
    // txt.setAttribute("style", "opacity:0.4");
    return txt.value;
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading.current) {
        loading.current = true;
        SetClicked((clicked) => !clicked);
      }
    }
  };

  function HandleNot(shit) {
    console.log("Shit not supported", shit);
    return "";
  }
  return (
    <div className="container">
      {/* <div className="header">
        <h1 style={{ padding: "10px" }}>{sub ? "r/" + sub : "r/all"}</h1>
        <form
          style={{ display: "flex" }}
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/r/${searchValue}`, { replace: true });
            window.location.reload();
            console.log("Submit", searchValue);
          }}
        >
          <h1>r/</h1>
          <input
            style={{ padding: "4px 6px", fontSize: "large", outline: "none" }}
            type="search"
            name=""
            value={searchValue}
            onChange={(e) => SetSearchValue(e.target.value)}
          />
        </form>
      </div> */}
      <hr />
      {data.length ? (
        <>
          {data.map((item, index) => {
            return item.data.author != "AutoModerator" ? ( // Check if not Automod
              ((item.data.is_reddit_media_domain && !item.data.is_video) ||
                item.data.post_hint == "image") && // check if image
              !item.data.url.endsWith(".gif") ? ( // check if not gif
                // check if not crosspost
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <ImageCard
                    preview={
                      item.data.post_hint == "image"
                        ? item.data.preview.images[0].resolutions.length <= 4
                          ? item.data.preview.images[0].source.url.replaceAll(
                              "amp;",
                              ""
                            )
                          : item.data.preview.images[0].resolutions[
                              item.data.preview.images[0].resolutions.length - 2
                            ].url.replaceAll("amp;", "")
                        : item.data.url
                    }
                  />
                </Card>
              ) : item.data.domain.includes("imgur.com") ? ( // If Imgur
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <ImageCard
                    preview={
                      item.data.preview.images[0].resolutions.length <= 4
                        ? item.data.preview.images[0].source.url.replaceAll(
                            "amp;",
                            ""
                          )
                        : item.data.preview.images[0].resolutions[
                            item.data.preview.images[0].resolutions.length - 2
                          ].url.replaceAll("amp;", "")
                    }
                  />
                </Card>
              ) : item.data.url.endsWith(".gif") ? ( // If Gif
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <ImageCard preview={item.data.url} />
                </Card>
              ) : item.data.post_hint == "rich:video" &&
                item.data.domain.includes("redgifs.com") ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <VideoCard
                    muted={!hasUserInteracted}
                    url={
                      item.data.media.oembed.thumbnail_url.split("files/")[0] +
                      "sd.m3u8"
                    }
                    // url={item.data.preview.reddit_video_preview.hls_url}
                    // fallback={item.data.media_embed.content}
                    fallback={item.data.preview?.reddit_video_preview.hls_url}
                    fallbackEmbed={item.data.media_embed.content}
                  />

                  <a href={item.data.url} target="_blank">
                    {item.data.url}
                  </a>
                  {/* <VideoCard url="https://api.redgifs.com/v2/gifs/uniformexperttrout/sd.m3u8" /> */}
                  {/* <div
                    style={{
                      height: "600px",
                      width: "90%",
                      position: "relative",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(item.data.media_embed.content),
                    }}
                  ></div> */}
                </Card>
              ) : item.data.domain.includes("redgifs.com") ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <EmbedVideo
                    url={item.data.media_embed.content}
                    thumbnail={item.data.thumbnail}
                    aspect={
                      item.data.thumbnail_width / item.data.thumbnail_height
                    }
                  />
                </Card>
              ) : item.data.post_hint == "hosted:video" ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <VideoCard
                    muted={!hasUserInteracted}
                    url={item.data.media.reddit_video.dash_url.replaceAll(
                      "&amp;",
                      "&"
                    )}
                    img={item.data.preview.images[0].source.url.replaceAll(
                      "amp;",
                      ""
                    )}
                    height={item.data.media.reddit_video.height}
                    width={item.data.media.reddit_video.width}
                  />
                  {/* <ImageCard preview={item.data.url} /> */}
                </Card>
              ) : item.data.post_hint == "rich:video" ||
                item.data.domain.includes("streamable.com") ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <VideoCard url={item.data.url} height="400px" />
                  {/* <ImageCard preview={item.data.url} /> */}
                </Card>
              ) : item.data.is_gallery ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <GalleryCard
                    items={item.data.gallery_data.items}
                    data={item.data.media_metadata}
                  />
                </Card>
              ) : item.data.is_self ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <div
                    style={{
                      borderRadius: "8px",
                      width: "90%",
                      padding: "10px",
                      background: "#00000033",
                      overflow: "overlay",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(item.data.selftext_html),
                    }}
                  ></div>
                </Card>
              ) : item.data.post_hint == "link" ? (
                <Card
                  date={handleDate(item.data.created)}
                  key={index}
                  fullname={item.data.author_fullname}
                  title={item.data.title}
                  user={item.data.author}
                  thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                  comments={item.data.num_comments}
                  ups={item.data.ups}
                  downs={Math.round(
                    item.data.ups / item.data.upvote_ratio - item.data.ups
                  )}
                >
                  <a
                    href={item.data.url}
                    target="_blank"
                    style={{
                      position: "relative",
                    }}
                  >
                    <i
                      style={{
                        width: "-webkit-fill-available",
                        position: "absolute",
                        zIndex: "3",
                        fontSize: "40px",
                        fontWeight: "bolder",
                        bottom: "0",
                        textAlign: "end",
                        borderTop: "2px solid white",
                        background:
                          "linear-gradient(-90deg, #000000a6, #ffffff80)",

                        // backdropFilter: "blur(8px)",
                        textDecoration: "none",
                        color: "white",
                        padding: "10px",
                      }}
                      className="bx bx-link-external"
                    ></i>
                    {/* <span
                      style={{
                        position: "absolute",
                        zIndex: "3",
                        fontSize: "40px",
                        fontWeight: "bolder",
                        transform: "rotate(180deg) translate(-50%, -50%)",
                        top: "50%",
                        left: "50%",
                        textDecoration: "none",
                      }}
                    >
                      &#10550;
                    </span> */}
                    <div>
                      <ImageCard
                        preview={
                          item.data.preview.images[0].resolutions.length <= 4
                            ? item.data.preview.images[0].source.url.replaceAll(
                                "amp;",
                                ""
                              )
                            : item.data.preview.images[0].resolutions[
                                item.data.preview.images[0].resolutions.length -
                                  2
                              ].url.replaceAll("amp;", "")
                        }
                      />
                    </div>
                  </a>
                </Card>
              ) : (
                // Cant Display

                <>
                  {HandleNot(item.data)}
                  <Card
                    date={handleDate(item.data.created)}
                    key={index}
                    fullname={item.data.author_fullname}
                    title={item.data.title}
                    user={item.data.author}
                    thumbnail={item.data.thumbnail.replaceAll("amp;", "")}
                    comments={item.data.num_comments}
                    ups={item.data.ups}
                    downs={Math.round(
                      item.data.ups / item.data.upvote_ratio - item.data.ups
                    )}
                  >
                    <h3 style={{ color: "orange" }}>Cant Display Post</h3>
                  </Card>
                </>
              )
            ) : (
              "" // if auto mod: null
            );
          })}
          <img src="../assets/spinner2.gif" width="100px" height="100px" />{" "}
        </>
      ) : reqError ? (
        <h1>Error: {reqError}</h1>
      ) : (
        <img src="../assets/spinner2.gif" width="100px" height="100px" />
      )}
    </div>
  );
}

export default Posts;
