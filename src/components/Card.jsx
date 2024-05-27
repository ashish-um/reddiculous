import React from "react";

function Card(props) {
  return (
    <div className="card animate-load">
      <h2
        dangerouslySetInnerHTML={{ __html: `${props.title} (${props.user})` }}
      ></h2>
      {props.children}
      <p style={{ display: "flex", gap: "10px" }}>
        {/* <span>Created: {handleDate(item.data.created)} hrs ago</span> */}
        {/* <span style={{ color: "red" }}>{props.fullname}</span> */}

        <span>Date: {props.date}</span>

        <span>Comments: {props.comments}</span>

        <span>
          Ups: {props.ups}, down:{props.downs}
        </span>
      </p>
    </div>
  );
}

export default Card;
