import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { admin_login, messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth)

    const [state, setState] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({ email: "", password: "" });

    const validate = () => {
        let valid = true;
        let newErrors = { email: "", password: "" };

        // Kiểm tra email hợp lệ
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!state.email.trim()) {
            newErrors.email = "Email không được để trống!";
            valid = false;
        } else if (!emailRegex.test(state.email)) {
            newErrors.email = "Email không đúng định dạng!";
            valid = false;
        } else if (state.email.includes(" ")) {
            newErrors.email = "Email không được chứa dấu cách!";
            valid = false;
        }

        // Kiểm tra password hợp lệ
        if (!state.password.trim()) {
            newErrors.password = "Mật khẩu không được để trống!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });

        // Xóa lỗi khi người dùng nhập lại
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
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')
        }
    }, [errorMessage, successMessage])

    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center' >
            <div className='w-[350px] text-[#ffffff] p-2'>
                <div className='bg-[#6f68d1] p-4 rounded-md'>

                    <div className='h-[70px] flex justify-center items-center'>
                        <div className='w-[180px] h-[50px]'>
                            <h1 className="text-2xl text-white font-bold">SPORTY ZONE</h1>
                        </div>
                    </div>

                    <form onSubmit={submit}>

                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="email">Email</label>
                            <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="email" name='email' placeholder='Email' id='email' required />

                        </div>

                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor="password">Password</label>
                            <input onChange={inputHandle} value={state.password} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="password" name='password' placeholder='Password' id='password' required />
                        </div>


                        <button disabled={loader ? true : false} className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                            {
                                loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Login'
                            }
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default AdminLogin;