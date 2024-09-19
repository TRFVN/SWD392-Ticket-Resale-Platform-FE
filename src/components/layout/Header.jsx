import React from "react";
import FTS_Logo from "../../assets/FTS_Logo.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import { Link } from "react-router-dom";
import { PiShoppingCartBold } from "react-icons/pi";
const Header = () => {
  return (
    <header className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col justify-center items-center gap-2">
          <Link to="/" className="h-[50px]">
            <img src={FTS_Logo} alt="FTS Logo" className="w-full h-full" />
          </Link>
          <span className="text-base italic">The best resell ticket</span>
        </div>
        <nav className="text-xl w-auto">
          <ul className="lg:flex lg:justify-center lg:items-center lg:gap-5">
            <li>
              <Link to={"/"}>Your tickets</Link>
            </li>
            <li>
              <Link to={"/"}>Wishlist</Link>
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
