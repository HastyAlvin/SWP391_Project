import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { get_seller_details, update_seller, messageClear } from '../../store/Reducers/adminReducer';
import toast from 'react-hot-toast';

const EditSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const { seller, loader, successMessage, errorMessage } = useSelector(state => state.admin);

  const [state, setState] = useState({
    name: '',
    email: '',
    status: '',
    payment: '',
    shopName: '',
    division: '',
    district: '',
    sub_district: ''
  });

  useEffect(() => {
    if (sellerId) {
      dispatch(get_seller_details(sellerId));
    }
  }, [dispatch, sellerId]);

  useEffect(() => {
    if (seller) {
      setState({
        name: seller.name || '',
        email: seller.email || '',
        status: seller.status || '',
        payment: seller.payment || '',
        shopName: seller.shopInfo?.shopName || '',
        division: seller.shopInfo?.division || '',
        district: seller.shopInfo?.district || '',
        sub_district: seller.shopInfo?.sub_district || ''
      });
    }
  }, [seller]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      status,
      payment,
      shopName,
      division,
      district,
      sub_district
    } = state;

    const updatedData = {
      name,
      email,
      status,
      payment,
      shopName,
      division,
      district,
      sub_district
    };

    dispatch(update_seller({ sellerId, sellerData: updatedData }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate(`/admin/dashboard/seller/details/${sellerId}`);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Seller Information</h1>

        {loader ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={state.name}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={state.email}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={state.status}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  >
                    <option value="">-- Select Status --</option>
                    <option value="active">Active</option>
                    <option value="deactive">Deactivated</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    name="payment"
                    value={state.payment}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  >
                    <option value="">-- Select Payment Status --</option>
                    <option value="active">Activated</option>
                    <option value="inactive">Not Activated</option>
                  </select>
                </div>
              </div>

              {/* Shop Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-700">Shop Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={state.shopName}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province/City</label>
                  <input
                    type="text"
                    name="division"
                    value={state.division}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={state.district}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward/Commune</label>
                  <input
                    type="text"
                    name="sub_district"
                    value={state.sub_district}
                    onChange={inputHandle}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/admin/dashboard/seller/details/${sellerId}`)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loader}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-70"
              >
                {loader ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-4 border-white border-t-transparent mr-2"></span>
                    Processing...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSeller;