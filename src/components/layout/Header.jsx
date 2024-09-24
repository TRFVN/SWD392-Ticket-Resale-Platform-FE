import React from "react";
import FTS_Logo from "../../assets/FTS_Logo.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import { Link } from "react-router-dom";
import { PiShoppingCartBold } from "react-icons/pi";
import Search from "../common/Search";
import animationData from "../common/NotificationV3/notification-V3.json";
import Lottie from "lottie-react";

const Header = () => {
  return (
    <header className="my-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <Link to="/" className="h-[50px]">
            <img src={FTS_Logo} alt="FTS Logo" className="w-full h-full" />
          </Link>
          <span className="text-base italic">
            The best resell ticket platform
          </span>
        </div>
        <Search />
        <nav className="text-xl w-auto">
          <ul className="lg:flex lg:justify-center lg:items-center lg:gap-5">
            <li>
              <Link to={"/"}>Your tickets</Link>
            </li>
            <li>
              <Link to={"/"}>Wishlist</Link>
            </li>
            <li>
              <Lottie animationData={animationData} loop={true} />
            </li>
            <li>
              <PiShoppingCartBold />
            </li>
            <Link>
              <img
                src={None_Avatar}
                alt="Avatar"
                className="lg:w-[40px] lg:h-[40px] rounded-full"
              />
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
