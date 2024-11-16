import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';


const friendsRewards = [
  { title: 'Invite 10 friends', referralsRequired: 10, bonusAward: 20000 },
  { title: 'Invite 25 friends', referralsRequired: 25, bonusAward: 50000 },
  { title: 'Invite 50 friends', referralsRequired: 50, bonusAward: 100000 },
//   { title: 'Invite 50 friends', referralsRequired: 50, bonusAward: 1000000 },
//   { title: 'Invite 100 friends', referralsRequired: 100, bonusAward: 2000000 },
];

const RefRewards = () => {
  const { referrals, balance, setBalance, id, setTaskPoints, claimedReferralRewards, setClaimedReferralRewards } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [congrats, setCongrats] = useState(false);




  const handleClaim = async (reward) => {
    if (referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title)) {
      const newBalance = balance + reward.bonusAward;
      try {
        const userRef = doc(db, 'telegramUsers', id);
        await updateDoc(userRef, {
          balance: newBalance,
          claimedReferralRewards: [...claimedReferralRewards, reward.title],
          taskPoints: balance + reward.bonusAward,
        });
        setBalance(newBalance);
        setTaskPoints(prevTaskPoints => prevTaskPoints + reward.bonusAward);
        setClaimedReferralRewards([...claimedReferralRewards, reward.title]);
        setModalMessage(
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className="text-accent" />
              <p className="font-medium text-center">Great job!</p>
            </div>
            <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
              <span className="text-accent">+{formatNumber(reward.bonusAward)}</span> $GHOST CLAIMED
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep inviting friends to unlock new rewards! Amazing things await!
            </p>
          </div>
        );

        setModalOpen(true);
        setCongrats(true);

        setTimeout(() => {
          setCongrats(false);
        }, 4000);
      } catch (error) {
        console.error('Error claiming referral reward:', error);
      }
    } else {
      setModalMessage('You have already claimed this referral reward or do not meet the requirements.');
      setModalOpen(true);
    }
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


  const closeModal = () => {
    setModalOpen(false);
  };



  return (
    <>




      {friendsRewards
        .filter((reward) => !claimedReferralRewards.includes(reward.title))
        .map((reward) => {
          // eslint-disable-next-line
          const progress = (referrals.length / reward.referralsRequired) * 100;
          const isClaimable = referrals.length >= reward.referralsRequired && !claimedReferralRewards.includes(reward.title);
          return (


<div key={reward.title} className="w-full rounded-[16px] py-3 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/invite.svg' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                    {reward.title}
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className=''>
                        +{formatNumber(reward.bonusAward)} $GHOST
                      </span>
                    </span>
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                        <button
                          disabled={!isClaimable}
                          onClick={() => handleClaim(reward)}
                          className={`${
                            isClaimable ? 'bg-btn text-[#000]' : 'bg-[#1f2023] text-[#888]'} w-fit py-[10px] rounded-[30px] px-5 font-semibold ease-in duration-200`}
                        >
                         Claim
                        </button>
        
                </div>
              </div>

    
          );
        })}

      <div className="w-full absolute top-[50px] left-0 right-0 flex justify-center z-50 pointer-events-none select-none">
        {congrats ? <img src='/congrats.gif' alt="congrats" className="w-[80%]" /> : null}
      </div>

      <div
        className={`${
          modalOpen === true ? 'visible' : 'invisible'
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          className={`${
            modalOpen === true ? 'opacity-100 mt-0' : 'opacity-0 mt-[100px]'
          } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8 ease-in duration-300 transition-all`}
        >
          {modalMessage}
          <div className="w-full flex justify-center">
            <button
              onClick={closeModal}
              className="bg-btn4 w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Continue to next
            </button>
          </div>
        </div>
      </div>

    </>


  );
};

export default RefRewards;
