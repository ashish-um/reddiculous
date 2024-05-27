import React from "react";
import { useState } from "react";

function EmbedVideo(props) {
  const [play, SetPlay] = useState(false);

  function decodeHtml(l_html) {
    const txt = document.createElement("textarea");
    // l_html = l_html.replace(" ", " sandbox ");
    txt.innerHTML = l_html;
    // txt.innerHTML = html.replace(`style="position:absolute;"`, "");
    // txt.setAttribute("style", "opacity:0.4");
    return txt.value;
  }

  return play ? (
    <div
      style={{
        height: "600px",
        width: "90%",
        position: "relative",
      }}
      dangerouslySetInnerHTML={{
        __html: decodeHtml(props.url),
      }}
    ></div>
  ) : (
    <div
      onMouseDown={(e) => SetPlay(true)}
      //   onMouseEnter={(e) => console.log("Mice Down")}
      style={{
        height: "600px",
        width: "90%",
        position: "relative",
      }}
    >
      <i
        class="bx bx-play"
        style={{
          fontSize: "100px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></i>
      <div
        style={{
          backgroundImage: `url(${props.thumbnail})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          height: "100%",
          width: "100%",
          backgroundPosition: "center",
          aspectRatio: props.aspect,
        }}
      />
    </div>
  );
}

export default EmbedVideo;
