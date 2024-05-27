import React from "react";

function ImageCard(props) {
  // console.log(props.preview);

  return (
    <div className="img-container">
      <img
        // loading=""
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
  );
}

export default ImageCard;
