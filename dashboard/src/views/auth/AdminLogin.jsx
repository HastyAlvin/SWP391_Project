import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);

    const [state, setState] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });

    const validate = () => {
        let valid = true;
        let newErrors = { email: "", password: "" };
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!state.email.trim()) {
            newErrors.email = "Email không được để trống!";
            valid = false;
        } else if (!emailRegex.test(state.email)) {
            newErrors.email = "Email không đúng định dạng!";
            valid = false;
        }

        if (!state.password.trim()) {
            newErrors.password = "Mật khẩu không được để trống!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const inputHandle = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const submit = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch(admin_login(state));
        } else {
            toast.error("Vui lòng nhập thông tin hợp lệ!");
        }
    };

    const overrideStyle = {
        display: 'flex',
        margin: '0 auto',
        height: '24px',
        justifyContent: 'center',
        alignItems: 'center'
    };

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/');
        }
    }, [errorMessage, successMessage]);

    return (
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 to-purple-500'>
            <div className='w-[380px] bg-white p-6 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-700 text-center mb-3'>Admin Login</h2>
                <p className='text-gray-500 text-center mb-5'>Sign in to your admin account</p>

                <form onSubmit={submit}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="email" className='text-gray-700 font-medium'>Email</label>
                        <input 
                            onChange={inputHandle} 
                            value={state.email} 
                            className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 outline-none ${errors.email ? 'border-red-500' : ''}`} 
                            type="email" name='email' id='email' placeholder='Enter email' required
                        />
                        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="password" className='text-gray-700 font-medium'>Password</label>
                        <input 
                            onChange={inputHandle} 
                            value={state.password} 
                            className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-300 outline-none ${errors.password ? 'border-red-500' : ''}`} 
                            type="password" name='password' id='password' placeholder='Enter password' required
                        />
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
                    </div>

                    <button disabled={loader} className='bg-indigo-600 w-full text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-300'>
                        {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
