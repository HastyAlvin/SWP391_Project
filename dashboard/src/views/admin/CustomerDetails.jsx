import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { get_customer_details, messageClear } from '../../store/Reducers/customerReducer';
import toast from 'react-hot-toast';

const CustomerDetails = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { customer, successMessage, errorMessage, loader } = useSelector(state => state.customer);

  useEffect(() => {
    dispatch(get_customer_details(customerId));
  }, [dispatch, customerId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Customer information not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/admin/dashboard/customer/edit/${customerId}`}
              className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            >
              <FaEdit /> Edit
            </Link>
          </div>
        </div>

        {/* Customer Profile */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Customer Information */}
          <div className="w-full">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex">
                  <span className="font-medium text-gray-600 w-32">Name:</span>
                  <span className="text-gray-800">{customer.name}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-600 w-32">Email:</span>
                  <span className="text-gray-800">{customer.email}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-600 w-32">Registered:</span>
                  <span className="text-gray-800">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Orders Summary */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold border-b pb-2">Order Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">Total Orders</h3>
                  <p className="text-2xl font-bold">{customer.totalOrders || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800">Completed</h3>
                  <p className="text-2xl font-bold">{customer.completedOrders || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800">Processing</h3>
                  <p className="text-2xl font-bold">{customer.pendingOrders || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Link
            to="/admin/dashboard/manage-customers"
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;