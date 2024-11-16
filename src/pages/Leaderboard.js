import React, { useEffect, useRef, useState } from 'react'
import Animate from '../Components/Animate';
import UserRanking from '../Components/Ranking';
import TopTen from '../Components/TopTen';
import { PiInfo } from "react-icons/pi";



const Leaderboard = () => {
    const [activeIndex, setActiveIndex] = useState(1);
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
    }, [openInfoTwo]);

    const handleMenu = (index) => {
        setActiveIndex(index);
      };
              

  return (
    <Animate>
    <div className='w-full flex justify-center flex-col px-4'>

    <div id="refer" className="w-full h-screen pt-5 scroller space-y-4 overflow-y-auto pb-[240px]">

      <div className='w-full flex flex-col space-y-1'>

  
        <h1 className='w-full text-center font-bold text-[32px]'>
            Leaderboard
        </h1>
        <button onClick={() => setOpenInfoTwo(true)} className="w-full pb-1 font-medium text-[12px] text-[#888] flex items-center justify-center space-x-[2px]">
            <span>Ranking info</span>
            <PiInfo size={12} className="mt-[1px]"/>
          </button>
          </div>

        <div className='w-full flex justify-between bg-[#17181A] rounded-[12px] relative z-10'>

  <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-btn text-[#ebebeb]' : ''}  rounded-[6px] text-[#c6c6c6] py-[10px] text-nowrap barTitle px-3 w-[45%] flex space-x-2 justify-center text-center text-[14px] font-semibold items-center`}>

  <span>All time</span>
</div>

<div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-btn text-[#ebebeb]' : ''} barTitle rounded-[6px] text-[#c6c6c6] py-[10px] px-3 w-[45%] space-x-2 font-semibold text-[14px] flex justify-center text-center items-center`}>
   <span>
   Top Miners
  </span>
</div>

        </div>





        <div className={`${activeIndex === 1 ? 'flex' : 'hidden'} w-full flex-col spacey-1 pt-6 relative !mt-0`}>

     

        <UserRanking/>

        </div>


        <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} w-full flex-col spacey-1 pt-6 relative !mt-0`}>

<TopTen/>

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
          
            <div className='flex justify-center items-center text-center relative'>

  <img src='/gold.svg' alt='dscfd' className='w-[30px] h-[30px]'/>

                    </div>
            </div>
            <h3 className="font-medium text-center text-[18px] text-[#ffffff] pb-2 uppercase">
          Leaderboard Update
            </h3>
            <p className="pb-6 text-[13px] w-full text-center">
         The leaderboard is updated once every 24 hours, login daily to see new rankings! 
         <br/>The top 10 users get special bonus and benefits on listing and lauching day! Boost your rank or Keep performing activities to increase your earnings!    </p>
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
  )
}

export default Leaderboard