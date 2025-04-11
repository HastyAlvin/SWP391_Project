import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaEdit, FaLock } from 'react-icons/fa';
import { get_seller_details, messageClear } from '../../store/Reducers/adminReducer';
import toast from 'react-hot-toast';

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const { seller, successMessage, errorMessage, loader } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(get_seller_details(sellerId));
  }, [dispatch, sellerId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Seller information not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Seller Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/admin/dashboard/seller/edit/${sellerId}`}
              className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            >
              <FaEdit /> Edit
            </Link>
            <Link
              to={`/admin/dashboard/seller/change-password/${sellerId}`}
              className="px-4 py-2 flex items-center gap-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
            >
              <FaLock /> Change Password
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-gray-200 flex justify-center items-center">
              {seller.image ? (
                <img src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400">{seller.name[0].toUpperCase()}</span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{seller.name}</h2>
            <div className="mt-2 flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${seller.status === 'active' ? 'bg-green-100 text-green-800' :
                seller.status === 'deactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                {seller.status === 'active' ? 'Active' :
                  seller.status === 'deactive' ? 'Deactivated' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Email:</span>
                <span className="text-gray-800">{seller.email}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Role:</span>
                <span className="text-gray-800">{seller.role || 'Seller'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Method:</span>
                <span className="text-gray-800">{seller.method || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Payment:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${seller.payment === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {seller.payment === 'active' ? 'Activated' : 'Not Activated'}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Created At:</span>
                <span className="text-gray-800">
                  {seller.createdAt ? new Date(seller.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Shop Information</h2>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Shop Name:</span>
                <span className="text-gray-800">{seller.shopInfo?.shopName || 'Not set'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Province/City:</span>
                <span className="text-gray-800">{seller.shopInfo?.division || 'Not set'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">District:</span>
                <span className="text-gray-800">{seller.shopInfo?.district || 'Not set'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Ward/Commune:</span>
                <span className="text-gray-800">{seller.shopInfo?.sub_district || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Link
            to="/admin/dashboard/manage-sellers"
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;