import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { get_category, messageClear } from '../../../store/Reducers/categoryReducer';
import toast from 'react-hot-toast';

const CategoryDetails = () => {
    const dispatch = useDispatch();
    const { categoryId } = useParams();
    const { categorys, successMessage, errorMessage, loader } = useSelector(state => state.category);

    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ''
        }));
    }, [dispatch]);

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

    const category = categorys.find(c => c._id === categoryId);

    if (loader) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">Category not found</div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <div className="w-full p-5 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Category Details</h1>
                    <div className="flex space-x-2">
                        <Link
                            to={`/admin/dashboard/category/edit/${categoryId}`}
                            className="px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                        >
                            <FaEdit /> Edit
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Image */}
                    <div>
                        <h2 className="text-xl font-semibold border-b pb-2">Category Image</h2>
                        <div className="mt-4">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-48 h-48 object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Category Information */}
                    <div>
                        <h2 className="text-xl font-semibold border-b pb-2">Category Information</h2>
                        <div className="mt-4 space-y-4">
                            <div className="flex">
                                <span className="font-medium text-gray-600 w-32">Name:</span>
                                <span className="text-gray-800">{category.name}</span>
                            </div>

                            <div className="flex">
                                <span className="font-medium text-gray-600 w-32">Created:</span>
                                <span className="text-gray-800">
                                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-between">
                    <Link
                        to="/admin/dashboard/category"
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;