import React, { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firestore';
import { useUser } from "../context/userContext";
import { IoCheckmarkCircleSharp, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import Animate from "../Components/Animate";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMute } from "react-icons/io5";
import BoostFarm from "../Components/BoostFarm";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiInfo } from "react-icons/pi";

const CryptoFarming = () => {
  const FARM_DURATION = 10800; // 60 seconds for 1 minute
  const [timeRemaining, setTimeRemaining] = useState(FARM_DURATION);
  const TRIGGER_TIME = FARM_DURATION - 1;
  const TRIGGER_TIMETWO = FARM_DURATION - 3;
  const TRIGGER_TIMETHREE = FARM_DURATION - 5;
  const TRIGGER_TIMEFOUR = FARM_DURATION - 7;
  const { id, balance, setBalance, miningPower, miningTotal, setMiningTotal} = useUser(); // Get the user ID from context
  const POINTS_TO_EARN = miningPower * 5;
  const [isFarming, setIsFarming] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [farmingCompleted, setFarmingCompleted] = useState(false);
  const [spinDuration, setSpinDuration] = useState(0);
  // eslint-disable-next-line
  const [elapsedTimer, setElapsedTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // To handle mute/unmute
  // eslint-disable-next-line
  const [animatePoints, setAnimatePoints] = useState(false); // To handle points animation
  const [showSettings, setShowSettings] = useState(false);
  const [claimModal, setClaimModal] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const modalRef = useRef(null);

  const fanAudioRef = useRef(null); // Reference to the audio element
  const [openInfoTwo, setOpenInfoTwo] = useState(false);

  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {

    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openInfoTwo]);

  

  const closeClaimer = (event) => {

    if (modalRef.current && !modalRef.current.contains(event.target)) {
        setClaimModal(false);
        setPointsEarned(0);

    }

}

  useEffect(() => {
    if (!id) {
    if (claimModal) {
      document.addEventListener('mousedown', closeClaimer);
    } else {
      document.removeEventListener('mousedown', closeClaimer);
    }
    
    return () => {
      document.removeEventListener('mousedown', closeClaimer);
    };
  }
    // eslint-disable-next-line 
  }, [claimModal, id]);

  
  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowSettings(false);
    };

    if (showSettings) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showSettings, setShowSettings]);




  useEffect(() => {
    const farmingStart = localStorage.getItem("farmingStart");
    const farmingDone = localStorage.getItem("farmingCompleted");

    const storedElapsedTimer = localStorage.getItem("elapsedTime");

    if (storedElapsedTimer) {
      setElapsedTimer(parseInt(storedElapsedTimer));
    }

    if (farmingDone === "true") {
      setPointsEarned(POINTS_TO_EARN);
      setFarmingCompleted(true);
      setCanClaim(true);
      localStorage.setItem("spinDuration", 0);
      setSpinDuration(0);
    } else if (farmingStart) {
      const elapsedTime = Math.floor((Date.now() - parseInt(farmingStart)) / 1000);
      if (elapsedTime < FARM_DURATION) {
        setTimeRemaining(FARM_DURATION - elapsedTime);
        setIsFarming(true);
        setPointsEarned((elapsedTime / FARM_DURATION) * POINTS_TO_EARN);
      } else {
        completeFarming();
      }
    } 
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (isFarming && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);

              
        // Animate pointsEarned on update
        setPointsEarned((prevPoints) => {
            const newPoints = ((FARM_DURATION - timeRemaining) / FARM_DURATION) * POINTS_TO_EARN;
            if (newPoints !== prevPoints) {
              setAnimatePoints(true);
              setTimeout(() => setAnimatePoints(false), 500); // Remove animation after 500ms
            }
            return newPoints;
          });

        // Update elapsed time
        setElapsedTimer((prevElapsedTimer) => {
          const newElapsedTimer = prevElapsedTimer + 1;
          localStorage.setItem("elapsedTime", newElapsedTimer);
          return newElapsedTimer;
        });

        if (timeRemaining <= TRIGGER_TIME) {
          setSpinDuration(5);
        }
        if (timeRemaining <= TRIGGER_TIMETWO) {
          setSpinDuration(2);
        }
        if (timeRemaining <= TRIGGER_TIMETHREE) {
          setSpinDuration(1);
        }
        if (timeRemaining <= TRIGGER_TIMEFOUR) {
          setSpinDuration(0.5);
        }
      }, 1000);
    } else if (timeRemaining <= 0) {
      clearInterval(interval);
      completeFarming();
    }
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [isFarming, timeRemaining]);

  useEffect(() => {
    if (isFarming) {
      fanAudioRef.current.play(); // Play the sound when farming starts
    } else {
      fanAudioRef.current.pause(); // Pause the sound when farming stops
    }
    if(farmingCompleted) {
      setSpinDuration(50)
    }
    // eslint-disable-next-line
  }, [isFarming]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    fanAudioRef.current.muted = !isMuted;
    setShowSettings(false);
  };

  const startFarming = () => {
    setIsFarming(true);
    setCanClaim(false);
    setSpinDuration(20);
    setFarmingCompleted(false);
    setPointsEarned(0);
    setTimeRemaining(FARM_DURATION);
    localStorage.setItem("farmingStart", Date.now());
    localStorage.setItem("farmingCompleted", "false");
  };

  const claimPoints = async () => {
    try {
      const userRef = doc(db, 'telegramUsers', id.toString());
      const newBalance = balance + pointsEarned;
      const newMiningTotal = miningTotal + pointsEarned;
      await updateDoc(userRef, { 
        balance: newBalance,
        miningTotal: newMiningTotal,
      });
      setClaimModal(true);
      setBalance(newBalance);
      setIsFarming(false);
      setTimeRemaining(FARM_DURATION);
      setCanClaim(false);
      setMiningTotal(newMiningTotal)
      setFarmingCompleted(false);
      setCongrats(true);
      setTimeout(() => {
          setCongrats(false);
      }, 3000);
      localStorage.removeItem("farmingStart");
      localStorage.removeItem("farmingCompleted");
      localStorage.setItem("spinDuration", 0);
      setSpinDuration(0);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

// eslint-disable-next-line
  const resetFarming = () => {
    setIsFarming(false);
    setPointsEarned(0);
    setTimeRemaining(FARM_DURATION);
    setCanClaim(false);
    setFarmingCompleted(false);
    localStorage.removeItem("farmingStart");
    localStorage.removeItem("farmingCompleted");
    localStorage.setItem("spinDuration", 0);
    setSpinDuration(0);
  };

  const completeFarming = () => {
    setIsFarming(false);
    setPointsEarned(POINTS_TO_EARN);
    setCanClaim(true);
    setFarmingCompleted(true);
    localStorage.removeItem("farmingStart");
    localStorage.setItem("farmingCompleted", "true");
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const formatNumberTwo = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, '');
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };
  const closeClaimerr = (event) => {
        setClaimModal(false);
        setPointsEarned(0);
}

  return (
    <Animate>
    <div className="w-full flex flex-col items-center justify-center px-4">
      <audio ref={fanAudioRef} src="/farming.mp3" loop muted={isMuted}></audio>

      <div id="refer" className="w-full h-screen pt-5 scroller overflow-y-auto pb-[150px] space-y-3">

        <div className="w-full flex justify-center items-center pb-3">
          
          <button className="absolute">
            
          </button>

        <div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1">
          <img src="/stars.svg" alt="sfdf" className="w-[14px]"/>
          <span className="text-secondary">Balance</span> <span> {formatNumber(balance)} </span>
        </div>


        <button onClick={() => setShowSettings(true)} className="absolute right-5">
          <IoSettingsOutline size={24} className=""/>
        </button>

        </div>



        <div className='w-full flex justify-center items-center text-center'>
          <div className='w-[150px] h-[150px] fanbg border-[#616161] border-[4px] flex justify-center rounded-full items-center text-center relative'>
            <img src='/fan.webp' alt='dscfd' className='w-[130px] h-[130px] animate-spin' style={{ animationDuration: `${spinDuration}s` }}/>
            <div className='absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[34px] w-[34px] flex justify-center items-center'>
              <img src='/dogs.webp' alt='sdfd' className='w-[14px]'/>
            </div>
          </div>
        </div>

      <div className="w-full px-3 pt-5">
        
        <div className="w-full bg-cards rounded-[12px] px-4 pt-4 pb-2 flex flex-col items-center justify-center mb-3 relative">
        <h2 className="font-medium text-secondary text-[14px]">Mined Tokens</h2>
          <span className="text-[26px] font-semibold">
          {farmingCompleted ? (
            <>
             {formatNumberTwo(pointsEarned)}
            </>
          ) : isFarming ? (
            <>
              {formatNumberTwo(pointsEarned)}
            </>
          ) : (
            <>
           {formatNumberTwo(pointsEarned)}
            </>
          )}
          </span>
          {isFarming && (
          <span className="font-medium text-[13px] text-secondary flex items-center justify-center space-x-[1px]">
        <MdOutlineTimer size={14} className=""/>
          <span>{formatTime(timeRemaining)}</span>
          </span>
          )}

          <span onClick={() => setOpenInfoTwo(true)} className="pt-5 pb-1 font-medium text-[10px] text-[#93792b] flex items-center justify-center space-x-[2px]">
         <img src="/starsorange.svg" alt="dsdsf" className="w-[8px]"/>
            <span>{miningPower} tokens profit per hour</span>
            <IoIosInformationCircleOutline size={11} className=""/>
          </span>

          <PiInfo onClick={() => setOpenInfoTwo(true)} size={18} className="absolute top-4 right-4 text-[#888]"/>

        </div>
 

        <div className="w-full flex items-center justify-between space-x-2">

        <button
          onClick={startFarming}
          disabled={isFarming || canClaim}
          className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${isFarming || canClaim ? "bg-btn2 text-[#888]" : "bg-btn"}`}
        >
          {isFarming ? "Mining.." : "Start Mining"}
        </button>

        <button
          onClick={claimPoints}
          disabled={!canClaim}
          className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${canClaim ? "bg-btn hover:bg-[#f3bf25a4]" : "bg-btn2 text-[#888]"}`}
        >
          {canClaim ? "Claim" : "Claim"}
        </button>
        </div>

        </div>


            <BoostFarm/>
           
      </div>
    </div>


    {showSettings && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">

          <div id="refer" className='w-full flex flex-col'>
          <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
            <div className="flex items-center space-x-4">
              <div className='w-full'>
                <h1 className='font-semibold text-[24px] text-center pb-4'>
                  Settings
                </h1>

                <div className="w-full flex flex-col pb-[100px]">
  
                <div className='flex w-full flex-col space-y-2'>
             
                    <button 
                      onClick={toggleMute}
                      className={`text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center`}
                    >
                        <div className='flex items-center space-x-2 justify-start w-[80%]'>

                     
                      <span className=''>
                        <IoSettingsOutline size={18} className={``} />
                      </span>
                      <div className='flex flex-col text-left'>

                   
                      <h2 className='flex flex-1 font-medium text-[13px]'>
                    {isMuted ? 'Unmute fan sound' : 'Mute fan sound'} 
                      </h2>
                      <div className='text-[12px] font-normal'>

                          </div>
                         </div>
                         </div>
                         {isMuted ? (
                            <IoVolumeMute size={24} className={`text-[#959595]`} />
                         ) : (
                          <IoVolumeMediumSharp size={24} className={`text-[#959595]`} />
                         )}
                      
            
                    </button>
            
                </div>

              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}


<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>


<div
        className={`${claimModal === true ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div ref={modalRef} className={`${claimModal === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          
          
        <div className="w-full flex justify-center flex-col items-center space-y-3">
        <IoCheckmarkCircleSharp size={32} className="text-accent" />
        <p className="font-medium text-center">Congratulations!</p>
        <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
          
          <span className='flex items-center justify-center space-x-[2px] text-[18px]'>
          <img src='/dogs.webp' alt='dscfd' className='w-[18px]'/>

          <span className="text-accent pr-[6px]">+{formatNumber(pointsEarned)} $BLEGGS </span> CLAIMED
              </span>
        </span>
        <p className="pb-6 text-[15px] w-full text-center">
          Continue mining to claim more tokens daily! 😎
        </p>
      </div>


        

          <div className="w-full flex justify-center">
            <button
              onClick={closeClaimerr}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Continue Mining
            </button>
          </div>
        </div>
      </div>


      <div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal !bottom-0 relative rounded-[16px] flex flex-col justify-center p-8`}>
         
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <div className='w-[50px] h-[50px] fanbg border-[#616161] border-[2px] flex justify-center rounded-full items-center text-center relative'>
{isFarming ? (
  <img src='/fan.webp' alt='dscfd' className='w-[30px] h-[30px] animate-spin' style={{ animationDuration: '2s' }}/>
) : (
  <img src='/fan.webp' alt='dscfd' className='w-[30px] h-[30px]'/>
)}
<div className='absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[16px] w-[16px] flex justify-center items-center'>
<img src='/dogs.webp' alt='sdfd' className='w-[8px]'/>
</div>


                    </div>
              <p className='font-medium text-[14px]'>mining profit per hour</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pb-2 uppercase">
          {miningPower} PPH
            </h3>
            <p className="pb-6 text-[13px] w-full text-center">
          This is the amount of tokens you earn every 1 hour when mining is active, you can boost your mining profit by clicking on the Boost Mining option.
             </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-btn4 text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
           Okay, Continue!
            </button>
          </div>
        </div>
      </div>


    </Animate>
  );
};

export default CryptoFarming;
