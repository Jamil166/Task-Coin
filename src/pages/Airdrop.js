import React, { useEffect, useRef, useState } from 'react'
import Animate from '../Components/Animate'
import { useUser } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { Address } from '../Components/Address'
import Exchanges from '../Components/Exchanges'
import { RiExchangeDollarFill } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { CiNoWaitingSign } from 'react-icons/ci'

const Airdrop = () => {
    const {tonTransactions, refBonus, miningTotal, taskPoints, selectedExchange} = useUser()
    const [showExchange, setShowExchange] = useState(false);
    const locations = useNavigate();
    const [backLos, setBackLos] = useState(true);

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

    useEffect(() => {

        // Attach a click event listener to handle the back navigation
        const handleBackButtonClick = () => {
            locations('/'); // Navigate to /home without refreshing the page
            setBackLos(false);
              }
    
          
        if (backLos) {
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
          window.Telegram.WebApp.BackButton.hide();
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }
      
        // Cleanup handler when component unmounts
        return () => {
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    
        };
      }, [backLos, setBackLos, locations]);

      

    const formatNumber = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
          return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
      };

      const qualifications = [
        {
            title: "Make TON Transactions",
            totalBalance: tonTransactions,
            icon: '/ton.png',
            id: 1,
        },
        {
            title: "Tasks Rewards",
            totalBalance: taskPoints,
            icon: '/coin.webp',
            id: 2,
        },
        {
            title: "Mining Rewards",
            totalBalance: miningTotal,
            icon: '/earn.svg',
            id: 3,
        },
        {
            title: "Referral Rewards",
            totalBalance: refBonus,
            icon: '/invite.svg',
            id: 4,
        }
      ]


      const openExchange = () => {
        setShowExchange(true);
    }
    

  return (
    <Animate>


    <div className='w-full flex justify-center items-center flex-col space-y-3'>


<div className='w-full flex items-center justify-center pt-8 pb-3'>
    <img alt="daxy" src="/prem.svg" 
            className="w-[100px]"
            />
</div>


<div className='w-full flex items-center justify-center pb-1'>
    <Address/>

    
</div>

<div className='w-full flex items-center justify-center pb-3'>
<button onClick={() => setOpenInfoTwo(true)} className="w-[74%] font-medium bg-cards px-4 py-[15px] text-primary text-[13px] space-x-1 rounded-full flex items-center justify-center">
            <img src="/withdraw.svg" alt="withdraw" className="w-[16px] h-[16px]"/>
            <span className="">
              Withdraw to wallet
            </span>

          </button>

    
</div>


      <div className='w-full relative h-screen bg-[rgb(146,139,122)] rounded-tl-[40px] rounded-tr-[40px]'>
        <div className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

        <div id="refer" className='w-full rounded-[16px] flex flex-col scroller h-[70vh] overflow-y-auto pb-[250px]'>
{/*  */}

<div className='w-full flex flex-col text-center justify-center items-center pt-6'>
    <h1 className='font-semibold text-[20px]'>
        Airdrop Qualifiers
    </h1>

    <p className='text-[14px] text-[#c6c6c6] leading-[24px] px-3 pb-8'>
            Listing and launching soon, all activities are important for qualification!
            </p>


</div>


<div className='w-full flex flex-col space-y-[10px]'>

<button 
                      onClick={openExchange}
                      className={`w-full bg-[#23221f] text-[14px] rounded-[10px] px-4 py-4 space-x-2 flex items-center justify-between`}
                    >
                        <div className='flex items-center space-x-2 justify-start w-[80%]'>

                        {selectedExchange.id === 'selectex' ? (
                                              <span className="flex items-center justify-center mt-[1px]">
                                                 <RiExchangeDollarFill size={34} className={``} />
                                            </span>



                        ) : (
                            <span className="flex items-center justify-center mt-[1px]">
                            <img src={selectedExchange.icon} alt={selectedExchange.title} className={`w-[34px] h-[34px] rounded-full`} />
                          </span>
                        )}
                      <div className='flex flex-col text-left'>

                   
                      <h2 className='flex flex-1 font-medium'>
                     Choose airdrop exchange
                      </h2>
                      <div className='text-[13px] font-normal'>

                  
                      {selectedExchange.id === 'selectex' ? (
                        <>
                        None
                        </>
                      ) : (
                        <>
                        {selectedExchange.name}
                        </>
                      )}
                          </div>
                         </div>
                         </div>
        
                        <MdOutlineKeyboardArrowRight size={24} className={`text-[#959595]`} />
            
                    </button>

{qualifications.map((data, index) => (

<div key={index} className="w-full bg-[#23221f] text-[14px] rounded-[10px] px-4 py-4 space-x-2 flex items-center justify-between">
                  <span className="flex items-center justify-center mt-[1px]">
                    <img src={data.icon} alt={data.title} className={`w-[34px] h-[34px] rounded-full`} />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex w-full justify-between items-center font-medium">
                      <h4 className="">
                       {data.title}
                      </h4>
                      <span className="">
                      {data.totalBalance <= 0 ? (
                        <span className='text-secondary'>{formatNumber(data.totalBalance)}</span>
                      ) : (
                        <span className='text-accent font-semibold'>
                        +{formatNumber(data.totalBalance)}
                        </span>
                      )}
                      
                      
                      </span>
                    </div>
                    <div className="flex w-full justify-between items-center text-secondary">
                    </div>
                  </div>
                </div>

))}
</div>



</div>

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
            <span className="w-[50px] flex items-center">
          <CiNoWaitingSign size={50} className="text-bronze"/>
        </span>
              <p className='font-medium'>not available yet</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pt-2 pb-2 uppercase">
          LOCKED!
            </h3>
            <p className="pb-6 text-[14px] w-full text-center">
           Withdrawal will be unlocked when token lauch and airdrop distributed, make sure you connect your wallet to be eligible for withdrawal!
             </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-btn4 text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Back to wallet
            </button>
          </div>
        </div>
      </div>

    <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />

    </Animate>
  )
}

export default Airdrop