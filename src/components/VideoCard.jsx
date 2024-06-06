import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";

function VideoCard(props) {
  const [failsLoading, SetFailsLoading] = useState(false);
  const [play, SetPlay] = useState(false);

  const videoRef = useRef(null);
  useEffect(() => {
    const videoElement = videoRef.current;

    // Function to handle the intersection changes
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          SetPlay(true);
        } else {
          SetPlay(false);
        }
      });
    };

    // Create an IntersectionObserver instance
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.9, // Adjust this value to determine when the video is considered in view
    });

    // Observe the video element
    observer.observe(videoElement);

    // Cleanup the observer on component unmount
    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  return (
    <div onCompositionStart={(r) => console.log(r)} className="video-holder">
      <div
        ref={videoRef}
        className="video-player"
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
        />
      </div>
    </div>
  );
}

export default VideoCard;
