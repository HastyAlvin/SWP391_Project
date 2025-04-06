import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { get_all_sellers, delete_seller, messageClear } from '../../store/Reducers/adminReducer';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';

const ManageSellers = () => {
  const dispatch = useDispatch();
  const { sellers, totalSellers, successMessage, errorMessage, loader } = useSelector(state => state.admin);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(10);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const obj = {
      page: currentPage,
      searchValue,
      parPage: parseInt(parPage),
      status
    };
    dispatch(get_all_sellers(obj));
  }, [dispatch, currentPage, searchValue, parPage, status]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // Refresh data after successful operation
      const obj = {
        page: currentPage,
        searchValue,
        parPage: parseInt(parPage),
        status
      };
      dispatch(get_all_sellers(obj));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleDeleteSeller = (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      dispatch(delete_seller(sellerId));
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Seller Management</h1>
          <Link to="/admin/dashboard/seller/add" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
            Add New Seller
          </Link>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              onChange={e => setStatus(e.target.value)}
              value={status}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactive">Deactivated</option>
              <option value="pending">Pending</option>
            </select>

            <select
              onChange={e => setParPage(parseInt(e.target.value))}
              value={parPage}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search sellers..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>

        {/* Sellers Table */}
        {loader ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Shop Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers && sellers.length > 0 ? (
                  sellers.map((seller, index) => (
                    <tr key={seller._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1 + (currentPage - 1) * parPage}</td>
                      <td className="px-4 py-3">
                        {seller.image ? (
                          <img src={seller.image} alt={seller.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
                            <span className="text-gray-500">{seller.name[0].toUpperCase()}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{seller.name}</td>
                      <td className="px-4 py-3">{seller.email}</td>
                      <td className="px-4 py-3">{seller.shopInfo?.shopName || 'Not set'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.status === 'active' ? 'bg-green-100 text-green-800' :
                          seller.status === 'deactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {seller.status === 'active' ? 'Active' :
                            seller.status === 'deactive' ? 'Deactivated' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.payment === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {seller.payment === 'active' ? 'Activated' : 'Not Activated'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Link to={`/admin/dashboard/seller/details/${seller._id}`} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <FaEye />
                          </Link>
                          <Link to={`/admin/dashboard/seller/edit/${seller._id}`} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            <FaEdit />
                          </Link>
                          <button onClick={() => handleDeleteSeller(seller._id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            <FaTrash />
                          </button>
                          <Link to={`/admin/dashboard/seller/change-password/${seller._id}`} className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                            <FaLock />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-3 text-center">No sellers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalSellers > parPage && (
          <div className="flex justify-end mt-6">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalSellers}
              parPage={parPage}
              showItem={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSellers;