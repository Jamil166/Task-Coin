import React from "react";
import { NavLink, useLocation } from "react-router-dom";




const Footer = () => {
  const location = useLocation();

const footerLinks = [
  {
    title: "Home",
    link: "/",
    icon: <img id="reels2" alt='dfd' src='/home.svg' className={location.pathname === "/" ? "w-[22px] h-[22px] brightness-[0.1]" : "w-[22px] h-[22px]"} />
},
{
  title: "Mine",
  link: "/earn",
  icon: <img alt='dfd' src='/earn.svg' className={location.pathname === "/earn" ? "w-[22px] h-[22px] brightness-[0.1]" : "w-[22px] h-[22px]"} />
},
  {
      title: "Friends",
      link: "/ref",
      icon: <img alt='dfd' src='/ref.svg' className={location.pathname === "/ref" ? "w-[22px] h-[22px] brightness-[0.1]" : "w-[22px] h-[22px]"}/>
  },

  {
      title: "Leaders",
      link: "/leaderboard",
      icon: <img alt='dfd' src='/leaders.svg' className={location.pathname === "/leaderboard" ? "w-[22px] h-[22px] brightness-[0.1]" : "w-[22px] h-[22px]"} />
  },
]

  return (
    <div className="w-full flex z-30 relative items-center justify-center space-x-2">

      {footerLinks.map((footer, index) => (
      <NavLink 
      key={index}
      to={footer.link}
      className={({ isActive }) => {
        return `

${
isActive
  ? "w-[25%] flex flex-col rounded-[10px] items-center justify-center text-primary text-[13px]"
  : "w-[25%] flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-[13px]"
}
  `;
      }}
    >
              <span id="reels" className={location.pathname === `${footer.link}` ? 
  `w-[60px] h-[34px] bg-btn mb-[6px] flex flex-col rounded-[24px] items-center justify-center text-[13px]`
  : "w-[60px] h-[34px] flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-primary text-[13px]"}>
                {footer.icon}
              </span>
        <span className="font-medium">{footer.title}</span>
        </NavLink>
      ))}


    </div>
  );
};

export default Footer;
