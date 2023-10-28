import React from "react";
import { Link } from "react-router-dom";
import App from "../App.jsx";
const RightList = (list) => {
  return (
    <>
      <div className="rightList">
        <Link to={"/"} element={<App />} id="homeLink">
          <h2>PokeStats</h2>
        </Link>
        <h2>Search</h2>
        <h2>About</h2>
      </div>
    </>
  );
};

export default RightList;
