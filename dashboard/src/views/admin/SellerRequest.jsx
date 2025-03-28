import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_request } from "../../store/Reducers/sellerReducer";

const SellerRequest = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredSellers, setFilteredSellers] = useState([]);

  const { sellers, totalSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_seller_request(obj));
  }, [searchValue, currentPage, parPage]);

  useEffect(() => {
    let filtered = [...sellers];
    if (searchValue) {
      filtered = filtered.filter(seller => 
        seller.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    setFilteredSellers(filtered);
  }, [sellers, searchValue]);

  const handleSort = () => {
    const sortedSellers = [...filteredSellers].sort((a, b) => {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    setFilteredSellers(sortedSellers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Seller Request</h1>
        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300 w-full md:w-64"
            type="text"
            placeholder="Search sellers..."
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-sm uppercase border-b border-gray-300 bg-gray-100">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4 cursor-pointer" onClick={handleSort}>
                  Name {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-2 px-4">{i + 1 + (currentPage - 1) * parPage}</td>
                  <td className="py-2 px-4">{seller.name}</td>
                  <td className="py-2 px-4">{seller.email}</td>
                  <td className="py-2 px-4">{seller.payment}</td>
                  <td className="py-2 px-4">{seller.status}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/dashboard/seller/details/${seller._id}`}
                      className="p-2 bg-green-500 text-white rounded hover:shadow-md flex justify-center items-center w-10 h-10"
                    >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalSeller > parPage && (
          <div className="flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalSeller}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRequest;
