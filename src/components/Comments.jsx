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
      <div className="comments">
        {data.length
          ? data.map((item, index) => {
              return (
                <>
                  {item.data.body && (
                    <Comment
                      // className="comment-parent"
                      first={true}
                      key={item.data.id}
                      data={item.data}
                    />
                  )}
                </>
              );
            })
          : ""}
      </div>
    </>
  );
}

export default Comments;
