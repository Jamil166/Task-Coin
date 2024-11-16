import React, { useState } from 'react'
import Animate from '../../Components/Animate';
import AdminRankings from '../../Components/AdminRankings';
import AdminMineRanks from '../../Components/AdminMineRanks';

const AdminRanks = () => {
    const [activeIndex, setActiveIndex] = useState(1);


    const handleMenu = (index) => {
        setActiveIndex(index);
      };
              

  return (
    <Animate>
    <div className='w-full flex justify-center flex-col px-4'>

    <div id="refer" className="w-full h-screen pt-5 scroller space-y-4 overflow-y-auto pb-[240px]">


        <h1 className='w-full text-center font-bold text-[32px]'>
            Leaderboard
        </h1>

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

     

        <AdminRankings/>

        </div>


        <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} w-full flex-col spacey-1 pt-6 relative !mt-0`}>

<AdminMineRanks/>

</div>

        </div>
        </div>
        </Animate>
  )
}

export default AdminRanks