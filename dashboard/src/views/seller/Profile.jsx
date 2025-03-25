import React, { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader } from 'react-spinners';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload, messageClear, profile_info_add, profile_info_update } from '../../store/Reducers/authReducer'
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {

    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    })

    const dispatch = useDispatch()
    const { userInfo, loader, successMessage } = useSelector(state => state.auth)


    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage)
            messageClear()
        }
    }, [successMessage])

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            dispatch(profile_image_upload(formData))
        }

    }
    useEffect(() => {
        if (userInfo?.shopInfo) {
            setState(userInfo.shopInfo); // Cập nhật state với dữ liệu từ DB
        }
    }, [userInfo]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setEditMode(false); // Ẩn form sau khi update thành công
        }
    }, [successMessage]);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        if (userInfo?.shopInfo) {
            setState({
                division: userInfo.shopInfo.division || '',
                district: userInfo.shopInfo.district || '',
                shopName: userInfo.shopInfo.shopName || '',
                sub_district: userInfo.shopInfo.sub_district || ''
            });
        }
    }, [userInfo]);

    const [editMode, setEditMode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInfo?.shopInfo) {
            dispatch(profile_info_update(state)); // Nếu đã có shopInfo → Update
        } else {
            dispatch(profile_info_add(state)); // Nếu chưa có → Add
        }
    };
    return (
        <div className="px-4 lg:px-7 py-5  min-h-screen flex justify-center">
            <div className="w-full max-w flex flex-wrap">
                {/* Left Section */}
                <div className="w-full md:w-6/12">
                    <div className="w-full p-5 bg-white rounded-md shadow-md">
                        <div className="flex justify-center py-3">
                            {userInfo?.image ? (
                                <label htmlFor="img" className="relative cursor-pointer">
                                    <img
                                        src={userInfo.image}
                                        className="w-40 h-40 rounded-full border border-gray-300 shadow-sm object-cover"
                                        alt="Profile"
                                    />
                                    {loader && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-600 opacity-50 rounded-full">
                                            <FadeLoader />
                                        </div>
                                    )}
                                </label>
                            ) : (
                                <label
                                    className="flex justify-center items-center flex-col w-40 h-40 cursor-pointer border border-dashed border-gray-400 hover:border-red-500 rounded-md"
                                    htmlFor="img"
                                >
                                    <FaImages className="text-gray-500 text-2xl" />
                                    <span className="text-gray-600">Select Image</span>
                                </label>
                            )}
                            <input onChange={add_image} type="file" className="hidden" id="img" />
                        </div>

                        {/* User Info */}
                        <div className="p-4 bg-gray-50 rounded-md shadow-sm relative">
                            {/* <span
                                onClick={() => setEditMode(true)}
                                className="p-2 bg-yellow-500 text-white rounded-full hover:shadow-md absolute right-3 top-3 cursor-pointer"
                            >
                                <FaRegEdit />
                            </span> */}
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Name:</span>
                                <span>{userInfo.name}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Email:</span>
                                <span>{userInfo.email}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Role:</span>
                                <span>{userInfo.role}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Status:</span>
                                <span>{userInfo.status}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Payment Account:</span>
                                <span
                                    className={`px-2 py-1 text-white text-xs rounded ${userInfo.payment === "active" ? "bg-green-500" : "bg-blue-500 cursor-pointer"
                                        }`}
                                    onClick={() => {
                                        if (userInfo.payment !== "active") dispatch(create_stripe_connect_account());
                                    }}
                                >
                                    {userInfo.payment === "active" ? userInfo.payment : "Activate"}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-md shadow-sm relative mt-5">
                            <span
                                onClick={() => setEditMode(true)}
                                className="p-2 bg-yellow-500 text-white rounded-full hover:shadow-md absolute right-3 top-3 cursor-pointer"
                            >
                                <FaRegEdit />
                            </span>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Shop Name:</span>
                                <span>{userInfo?.shopInfo?.shopName || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Division:</span>
                                <span>{userInfo?.shopInfo?.division || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">District:</span>
                                <span>{userInfo?.shopInfo?.district || 'N/A'}</span>
                            </div>
                            <div className="flex gap-2 text-gray-700">
                                <span className="font-semibold">Sub District:</span>
                                <span>{userInfo?.shopInfo?.sub_district || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Edit Form */}
                        {editMode && (
                            <form onSubmit={handleSubmit} className="mt-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {["shopName", "division", "district", "sub_district"].map((field) => (
                                        <div key={field} className="flex flex-col">
                                            <label className="text-gray-700 font-medium capitalize">{field.replace("_", " ")}</label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={state[field]}
                                                onChange={inputHandle}
                                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 bg-white text-gray-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={loader}
                                    className="mt-4 w-full md:w-48 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-7 py-2 transition duration-200 shadow-md"
                                >
                                    {loader ? <PropagateLoader color="#fff" /> : "Save Changes"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Section - Change Password */}
                <div className="w-full md:w-6/12 mt-6 md:mt-0">
                    <div className="w-full pl-0 md:pl-7">
                        <div className="bg-white rounded-md shadow-md p-5">
                            <h1 className="text-gray-800 text-lg mb-3 font-semibold">Change Password</h1>
                            <form>
                                {["email", "old_password", "new_password"].map((field, index) => (
                                    <div key={index} className="flex flex-col w-full gap-1 mb-2">
                                        <label htmlFor={field} className="text-gray-700 capitalize">
                                            {field.replace("_", " ")}
                                        </label>
                                        <input
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 bg-white text-gray-700"
                                            type={field.includes("password") ? "password" : "email"}
                                            name={field}
                                            id={field}
                                            placeholder={field.replace("_", " ")}
                                        />
                                    </div>
                                ))}
                                <button className="bg-red-500 hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2 my-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Profile;