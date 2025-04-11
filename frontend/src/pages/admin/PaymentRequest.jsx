import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { confirm_payment_request, get_payment_request, messageClear } from '../../store/reducers/PaymentReducer';
import moment from 'moment';
import toast from 'react-hot-toast';

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} {...props} /> 
))

const PaymentRequest = () => {
    const dispatch = useDispatch();
    const { successMessage, errorMessage, pendingWithdrows, loader } = useSelector(state => state.payment);
    const [paymentId, setPaymentId] = useState('');

    useEffect(() => { 
        dispatch(get_payment_request());
    }, []);

    const confirm_request = (id) => {
        setPaymentId(id);
        dispatch(confirm_payment_request(id));
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

    const Row = ({ index, style }) => (
        <div style={style} className='flex text-sm text-gray-800 font-medium border-b border-gray-300'>
            <div className='w-[20%] p-2'>{index + 1}</div>
            <div className='w-[20%] p-2'>${pendingWithdrows[index]?.amount}</div>
            <div className='w-[20%] p-2'>
                <span className='py-[2px] px-[6px] bg-gray-200 text-blue-500 rounded-md text-sm'>
                    {pendingWithdrows[index]?.status}
                </span>
            </div>
            <div className='w-[20%] p-2'>{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
            <div className='w-[20%] p-2'>
                <button 
                    disabled={loader} 
                    onClick={() => confirm_request(pendingWithdrows[index]?._id)} 
                    className='bg-green-500 px-3 py-1 text-white rounded-md hover:bg-green-600 transition duration-200'>
                    {(loader && paymentId === pendingWithdrows[index]?._id) ? 'Loading...' : 'Confirm'}
                </button>
            </div>
        </div>
    );

    return (
        <div className='px-4 lg:px-8 pt-5'>
            <div className='w-full p-5 bg-white border border-gray-300 rounded-lg shadow-md'>
                <h2 className='text-xl font-medium pb-5 text-gray-800'>Withdrawal Request</h2>
                <div className='w-full'>
                    <div className='w-full overflow-x-auto'>
                        <div className='flex bg-gray-100 uppercase text-xs font-bold border-b border-gray-300'>
                            <div className='w-[20%] p-2'>No</div>
                            <div className='w-[20%] p-2'>Amount</div>
                            <div className='w-[20%] p-2'>Status</div>
                            <div className='w-[20%] p-2'>Date</div>
                            <div className='w-[20%] p-2'>Action</div>
                        </div>
                        <List
                            style={{ minWidth: '340px' }}
                            className='List'
                            height={350}
                            itemCount={pendingWithdrows.length}
                            itemSize={40}
                            outerElementType={outerElementType}                    
                        >
                            {Row}
                        </List>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentRequest;