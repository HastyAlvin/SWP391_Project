import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { get_banners, delete_banner, messageClear } from '../../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';
import Pagination from '../../Pagination';

const BannerList = () => {
    const dispatch = useDispatch();
    const { banners, successMessage, errorMessage, loader } = useSelector(state => state.banner);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(get_banners());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            dispatch(get_banners()); // Refresh the list after deletion
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    // Filter banners based on search
    const filteredBanners = banners.filter(banner =>
        banner.link.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate pagination
    const startIndex = (currentPage - 1) * parPage;
    const endIndex = startIndex + parPage;
    const currentItems = filteredBanners.slice(startIndex, endIndex);

    const handleDelete = (bannerId) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            dispatch(delete_banner(bannerId));
        }
    };

    return (
        <div className="px-4 py-6">
            <div className="w-full p-5 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Banners</h1>
                    <Link to="/admin/dashboard/banner/add" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
                        Add New Banner
                    </Link>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <select
                            onChange={(e) => setParPage(parseInt(e.target.value))}
                            value={parPage}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>

 
                </div>

                {/* Banners Table */}
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
                                    <th className="px-4 py-3">Banner</th>
                                    <th className="px-4 py-3">Created At</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((banner, index) => (
                                    <tr key={banner._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1 + (currentPage - 1) * parPage}</td>
                                        <td className="px-4 py-3">
                                            <img src={banner.banner} alt="Banner" className="w-32 h-20 object-cover rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(banner.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                <Link to={`/admin/dashboard/banner/edit/${banner._id}`} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filteredBanners.length > parPage && (
                    <div className="flex justify-end mt-6">
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={filteredBanners.length}
                            parPage={parPage}
                            showItem={5}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerList;