import React, { useEffect } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { totalSale, totalOrder, totalProduct, totalSeller, recentOrder } = useSelector(state => state.dashboard);

    useEffect(() => {
        dispatch(get_seller_dashboard_data());
    }, [dispatch]);

    return (
        <div className='px-2 md:px-7 py-5'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                <DashboardCard title='Total Sales' value={`$${totalSale}`} icon={<MdCurrencyExchange />} bgColor='bg-[#fae8e8]' iconBg='bg-[#fa0305]' />
                <DashboardCard title='Products' value={totalProduct} icon={<MdProductionQuantityLimits />} bgColor='bg-[#fde2ff]' iconBg='bg-[#760077]' />
                <DashboardCard title='Sellers' value={totalSeller} icon={<FaUsers />} bgColor='bg-[#e9feea]' iconBg='bg-[#038000]' />
                <DashboardCard title='Orders' value={totalOrder} icon={<FaCartShopping />} bgColor='bg-[#ecebff]' iconBg='bg-[#0200f8]' />
            </div>

            {/* Recent Orders Table */}
            <div className='w-full p-4 bg-[#FFFFFF] rounded-md mt-6'>
                <h2 className='font-semibold text-lg text-[#000000] pb-3'>Recent Orders</h2>
                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#000000]'>
                        <thead className='text-sm text-[#000000] uppercase border-b border-slate-700'>
                            <tr>
                                <th className='py-3 px-4'>Order ID</th>
                                <th className='py-3 px-4'>Price</th>
                                <th className='py-3 px-4'>Payment Status</th>
                                <th className='py-3 px-4'>Order Status</th>
                                <th className='py-3 px-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrder.map((order, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4'>#{order._id}</td>
                                    <td className='py-3 px-4'>${order.price}</td>
                                    <td className='py-3 px-4'>{order.payment_status}</td>
                                    <td className='py-3 px-4'>{order.delivery_status}</td>
                                    <td className='py-3 px-4'>
                                        <Link to={`/seller/dashboard/order/details/${order._id}`} className='text-blue-400'>View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, value, icon, bgColor, iconBg }) => (
    <div className={`flex justify-between items-center p-5 ${bgColor} rounded-md gap-3`}>
        <div className='flex flex-col text-[#000000]'>
            <h2 className='text-3xl font-bold'>{value}</h2>
            <span className='text-md font-medium'>{title}</span>
        </div>
        <div className={`w-[40px] h-[47px] rounded-full ${iconBg} flex justify-center items-center text-xl text-white`}>
            {icon}
        </div>
    </div>
);

export default SellerDashboard;
