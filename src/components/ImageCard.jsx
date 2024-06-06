import React, { useState } from "react";
import CloseSvg from "../assets/CloseSvg";

function ImageCard(props) {
  // console.log(props.preview);

  const [zoom, SetZoom] = useState(false);

  return (
    <>
      {zoom && props.src && (
        <div
          onClick={() => {
            props.SetImageZoomed && props.SetImageZoomed(false);
            SetZoom(false);
          }}
          className="img-src-holder"
        >
          <div className="img-src">
            <div
              className=""
              style={{
                // width: "30px",
                // height: "30px",
                position: "absolute",
                right: "10px",
                top: "10px",
              }}
            >
              <div
                className="clickable"
                style={{
                  width: "40px",
                  height: "40px",
                  padding: "4px",
                  background: "var(--card-element)",
                  borderRadius: "100vw",
                }}
              >
                <CloseSvg />
              </div>
            </div>
            <img
              width={"100%"}
              height={"100%"}
              style={{ objectFit: "contain" }}
              src={props.src}
            />
          </div>
        </div>
      )}
      <div
        onClick={() => {
          props.SetImageZoomed && props.SetImageZoomed(true);
          SetZoom(true);
        }}
        className="img-container"
      >
        <img
          loading="lazy"
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "contain" }}
          src={props.preview}
        />
        <div
          className="img-bg"
          style={{ backgroundImage: `url(${props.preview})` }}
        ></div>
      </div>
    </>
  );
}

export default ImageCard;
