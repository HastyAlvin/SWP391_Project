import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { get_category, updateCategory, messageClear } from '../../../store/Reducers/categoryReducer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';

const CategoryEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category);

    const [state, setState] = useState({
        name: '',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (categoryId) {
            dispatch(get_category({
                searchValue: '',
                parPage: '',
                page: ''
            }));
        }
    }, [categoryId, dispatch]);

    useEffect(() => {
        if (categorys.length > 0) {
            const category = categorys.find(c => c._id === categoryId);
            if (category) {
                setState({
                    name: category.name,
                    image: category.image
                });
                setImagePreview(category.image);
            }
        }
    }, [categorys, categoryId]);

    const imageHandle = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const update = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', state.name);
        if (image) {
            formData.append('image', image);
        }
        dispatch(updateCategory({
            id: categoryId,
            name: state.name,
            image: image
        }));
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
                    <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
                </div>

                <form onSubmit={update}>
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
                                className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center justify-center min-w-[100px]"
                            >
                                {loader ? <PropagateLoader color="#fff" size={10} /> : 'Update'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryEdit;