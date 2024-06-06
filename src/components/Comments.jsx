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
          <div className="comment-back-holder">
            <div style={{ position: "fixed" }}>
              <div
                className="label clickable comment-back"
                style={{ boxShadow: "var(--body-background) 0 0 10px" }}
                onClick={() => navigate(-1)}
              >
                <BackSvg />
              </div>
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
