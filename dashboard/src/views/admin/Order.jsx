import React, { useEffect, useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_admin_orders } from "../../store/Reducers/OrderReducer";

const Order = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);

  const { myOrders, totalOrder } = useSelector((state) => state.order);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_admin_orders(obj));
  }, [searchValue, currentPage, parPage, dispatch]);

  return (
    <div className="px-4 py-6">
      <div className="w-full p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
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

          <input
            type="text"
            placeholder="Search orders..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((o) => (
                <React.Fragment key={o._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{o._id}</td>
                    <td className="px-4 py-3">{o.shippingInfo.name}</td>
                    <td className="px-4 py-3">{o.date}</td>
                    <td className="px-4 py-3">${o.price}</td>
                    <td className="px-4 py-3">{o.payment_status}</td>
                    <td className="px-4 py-3">{o.delivery_status}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/dashboard/order/details/${o._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setShow(o._id === show ? false : o._id)}
                        className="transform transition-transform"
                      >
                        <LuArrowDown
                          className={show === o._id ? "rotate-180" : "rotate-0"}
                        />
                      </button>
                    </td>
                  </tr>
                  {show === o._id && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50">
                        <div className="px-4 py-4">
                          {/* Shipping Information */}
                          <div className="mb-4">
                            <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p><span className="font-medium">Name:</span> {o.shippingInfo.name}</p>
                                <p><span className="font-medium">Phone:</span> {o.shippingInfo.phone}</p>
                                <p><span className="font-medium">Address:</span> {o.shippingInfo.address}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">City:</span> {o.shippingInfo.city}</p>
                                <p><span className="font-medium">Province:</span> {o.shippingInfo.province}</p>
                                <p><span className="font-medium">Post Code:</span> {o.shippingInfo.post}</p>
                              </div>
                            </div>
                          </div>

                          {/* Products Information */}
                          <div className="mb-4">
                            <h3 className="font-semibold text-lg mb-2">Products</h3>
                            <div className="space-y-3">
                              {o.products.map((p) => (
                                <div key={p._id} className="flex items-center gap-4 border-b pb-3">
                                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded" />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{p.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {p.quantity} × ${p.price}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Shop: {p.shopName}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${p.price * p.quantity}</p>
                                    <p className="text-sm text-gray-600">
                                      Discount: {p.discount}%
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Suborders */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Suborders</h3>
                            <div className="bg-white rounded border">
                              {o.suborder.map((so) => (
                                <div key={so._id} className="p-3 border-b last:border-0">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">#{so._id}</span>
                                    <span className="text-sm text-gray-600">{so.date}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p><span className="font-medium">Price:</span> ${so.price}</p>
                                      <p><span className="font-medium">Status:</span> {so.delivery_status}</p>
                                    </div>
                                    <div>
                                      <p><span className="font-medium">Payment:</span> {so.payment_status}</p>
                                      <p><span className="font-medium">Shipping:</span> {so.shippingInfo}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalOrder > parPage && (
          <div className="flex justify-end mt-6">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
