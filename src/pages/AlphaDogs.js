import React, { useEffect, useState } from 'react';
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import NewUser from '../Components/NewUser';
import CommunitySlider from '../Components/Slides';
import TasksMenu from '../Components/TasksMenu';
import YourRewards from '../Components/YourRewards';
import { NavLink } from 'react-router-dom';


const AlphaDogs = () => {
  const { balance, loadingTwo, setLoadingTwo, checker, setChecker, loading } = useUser();
  const [checking, setChecking] = useState(false);
  const [welcome, setWelcome] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTwo(false);
    }, 2000);
    // eslint-disable-next-line
  }, []);

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


const checkers = () => {
  setWelcome(false);
  setChecking(true);
}

  return (
<>
      {loading ? (
        <Spinner />
      ) : (
  
      <Animate>
         
    <div className='w-full flex justify-center flex-col px-4'>

    <div id="refer" className="w-full h-screen pt-5 scroller space-y-3 overflow-y-auto pb-[180px]">

        {loadingTwo && (
    <div className="flex justify-center items-center h-full">
    <div className="w-[50px] h-[50px] border-[6px] border-[#6c6c6c] mt-[-20%] border-dashed rounded-full animate-spin marco"></div>
  </div>
        )}





<div className={`w-full overflow-hidden space-y-3 ${loadingTwo ? 'hidden' : 'block'}`}>


      <div className='w-full h-[60px] overflow-hidden rounded-[12px] bg-btn flex items-center justify-center text-center font-semibold relative'>
       {/* <div className='scorebg absolute left-0 right-0 top-4 bottom-0 rounded-[12px]'></div> */}
       <img src='/scorebg.svg' alt='ifd' className='object-cover object-center w-[400px] h-[220px] absolute left-[6px] mt-[-10px] right-0'/>
       
       <div className='relative flex items-center justify-center text-white space-x-2'>

        <img src='/scoreIcon2.svg' alt='score' className='w-[20px]'/>
        <span>

        {process.env.REACT_APP_PROJECT_NAME_SMALL}
        </span>

        </div>
      </div>

      <div className='w-full flex justify-center bg-[#181818] rounded-[12px] relative overflow-hidden'>

      <img src='/blurbg.svg' alt='ifd' className='object-cover absolute left-0 w-full right-0 h-[200px] object-center rounded-[12px]'/>

<div className='w-full relative flex flex-col px-6 pt-6 items-center'>

        <img src='stars.svg' alt='stars' className='w-[60px]'/>
        <h4 className='font-semibold text-[32px] pt-2'>
          {formatNumber(balance)}
        </h4>
        <p className='pb-6'>
        $GHOST
        </p>
<div className='w-full pb-4'>

      <NavLink to='/airdrop' className='bg-btn h-[50px] px-4 rounded-[10px] flex items-center justify-center space-x-1 font-semibold text-[15px]'>
      <img src='/tons.svg' alt='dfd' className='w-[26px] mt-[2px]'/>
      <span className=''>
        Withdraw to wallet
      </span>
      </NavLink>
</div>
</div>



      </div>

      <CommunitySlider/>

      <div className='w-full flex flex-col'>

      <TasksMenu/>
      <YourRewards/>
      </div>

      </div>



{checker && (

      <div 
        className={`visible fixed bottom-0 left-0 z-40 right-0 top-[-12px] taskbg flex justify-center items-center`}
      >

      <div className="w-full flex h-full taskbg mt-[2px] justify-center relative flex-col items-center px-4">


        {welcome && (

          <div className='w-full h-full relative pb-24 flex items-center justify-center flex-col space-y-3'>
        <div className='absolute w-[180px] h-[180px]'>

          <img src='/stars.svg' alt='gods' className='w-full'/>

        </div>

        <div className='absolute bottom-10 flex flex-col w-full justify-center items-center space-y-5'>

 
          <p className='w-full text-center max-w-[20em]'>
           Welcome to {process.env.REACT_APP_PROJECT_NAME_SMALL}!<br/> Start mining {process.env.REACT_APP_PROJECT_NAME_SMALL} tokens today!
          </p>
            {balance > 0 ? (
          <button onClick={() => setChecker(false)} className='w-full py-3 rounded-[8px] font-semibold px-3 flex items-center justify-center text-center bg-btn'>
          Let's go!
        </button>
            ) : (
              <button onClick={checkers} className='w-full py-3 rounded-[8px] font-semibold px-3 flex items-center justify-center text-center bg-btn'>
              Let's go!
            </button>
            )}



        </div>

        </div>
        )}

        {checking && (

<NewUser setChecker={setChecker}/>
        )}



              </div>
         
            </div>
)}


    </div>
    </div>
</Animate>
      )}
</>
  );
};

export default AlphaDogs;
