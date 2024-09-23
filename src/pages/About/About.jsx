import React, { useState } from "react";

function About() {
  const [founders, setFounders] = useState([
    {
      id: 1,
      name: "Truong Vo",
      description: "Founders & CEO",
      img: "https://cafeland.vn/image-data/320-320/static1.cafeland.vn/cafelandnew/hinh-anh/2020/05/14/bill-gates-cafeland.jpg",
    },
    {
      id: 2,
      name: "Khoa Ho",
      description: "Founder & CTO",
      img: "https://www.thestreet.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cq_auto:good%2Cw_1200/MTY4NjUwMTkwMDk3NzUzNzM1/zuckerberg-facebook-directors-settle-delaware-suit-over-voting-rights.png",
    },
    {
      id: 3,
      name: "Quan Pham",
      description: "Founder & CFO",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY-_R6V-nDMdEKuLC_LNEZG_BJ-6-m74_e1w&s",
    },
  ]);
  return (
    <div className="flex flex-col justify-center items-start gap-8 w-full">
      <div className="font-bold text-2xl">ABOUT SERVAVE</div>
      <div className="">
        Servave is a safe, user-friendly, and fair website for buying and
        selling tickets to concerts, festivals, sporting events, theatrical
        plays, and day excursions. To protect purchasers from inflated costs,
        the platform requires a maximum markup of 20% over the original ticket
        price. In locations with unique resale pricing rules, Servave adjusts
        its markup accordingly, ensuring that purchasers always pay a fair
        price. The danger of fraud is reduced by user authentication and
        engagement with event organizers. Servave has emerged as the premier
        platform for fans wishing to buy and sell tickets globally.
      </div>
      <div className="font-bold text-2xl">FOUNDERS</div>
      <div className="flex flex-row justify-between items-center">
        {founders &&
          founders.length > 0 &&
          founders.map((founder, index) => {
            return (
              <div
                key={founder.id}
                className="flex flex-col justify-start items-center gap-6 h-[300px] w-[300px]"
              >
                <img
                  src={founder.img}
                  alt={founder.name}
                  className="w-[150px] h-[150px] object-contain rounded-full"
                />
                <span className="text-lg font-semibold italic">
                  {founder.name}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default About;
