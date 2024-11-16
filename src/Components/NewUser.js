import React, { useEffect, useState } from 'react';
import { PiCheckCircle } from "react-icons/pi";
import { useUser } from '../context/userContext';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

const NewUser = ({setChecker}) => {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [visibleChecks, setVisibleChecks] = useState(0);
  const [completedChecks, setCompletedChecks] = useState([]);
  const {id, premium, premiumReward, setCheckinRewards, setShowClaimModal, setLastCheckIn, setCheckInDays, setPremiumReward, setBalance} = useUser()
  // eslint-disable-next-line
  const [showRewards, setShowRewards] = useState(false);
  const [premiumRewards, setPremiumRewards] = useState(false);
  const [finishRewards, setFinishRewards] = useState(false);
  const [dailyCheckin, setDailyCheckin] = useState(false);
  const [awardedPoint, setAwardedPoint] = useState(0);
  const premiumPoints = 5000;
  const checkinPoint = 500;
  

  const awardPointsPrem = async () => {
    // Get the first digit of the user ID
    const firstDigit = parseInt(id.toString()[0]);
  
    // Calculate points to award based on the first digit
    const pointsToAward = firstDigit * 1000;
  
    // Calculate the new balance
    const newBalance = pointsToAward + checkinPoint + premiumPoints;
  
    try {
      const now = new Date();
      const userRef = doc(db, 'telegramUsers', id.toString());
      await updateDoc(userRef, {
        balance: newBalance,
        yearsReward: pointsToAward, // Assuming you want to track the points awarded for years separately
        checkinRewards: checkinPoint,
        premiumReward: premiumReward + premiumPoints,
        checkInDays: [1],
        lastCheckIn: Timestamp.fromDate(now),

      });
  
      setBalance(newBalance);
      setAwardedPoint(pointsToAward);
      setCheckinRewards(checkinPoint);
      setPremiumReward(premiumPoints);
      setLastCheckIn(now);
      setCheckInDays([1]);
      setShowClaimModal(false);
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  const awardPointsNotPrem = async () => {
    // Get the first digit of the user ID
    const firstDigit = parseInt(id.toString()[0]);
  
    // Calculate points to award based on the first digit
    const pointsToAward = firstDigit * 1000;
    // Calculate the new balance
    const newBalance = pointsToAward + checkinPoint;
  
    try {
      const now = new Date();
      const userRef = doc(db, 'telegramUsers', id.toString());
      await updateDoc(userRef, {
        balance: newBalance,
        yearsReward: pointsToAward, // Assuming you want to track the points awarded for years separately
        checkinRewards: checkinPoint,
        checkInDays: [1],
        lastCheckIn: Timestamp.fromDate(now),

      });
  
      setBalance(newBalance);
      setAwardedPoint(pointsToAward);
      setCheckinRewards(checkinPoint);
      setLastCheckIn(now);
      setCheckInDays([1]);
      setShowClaimModal(false);
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };


  // useEffect(() => {
  //   if (id) {
  //     awardPointsBasedOnFirstDigit(id, balance, setBalance);
  //   }
  //   // eslint-disable-next-line
  // }, [id]);

  useEffect(() => {
    if (id) {
      if (premium) {
        awardPointsPrem();
      } else {
        // Action for non-premium users
        awardPointsNotPrem();
      }
    }
  // eslint-disable-next-line
  }, [id]);

  


//   useEffect(() => {
//     if (id) {

//       if (premium) {
//         const awardPremium = async () => {
//           const userRef = doc(db, 'telegramUsers', id.toString());
//           const totalBalance = premiumPoints;
//           try {
//             await updateDoc(userRef, {
//               premiumReward: premiumReward + premiumPoints,
//               balance: increment(totalBalance),

         
//             });
//             setPremiumReward(premiumPoints);
//             setBalance((prevBalance) => prevBalance + totalBalance);
//             console.log('Points claimed successfully');
//           } catch (error) {
//             console.error('Error updating balance and energy:', error);
//           }
//       };
//       awardPremium();
//       }

//     }
// // eslint-disable-next-line
//     }, [id]);

  useEffect(() => {
    if (visibleChecks < 4) {
      const timer = setTimeout(() => {
        setVisibleChecks(visibleChecks + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visibleChecks]);

  useEffect(() => {
    if (currentCheck < 4 && currentCheck < visibleChecks) {
      const timer = setTimeout(() => {
        setCurrentCheck(currentCheck + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentCheck, visibleChecks]);

  const handleTransitionEnd = (index) => {
    setCompletedChecks((prev) => [...prev, index]);
  };

  const allChecksCompleted = completedChecks.length === 4;

  const openCollect = () => {
    setPremiumRewards(true);
    setShowRewards(false);


  }
  const openPremium = () => {
    setFinishRewards(true);
    setPremiumRewards(false);

  }
  const openFinish = () => {
    setDailyCheckin(true);
    setFinishRewards(false);

  }
  const openDone = () => {
    setChecker(false);
    setDailyCheckin(false);

  }


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
    <>

    <div className='w-full h-full relative pb-24 flex items-center justify-center flex-col space-y-20'>



    <div className='font-bold checking w-full absolute top-8 text-center text-[#fff]'>
                Checking your account
              </div>
    
    
            <div className='flex flex-col w-full justify-start items-center px-1 space-y-16'>
    
    
     
            <div className="flex flex-col items-start !mt-[-100px] space-y-8 w-full">
      {['Account Age Verified', 'Activity Level Analyzed', 'Telegram Premium Checked', 'OG Status Confirmed'].map((check, index) => (
        <div key={index} className={`flex flex-col items-center gap-2 w-full transition-opacity duration-500 ${index < visibleChecks ? 'opacity-100' : 'opacity-0'}`}>
          <div className='w-full flex justify-between items-center'>
            <div className='text-[16px] font-semibold'>{check}</div>
            <PiCheckCircle size={20} className={`${completedChecks.includes(index) ? 'text-accent' : 'text-white'}`}/>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-[2px] relative overflow-hidden">
            <div
              className={`h-full bg-btn ${currentCheck > index ? 'w-full' : 'w-0'} transition-all duration-[2000ms]`}
              onTransitionEnd={() => handleTransitionEnd(index)}
            ></div>
          </div>
        </div>
      ))}

    </div>

    {allChecksCompleted && (
      <>
      {premium ? (
              <button onClick={openCollect} className={`w-full py-3 rounded-[8px] absolute bottom-10 font-semibold px-3 items-center justify-center text-center bg-btn`}>
              Continue
             </button>
      ) : (
        <button onClick={openPremium} className={`w-full py-3 rounded-[8px] absolute bottom-10 font-semibold px-3 items-center justify-center text-center bg-btn`}>
        Continue
       </button>
      )}

      </>
                  )}

    
    
            </div>
    
            </div>

{/* {showRewards && (
      
    <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex bg-[#000] justify-center px-[16px] h-full">

<div className='backdrop-blur-[1px] absolute top-0 left-0 right-0 bottom-0'>

</div>

    <div className="w-full pt-10 justify-center flex-col items-center space-y-4 relative">
  <div className='w-full flex justify-center space-x-2'>

    <div className={`w-[33%] h-[6px] rounded-[50px] ${showRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
    <div className={`w-[33%] h-[6px] rounded-[50px] ${premiumRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
    <div className={`w-[33%] h-[6px] rounded-[50px] ${finishRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>

  </div>
  <div className='w-full absolute'>
        <img src='/congrats2.gif' alt='cong' className='w-full'/>
    </div>

  <div className='w-full flex flex-col space-y-5 items-center'>

    <h2 className='font-bold text-[30px]'>
        Gold!
    </h2>

    <p className='text-[16px] font-semibold pb-6'>
        You've joined Telegram
    </p>

    <h2 className='font-bold text-[100px] leading-[100px] !p-0 !m-0'>
      {years !== 'Unknown' ? `${years}` : 'Unknown'}
    </h2>
    <p className='text-[20px] text-white font-bold !mt-0'>
    {displayText} ago
    </p>

    <div className={``}>
      <img src='/gold.svg' alt='sdf' className='w-[180px]'/>
    </div>

  </div>



    </div>

    <div className='w-full absolute bottom-6 flex px-4'>
        <div className='w-full flex flex-col items-center space-y-4 text-center'>

  
        <p className='max-w-[28em] textlow text-white font-semibold'>
        
            You're in the Top 90% Telegram users 🔥
        </p>
        <button onClick={openCollect} className={`w-full py-3 rounded-[8px] font-semibold px-3 items-center justify-center text-center bg-[#fff] text-[#000]`}>
              Continue
             </button>
             </div>
    </div>
    </div>
)}  */}

{premium && (
<>
{premiumRewards && (
      
      <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex bg-[#000] justify-center px-[16px] h-full">
  
  <div className='backdrop-blur-[1px] absolute top-0 left-0 right-0 bottom-0'>
  
  </div>
  
      <div className="w-full pt-10 justify-center flex-col items-center space-y-4 relative">
    <div className='w-full flex justify-center space-x-2'>
  
      <div className={`w-[43%] h-[6px] rounded-[50px] ${premiumRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
      <div className={`w-[43%] h-[6px] rounded-[50px] ${finishRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
  
    </div>
    <div className='w-full absolute'>
          <img src='/congrats2.gif' alt='cong' className='w-full'/>
      </div>
  
    <div className='w-full flex flex-col space-y-5 items-center'>
  
      <h2 className='font-bold text-[30px] text-center'>
         Telegram Premium
      </h2>
  
      <p className='text-[16px] font-semibold pb-6'>
          You are one of the best!
      </p>
  
      <div className={``}>
        <img src='/prem.svg' alt='sdf' className='w-[280px] premiumsvg'/>
      </div>
  
      <p className='text-[20px] text-white font-bold !mt-0'>
     Premium user
      </p>
  
  
    </div>
  
  
  
      </div>
  
      <div className='w-full absolute bottom-7 flex px-4'>
          <div className='w-full flex flex-col items-center space-y-4 text-center'>
  
    
          <p className='max-w-[28em] textlow text-white font-semibold'>
          
              Status confirmed
          </p>
          <button onClick={openPremium} className={`w-full py-3 rounded-[8px] font-semibold px-3 items-center justify-center text-center bg-[#fff] text-[#000]`}>
                Continue
               </button>
               </div>
      </div>
      </div>
  )} 
</>
)}


{finishRewards && (
      
      <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex bg-[#000] justify-center px-[16px] h-full">
  
  <div className='backdrop-blur-[1px] absolute top-0 left-0 right-0 bottom-0'>
  
  </div>
  
      <div className="w-full pt-10 justify-center flex-col items-center space-y-4 relative">
    <div className='w-full flex justify-center space-x-2'>

      <div className={`${premium ? '' : 'hidden'} w-[43%] h-[6px] rounded-[50px] ${!premiumRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
      <div className={`${premium ? 'w-[43%] ' : 'w-[86%]'} h-[6px] rounded-[50px] ${finishRewards ? 'bg-btn' : 'bg-btn4 opacity-[16%]'}`}></div>
  
    </div>
  
    <div className='w-full flex flex-col space-y-5 items-center'>
  
      <h2 className='font-bold text-[30px] text-center w-full'>
        {premium ? 'You are the best' : 'Welcome to GamaDogs'}
      </h2>
  
      <p className='text-[16px] font-semibold pb-14'>
        Here is your $BLEGGS rewards
      </p>
  
      <div className={``}>
        <img src='/stars.svg' alt='sdf' className='w-[80px] premiumsvg'/>
      </div>
  
      <p className='text-[24px] text-white font-bold !mt-3'>
        {premium ? (
          <>
                    +{formatNumber(awardedPoint + premiumPoints)}
          </>
        ) : (
          <>
          +{formatNumber(awardedPoint)}
</>
        )}
  
      </p>
  
      <p className='text-[16px] !mt-0'>
      $BLEGGS
      </p>
  
  
    </div>
  
  
  
      </div>
  
      <div className='w-full absolute bottom-7 flex px-4'>
          <div className='w-full flex flex-col items-center space-y-4 text-center'>
  
    
          <p className='max-w-[28em] textlow text-white font-semibold'>
          
             If you missed Dogs, dont miss {process.env.REACT_APP_PROJECT_NAME_SMALL}!
          </p>
          <button onClick={openFinish} className={`w-full py-3 rounded-[8px] font-semibold px-3 items-center justify-center text-center bg-[#fff] text-[#000]`}>
                Continue
               </button>
               </div>
      </div>
      </div>
  )} 



{dailyCheckin && (
      
    <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex bg-[#000] justify-center px-[16px] h-full">

<div className='backdrop-blur-[1px] absolute top-0 left-0 right-0 bottom-0'>

</div>

    <div className="w-full pt-10 justify-center flex-col items-center space-y-4 relative">


  <div className='w-full flex flex-col space-y-5 items-center pt-16'>

    <h2 className='font-bold text-[42px]'>
      Day 1
    </h2>
    <p className='text-[20px] text-white font-bold !mt-1'>
Daily Checkin
    </p>

    <p className='text-[16px] text-white !mt-1'>
  +{formatNumber(checkinPoint)} $BLEGGS
    </p>

    <div className={``}>
      <img src='/checkin.svg' alt='sdf' className='w-[150px]'/>
    </div>

  </div>



    </div>

    <div className='w-full absolute bottom-7 flex px-4'>
        <div className='w-full flex flex-col items-center space-y-4 text-center'>

  
        <p className='max-w-[28em] textlow text-white font-medium px-1'>
        
          Visit daily to maintain your streak! if you miss a day you loose your progress and start afresh😎
        </p>
        <button onClick={openDone} className={`w-full py-3 rounded-[8px] font-semibold px-3 items-center justify-center text-center bg-btn`}>
              Continue
             </button>
             </div>
    </div>
    </div>
)} 
</>

  );
};

export default NewUser;
