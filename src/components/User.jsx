import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Posts from "./Posts";

function User() {
  return <Posts />;
}

export default User;
