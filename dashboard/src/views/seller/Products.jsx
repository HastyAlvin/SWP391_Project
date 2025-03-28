import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_products, deleteProduct } from '../../store/Reducers/productReducer';
import { LuImageMinus } from "react-icons/lu";

const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state.product);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [parPage, setParPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
  }, [searchValue, currentPage, parPage]);

  useEffect(() => {
    setFilteredProducts([...products]);
  }, [products]);

  const handleSort = () => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    setFilteredProducts(sortedProducts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className='px-4 py-6'>
      <div className='w-full p-5 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Products</h1>
        
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className='px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300'
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className='px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300 w-full md:w-64'
            type='text'
            placeholder='Search products...'
          />
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left text-gray-700'>
            <thead className='text-sm uppercase border-b border-gray-300 bg-gray-100'>
              <tr>
                <th className='py-3 px-4'>No</th>
                <th className='py-3 px-4'>Image</th>
                <th className='py-3 px-4 cursor-pointer' onClick={handleSort}>Name {sortOrder === "asc" ? "▲" : "▼"}</th>
                <th className='py-3 px-4'>Category</th>
                <th className='py-3 px-4'>Brand</th>
                <th className='py-3 px-4'>Price</th>
                <th className='py-3 px-4'>Discount</th>
                <th className='py-3 px-4'>Stock</th>
                <th className='py-3 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((d, i) => (
                <tr key={i} className='border-b border-gray-200'>
                  <td className='py-2 px-4'>{i + 1}</td>
                  <td className='py-2 px-4'>
                    <img className='w-12 h-12 rounded-full' src={d.images[0]} alt='' />
                  </td>
                  <td className='py-2 px-4'>{d.name}</td>
                  <td className='py-2 px-4'>{d.category}</td>
                  <td className='py-2 px-4'>{d.brand}</td>
                  <td className='py-2 px-4'>${d.price}</td>
                  <td className='py-2 px-4'>{d.discount === 0 ? 'No Discount' : `%${d.discount}`}</td>
                  <td className='py-2 px-4'>{d.stock}</td>
                  <td className='py-2 px-4'>
                    <div className='flex space-x-2'>
                      <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-2 bg-yellow-500 text-white rounded hover:shadow-md'>
                        <FaEdit />
                      </Link>
                      <Link to={`/seller/dashboard/add-banner/${d._id}`} className='p-2 bg-blue-500 text-white rounded hover:shadow-md'>
                        <LuImageMinus />
                      </Link>
                      <button className='p-2 bg-red-500 text-white rounded hover:shadow-md' onClick={() => handleDelete(d._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalProduct > parPage && (
          <div className='flex justify-end mt-4'>
            <Pagination pageNumber={currentPage} setPageNumber={setCurrentPage} totalItem={totalProduct} parPage={parPage} showItem={4} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
