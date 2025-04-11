import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders } from '../../store/reducers/orderReducer';

const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, totalOrder } = useSelector(state => state.order);
  const { userInfo } = useSelector(state => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      sellerId: userInfo._id
    };
    dispatch(get_seller_orders(obj));
  }, [searchValue, currentPage, parPage]);

  return (
    <div className='px-4 py-6'>
      <div className='w-full p-5 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Orders</h1>
        
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className='px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300'
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className='px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300 w-full md:w-64'
            type='text'
            placeholder='Search orders...'
          />
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left text-gray-700'>
            <thead className='text-sm uppercase border-b border-gray-300 bg-gray-100'>
              <tr>
                <th className='py-3 px-4'>Order Id</th>
                <th className='py-3 px-4'>Price</th>
                <th className='py-3 px-4'>Payment Status</th>
                <th className='py-3 px-4'>Order Status</th>
                <th className='py-3 px-4'>Date</th>
                <th className='py-3 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((d, i) => (
                <tr key={i} className='border-b border-gray-200'>
                  <td className='py-2 px-4 font-medium'>#{d._id}</td>
                  <td className='py-2 px-4'>${d.price}</td>
                  <td className='py-2 px-4'>{d.payment_status}</td>
                  <td className='py-2 px-4'>{d.delivery_status}</td>
                  <td className='py-2 px-4'>{d.date}</td>
                  <td className='py-2 px-4'>
                    <div className='flex space-x-2'>
                      <Link to={`/seller/dashboard/order/details/${d._id}`} className='p-2 bg-green-500 text-white rounded hover:shadow-md'>
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalOrder > parPage && (
          <div className='flex justify-end mt-4'>
            <Pagination 
              pageNumber={currentPage} 
              setPageNumber={setCurrentPage} 
              totalItem={totalOrder} 
              parPage={parPage} 
              showItem={4} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;