import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import logo from '../assets/logo.png'; // Đảm bảo có ảnh logo

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [allNav, setAllNav] = useState([]);
    useEffect(() => {
        setAllNav(getNav(role));
    }, [role]);

    return (
        <>
            {/* Overlay khi mở Sidebar */}
            <div
                onClick={() => setShowSidebar(false)}
                className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="h-20 flex flex-col justify-center items-center border-b border-gray-200">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                    >
                        <span className="text-white animate-spin text-3xl">⚽</span>
                        SPORTY ZONE
                    </Link>
                </div>

                {/* Menu */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {allNav.map((n, i) => (
                            <li key={i}>
                                <Link
                                    to={n.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === n.path
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{n.icon}</span>
                                    <span>{n.title}</span>
                                </Link>
                            </li>
                        ))}

                        {/* Logout */}
                        <li>
                            <button
                                onClick={() => dispatch(logout({ navigate, role })).then(() => window.location.reload())}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 w-full"
                            >
                                <BiLogOutCircle className="text-xl" />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
