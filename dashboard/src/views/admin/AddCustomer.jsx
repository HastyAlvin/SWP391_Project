import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { add_customer, messageClear } from '../../store/Reducers/customerReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector(state => state.customer);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    method: 'manual'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  // Simple validation
  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!state.name.trim()) {
      newErrors.name = 'Customer name is required';
      isValid = false;
    }

    if (!state.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!state.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (state.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(add_customer(state));
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/admin/dashboard/manage-customers');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
        </div>

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={state.name}
                onChange={inputHandle}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter customer name"
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={state.password}
                onChange={inputHandle}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard/manage-customers')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loader}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px]"
              >
                {loader ? <PropagateLoader color="#fff" size={10} /> : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;