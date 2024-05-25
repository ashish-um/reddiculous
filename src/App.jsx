import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import "./components/ImageCard";
import Card from "./components/Card";
import ImageCard from "./components/ImageCard";
import VideoCard from "./components/VideoCard";

function App() {
  const [data, setData] = useState([]);
  const [m_after, setAfter] = useState("");
  const [clicked, SetClicked] = useState(false);
  const [reqError, SetReqError] = useState("");
  // const [loading, SetLoading] = useState(false);
  const loading = useRef(false);
  // const [, SetPageNum] = useState();

  useEffect(() => {
    var options = {
      method: "GET",
      url: "https://old.reddit.com/r/videos.json",
      params: { after: m_after },
    };
    axios
      .request(options)
      .then((response) => {
        // console.log(
        //   response.data.data.children.filter(
        //     (item) => item.data.post_hint == "hosted:video"
        //   )
        // );
        console.log(response.data.data);
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
  const embedContent = `
  <iframe 
    width="267" 
    height="200" 
    src="https://www.youtube.com/embed/WEA34Nk6skM?feature=oembed&amp;enablejsapi=1" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen 
    title="Malcolm in the Middle - spider scene s03e11">
  </iframe>
`;
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

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  return (
    <div className="container">
      <h1 style={{ padding: "10px" }}>
        {data.length ? data[0].data.subreddit_name_prefixed : "whoRddit"}
      </h1>
      <hr />
      {data.length ? (
        <>
          {data.map((item, index) => {
            return item.data.author != "AutoModerator" ? ( // Check if not Automod
              ((item.data.is_reddit_media_domain && !item.data.is_video) ||
                item.data.post_hint == "image") && // check if image
              !item.data.url.endsWith(".gif") && // check if not gif
              !item.data.crosspost_parent ? ( // check if not crosspost
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
              ) : // if not image: null
              // check if gif
              item.data.url.endsWith(".gif") ? (
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
              ) : // check if video
              item.data.post_hint == "hosted:video" ? (
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
              ) : item.data.post_hint == "rich:video" ? (
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
                  <VideoCard url={item.data.url} />
                  {/* <ImageCard preview={item.data.url} /> */}
                </Card>
              ) : (
                ""
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

export default App;
