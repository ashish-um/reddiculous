import React from "react";
import { useState, useEffect, useRef } from "react";
// import "../App.css";
import axios from "axios";
import Card from "./Card";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import EmbedVideo from "./EmbedVideo";
import GalleryCard from "./GalleryCard";
import { useParams } from "react-router-dom";
// import { spinner } from "../../public/spinner2.gif";

function Posts({ setParam, setCommentsData }) {
  const [data, setData] = useState([]);
  const [m_after, setAfter] = useState("");
  const [clicked, SetClicked] = useState(0);
  const [reqError, SetReqError] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const loading = useRef(false);
  const { sub, id, post } = useParams();
  const prevSub = useRef(sub);
  const URL = useRef(`https://old.reddit.com/r/${sub ? sub : "all"}.json`);
  // var URL = `https://old.reddit.com/r/${sub ? sub : "all"}.json`;

  useEffect(() => {
    // set State Default
    if (setParam) {
      setParam(sub ? `r/${sub}` : "r/all");
    }
    setData([]);
    URL.current = `https://old.reddit.com/r/${sub ? sub : "all"}.json`;
    setAfter("");
    SetReqError("");
    if (sub != prevSub.current) {
      SetClicked(clicked == 0 ? 1 : 0);
      window.scrollTo(0, 0);
    }
    if (post && id) {
      console.log("Entered Post", post);
      URL.current = `https://old.reddit.com/r/${sub}/comments/${id}/${post}.json?limit=100`;
    }
    // console.log(true);
    const handleInteraction = () => setHasUserInteracted(true);
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, [sub, post]);

  useEffect(() => {
    var options = {
      method: "GET",
      url: URL.current,
      params: { after: m_after },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(
        //   response.data.data.children.filter(
        //     (item) => item.data.crosspost_parent_list?.length > 0
        //   )
        // );
        if (id && post) {
          // console.log("checking");
          // console.log(response.data);
          setData(response.data[0].data.children);
          setCommentsData(response.data[1].data.children);
        } else {
          // console.log(response.data.data.children);
          setData((data) => [...data, ...response.data.data.children]);
          setAfter(response.data.data.after);
        }
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
  // console.log(data.length);
  console.log("clicked", clicked);
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
    txt.innerHTML = l_html;
    return txt.value;
  }

  useEffect(() => {
    if (!(post || id)) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading.current) {
        loading.current = true;
        SetClicked((clicked) => clicked + 1);
      }
    }
  };

  function HandleNot(shit) {
    console.log("Shit not supported", shit);
    return "";
  }
  return (
    <div className="container">
      {data.length ? (
        <>
          {data.map((item, index) => {
            let l_item = item.data;
            if (item.data.crosspost_parent_list?.length) {
              l_item = item.data.crosspost_parent_list[0];
            }

            return l_item.author != "AutoModerator" ? (
              l_item.removal_reason || l_item.removed_by_category ? (
                "" // Check if not Automod
              ) : l_item.crosspost_parent_list?.length ? (
                // { l_item: l_item.crosspost_parent_list[0] }
                ""
              ) : ((l_item.is_reddit_media_domain && !l_item.is_video) ||
                  l_item.post_hint == "image") && // check if image
                !l_item.url.endsWith(".gif") ? ( // check if not gif
                // check if not crosspost
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <ImageCard
                    preview={
                      l_item.post_hint == "image"
                        ? l_item.preview.images[0].resolutions.length <= 4
                          ? l_item.preview.images[0].source.url.replaceAll(
                              "amp;",
                              ""
                            )
                          : l_item.preview.images[0].resolutions[
                              l_item.preview.images[0].resolutions.length - 2
                            ].url.replaceAll("amp;", "")
                        : l_item.url
                    }
                  />
                </Card>
              ) : l_item.domain.includes("imgur.com") ? ( // If Imgur
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <ImageCard
                    preview={
                      l_item.preview.images[0].resolutions.length <= 4
                        ? l_item.preview.images[0].source.url.replaceAll(
                            "amp;",
                            ""
                          )
                        : l_item.preview.images[0].resolutions[
                            l_item.preview.images[0].resolutions.length - 2
                          ].url.replaceAll("amp;", "")
                    }
                  />
                </Card>
              ) : l_item.url.endsWith(".gif") ? ( // If Gif
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <ImageCard preview={l_item.url} />
                </Card>
              ) : l_item.post_hint == "rich:video" &&
                l_item.domain.includes("redgifs.com") ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <VideoCard
                    muted={!hasUserInteracted}
                    url={
                      l_item.media.oembed.thumbnail_url.split("files/")[0] +
                      "sd.m3u8"
                    }
                    // url={l_item.preview.reddit_video_preview.hls_url}
                    // fallback={l_item.media_embed.content}
                    fallback={l_item.preview?.reddit_video_preview.hls_url}
                    fallbackEmbed={l_item.media_embed.content}
                  />

                  {/* <a href={l_item.url} target="_blank">
                    {l_item.url}
                  </a> */}
                  {/* <VideoCard url="https://api.redgifs.com/v2/gifs/uniformexperttrout/sd.m3u8" /> */}
                  {/* <div
                    style={{
                      height: "600px",
                      width: "90%",
                      position: "relative",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(l_item.media_embed.content),
                    }}
                  ></div> */}
                </Card>
              ) : l_item.domain.includes("redgifs.com") ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  {console.log(l_item.preview)}
                  {"reddit_video_preview" in l_item.preview ? (
                    <>
                      <VideoCard
                        muted={!hasUserInteracted}
                        url={l_item.preview.reddit_video_preview.hls_url}
                        // url={l_item.preview.reddit_video_preview.hls_url}
                        // fallback={l_item.media_embed.content}
                        fallback={l_item.preview?.reddit_video_preview.hls_url}
                      />
                    </>
                  ) : (
                    console.log("Sorry Not Found Previews")
                  )}
                  {/* <EmbedVideo
                    url={
                      l_item.crosspost_parent_list.length
                        ? l_item.crosspost_parent_list[0].media_embed.content
                        : l_item.media_embed.content
                    }
                    thumbnail={l_item.thumbnail}
                  /> */}
                </Card>
              ) : l_item.post_hint == "hosted:video" || l_item.is_video ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <VideoCard
                    muted={!hasUserInteracted}
                    url={l_item.media.reddit_video.dash_url.replaceAll(
                      "&amp;",
                      "&"
                    )}
                  />
                  {/* <ImageCard preview={l_item.url} /> */}
                </Card>
              ) : l_item.post_hint == "rich:video" ||
                l_item.domain.includes("streamable.com") ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <VideoCard
                    url={l_item.url}
                    aspect={
                      l_item.media_embed.width / l_item.media_embed.height
                    }
                  />
                  {/* <ImageCard preview={l_item.url} /> */}
                </Card>
              ) : l_item.is_gallery ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <GalleryCard
                    items={l_item.gallery_data.items}
                    data={l_item.media_metadata}
                  />
                </Card>
              ) : l_item.is_self ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <div
                    style={{
                      borderRadius: "8px",
                      width: "98%",
                      padding: "10px",
                      background: "#00000033",
                      overflow: "overlay",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: decodeHtml(
                        l_item.selftext_html
                          ? !(post && id)
                            ? l_item.selftext_html?.slice(0, 600) + "..."
                            : l_item.selftext_html
                          : ""
                      ),
                    }}
                  ></div>
                </Card>
              ) : l_item.post_hint == "link" ? (
                <Card
                  permalink={l_item.permalink}
                  spoiler={l_item.spoiler}
                  over_18={l_item.over_18}
                  subreddit={l_item.subreddit_name_prefixed}
                  date={handleDate(l_item.created)}
                  key={index}
                  fullname={l_item.author_fullname}
                  title={l_item.title}
                  user={l_item.author}
                  thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                  comments={l_item.num_comments}
                  ups={l_item.ups}
                  downs={Math.round(
                    l_item.ups / l_item.upvote_ratio - l_item.ups
                  )}
                >
                  <a
                    href={l_item.url}
                    target="_blank"
                    style={{
                      position: "relative",
                    }}
                  >
                    <i className="bx bx-link-external redirect-link"></i>
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
                          l_item.preview.images[0].resolutions.length <= 4
                            ? l_item.preview.images[0].source.url.replaceAll(
                                "amp;",
                                ""
                              )
                            : l_item.preview.images[0].resolutions[
                                l_item.preview.images[0].resolutions.length - 2
                              ].url.replaceAll("amp;", "")
                        }
                      />
                    </div>
                  </a>
                </Card>
              ) : (
                // Cant Display

                <>
                  {HandleNot(l_item)}
                  <Card
                    permalink={l_item.permalink}
                    spoiler={l_item.spoiler}
                    over_18={l_item.over_18}
                    subreddit={l_item.subreddit_name_prefixed}
                    date={handleDate(l_item.created)}
                    key={index}
                    fullname={l_item.author_fullname}
                    title={l_item.title}
                    user={l_item.author}
                    thumbnail={l_item.thumbnail.replaceAll("amp;", "")}
                    comments={l_item.num_comments}
                    ups={l_item.ups}
                    downs={Math.round(
                      l_item.ups / l_item.upvote_ratio - l_item.ups
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
          {!(post && id) && (
            <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
          )}
        </>
      ) : reqError ? (
        <h1>Error: {reqError}</h1>
      ) : (
        <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
      )}
    </div>
  );
}

export default Posts;
