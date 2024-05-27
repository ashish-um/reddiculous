import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Posts from "./components/Posts";
import Nav from "./components/Nav";
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
          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center" }}>Page Does Not Exist :(</h1>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
