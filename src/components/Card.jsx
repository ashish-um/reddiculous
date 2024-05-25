import React from "react";

function Card(props) {
  return (
    <div className="card animate-load">
      <h2
        dangerouslySetInnerHTML={{ __html: `${props.title} (${props.user})` }}
      ></h2>
      {props.children}
      <p>
        {/* <span>Created: {handleDate(item.data.created)} hrs ago</span> */}
        <span style={{ color: "red" }}>{props.fullname}</span>
        <br />
        <span>Date: {props.date}</span>
        <br />
        <span>Comments: {props.comments}</span>
        <br />
        <span>
          Ups: {props.ups}, down:{props.downs}
        </span>
      </p>
    </div>
  );
}

export default Card;
