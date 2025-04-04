import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {

  const { userInfo } = useSelector(state => state.auth)

  return (
    <div className='fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40'>
      <div className='ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-[#b1addf] px-5 transition-all'>

        <div onClick={() => setShowSidebar(!showSidebar)} className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer ' >
          <span><FaList /></span>
        </div>
        <div className='hidden md:block'>
          <input
            className='w-[250px] px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 
               transition-all duration-300 shadow-sm placeholder-gray-400'
            type="text"
            name='search'
            placeholder='🔍 Search...'
          />
        </div>


        <div className='flex justify-center items-center gap-8 relative'>
          <div className='flex justify-center items-center'>
            <div className='flex justify-center items-center gap-3'>
              <div className='flex justify-center items-center flex-col text-end'>
                <h2 className='text-md font-bold'>{userInfo.name}</h2>
                <span className='text-[14px] w-full font-normal'>{userInfo.role}</span>
              </div>

              {
                userInfo.role === 'admin' ? <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src="https://res.cloudinary.com/dglcab81p/image/upload/f_auto,q_auto/txstmr55xkjuerhouyck" alt="" /> : <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src={userInfo.image} alt="" />
              }


            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default Header;