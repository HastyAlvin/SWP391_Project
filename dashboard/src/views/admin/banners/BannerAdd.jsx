import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegImage } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import { add_banner, messageClear } from '../../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';

const BannerAdd = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.banner);

    const [state] = useState({
        productId: '67e8cb6969b5865dfe00c829',
        link: '67e8cb6969b5865dfe00c829'
    });
    const [imageShow, setImageShow] = useState('');
    const [image, setImage] = useState('');

    const imageHandle = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setImage(files[0]);
            setImageShow(URL.createObjectURL(files[0]));
        }
    };

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productId', state.productId);
        formData.append('link', state.link);
        formData.append('mainban', image);
        dispatch(add_banner(formData));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/admin/dashboard/banners');
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
                    <h1 className="text-2xl font-bold text-gray-800">Add New Banner</h1>
                </div>

                <form onSubmit={add} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl text-gray-400 mb-2"><FaRegImage /></span>
                                    <span>Upload Banner Image</span>
                                </div>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={imageHandle}
                                    className="hidden"
                                    required
                                />
                                <label
                                    htmlFor="image"
                                    className="cursor-pointer py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                >
                                    Select Image
                                </label>
                            </div>
                        </div>
                        {imageShow && (
                            <div className="mt-4">
                                <img src={imageShow} alt="Preview" className="w-full h-72 object-cover rounded-md" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard/banners')}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loader}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px]"
                        >
                            {loader ? <PropagateLoader color="#fff" size={10} /> : 'Add Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerAdd;