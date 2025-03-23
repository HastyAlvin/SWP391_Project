import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const inputHandle = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });

        if (name === "email") {
            setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email format!" });
        }

        if (name === "password") {
            setErrors({ ...errors, password: validatePassword(value) ? "" : "Password must be at least 6 characters!" });
        }
    };

    const submit = (e) => {
        e.preventDefault();

        if (!validateEmail(state.email)) {
            setErrors({ ...errors, email: "Invalid email format!" });
            return;
        }

        if (!validatePassword(state.password)) {
            setErrors({ ...errors, password: "Password must be at least 6 characters!" });
            return;
        }

        dispatch(seller_register(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-500'>
            <div className='w-[380px] bg-white p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-700 text-center mb-3'>Create Your Account</h2>
                <p className='text-gray-500 text-center mb-5'>Sign up to become a seller</p>

                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="name" className='text-gray-700 font-medium'>Name</label>
                        <input 
                            onChange={inputHandle} 
                            value={state.name} 
                            className='px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 outline-none' 
                            type="text" name='name' id='name' placeholder='Enter your name' required
                        />
                    </div>

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
                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign Up'}
                    </button>
                </form>

                <div className='text-center mt-4'>
                    <p className='text-gray-600'>Already have an account? <Link to="/login" className='text-indigo-600 font-medium'>Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
