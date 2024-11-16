import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

const AdminRankings = () => {
  const [users, setUsers] = useState([]);
  const [leaderBoard, setLeaderBoard] = useState([]);

  // Fetch top 8 users from 'telegramUsers'
  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'telegramUsers'), orderBy('balance', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Function to update the leaderboard
  const addUsersToLeaderBoard = async () => {
    const leaderBoardSnapshot = await getDocs(query(collection(db, 'leaderBoard'), orderBy('balance', 'desc')));
    const currentLeaderBoard = leaderBoardSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    let updated = false;

    for (const user of users) {
      const existingUser = currentLeaderBoard.find(lbUser => lbUser.id === user.id);

      if (existingUser) {
        if (existingUser.balance !== user.balance) {
          await setDoc(doc(db, 'leaderBoard', user.id), {
            id: user.id,
            username: user.username,
            balance: user.balance,
            fullName: user.fullName || user.username,
          });
          updated = true;
        }
      } else {
        if (currentLeaderBoard.length >= 100) {
          const lowestUser = currentLeaderBoard[currentLeaderBoard.length - 1];
          await deleteDoc(doc(db, 'leaderBoard', lowestUser.id));
        }

        await setDoc(doc(db, 'leaderBoard', user.id), {
          id: user.id,
          username: user.username,
          balance: user.balance,
          fullName: user.fullName || user.username,
        });
        updated = true;
      }
    }


    if (updated) {
        fetchLeaderBoard();
      }
    };
  
    const fetchLeaderBoard = async () => {
      const q = query(collection(db, 'leaderBoard'), orderBy('balance', 'desc'));
      const querySnapshot = await getDocs(q);
      const leaderBoardList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderBoard(leaderBoardList);
    };

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

  return (
<>

<button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={addUsersToLeaderBoard}
      >
        Update LeaderBoard
      </button>

<div className="w-full flex flex-col space-y-3 pt-3">
{leaderBoard
  .sort((a, b) => b.balance - a.balance) // Sort users by balance in descending order
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
                <span className='font-semibold text-[14px]'>{getInitials(user.username)}</span>
              )}
              </div>
            </div>
              <div className="flex h-full flex-1 flex-col justify-center relative">
                <div className='flex w-full flex-col justify-between h-full space-y-[2px]'>
                  <h1 className="text-[14px] text-nowrap line-clamp-1 font-medium">
                  {user.username}
                  </h1>
                  <span className='flex items-center gap-1 flex-1 text-[12px]'>
    
                    <img src='/stars2.svg' alt='dvf' className='w-[10px]'/>
                 
                    <span className='text-[12px] text-nowrap font-medium'>
                      {formatNumber(user.balance)}
                    </span>
                  </span>
                </div>
              </div>
              <div className='w-fit flex items-center justify-end flex-wrap text-[14px] relative px-4'>
             
             
              {index < 5 ? (
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

export default AdminRankings;
