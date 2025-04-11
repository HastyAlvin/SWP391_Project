import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login, messageClear } from '../../store/Reducers/authReducer';
import ForgotPassword from "./ForgotPassword.jsx";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage, role } = useSelector(state => state.auth);
    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

    const showForgotPasswordModal = () => {
        setForgotPasswordVisible(true);
    };

    const hideForgotPasswordModal = () => {
        setForgotPasswordVisible(false);
    };

    const [state, setState] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!state.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            tempErrors.email = "Invalid email format";
        }
        if (state.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const inputHandle = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch(seller_login(state));
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/seller/dashboard');
            }
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-500'>
            <div className='w-[380px] bg-white p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-700 text-center mb-3'>Welcome Back</h2>
                <p className='text-gray-500 text-center mb-5'>Sign in to your seller account</p>

                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="email" className='text-gray-700 font-medium'>Email</label>
                        <input
                            onChange={inputHandle}
                            value={state.email}
                            className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 outline-none'
                            type="email" name='email' id='email' placeholder='Enter email' required
                        />
                        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="password" className='text-gray-700 font-medium'>Password</label>
                        <input
                            onChange={inputHandle}
                            value={state.password}
                            className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 outline-none'
                            type="password" name='password' id='password' placeholder='Enter password' required
                        />
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
                    </div>

                    <button disabled={loader} className='bg-indigo-600 w-full text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-300'>
                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign In'}
                    </button>
                </form>
                <div className='text-center mt-4 '>
                    <p onClick={showForgotPasswordModal} style={{cursor:'pointer'}} className='text-gray-600 group-hover:text-blue-500'>Remember password or not?</p>
                </div>
                <div className='text-center mt-4'>
                    <p className='text-gray-600'>Don't have an account? <Link to="/register" className='text-indigo-600 font-medium'>Sign Up</Link></p>
                </div>
            </div>
            <ForgotPassword
                visible={forgotPasswordVisible}
                onCancel={hideForgotPasswordModal}
            />
        </div>
    );
};

export default Login;
