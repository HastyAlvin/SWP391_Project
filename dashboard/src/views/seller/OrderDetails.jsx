import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {

    const { orderId } = useParams()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')

    const { order, errorMessage, successMessage } = useSelector(state => state.order)

    useEffect(() => {
        setStatus(order?.delivery_status)
    }, [order])


    useEffect(() => {
        dispatch(get_seller_order(orderId))
    }, [orderId])

    const status_update = (e) => {
        dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }))
        setStatus(e.target.value)
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])

    return (
        <div className='px-4 py-6'>
            <div className='w-full p-5 bg-white rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-2xl font-bold text-gray-700'>Order Details</h1>
                    <select
                        onChange={status_update}
                        value={status}
                        className='px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring focus:ring-indigo-300'
                    >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="warehouse">warehouse</option>
                        <option value="placed">placed</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div>

                <div className='bg-gray-50 p-4 rounded-md mb-4'>
                    <div className='flex gap-2 text-gray-700'>
                        <h2 className='font-medium'>Order ID: #{order._id}</h2>
                        <span className='text-gray-500'>{order.date}</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-md'>
                        <h2 className='font-semibold text-gray-700 mb-2'>Delivery Information</h2>
                        <p className='text-gray-600'>Deliver To: {order.shippingInfo}</p>
                        <div className='mt-2'>
                            <span className='text-gray-700'>Payment Status: </span>
                            <span className='text-gray-600'>{order.payment_status}</span>
                        </div>
                        <div className='mt-2'>
                            <span className='text-gray-700'>Total Price: </span>
                            <span className='text-gray-600'>${order.price}</span>
                        </div>
                    </div>

                    <div className='md:col-span-2'>
                        <h2 className='font-semibold text-gray-700 mb-2'>Products</h2>
                        <div className='space-y-3'>
                            {
                                order?.products?.map((p, i) => (
                                    <div key={i} className='flex gap-4 bg-gray-50 p-3 rounded-md'>
                                        <img className='w-20 h-20 object-cover rounded-md' src={p.images[0]} alt={p.name} />
                                        <div>
                                            <h3 className='font-medium text-gray-700'>{p.name}</h3>
                                            <p className='text-gray-600'>
                                                Brand: {p.brand}
                                            </p>
                                            <p className='text-gray-600'>
                                                Quantity: {p.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;