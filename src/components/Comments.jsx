import React from "react";
import Posts from "./Posts";
import Comment from "./Comment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackSvg from "../assets/BackSvg";

function Comments() {
  const [data, SetData] = useState([]);
  const navigate = useNavigate();

  console.log(data);
  return (
    <>
      <div>
        {data.length > 0 && (
          <div
            style={{
              maxWidth: "var(--max-card-width)",
              margin: "auto",
              position: "relative",
            }}
          >
            <div
              className="label clickable comment-back"
              onClick={() => navigate(-1)}
            >
              <BackSvg />
            </div>
          </div>
        )}
        <Posts setCommentsData={SetData} />
      </div>
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
