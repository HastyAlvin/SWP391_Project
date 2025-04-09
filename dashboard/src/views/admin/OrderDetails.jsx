import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        setStatus(order?.delivery_status);
    }, [order]);

    useEffect(() => {
        dispatch(get_admin_order(orderId));
    }, [orderId]);

    const status_update = (e) => {
        dispatch(admin_order_status_update({ orderId, info: { status: e.target.value } }));
        setStatus(e.target.value);
    };

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

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full bg-[#FFFFFF] rounded-md'>
                {/* Header Section */}
                <div className='flex justify-between items-center p-4 border-b'>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate(-1)}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2'
                        >
                            <span>←</span> Back to List
                        </button>
                        <h2 className='text-xl font-semibold text-[#000000]'>Order #{order._id}</h2>
                        <span className='text-sm text-gray-600'>{order.date}</span>
                    </div>
                    <select
                        onChange={status_update}
                        value={status}
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#FFFFFF] border border-slate-700 rounded-md text-[#000000]'
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="placed">Placed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Order Information Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
                    {/* Customer Information */}
                    <div className='bg-gray-50 p-4 rounded-md'>
                        <h3 className='font-semibold mb-3'>Customer Information</h3>
                        <div className='space-y-2'>
                            <p className='text-sm'><span className='font-medium'>Name:</span> {order.shippingInfo?.name}</p>
                            <p className='text-sm'><span className='font-medium'>Address:</span> {order.shippingInfo?.address}</p>
                            <p className='text-sm'><span className='font-medium'>Province:</span> {order.shippingInfo?.province}</p>
                            <p className='text-sm'><span className='font-medium'>City:</span> {order.shippingInfo?.city}</p>
                            <p className='text-sm'><span className='font-medium'>Area:</span> {order.shippingInfo?.area}</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='bg-gray-50 p-4 rounded-md'>
                        <h3 className='font-semibold mb-3'>Order Summary</h3>
                        <div className='space-y-2'>
                            <p className='text-sm'><span className='font-medium'>Payment Status:</span> {order.payment_status}</p>
                            <p className='text-sm'><span className='font-medium'>Total Price:</span> ${order.price}</p>
                            <p className='text-sm'><span className='font-medium'>Delivery Status:</span> {status}</p>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className='p-4 border-t'>
                    <h3 className='font-semibold mb-4'>Order Items</h3>
                    <div className='space-y-4'>
                        {order.products && order.products.map((p, i) => (
                            <div key={i} className='flex items-center gap-4 p-3 bg-gray-50 rounded-md'>
                                <img className='w-16 h-16 object-cover rounded' src={p.images[0]} alt={p.name} />
                                <div className='flex-1'>
                                    <h4 className='font-medium'>{p.name}</h4>
                                    <div className='flex gap-4 text-sm text-gray-600 mt-1'>
                                        <p>Brand: {p.brand}</p>
                                        <p>Quantity: {p.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seller Orders Section */}
                {order?.suborder?.length > 0 && (
                    <div className='p-4 border-t'>
                        <h3 className='font-semibold mb-4'>Seller Orders</h3>
                        <div className='space-y-4'>
                            {order.suborder.map((o, i) => (
                                <div key={i} className='border rounded-md p-4'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <h4 className='font-medium'>Seller {i + 1}</h4>
                                        <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                                            {o.delivery_status}
                                        </span>
                                    </div>
                                    <div className='space-y-3'>
                                        {o.products?.map((p, j) => (
                                            <div key={j} className='flex items-center gap-4 bg-gray-50 p-3 rounded-md'>
                                                <img className='w-16 h-16 object-cover rounded' src={p.images[0]} alt={p.name} />
                                                <div className='flex-1'>
                                                    <h5 className='font-medium'>{p.name}</h5>
                                                    <div className='flex gap-4 text-sm text-gray-600 mt-1'>
                                                        <p>Brand: {p.brand}</p>
                                                        <p>Quantity: {p.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;