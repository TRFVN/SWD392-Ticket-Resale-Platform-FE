import { Link } from "react-router-dom";
import animationData from "../common/Alert triangle/alertTriangle.json";
import Lottie from "lottie-react";
const Footer = () => {
  return (
    <footer className="grid justify-center items-start lg:grid-cols-12 sm:grid-cols-1 lg:py-10 lg:border-t-2">
      <div className="grid justify-center items-start lg:col-span-4 lg:gap-4 sm:col-span-1 sm:gap-4">
        <div className="lg:font-medium lg:text-lg">INFORMATION</div>
        <ul className="flex flex-col justify-start items-start lg:gap-3 cursor-pointer">
          <li className="hover:text-blue-800">
            <Link to={"/about"}>About Us</Link>
          </li>
          {/* <Lottie animationData={animationData} loop={true} /> */}
          <li>How It Works</li>
          <li>Help Center</li>
          <li>Privacy Policy</li>
          <li>Help & FAQs</li>
        </ul>
      </div>

      <div className="grid justify-center items-start lg:col-span-4 lg:gap-4 sm:col-span-1 sm:gap-4">
        <div className="lg:font-medium lg:text-lg">FOLLOW US ON</div>
        <ul className="flex flex-col justify-start items-start lg:gap-3">
          <a
            href="https://www.facebook.com/groups/523189832208967"
            target="_blank"
          >
            <li className="flex flex-row justify-start items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                  x1="9.993"
                  x2="40.615"
                  y1="9.993"
                  y2="40.615"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#2aa4f4"></stop>
                  <stop offset="1" stopColor="#007ad9"></stop>
                </linearGradient>
                <path
                  fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                  d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                ></path>
                <path
                  fill="#fff"
                  d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                ></path>
              </svg>
              Facebook
            </li>
          </a>

          <a
            href="https://www.facebook.com/groups/523189832208967"
            target="_blank"
          >
            <li className="flex flex-row justify-start items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 48 48"
              >
                <linearGradient
                  id="U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1"
                  x1="4.338"
                  x2="38.984"
                  y1="-10.056"
                  y2="49.954"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#4b4b4b"></stop>
                  <stop offset=".247" stopColor="#3e3e3e"></stop>
                  <stop offset=".686" stopColor="#2b2b2b"></stop>
                  <stop offset="1" stopColor="#252525"></stop>
                </linearGradient>
                <path
                  fill="url(#U8Yg0Q5gzpRbQDBSnSCfPa_yoQabS8l0qpr_gr1)"
                  d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28c2.209,0,4,1.791,4,4v28	C42,40.209,40.209,42,38,42z"
                ></path>
                <path
                  fill="#fff"
                  d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"
                ></path>
                <polygon
                  fill="#fff"
                  points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"
                ></polygon>
                <polygon
                  fill="#fff"
                  points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"
                ></polygon>
              </svg>
              X
            </li>
          </a>

          <a
            href="https://www.facebook.com/groups/523189832208967"
            target="_blank"
          >
            <li className="flex flex-row justify-start items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 48 48"
              >
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                  cx="19.38"
                  cy="42.035"
                  r="44.899"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#fd5"></stop>
                  <stop offset=".328" stopColor="#ff543f"></stop>
                  <stop offset=".348" stopColor="#fc5245"></stop>
                  <stop offset=".504" stopColor="#e64771"></stop>
                  <stop offset=".643" stopColor="#d53e91"></stop>
                  <stop offset=".761" stopColor="#cc39a4"></stop>
                  <stop offset=".841" stopColor="#c837ab"></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                  cx="11.786"
                  cy="5.54"
                  r="29.813"
                  gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#4168c9"></stop>
                  <stop
                    offset=".999"
                    stopColor="#4168c9"
                    stopOpacity="0"
                  ></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <path
                  fill="#fff"
                  d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                ></path>
                <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                <path
                  fill="#fff"
                  d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                ></path>
              </svg>
              Instagram
            </li>
          </a>

          <a
            href="https://www.facebook.com/groups/523189832208967"
            target="_blank"
          >
            <li className="flex flex-row justify-start items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#212121"
                  fillRule="evenodd"
                  d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#ec407a"
                  fillRule="evenodd"
                  d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011 c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413 c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607L29.208,20.607 z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1 c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391 C17.213,29.127,17.972,30.274,19.079,30.832z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157 c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379 c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391 c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183 c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#81d4fa"
                  fillRule="evenodd"
                  d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848 C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019 c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338 c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069 c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183 C14.374,24.749,17.611,21.463,21.635,21.38z"
                  clipRule="evenodd"
                ></path>
              </svg>
              TikTok
            </li>
          </a>
        </ul>
      </div>

      <div className="grid justify-center items-start lg:col-span-4 lg:gap-4 sm:col-span-1 sm:gap-4">
        <div className="lg:font-medium lg:text-lg">DOWNLOAD APP NOW</div>
        <ul className="flex flex-col justify-start items-start lg:gap-4">
          <li>
            <a href="https://apps.apple.com/us/app" target="_blank">
              <img
                src="https://ticketswap-image-cdn.b-cdn.net/static/images/appStore/app-store-en.svg"
                alt="App Store"
                className="w-[135px]"
              />
            </a>
          </li>
          <li>
            <a href="https://play.google.com/store/apps" target="_blank">
              <img
                src="https://ticketswap-image-cdn.b-cdn.net/static/images/appStore/google-play-en.png"
                alt="Google Play"
                className="w-[135px] h-[45px]"
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
