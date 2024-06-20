import React, { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import ImageCard from "./ImageCard";
import VideoCard from "./VideoCard";
import EmbedVideo from "./EmbedVideo";
import GalleryCard from "./GalleryCard";
import { useParams } from "react-router-dom";

// import { spinner } from "../../public/spinner2.gif";

function Posts({ setParam, setCommentsData, setPostLoad, liked = false }) {
  const [data, setData] = useState([]);
  const [m_after, setAfter] = useState("");
  const [clicked, setClicked] = useState(0);
  const [reqError, setReqError] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const loading = useRef(false);
  const { sub, id, post, user, sort } = useParams();
  // const URL = useRef(`https://old.reddit.com/r/${sub ? sub : "popular"}.json`);
  const URL = useRef();
  const [searchParam, setSearchParams] = useSearchParams({
    q: "",
    sort: "",
    t: "",
  });

  const [firstLoad, setFirstLoad] = useState(true);

  const storeData = useRef("main-data");
  const storeAfter = useRef("main-data-after");
  const storeScroll = useRef("scroll");
  const cacheIt = useRef();

  const setLocalItems = (main, after, scroll) => {
    storeData.current = main;
    storeAfter.current = after;
    storeScroll.current = scroll;
    window.scrollTo(0, 0);
  };

  const clearSessionStorage = () => {
    Object.keys(sessionStorage).forEach((item) => {
      if (item.startsWith("del_")) {
        sessionStorage.removeItem(item);
      }
    });
  };

  const setupUrlAndCache = () => {
    if (post && id) {
      URL.current = `https://old.reddit.com/r/${sub}/comments/${id}/${post}.json?limit=100`;
      cacheIt.current = false;
    } else if (sort) {
      setLocalItems(`del_sub${sub}`, `del_subafter${sub}`, `del_subscroll${sub}`);
      URL.current = `https://old.reddit.com/r/${sub}/${sort}.json`;
    } else if (sub) {
      setLocalItems(`del_sub${sub}`, `del_subafter${sub}`, `del_subscroll${sub}`);
      URL.current = `https://old.reddit.com/r/${sub}.json`;
      cacheIt.current = true;
    } else if (user) {
      setLocalItems(`del_user${user}`, `del_userafter${user}`, `del_userscroll${user}`);
      URL.current = `https://old.reddit.com/user/${user}/submitted.json`;
      cacheIt.current = true;
    } else if (searchParam.get("q")) {
      setLocalItems(`del_search`, `del_searchafter`, `del_searchscroll`);
      URL.current = `https://old.reddit.com/search.json`;
      cacheIt.current = true;
    } else {
      let joinedSubsCombined = "";
      const subscriptions = JSON.parse(localStorage.getItem("subscriptions"));
      subscriptions?.forEach((element) => {
        joinedSubsCombined += "+" + element.display_name_prefixed.slice(2);
      });
      URL.current = `https://old.reddit.com/r/${joinedSubsCombined || 'all'}.json`;
      clearSessionStorage();
    }
  };

  useEffect(() => {
    setData([]);
    setAfter("");
    cacheIt.current = true;
    storeData.current = `homedata`;
    storeAfter.current = `homeafter`;
    storeScroll.current = `homescroll`;

    setupUrlAndCache();

    setReqError("");

    if (!firstLoad) {
      setClicked(clicked === 0 ? 1 : 0);
    }

    const handleInteraction = () => setHasUserInteracted(true);
    window.addEventListener("click", handleInteraction);

    if (sessionStorage.getItem("isReloaded")) {
      sessionStorage.clear();
    } else {
      sessionStorage.setItem("isReloaded", "true");
    }

    return () => {
      window.removeEventListener("click", handleInteraction);
      sessionStorage.removeItem("isReloaded");
    };
  }, [sub, post, searchParam.get("q"), sort, searchParam.get("t")]);

  const fetchData = async () => {
    try {
      const options = {
        method: "GET",
        url: URL.current,
        params: {
          after: m_after,
          q: searchParam.get("q"),
          include_over_18: localStorage.getItem("show_nsfw") === "true" ? "on" : "",
          sort: searchParam.get("sort"),
          t: searchParam.get("t"),
        },
      };

      const response = await axios.request(options);
      if (id && post) {
        setData(response.data[0].data.children);
        setCommentsData(response.data[1].data.children);
        window.removeEventListener("scroll", handleScroll);
      } else {
        const newData = localStorage.getItem("show_nsfw") !== "true"
          ? response.data.data.children.filter(item => !item.data.over_18)
          : response.data.data.children;

        const combinedData = [...data, ...newData];
        setData(combinedData);
        setAfter(response.data.data.after);

        if (cacheIt.current) {
          sessionStorage.setItem(storeData.current, JSON.stringify(combinedData));
          sessionStorage.setItem(storeAfter.current, response.data.data.after);
        }
      }
    } catch (error) {
      setReqError(error.message);
    } finally {
      loading.current = false;
    }
  };

  const handleInitialLoad = () => {
    const savedData = JSON.parse(sessionStorage.getItem(storeData.current));
    const savedPage = sessionStorage.getItem(storeAfter.current);
    const savedScrollPosition = sessionStorage.getItem(storeScroll.current);

    if ((!savedData || (!firstLoad && cacheIt.current) || (post && id)) && !liked) {
      fetchData();
    } else if (!savedData && liked) {
      const likedPosts = localStorage.getItem("liked_posts");
      sessionStorage.setItem(storeData.current, likedPosts);
      setAfter(null);
      setData(JSON.parse(likedPosts));
    } else {
      setData(savedData);
      setAfter(savedPage);
      window.scrollTo(0, 0);
      setTimeout(() => window.scrollTo(0, savedScrollPosition), 400);
    }
  };

  
  useEffect(() => {
    setFirstLoad(false);
    handleInitialLoad();
  }, [clicked]);
  //   console.log(sub);
  // console.log(data.length);

  function decodeHtml(l_html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = l_html;
    return txt.value;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 900);
    return () => {
      clearTimeout(timer); // Clear the timer to prevent the event listener from being added after unmount
      window.removeEventListener("scroll", handleScroll); // Remove the event listener if it was added
    };
  }, []);

  const handleScroll = React.useCallback(() => {
    if (cacheIt.current) {
      sessionStorage.setItem(storeScroll.current, window.scrollY);
      // console.log(cacheIt.current);
    }

    if (
      window.innerHeight + document.documentElement.scrollTop + 300 >=
      document.documentElement.scrollHeight
    ) {
      if (!loading.current && !liked) {
        loading.current = true;

        setClicked((clicked) => clicked + 1);
      }
    }
  }, []);

  function handleImage(item) {
    if (item.post_hint == "image") {
      const filteredImage = item.preview.images[0].resolutions.filter(
        (element) => element.height > 400 || element.width > 400
      );
      // console.log("filteredImages", filteredImage);
      if (filteredImage.length > 0) {
        return filteredImage[0].url.replaceAll("amp;", "");
      } else {
        return item.preview.images[0].source.url.replaceAll("amp;", "");
      }
    } else {
      console.log("wierd", item);
      return item.url;
    }
  }

  if (reqError) {
    return <h1>Error: {reqError}</h1>;
  }

  return (
    <div className="container">
      {/* {sub && <h2 className="post-title">r/{sub}</h2>} */}
      {data?.length ? (
        <>
          {data.map((item, index) => {
            let l_item = item.data;
            let crosspost = false;
            if (item.data.crosspost_parent_list?.length) {
              l_item = item.data.crosspost_parent_list[0];
              crosspost = true;
            }

            return (
              <Fragment key={l_item.id}>
                {l_item.author != "AutoModerator" ? (
                  l_item.removal_reason || l_item.removed_by_category ? (
                    "" // Check if not Automod
                  ) : l_item.crosspost_parent_list?.length ? (
                    // { l_item: l_item.crosspost_parent_list[0] }
                    ""
                  ) : ((l_item.is_reddit_media_domain && !l_item.is_video) ||
                      l_item.post_hint == "image") && // check if image
                    !l_item.url.endsWith(".gif") ? ( // check if not gif
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <ImageCard
                        preview={handleImage(l_item)}
                        src={
                          l_item.post_hint == "image"
                            ? l_item.preview.images[0].source.url.replaceAll(
                                "amp;",
                                ""
                              )
                            : l_item.url
                        }
                      />
                    </Card>
                  ) : l_item.domain.includes("imgur.com") ? ( // If Imgur
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      {l_item.preview && (
                        <ImageCard
                          preview={
                            l_item.preview.images[0].resolutions.length <= 4
                              ? l_item.preview.images[0].source.url.replaceAll(
                                  "amp;",
                                  ""
                                )
                              : l_item.preview.images[0].resolutions[
                                  l_item.preview.images[0].resolutions.length -
                                    2
                                ].url.replaceAll("amp;", "")
                          }
                        />
                      )}
                    </Card>
                  ) : l_item.post_hint == "link" ? (
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <a
                        href={l_item.url}
                        target="_blank"
                        style={{
                          position: "relative",
                        }}
                      >
                        <i className="bx bx-link-external redirect-link"></i>

                        <div>
                          <ImageCard
                            preview={
                              l_item.preview.images[0].resolutions.length <= 4
                                ? l_item.preview.images[0].source.url.replaceAll(
                                    "amp;",
                                    ""
                                  )
                                : l_item.preview.images[0].resolutions[
                                    l_item.preview.images[0].resolutions
                                      .length - 2
                                  ].url.replaceAll("amp;", "")
                            }
                          />
                        </div>
                      </a>
                    </Card>
                  ) : l_item.url.endsWith(".gif") ? ( // If Gif
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <ImageCard preview={l_item.url} />
                    </Card>
                  ) : l_item.post_hint == "rich:video" &&
                    l_item.domain.includes("redgifs.com") ? (
                    <Card crosspost={crosspost} key={index} data={l_item}>
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
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      {l_item.preview &&
                      "reddit_video_preview" in l_item.preview ? (
                        <>
                          <VideoCard
                            muted={!hasUserInteracted}
                            url={l_item.preview.reddit_video_preview.hls_url}
                            // url={l_item.preview.reddit_video_preview.hls_url}
                            // fallback={l_item.media_embed.content}
                            fallback={
                              l_item.preview?.reddit_video_preview.hls_url
                            }
                          />
                        </>
                      ) : (
                        <>
                          <EmbedVideo
                            url={l_item.media_embed.content}
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
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <VideoCard
                        muted={!hasUserInteracted}
                        url={l_item.media.reddit_video.dash_url.replaceAll(
                          "&amp;",
                          "&"
                        )}
                        // img={
                        //   l_item.preview.images[0].resolutions.filter(
                        //     (item) => item.height > 300
                        //   ).length > 0
                        //     ? l_item.preview.images[0].resolutions
                        //         .filter((item) => item.height > 300)[0]
                        //         .url.replaceAll("amp;", "")
                        //     : l_item.preview.images[0].source.url.replaceAll(
                        //         "amp;",
                        //         ""
                        //       )
                        // }
                        img={l_item.preview?.images[0].source.url.replaceAll(
                          "amp;",
                          ""
                        )}
                      />
                      {/* <ImageCard preview={l_item.url} /> */}
                    </Card>
                  ) : l_item.post_hint == "rich:video" ||
                    l_item.domain.includes("youtube.com") ||
                    l_item.domain.includes("streamable.com") ? (
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <VideoCard
                        url={l_item.url}
                        aspect={
                          l_item.media_embed.width / l_item.media_embed.height
                        }
                      />
                      {/* <ImageCard preview={l_item.url} /> */}
                    </Card>
                  ) : l_item.is_gallery ? (
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      <GalleryCard
                        items={l_item.gallery_data.items}
                        data={l_item.media_metadata}
                      />
                    </Card>
                  ) : l_item.is_self ? (
                    <Card crosspost={crosspost} key={index} data={l_item}>
                      {l_item.selftext_html && (
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
                              l_item.selftext_html.length > 598 && !(post && id)
                                ? l_item.selftext_html?.slice(0, 600) + "..."
                                : l_item.selftext_html
                            ),
                          }}
                        ></div>
                      )}
                    </Card>
                  ) : (
                    // Cant Display
                    <>
                      {l_item.url && (
                        <Card crosspost={crosspost} key={index} data={l_item}>
                          <a
                            href={l_item.url}
                            target="_blank"
                            style={{
                              position: "relative",
                            }}
                          >
                            <i className="bx bx-link-external redirect-link"></i>

                            <div>
                              <ImageCard
                                preview={
                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVq-OmHL5H_5P8b1k306pFddOe3049-il2A&s" ||
                                  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png?20220519031949"
                                }
                              />
                            </div>
                          </a>
                        </Card>
                      )}
                    </>
                  )
                ) : (
                  "" // if auto mod: null
                )}
              </Fragment>
            );
          })}

          {!(post && id) && m_after && (
            <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
          )}
          {m_after == null && "NOthing TO show"}
        </>
      ) : !(m_after == null) ? (
        !sessionStorage.getItem(storeData) && (
          <img src="/reddiculous/spinner2.gif" width="100px" height="100px" />
        )
      ) : (
        "nothing to show"
      )}
    </div>
  );
}

export default Posts;
