import React, { useEffect, useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { get_admin_orders } from "../../store/reducers/orderReducer";

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
  }, [searchValue, currentPage, parPage]);

  return (
    <div className="px-4 lg:px-8 py-5">
      <div className="w-full p-6 bg-white shadow-md rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <select
            onChange={(e) => setParPage(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-indigo-400"
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto">
          <div className="w-full text-sm text-gray-700">
            {/* Table Header */}
            <div className="uppercase font-semibold border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div className="py-3 w-[25%]">Order ID</div>
                <div className="py-3 w-[13%]">Price</div>
                <div className="py-3 w-[18%]">Payment Status</div>
                <div className="py-3 w-[18%]">Order Status</div>
                <div className="py-3 w-[18%]">Action</div>
                <div className="py-3 w-[8%]">
                  <LuArrowDown />
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {myOrders.map((o) => (
              <div key={o._id} className="text-gray-700">
                <div className="flex justify-between items-start border-b border-gray-300">
                  <div className="py-3 w-[25%] font-medium whitespace-nowrap">
                    #{o._id}
                  </div>
                  <div className="py-3 w-[13%] font-medium">${o.price}</div>
                  <div className="py-3 w-[18%] font-medium">
                    {o.payment_status}
                  </div>
                  <div className="py-3 w-[18%] font-medium">
                    {o.delivery_status}
                  </div>
                  <div className="py-3 w-[18%] font-medium">
                    <Link
                      to={`/admin/dashboard/order/details/${o._id}`}
                      className="text-indigo-500 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                  <div
                    onClick={() => setShow(o._id === show ? false : o._id)}
                    className="py-3 w-[8%] cursor-pointer transition-transform"
                  >
                    <LuArrowDown
                      className={`transform ${
                        show === o._id ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Suborders */}
                <div
                  className={`transition-all ${
                    show === o._id
                      ? "block border-b border-gray-300 bg-gray-100"
                      : "hidden"
                  }`}
                >
                  {o.suborder.map((so) => (
                    <div
                      key={so._id}
                      className="flex justify-start items-start border-b border-gray-300"
                    >
                      <div className="py-3 w-[25%] font-medium pl-3">
                        #{so._id}
                      </div>
                      <div className="py-3 w-[13%] font-medium">${so.price}</div>
                      <div className="py-3 w-[18%] font-medium">
                        {so.payment_status}
                      </div>
                      <div className="py-3 w-[18%] font-medium">
                        {so.delivery_status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalOrder > parPage && (
          <div className="w-full flex justify-end mt-4">
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
