import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { get_customer_details, update_customer, messageClear } from '../../store/Reducers/customerReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const EditCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { loader, successMessage, errorMessage, customer } = useSelector(state => state.customer);

  const [state, setState] = useState({
    name: '',
    email: '',
    method: 'manual'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (customerId) {
      dispatch(get_customer_details(customerId));
    }
  }, [dispatch, customerId]);

  useEffect(() => {
    if (customer) {
      setState({
        name: customer.name || '',
        email: customer.email || '',
        method: customer.method || 'manual'
      });
    }
  }, [customer]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  // Simple validation
  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '' };

    if (!state.name.trim()) {
      newErrors.name = 'Tên khách hàng là bắt buộc';
      isValid = false;
    }

    if (!state.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(update_customer({ customerId, customerData: state }));
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate(`/admin/dashboard/customer/details/${customerId}`);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate, customerId]);

  if (loader && !customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cập nhật thông tin khách hàng</h1>
        </div>

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={state.name}
                onChange={inputHandle}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Nhập tên khách hàng"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={state.email}
                onChange={inputHandle}
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="example@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/admin/dashboard/customer/details/${customerId}`)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loader}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center justify-center min-w-[100px]"
              >
                {loader ? <PropagateLoader color="#fff" size={10} /> : 'Cập nhật'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;