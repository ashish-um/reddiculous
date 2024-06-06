import React, { useEffect, useState } from "react";
import ImageCard from "./ImageCard";

function GalleryCard(props) {
  const [currIndex, SetCurrIndex] = useState(0);
  const [imageZoomed, SetImageZoomed] = useState(false);

  const transitionStyle = "300ms cubic-bezier(0.4, 0, 0.2, 1)";
  const [transitionState, SetTransition] = useState(true);

  useEffect(() => {
    if (imageZoomed) {
      SetTransition(false);
    }
    if (!imageZoomed) {
      setTimeout(() => {
        SetTransition(true);
      }, 100);
    }
  }, [imageZoomed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div className="carousel-nav">
        {props.items.map((item, index) => {
          return (
            <span key={index}>
              {currIndex == index
                ? String.fromCharCode(10022)
                : String.fromCharCode(10023)}
            </span>
          );
        })}
      </div>
      <button
        className="arrow right-arrow"
        onClick={() =>
          (currIndex < props.items.length - 1 &&
            SetCurrIndex((currIndex) => currIndex + 1)) ||
          (currIndex == props.items.length - 1 && SetCurrIndex(0))
        }
      >
        &#10140;
      </button>
      <button
        className="arrow left-arrow"
        onClick={() =>
          (currIndex > 0 && SetCurrIndex((currIndex) => currIndex - 1)) ||
          (currIndex == 0 && SetCurrIndex(props.items.length - 1))
        }
      >
        &#10140;
      </button>
      <div
        className="carousel-translate"
        style={{
          transform: `${
            !imageZoomed ? `translateX(${-100 * currIndex}%)` : ""
          }`,
          transition: transitionState ? transitionStyle : "",
        }}
      >
        {props.items.map((item, index) => {
          return (
            <div key={index} className="carousel">
              <ImageCard
                SetImageZoomed={SetImageZoomed}
                preview={
                  props.data[item.media_id].status == "valid"
                    ? (props.data[item.media_id].p &&
                        props.data[item.media_id].p[
                          props.data[item.media_id].p.length > 3
                            ? 3
                            : props.data[item.media_id].p.length - 1
                        ]?.u.replaceAll("amp;", "")) ||
                      (props.data[item.media_id].s.gif &&
                        props.data[item.media_id].s.gif) ||
                      (props.data[item.media_id].s.u &&
                        props.data[item.media_id].s.u.replaceAll("amp;", ""))
                    : "https://hips.hearstapps.com/hmg-prod/images/legacy-fre-image-placeholder-1645192956.png?crop=1.00xw:1.00xh;0,0&resize=640:*"
                }
                src={
                  props.data[item.media_id].status == "valid"
                    ? (props.data[item.media_id].s.gif &&
                        props.data[item.media_id].s.gif) ||
                      (props.data[item.media_id].s.u &&
                        props.data[item.media_id].s.u.replaceAll("amp;", ""))
                    : "https://hips.hearstapps.com/hmg-prod/images/legacy-fre-image-placeholder-1645192956.png?crop=1.00xw:1.00xh;0,0&resize=640:*"
                }
              />
              {/* {item.media_id} */}
              {/* <img
              src={props.data[item.media_id].p[0].u.replaceAll("amp;", "")}
            /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GalleryCard;
