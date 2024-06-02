import React, { useState } from "react";
import ReactPlayer from "react-player/lazy";
function VideoCard(props) {
  // console.log(props.img);

  // const []
  const [failsLoading, SetFailsLoading] = useState(false);
  const [play, SetPlay] = useState(false);

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    // txt.innerHTML = html.replace(`style="position:absolute;"`, "");
    return txt.value;
  }
  // console.log("Image", props.img);
  // console.log(props.aspect);
  return (
    <div onCompositionStart={(r) => console.log(r)} className="video-holder">
      <div
        className="video-player"
        onMouseEnter={(e) => SetPlay(true)}
        onMouseLeave={(e) => SetPlay(false)}
        // style={{ height: `${props.height ? props.height : "700px"}` }}
        style={{ aspectRatio: props?.aspect }}
      >
        <ReactPlayer
          light={
            props.img ? (
              <img
                src={props.img}
                style={{ maxHeight: "var(--max-video-height)" }}
              />
            ) : (
              false
            )
          }
          muted={props.muted}
          playing={play}
          playsinline={true}
          url={
            failsLoading
              ? props.fallback
                ? props.fallback
                : props.url
              : props.url
          }
          width="100%"
          height="100%"
          controls
          onError={(e) => {
            // console.log(`Could Not Play It, switching to fallback ${e}`);
            SetFailsLoading(true);
          }}

          // style={{ width: "100px" }}
          // width={300}
        />
      </div>
    </div>
  );
}

export default VideoCard;
