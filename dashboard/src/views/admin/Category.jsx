import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_category, deleteCategory, messageClear } from '../../store/Reducers/categoryReducer';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';

const Category = () => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage, categorys, totalCategory } = useSelector(state => state.category);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(get_category({
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }));
    }, [searchValue, currentPage, parPage, dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            // Refresh category list after successful operation
            dispatch(get_category({
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            }));
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch, currentPage, parPage, searchValue]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="px-4 py-6">
            <div className="w-full p-5 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <Link to="/admin/dashboard/category/add" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                        Add New Category
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <select
                        onChange={(e) => {
                            setParPage(parseInt(e.target.value));
                            setCurrentPage(1); // Reset to first page when changing items per page
                        }}
                        value={parPage}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                </div>

                {/* Categories Table */}
                {loader ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs uppercase bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3">No.</th>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorys && categorys.length > 0 ? (
                                    categorys.map((category, index) => (
                                        <tr key={category._id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{index + 1 + (currentPage - 1) * parPage}</td>
                                            <td className="px-4 py-3">
                                                <img className="w-12 h-12 rounded-lg object-cover" src={category.image} alt={category.name} />
                                            </td>
                                            <td className="px-4 py-3 font-medium">{category.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <Link to={`/admin/dashboard/category/details/${category._id}`} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                                        <FaEye />
                                                    </Link>
                                                    <Link to={`/admin/dashboard/category/edit/${category._id}`} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category._id)}
                                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-3 text-center">No categories found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {categorys && categorys.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={totalCategory}
                            parPage={parPage}
                            showItem={5}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;