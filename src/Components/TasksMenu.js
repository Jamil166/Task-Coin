import React, { useState } from 'react';
import { updateDoc, doc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Import Firestore configuration
import axios from 'axios';
import Animate from '../Components/Animate';
import { useUser } from "../context/userContext";
import ManualTasks from '../Components/ManualTasks';
import { IoCheckmarkCircleSharp, IoClose } from 'react-icons/io5';
// import MilestoneRewards from '../Components/MilestoneRewards';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Partners from './Partners';
import RefRewards from './RefRewards';
import TonTask from './TonTask';
import YouTubeTasks from './YoutubeTasks';



const TasksMenu = () => {
  const { id, setBalance, completedTasks, tasks, setTaskPoints, setCompletedTasks, setTasks } = useUser(); // Assuming 'id' is the user's document ID in Firestore
  const [modalOpen, setModalOpen] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [currentError, setCurrentError] = useState({}); // Task-specific error messages
  const [showVerifyButtons, setShowVerifyButtons] = useState({}); // State to manage the display of Verify buttons
  const [countdownFinished, setCountdownFinished] = useState({});
  const [claiming, setClaiming] = useState({});
  const [claimError, setClaimError] = useState('');
  // eslint-disable-next-line
  const [activeIndex, setActiveIndex] = useState(1);
  const [claimedBonus, setClaimedBonus] = useState(0); // New state to store the claimed bonus amount
  const [congrats, setCongrats] = useState(false)

  // eslint-disable-next-line
  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const telegramBotToken = process.env.REACT_APP_BOT_TOKEN;

  const performTask = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    window.open(task.link, '_blank');
    setTimeout(() => {
      setShowVerifyButtons({ ...showVerifyButtons, [taskId]: true });
    }, 2000);
  };

  const checkTelegramMembership = async (taskId) => {
    try {
      const task = tasks.find(task => task.id === taskId);
      const response = await axios.get(`https://api.telegram.org/bot${telegramBotToken}/getChatMember`, {
        params: {
          chat_id: task.chatId,
          user_id: id, // Use the user's Firestore document ID as the Telegram user ID
        }
      });

      if (response.data.ok && (response.data.result.status === 'member' || response.data.result.status === 'administrator' || response.data.result.status === 'creator')) {
        // Update task verification status in Firestore
        setTasks(tasks.map(task => task.id === taskId ? { ...task, verified: true } : task));
        setCountdownFinished({ ...countdownFinished, [taskId]: true });
      } else {
        setCurrentError({ [taskId]: `Could not verify, try again` });
        // setTimeout(() => {
        //     setCurrentError({});
        // }, 1000);
      }
    } catch (error) {
      console.error('Error verifying Telegram membership:', error);
      setCurrentError({ [taskId]: `Could not verify, try again` });
    //   setTimeout(() => {
    //     setCurrentError({});
    // }, 1000);
    } finally {
      setShowVerifyButtons({ ...showVerifyButtons, [taskId]: false });
    }
  };

  const hideError = () => {
    setCurrentError({})
  }

  const startCountdown = (taskId) => {
    setCurrentError({}); // Reset error state
    setCountdowns({ ...countdowns, [taskId]: 5 });

    const countdownInterval = setInterval(() => {
      setCountdowns(prevCountdowns => {
        const newCountdown = prevCountdowns[taskId] - 1;
        if (newCountdown <= 0) {
          clearInterval(countdownInterval);
          setCountdownFinished({ ...countdownFinished, [taskId]: true });
          return { ...prevCountdowns, [taskId]: 0 };
        }
        return { ...prevCountdowns, [taskId]: newCountdown };
      });
    }, 1000);

    checkTelegramMembership(taskId); // Call the API immediately
  };

  const claimTask = async (taskId) => {
    setClaiming({ ...claiming, [taskId]: true });
    setClaimError('');
    try {
      const task = tasks.find(task => task.id === taskId);
      const userDocRef = doc(db, 'telegramUsers', id);

      await updateDoc(userDocRef, {
        balance: increment(task.bonus),
        tasksCompleted: arrayUnion(taskId),
        taskPoints: increment(task.bonus),
      });

      // Update the balance and completedTasks state
      setBalance(prevBalance => prevBalance + task.bonus);
      setTaskPoints(prevTaskPoints => prevTaskPoints + task.bonus);
      setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, taskId]);

      setClaimedBonus(task.bonus);
      setModalOpen(true);
      setCongrats(true);

      setTimeout(() => {
        setCongrats(false);
      }, 4000);
    } catch (error) {
      console.error('Error claiming task:', error);
      setClaimError('Failed to claim the task. Please try again.');
    } finally {
      setClaiming({ ...claiming, [taskId]: false });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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

  const formatNumberCliam = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  return (
    <>
      <Animate>
        <div className="w-full pt-4 justify-center flex-col">
          <h3 className='font-medium text-[18px] pb-5'>
            Complete Tasks & Earn
          </h3>

          <div className={`w-full flex items-end justify-center flex-col space-y-1`}>
            {tasks.map(task => (
                    <>
              <div key={task.id} className="w-full rounded-[16px] py-3 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src={task.icon} className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                      {task.title}
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className=''>
                        +{formatNumber(task.bonus)} $GHOST
                      </span>
                    </span>
                    {claimError && (
                      <p className={`text-accent pt-2 text-xs w-full`}>{claimError}</p>
                    )}
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>
                  {!completedTasks.includes(task.id) && (
                    <>
                      {!showVerifyButtons[task.id] && (
                        <button
                          onClick={() => performTask(task.id)}
                          className={`w-[78px] py-[10px] text-center absolute rounded-[30px] px-3 bg-[#1f2023] hover:bg-[#36373c] text-[#fff] font-semibold ease-in duration-200 ${countdowns[task.id] > 0 ? 'hidden' : ''}`}
                        >
                         Start
                        </button>
                      )}
                      {showVerifyButtons[task.id] && (
                        <button
                          onClick={() => startCountdown(task.id)}
                          className={`w-[78px] py-[10px] text-center rounded-[30px] px-3 font-semibold ${countdowns[task.id] ? 'hidden' : `bg-btn4`}`}
                          disabled={task.verified && countdownFinished[task.id]}
                        >
                          Check
                        </button>
                      )}
                    </>
                  )}
                  {countdowns[task.id] ? (
                    <span className="w-[78px] py-[10px] h-[40px] flex items-center justify-between rounded-[30px] px-5 font-medium bg-[#1f2023]">
                     <div className='w-full flex items-center justify-center relative'>
                     <AiOutlineLoading3Quarters size={24} className='absolute animate-spin text-secondary'/>
                       <span className='absolute text-[10px]'>
                        {countdowns[task.id]}s
                        </span>
                     </div>

                    </span>
                  ) : (
                    <>
                      {completedTasks.includes(task.id) && (
                        <>
                          <span className=''>
                            <IoCheckmarkCircleSharp size={28} className={`text-accent`} />
                          </span>
                        </>
                      )}
                    </>
                  )}
                  {!completedTasks.includes(task.id) && (
                    <button
                      onClick={() => claimTask(task.id)}
                      disabled={!task.verified || claiming[task.id] || !countdownFinished[task.id]}
                      className={`w-[78px] ${claiming[task.id] ? 'text-[14px]' : ''} py-[10px] absolute text-center rounded-[30px] px-3 font-semibold bg-btn ${task.verified && countdownFinished[task.id] ? '' : 'hidden'}`}
                    >
                      {claiming[task.id] ? 'Claiming' : 'Claim'}
                    </button>
                  )}
                </div>
              </div>
          
    {countdowns[task.id] ? (
<>
</>
                  ) : (
                    <>
                      {task.verified && countdownFinished[task.id] && !completedTasks.includes(task.id) ? (
<></>                      ) : (
                        currentError[task.id] && (
<div onClick={hideError} className={`${currentError[task.id] ? 'bottom-2' : '-bottom-32 duration-300 ease-out'} w-full px-6 absolute z-10 left-0 right-0`}>

                          <div className={`w-full bg-[#17181A] font-medium text-secondary rounded-[8px] py-3 px-4 flex items-center justify-between text-[15px] text-wrap`}>

                      
                           <span>
                            {currentError[task.id]}
                            </span> 
                            <IoClose size={20} className=''/>
                            
                            </div>
</div>


                        )
                      )}
                      {completedTasks.includes(task.id) && (
                        <>
                        </>
                      )}
                    </>
                  )}
              </>
            ))}


            <ManualTasks />

            <TonTask/>

              <RefRewards/>


              <div className='w-full flex flex-col items-start'>


<h3 className='font-medium text-[18px] py-5'>
        Our Partners
          </h3>


<Partners/>


              </div>
              <div className='w-full flex flex-col items-start'>


<h3 className='font-medium text-[18px] py-5'>
       Video Tasks
          </h3>


<YouTubeTasks/>


              </div>






            <div className={`${
              modalOpen === true ? "visible" : "invisible"
            } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}>
              <div className={`${
                modalOpen === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
              } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
                <div className="w-full flex justify-center flex-col items-center space-y-3">
                  <div className="w-full items-center justify-center flex flex-col space-y-2">
                    <IoCheckmarkCircleSharp size={32} className={`text-accent`} />
                    <p className='font-medium'>Let's go!!</p>
                  </div>
                  <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
                    <span className={`text-accent`}>+{formatNumberCliam(claimedBonus)}</span> $GHOST CLAIMED
                  </h3>
                  <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
                    Keep performing new tasks! something huge is coming! Perform more and earn more $GHOST now!
                  </p>
                </div>
                <div className="w-full flex justify-center">
                  <button
                    onClick={closeModal}
                    className={`bg-btn4 w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
                  >
                    Continue tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none'>
            {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
          </div>
          
        </div>
   
      </Animate>
    </>
  );
};

export default TasksMenu;
