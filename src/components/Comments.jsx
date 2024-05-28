import React from "react";
import Posts from "./Posts";
import Comment from "./Comment";
import { useState } from "react";

function Comments() {
  const [data, SetData] = useState([]);
  console.log(data);
  return (
    <>
      <Posts setCommentsData={SetData} />
      <Comment />
    </>
  );
}

export default Comments;
