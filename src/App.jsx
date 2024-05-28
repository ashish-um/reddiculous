import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./components/Posts";
import Nav from "./components/Nav";
import Comments from "./components/Comments";
import { useState } from "react";

function App() {
  const [params, SetParams] = useState("r/all");
  return (
    <>
      <Router>
        <Nav param={params} />
        <Routes>
          <Route path="/" element={<Posts setParam={SetParams} />} />
          <Route path="/r/:sub" element={<Posts setParam={SetParams} />} />
          <Route path="/r/:sub/comments/:id/:post/" element={<Comments />} />
          <Route
            path="/u/:user"
            element={
              <h1 style={{ textAlign: "center", marginBlock: "20px" }}>
                Page Under Construction 🛠️
              </h1>
            }
          />
          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center", marginBlock: "20px" }}>
                Page Does Not Exist 🚧
              </h1>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
