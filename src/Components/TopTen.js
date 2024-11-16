import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/userContext';

const TopTen = () => {
const {mineLeaderBoard, activeMineUserRank, fullName, miningTotal} = useUser();

const getInitials = (username) => {
    const nameParts = username.split(' ');
    return nameParts[0].charAt(0).toUpperCase() + nameParts[0].charAt(1).toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Custom images for top 5 users
  const rankImages = [
    '/1st.webp', // 1st place image
    '/2nd.webp', // 2nd place image
    '/3rd.webp', // 3rd place image
    '/4th.webp', // 4th place image
    '/5th.webp', // 5th place image
    '/6th.webp', // 5th place image
    '/7th.webp', // 5th place image
    '/8th.webp', // 5th place image
    '/9th.webp', // 5th place image
    '/10th.webp', // 5th place image
  ];

                
  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const shortenName = (name) => {
    // Check if the name is longer than 16 characters
    if (name.length > 16) {
      return name.substring(0, 16) + '...'; // Return the first 16 characters followed by '...'
    }
    return name; // Return the original name if it's less than or equal to 16 characters
  };

  return (
<>

      <div className='w-full relative rounded-[8px] leadershadow flex flex-col space-y-2'>

{/* Display the active user's rank */}

<div className='bg-[#202124] py-2 px-3 flex flex-col font-medium w-full rounded-[8px]'>
  
<h2 className="text-[13px] text-secondary font-semibold">Your Mining Rank</h2>
<div 
className="w-full rounded-[16px] py-2 flex items-center justify-between space-x-3">

<div className='w-fit'>
  <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full p-1 ${getRandomColor()}`}>
  <span className='font-semibold text-[14px]'>{getInitials(fullName)}</span>
  </div>
</div>
  <div className="flex h-full flex-1 flex-col justify-center relative">
    <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
      <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
      {shortenName(fullName)}
      </h1>
      <span className='flex items-center gap-1 flex-1 text-[12px]'>

        <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
     
        <span className='text-[12px] text-nowrap font-medium'>
          {formatNumber(miningTotal)}
        </span>
      </span>
    </div>
  </div>
  <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-1'>
 
    <button
    className={`font-semibold ease-in duration-200`}
  >
  #{activeMineUserRank}
  </button>
  


  </div>
</div>
</div>

<NavLink to='/earn' className='bg-btn4 h-[45px] flex justify-center items-center space-x-2 font-medium w-full rounded-[8px]'>
    <img src='/prem.svg' alt='fdfvds' className='w-[14px]'/>
    <span>
        Boost Mining Rank
        </span>
</NavLink>

</div>


<div className="w-full flex flex-col space-y-3 pt-3">

{mineLeaderBoard
    .slice(0, 50)
    .sort((a, b) => b.miningTotal - a.miningTotal) // Sort users by balance in descending order
    .map((user, index) => (

    
                   <div 
            key={user.id} 
            className="w-full rounded-[16px] py-3 flex items-center justify-between space-x-3">
        
            <div className='w-fit'>
              <div className={`flex items-center justify-center h-[42px] w-[42px] rounded-full p-1 ${getRandomColor()}`}>
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.username}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className='font-semibold text-[14px]'>{getInitials(user.fullName)}</span>
              )}
              </div>
            </div>
              <div className="flex h-full flex-1 flex-col justify-center relative">
                <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
                  <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
                  {shortenName(user.fullName)}
                  </h1>
                  <span className='flex items-center gap-1 flex-1 text-[12px]'>
    
                    <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
                 
                    <span className='text-[12px] text-nowrap font-medium'>
                      {formatNumber(user.miningTotal)}
                    </span>
                  </span>
                </div>
              </div>
              <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-4'>
             
             
              {index < 10 ? (
                <img
                  src={rankImages[index]} // Display the custom image for the user rank
                  alt={`Rank ${index + 1}`}
                  className="w-[24px] h-auto"
                />
              ) : (
                <button
                className={`font-semibold ease-in duration-200`}
              >
              #{index + 1}
              </button>
              )}

    
              </div>
            </div>

   
        ))}
             </div>
  
</>
  );
};

export default TopTen;
