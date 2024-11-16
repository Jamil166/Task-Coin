// RouletteSpinner.jsx
import React, { useState, useEffect } from 'react';

const RouletteSpinner = () => {
  const values = [3000, 2000, 1000, 500, 300];
  // eslint-disable-next-line
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      const spinDuration = 3000; // 3 seconds
      const intervalDuration = 100; // 0.1 second
      let elapsed = 0;

      const intervalId = setInterval(() => {
        elapsed += intervalDuration;
        setSelectedIndex(prevIndex => (prevIndex + 1) % values.length);

        if (elapsed >= spinDuration) {
          clearInterval(intervalId);
          setIsSpinning(false);
          // Set final selected index
          const finalIndex = Math.floor(Math.random() * values.length);
          setSelectedIndex(finalIndex);
        }
      }, intervalDuration);

      return () => clearInterval(intervalId);
    }
  }, [isSpinning, values.length]);
  
// eslint-disable-next-line
  const spin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
    }
  };

  return (
    <div className='w-full flex flex-col space-y-3'>

    <h1 className='text-[13px] text-secondary'>
        FREE SPINS
    </h1>

<div className='w-full h-[300px] bg-[#17181A] rounded-[12px] overflow-hidden relative flex items-center flex-col justify-center'>

<div className='bg-[#17181A] absolute h-[10px] z-20 opacity-[90%] w-full top-0 left-0 right-0 rounded-[12px]'></div>
<div className='bg-[#17181A] absolute h-[70px] z-20 opacity-[75%] w-full top-0 left-0 right-0 rounded-[12px]'></div>
<div className='bg-[#17181A] absolute h-[128px] z-20 opacity-[75%] w-full bottom-0 left-0 right-0 rounded-[12px]'></div>
<div className='bg-[#17181A] absolute h-[100px] z-20 w-full bottom-0 left-0 right-0 rounded-[12px]'></div>

<div className='absolute w-full left-0 right-0 px-10 flex justify-center items-center bottom-0 top-0'>

<div className='bg-[#26282B] absolute w-[80%] mt-[-65px] h-[30px] rounded-[6px]'></div>
</div>


        <div className='w-full flex h-[300px] z-10 space-y-2 flex-col items-center justify-center'>

        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                200
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                300
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                1000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                2000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                3000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                4000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                5000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                6000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                7000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                8000
            </span>

        </span>
        <span className='flex items-center space-x-1 font-medium'>

            <img src='/stars2.svg' alt='stars' className='w-[14px]'/>
            <span className=''>
                9000
            </span>

        </span>
        </div>


        <div className='absolute w-full left-0 right-0 px-6 flex justify-center items-center bottom-5'>
        <button className='bg-btn font-semibold flex justify-center rounded-[8px] items-center h-[50px] w-full z-20'>
            Spin
        </button>
        </div>

    </div>


    <p className='text-[13px] text-secondary'>
        Spin to win prizes. You have a free spin every 24 hours. Get one more spin for every 5 invited friends or use stars.
    </p>

    </div>
  );
};

export default RouletteSpinner;