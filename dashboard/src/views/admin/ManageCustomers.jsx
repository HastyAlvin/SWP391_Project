import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { get_all_customers, delete_customer, messageClear } from '../../store/Reducers/customerReducer';
import Pagination from '../Pagination';
import toast from 'react-hot-toast';

const ManageCustomers = () => {
  const dispatch = useDispatch();
  const { customers, totalCustomers, successMessage, errorMessage, loader } = useSelector(state => state.customer);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [status, setStatus] = useState('all');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Fetch all customers once
  useEffect(() => {
    dispatch(get_all_customers({ page: 1, searchValue: '', parPage: 1000, status: 'all' }));
  }, [dispatch]);

  // Handle filtering and pagination locally
  useEffect(() => {
    if (customers) {
      let result = [...customers];

      // Apply status filter
      if (status !== 'all') {
        result = result.filter(customer => customer.status === status);
      }

      // Apply search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        result = result.filter(customer =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
        );
      }

      setFilteredCustomers(result);
    }
  }, [customers, searchValue, status]);

  // Get current page items
  const indexOfLastItem = currentPage * parPage;
  const indexOfFirstItem = indexOfLastItem - parPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(delete_customer(customerId));
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Customers</h1>
          <Link to="/admin/dashboard/customer/add" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
            Add New Customer
          </Link>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              onChange={e => setStatus(e.target.value)}
              value={status}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              onChange={e => setParPage(parseInt(e.target.value))}
              value={parPage}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search customers..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>

        {/* Customers Table */}
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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Join Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((customer, index) => (
                    <tr key={customer._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1 + (currentPage - 1) * parPage}</td>
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Link to={`/admin/dashboard/customer/details/${customer._id}`} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <FaEye />
                          </Link>
                          <Link to={`/admin/dashboard/customer/edit/${customer._id}`} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            <FaEdit />
                          </Link>
                          <button onClick={() => handleDelete(customer._id)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center">No customers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > parPage && (
          <div className="flex justify-end mt-6">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={filteredCustomers.length}
              parPage={parPage}
              showItem={5}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;