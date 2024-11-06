import React from "react";
import { Link, useLocation } from "react-router-dom";

function BreadCrumb() {
  const location = useLocation();
  console.log(location);
  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `&gt; ${crumb}`;
      return (
        <div key={crumb}>
          <Link to={currentLink}>{crumb}</Link>
        </div>
      );
    });
  return <div className="my-3 text-cyan-600 italic">{crumbs}</div>;
}

export default BreadCrumb;
