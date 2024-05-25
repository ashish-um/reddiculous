import React from "react";
import ReactPlayer from "react-player";
function VideoCard(props) {
  // console.log(props.img);

  return (
    <div
      onCompositionStart={(r) => console.log(r)}
      className="video-holder"
      onClick={(e) =>
        console.log(`page:${e.pageY} client:${e.clientY} screen:${e.screenY}`)
      }
    >
      <div className="video-player">
        <ReactPlayer
          // light={<img src={props.img} height="100%" alt="Thumbnail" />}
          // playing={true}

          url={props.url}
          width="100%"
          height="100%"
          controls
          // style={{ width: "100px" }}
          // width={300}
        />
      </div>
    </div>
  );
}

export default VideoCard;
