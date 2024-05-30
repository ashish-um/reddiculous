import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import EmbedVideo from "./EmbedVideo";
import GalleryCard from "./GalleryCard";
import { useParams } from "react-router-dom";

// import { spinner } from "../../public/spinner2.gif";

function Posts({ setParam, setCommentsData, setPostLoad }) {
  const [data, setData] = useState([]);
  const [m_after, setAfter] = useState("");
  const [clicked, SetClicked] = useState(0);
  const [reqError, SetReqError] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const loading = useRef(false);
  const { sub, id, post, user } = useParams();
  const prevSub = useRef(sub);
  const URL = useRef(`https://old.reddit.com/r/${sub ? sub : "all"}.json`);
  const [searchParam, SetSearchParams] = useSearchParams({ q: "" });
  const prevSearchQuery = useRef(searchParam.get("q"));
  // console.log("Search:", searchParam.get("q"));
  // URL.current = user && `https://old.reddit.com/u/${user}/submitted.json`;
  // var URL = `https://old.reddit.com/r/${sub ? sub : "all"}.json`;

  useEffect(() => {
    // set State Default
    if (setParam) {
      setParam(sub ? `r/${sub}` : "r/all");
    }
    setData([]);
    if (sub) {
      URL.current = `https://old.reddit.com/r/${sub ? sub : "all"}.json`;
    }
    if (user) {
      URL.current = `https://old.reddit.com/user/${user}/submitted.json`;
    }
    if (searchParam.get("q")) {
      URL.current = `https://old.reddit.com/search.json`;
    }

    setAfter("");
    SetReqError("");
    if (
      sub != prevSub.current ||
      prevSearchQuery.current != searchParam.get("q")
    ) {
      SetClicked(clicked == 0 ? 1 : 0);
      window.scrollTo(0, 0);
    }
    if (post && id) {
      // console.log("Entered Post", post);
      URL.current = `https://old.reddit.com/r/${sub}/comments/${id}/${post}.json?limit=100`;
    }
    // console.log(true);
    const handleInteraction = () => setHasUserInteracted(true);
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, [sub, post, searchParam.get("q")]);

  useEffect(() => {
    var options = {
      method: "GET",
      url: URL.current,
      params: {
        after: m_after,
        q: searchParam.get("q"),
        // include_over_18: "on",
        // sort: "top",
        // t: "all",
      },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(
        //   response.data.data.children.filter((item) => item.data.is_gallery)
        // );
        if (id && post) {
          // console.log("checking");
          // console.log(response.data);
          // window.removeEventListener("scroll", handleScroll);
          setData(response.data[0].data.children);
          setCommentsData(response.data[1].data.children);
        } else {
          console.log(response.data.data.children);
          if (!response.data.data.after) {
            window.removeEventListener("scroll", handleScroll);
          }
          setData((data) => [...data, ...response.data.data.children]);
          setAfter(response.data.data.after);
        }
        if (setPostLoad) {
          setPostLoad(true);
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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = React.useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading.current) {
        loading.current = true;
        SetClicked((clicked) => clicked + 1);
      }
    }
  }, []);

  function HandleNot(shit) {
    console.log("Shit not supported", shit);
    return "";
  }

  return (
    <div className="container">
      {sub ? <h2 className="post-title">r/{sub}</h2> : ""}
      {data.length ? (
        <>
          {data.map((item, index) => {
            let l_item = item.data;
            let crosspost = false;
            if (item.data.crosspost_parent_list?.length) {
              l_item = item.data.crosspost_parent_list[0];
              crosspost = true;
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
                <Card
                  crosspost={crosspost}
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
                  crosspost={crosspost}
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
              ) : l_item.post_hint == "link" ? (
                <Card
                  crosspost={crosspost}
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
              ) : l_item.url.endsWith(".gif") ? ( // If Gif
                <Card
                  crosspost={crosspost}
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
                  crosspost={crosspost}
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
                    img={
                      l_item.preview.images[0].resolutions.filter(
                        (item) => item.height > 300
                      ).length > 0
                        ? l_item.preview.images[0].resolutions
                            .filter((item) => item.height > 300)[0]
                            .url.replaceAll("amp;", "")
                        : l_item.preview.images[0].source.url.replaceAll(
                            "amp;",
                            ""
                          )
                    }
                    // url={l_item.preview.reddit_video_preview.hls_url}
                    // fallback={l_item.media_embed.content}
                    fallback={l_item.preview?.reddit_video_preview?.hls_url}
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
                  crosspost={crosspost}
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
                  {l_item.preview &&
                  "reddit_video_preview" in l_item.preview ? (
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
                    // console.log("Sorry Not Found Previews")
                    <>
                      {/* {console.log(l_item)} */}
                      <EmbedVideo
                        url={
                          l_item.crosspost_parent_list.length
                            ? l_item.crosspost_parent_list[0].media_embed
                                .content
                            : l_item.media_embed.content
                        }
                        thumbnail={
                          l_item.thumbnail?.includes("https")
                            ? l_item.thumbnail
                            : "https://external-preview.redd.it/GvDG58LivFnlxOq8XETKwi__STfuh3cKuy7C2ah2uDw.jpg?width=640&crop=smart&blur=40&format=pjpg&auto=webp&s=8acc582cbc8e2228edcb7d0412091ba1552879b5"
                        }
                      />
                    </>
                  )}
                </Card>
              ) : l_item.post_hint == "hosted:video" || l_item.is_video ? (
                <Card
                  crosspost={crosspost}
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
                l_item.domain.includes("youtube.com") ||
                l_item.domain.includes("streamable.com") ? (
                <Card
                  crosspost={crosspost}
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
                  crosspost={crosspost}
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
                  crosspost={crosspost}
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
              ) : (
                // Cant Display
                <>
                  {HandleNot(l_item)}
                  <Card
                    crosspost={crosspost}
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
                      rel="noopener noreferrer"
                      style={{ color: "cornflowerblue" }}
                    >
                      {l_item.url}
                    </a>
                    <h3 style={{ color: "orange" }}>Nothing to show</h3>
                  </Card>
                </>
              )
            ) : (
              "" // if auto mod: null
            );
          })}
          {!(post && id) && m_after && (
            <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
          )}
        </>
      ) : reqError ? (
        <h1>Error: {reqError}</h1>
      ) : !(m_after == null) ? (
        <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
      ) : (
        "nothing to show"
      )}
    </div>
  );
}

export default Posts;
