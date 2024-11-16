import React, { useEffect, useState } from 'react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircleSharp, IoClose } from 'react-icons/io5';

const TonTask = () => {
  const { id, balance, setBalance, tonTasks, setTaskPoints, setTonTasks, tonTransactions, setTonTransactions } = useUser();
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");
  const [buttonText, setButtonText] = useState("Make Purchase");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const wallets = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [congrats, setCongrats] = useState(false);
  const bonusAward = 10000;
  const cost = '100000000'
  const price = 0.2


  useEffect(() => {
    const initializeTonConnect = async () => {
      try {
        await tonConnectUI.connectionRestored;
        setIsLoading(false);
      } catch (err) {
        console.error('TonConnect initialization error:', err);
        setMessage(`TonConnect error: ${err.message}`);
        setMessageColor("red");
        setIsLoading(false);
      }
    };
    initializeTonConnect();
  }, [tonConnectUI]);

  const transaction = (cost) => ({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: "UQAtr73XG2zmO1iwQYqvhhIdWVdJVT0CHsBai7LO_MGg9UBL",
        amount: cost, // Accurate cost from the selected mining power
      },
    ],
  });

  const handleClick = async () => {
    setButtonText("Processing...");
    setButtonDisabled(true);

    try {
      const response = await tonConnectUI.sendTransaction(transaction(cost));
      console.log('Transaction sent successfully', response);

      const newBalance = balance + bonusAward;
      const userRef = doc(db, 'telegramUsers', id.toString());
      await updateDoc(userRef, {
        balance: newBalance,
        tonTransactions: tonTransactions + 1,
        tonTasks: true,
        taskPoints: increment(bonusAward),
      });
      setBalance(newBalance);
      setTonTransactions(tonTransactions + 1);
      setTonTasks(true);
      setTaskPoints(prevTaskPoints => prevTaskPoints + bonusAward);

      setCongratsMessage(
        <div className="w-full flex justify-center flex-col items-center space-y-3">
        <IoCheckmarkCircleSharp size={32} className="text-accent" />
        <p className="font-medium text-center">Congratulations!</p>
        <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
          
          <span className='flex items-center justify-center space-x-[2px] text-[18px]'>
<img src='/dogs.webp' alt='sdfd' className='w-[15px]'/>

          <span className="text-accent">+10,000 $GHOST CLAIMED</span>
              </span>
          <span>Task Completed</span>
        </span>
        <p className="pb-6 text-[15px] w-full text-center">
          Perform more activities or buy more $GHOST to stay ahead and claim listing giveaway bonues!😎
        </p>
      </div>
      );

      setShowCongratsModal(true);
      setOpenUpgrade(false);
      setCongrats(true);
      setTimeout(() => {
          setCongrats(false);
      }, 3000);

      setMessage("");
      setMessageColor("green");
    } catch (err) {
      console.error('Transaction error:', err);
      setMessage("Transaction failed or canceled, please try again later.");
      setMessageColor("red");
    } finally {
      setButtonText("Make Purchase");
      setButtonDisabled(false);
    }
  };

  const closeUpgrader = () => {
    setOpenUpgrade(false);
    setMessage("")
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

  return (
    <>
   
   <div
className="w-full rounded-[16px] py-3 flex items-center justify-between space-x-1">
              
              <div className='w-fit pr-2'>
                <div className='flex items-center justify-center bg-[#1f2023] h-[45px] w-[45px] rounded-full p-1'>
                  <img alt="engy" src='/ton.png' className='w-[20px]' />
                </div>
              </div>
                <div className="flex h-full flex-1 flex-col justify-center relative">
                  <div className='flex w-full flex-col justify-between h-full space-y-1'>
                    <h1 className="text-[15px] text-nowrap line-clamp-1 font-medium">
                    Make a TON Transaction
                    </h1>
                    <span className='flex text-secondary items-center w-fit text-[15px]'>
                   
                      <span className=''>
                        +{formatNumber(bonusAward)} $GHOST
                      </span>
                    </span>
                  </div>
                </div>
                <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative'>

                        {tonTasks ? (
                          <span className=''>
                          <IoCheckmarkCircleSharp size={28} className={`text-accent`} />
                        </span>
                        ) : (
                            <button
                            onClick={() => setOpenUpgrade(true)}
                            className={`bg-[#1f2023] hover:bg-[#36373c] text-[#fff] w-fit py-[10px] rounded-[30px] px-5 font-semibold ease-in duration-200`}
                          >
                           Start
                          </button>
                        )}

        
                </div>
              </div>
  

      {openUpgrade && (
<>

<div className="fixed flex bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center">
        <div className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
            <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
                <button
                    onClick={closeUpgrader}
                    className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                >
                    <IoClose size={20} className="text-[#9995a4]" />
                </button>

                <div className="w-full flex justify-center flex-col items-center">
                 

<img src='/dogs.webp' alt='sdfd' className='w-[70px]'/>



        
                    <h3 className="font-semibold text-center text-[20px] pt-2">
                    Make a TON Transaction
                    </h3>
                    <p className="pb-6 text-primary text-[14px] px-4 text-center">
                      Making a TON transaction is a criteria for airdrop qualification!
                    </p>

                    <div className='w-full flex justify-center items-center space-x-2 pb-3'>
                    <div className="w-[45%] bg-cards text-[12px] rounded-[6px] p-2 text-primary flex items-center justify-center space-x-1 font-semibold text-center">
                       <span> Price:</span> <span className='pl-1'><img src='ton.png' alt='dfd' className='w-[12px] h-[12px]'/></span> <span>{price}</span>  <span> TON</span> 
                    </div>
                    </div>

                </div>

                {wallets ? (
                    <>
                        <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7">
                        <button 
onClick={handleClick} 
className={`${buttonDisabled ? 'bg-[#5A4420]' : 'bg-btn4'} text-[#000] w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]`}
disabled={buttonDisabled}
>
{buttonText}
</button>

                        </div>

                        {message && (
                            <p className='w-full text-center text-[13px]' style={{ color: messageColor, marginTop: "10px" }}>
                                {message}
                            </p>
                        )}
                    </>
                ) : (
                    <div className='w-full flex flex-col items-center justify-center space-y-4'>
                    <TonConnectButton className="!w-full" />
                    </div>
                )}
            </div>
        </div>
    </div>
</>

      )}

<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>


      <div
        className={`${showCongratsModal === true ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div className={`${showCongratsModal === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          
          
            {congratsMessage}


        

          <div className="w-full flex justify-center">
            <button
              onClick={() => setShowCongratsModal(false)}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Continue
            </button>
          </div>
        </div>
      </div>


    </>
  );
};

export default TonTask;
