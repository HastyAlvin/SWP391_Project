import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { categoryAdd, messageClear } from '../../../store/Reducers/categoryReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const CategoryAdd = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loader, successMessage, errorMessage } = useSelector(state => state.category);

    const [state, setState] = useState({
        name: ''
    });
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const imageHandle = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const add = (e) => {
        e.preventDefault();
        if (!state.name) {
            toast.error('Category name is required');
            return;
        }
        if (!image) {
            toast.error('Category image is required');
            return;
        }

        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('image', image);

        dispatch(categoryAdd(formData));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            navigate('/admin/dashboard/category');
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
                    <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
                </div>

                <form onSubmit={add}>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                name="name"
                                value={state.name}
                                onChange={(e) => setState({ ...state, name: e.target.value })}
                                placeholder="Enter category name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                            <input
                                type="file"
                                onChange={imageHandle}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-400"
                                accept="image/*"
                            />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard/category')}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loader}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center justify-center min-w-[100px]"
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

export default CategoryAdd;