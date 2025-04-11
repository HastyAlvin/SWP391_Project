import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { get_seller_details, change_seller_password, messageClear } from '../../store/Reducers/adminReducer';
import toast from 'react-hot-toast';

const ChangeSellerPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const { seller, loader, successMessage, errorMessage } = useSelector(state => state.admin);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sellerId) {
      dispatch(get_seller_details(sellerId));
    }
  }, [dispatch, sellerId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError('Please enter new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    dispatch(change_seller_password({
      sellerId,
      newPassword
    }));
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
  }, [successMessage, errorMessage, dispatch, navigate, sellerId]);

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h1>

        {loader && !seller ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {seller && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-700">Seller: {seller.name}</h2>
                <p className="text-gray-600">Email: {seller.email}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="Re-enter new password"
                />
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
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
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeSellerPassword;