import React from 'react'
import { useUser } from '../context/userContext';

const YourRewards = () => {

    const {premiumReward, taskPoints, checkinRewards, premium, miningTotal} = useUser();

    const formatNumber = (number) => {
        if (number === undefined || number === null || isNaN(number)) {
          return '';
        }
    
        if (number >= 1000000) {
          return (number / 1000000).toFixed() + 'M';
        } else if (number >= 100000) {
          return (number / 1000).toFixed(0) + 'K';
        } else {
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
      };

  return (
   
<div className='w-full flex flex-col items-start'>
<h3 className='font-medium text-[18px] py-5'>
         Your rewards
          </h3>

          <div className="w-full rounded-[16px] py-1 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/checkin.svg' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                   Checkin Rewards
                    </h1>

                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                <span className='flex items-center w-fit text-[15px]'>
                   
                   <span className='font-semibold text-primary'>
                     +{formatNumber(checkinRewards)} $GHOST
                   </span>
                 </span>
        
                </div>
              </div>

              <div className="w-full rounded-[16px] py-1 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/gold.svg' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                Tasks Rewards
                    </h1>

                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                <span className='flex items-center w-fit text-[15px]'>
                   
                   <span className='font-semibold text-primary'>
                     +{formatNumber(taskPoints)} $GHOST
                   </span>
                 </span>
        
                </div>
              </div>
              <div className="w-full rounded-[16px] py-1 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/gold.svg' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                Mining Rewards
                    </h1>

                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                <span className='flex items-center w-fit text-[15px]'>
                   
                   <span className='font-semibold text-primary'>
                     +{formatNumber(miningTotal)} $GHOST
                   </span>
                 </span>
        
                </div>
              </div>

              {premium && (

              <div className="w-full rounded-[16px] py-1 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/prem.svg' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
               Telegram Premium
                    </h1>

                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>
                <span className='flex items-center w-fit text-[15px]'>
                   
                   <span className='font-semibold text-primary'>
                     +{formatNumber(premiumReward)} $GHOST
                   </span>
                 </span>
        
                </div>
              </div>
              )}
</div>
  )
}

export default YourRewards
