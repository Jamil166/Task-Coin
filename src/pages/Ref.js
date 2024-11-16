import React, { useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { FaLink } from "react-icons/fa6";
// import { MdOutlineFileUpload } from "react-icons/md";
import coinsmall from "../images/coinsmall.webp";
import { useUser } from "../context/userContext";
import whatsapp from "../images/whatsapp.svg";
import twitter from "../images/twitter.svg";
import telegram from "../images/telegram.svg";
import facebook from "../images/facebook.svg";
import { IoCloseCircleOutline, IoInformationCircle } from "react-icons/io5";

const Ref = () => {
  const { id, referrals, refBonus, loading } = useUser();
  const [copied, setCopied] = useState(false);
  const [info, setInfo] = useState(false)


  const openInfo = () =>{
    setInfo(false);
  }

  const copyToClipboard = () => {
    // eslint-disable-next-line
    const reflink = `https://t.me/AlphaGhost_Bot?start=r${id}\n\$GHOST tokens mining is live! Two is better than one!  Join my squad, and let\'s double the fun (and earnings 🤑)! $GHOST Power Tap! 🚀`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Mine $BLEGGS tokens now!",
      // eslint-disable-next-line
      url: `https://t.me/AlphaGhost_Bot?start=r${id}\n\ `, // Replace with your link
      text: "$GHOST tokens mining is live! Two is better than one!  Join my squad, and let's double the fun (and earnings 🤑)! $GHOST Power Tap! 🚀",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      fallbackShare(shareData);
    }
  };

  const fallbackShare = (shareData) => {
    const encodedText = encodeURIComponent(
      // eslint-disable-next-line
      `${shareData.url} \n\$GHOST tokens mining is live! Two is better than one!  Join my squad, and let\'s double the fun (and earnings 🤑)! $GHOST Power Tap! 🚀`
    );
    const encodedUrl = encodeURIComponent(shareData.url);

    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    const telegramUrl = `https://telegram.me/share/url?text=${encodedText}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    const fallbackOptions = [
      { name: "WhatsApp", url: whatsappUrl, icon: whatsapp },
      { name: "Telegram", url: telegramUrl, icon: telegram },
      { name: "Twitter", url: twitterUrl, icon: twitter },
      { name: "Facebook", url: facebookUrl, icon: facebook },
    ];

    const optionsHtml = fallbackOptions
      .map(
        (option) =>
          `<li key="${option.name}" style="display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  "">
        <a href="${option.url}" target="_blank" rel="noopener noreferrer">
        <img alt="daxy" src=${option.icon} width="50px"/>
        </a>
        <span style="
    font-size: 12px;
    color: #000;
    padding-top: 4px;
    font-weight: 500;
">${option.name}</span>
      </li>`
      )
      .join("");

    const fallbackHtml = `
     <div id="fallback-share-popup" style="z-index:40; position: fixed;top: 0;background:#0000007d;left: 0;right: 0;bottom: 0;display: flex;justify-content: center; align-items: start;
     flex-direction: column;"> 
     <div id="close-popup-button" style="
    width: 100%;
    height: 70%;
"></div>
     <div style="background: #fff;padding: 20px 24px;width: 100%;box-shadow: 0 0 10px rgba(0,0,0,0.1);height: 30%;border-top-right-radius: 16px;border-top-left-radius:16px">
        <h3 style=" font-size: 18px;
        font-weight: 600;
        color: #313131;
        padding-bottom: 12px;
        width: 100%;
        text-align: center;
        ">Share via</h3>
        <ul style="display: flex;
        justify-content: space-between;
        gap: 10px">
          ${optionsHtml}
        </ul>
        
        <div style="
    width: 100%;
    padding: 30px 10px 0;
    display: flex;
    justify-content: center;
">
<button id="close-popup-button2" style="
    background: #000000d4;
    padding: 6px 14px;
    font-weight: 500;
    border-radius: 6px;
">Close</button>
</div>

      </div>
      </div>
    `;

    const fallbackPopup = document.createElement("div");
    fallbackPopup.innerHTML = fallbackHtml;
    document.body.appendChild(fallbackPopup);

    document.getElementById("close-popup-button").onclick = () => {
      document.getElementById("fallback-share-popup").remove();
    };
    document.getElementById("close-popup-button2").onclick = () => {
      document.getElementById("fallback-share-popup").remove();
    };
  };


  return (
    <>
      {/* {loading ? ( // Display loading indicator if data is fetching
        <Spinner/>
      ) : ( */}
      <>
        <Animate>
          <div className="w-full pt-3 justify-center flex-col space-y-3 px-5">
            <div className="w-full flex justify-center">
              <h1 className="font-semibold text-[28px] text-[#ffffffe0] pb-1 text-center">
                Invite friends <br/>& get more $GHOST
              </h1>
            </div>

            {/*  */}

            <div className='w-full bg-[#17181A] rounded-[12px] relative flex flex-col space-y-4 p-4'>



<div className="flex items-center space-x-3">
  <img src='/stars2.svg' alt="gf" className="w-[35px]"/>
  <div className="flex flex-col">
    <h3 className="font-medium">
      Invite a friend
    </h3>
    <p className="text-[13px]">
      get 20% of your friend's earnings
    </p>
  </div>
</div>


{/* <div className="flex items-center space-x-1 -ml-1 pb-2">
  <img src='/prem.svg' alt="gf" className="w-[48px]"/>
  <div className="flex flex-col">
    <h3 className="font-medium">
      Invite with Telegram Premium
    </h3>
    <p className="text-[13px]">
      +100 to you and your friend
    </p>
  </div>
</div> */}


            <div className="w-full flex items-center justify-between space-x-[10px]">
              <button
                onClick={handleShare}
                className="w-[65%] flex space-x-2 font-medium text-[14px] barTitle bg-btn h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="">Invite friend</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="w-[35%] flex space-x-2 text-primary font-medium text-[14px] barTitle bg-[#313439] h-[45px] rounded-[10px] px-4 justify-center items-center text-center"
              >
                <span className="flex items-center">
                  <FaLink size={18} className="" />
                </span>
                <span className="">
                  {copied ? <span>Copied!</span> : <span>Copy</span>}
                </span>
              </button>
            </div>


            </div>



            <div className="w-full flex justify-between items-center">
              <h3 className="font-semibold small-text text-[17px] text-[#ffffffe0] pl-1">
              {referrals.length} {referrals.length === 1 ? 'friend' : 'friends'}
              </h3>

              <div
                className="small-text2 font-semibold relative py-2 px-3 text-primary flex items-center space-x-2 text-[14px] text rounded-[6px]"
              >
             <span className="">
                {refBonus} $GHOST
                </span>  
                <IoInformationCircle onClick={() => setInfo(true)} size={14} className="text-gray-400"/>

                <span className={`${info ? 'absolute' : 'hidden'} bottom-[-50px] right-0 bg-gray-700 text-secondary font-normal text-[11px] py-2 px-4 rounded-[8px] w-[250px]`}>
                    <span className="w-full flex justify-end pb-1">
                        <IoCloseCircleOutline onClick={openInfo} size={13} className=""/>
                    </span>
                   <p>
                    Your referral earnings are important for airdrop distribution, invite more friends to earn more referral points
                   </p> 
                </span>
              </div>
            </div>


            <div
              id="refer"
              className="w-full h-[60vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]"
            >
              <div className="w-full flex flex-col space-y-3">
                {loading ? (
                  <p className="text-[#d0d0d0] w-full text-center">
                    checking...
                  </p>
                ) : referrals.length === 0 ? (
                  <p className="text-[#d0d0d0] text-center font-medium w-full now pt-8 px-5 text-[14px] leading-[24px]">
                   Here is no friends yet
                  </p>
                ) : (
                  <>
                    {referrals.map((user, index) => (
                      <div
                        key={index}
                        className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
                      >
                        <div className="flex flex-1 flex-col space-y-1">
                          <div className="text-primary pl-1 text-[15px] font-semibold">
                            {user.username}
                          </div>

                          <div className="flex items-center space-x-1 text-[14px] text-primary">

                            <span className="w-[16px]">
                              <img
                                src={coinsmall}
                                className="w-full"
                                alt="coin"
                              />
                            </span>
                            <span className="font-normal text-primary text-[14px]">
                              {formatNumber(user.balance)}
                            </span>
                          </div>
                        </div>

                        <div className="text-[#d5df99] font-semibold text-[14px]">
                          +{formatNumber((user.balance / 100) * 20)}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <Outlet />
        </Animate>
      </>
      {/* )} */}
    </>
  );
};

export default Ref;
