import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer';
import toast from 'react-hot-toast';

const SellerDetails = () => {
    const dispatch = useDispatch();
    const { seller, successMessage } = useSelector(state => state.seller);
    const { sellerId } = useParams();
    const [status, setStatus] = useState('');

    useEffect(() => {
        dispatch(get_seller(sellerId));
    }, [sellerId]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        if (seller) {
            setStatus(seller.status);
        }
    }, [seller]);

    const submit = (e) => {
        e.preventDefault();
        dispatch(seller_status_update({ sellerId, status }));
    };

    return (
        <div className="px-4 py-6">
            <div className="w-full p-5 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Seller Details</h1>
                <div className="w-full flex flex-wrap">
                    <div className="w-3/12 flex justify-center items-center py-3">
                        <div>
                            {seller?.image ? (
                                <img className="w-full h-[230px] object-cover rounded-md" src={seller.image} alt="Seller" />
                            ) : (
                                <span className="text-gray-500">Image Not Uploaded</span>
                            )}
                        </div>
                    </div>
                    <div className="w-4/12 px-4">
                        <h2 className="text-lg py-2 font-semibold text-gray-700">Basic Info</h2>
                        <div className="p-4 bg-gray-100 rounded-md">
                            {[ 
                                { label: "Name", value: seller?.name },
                                { label: "Email", value: seller?.email },
                                { label: "Role", value: seller?.role },
                                { label: "Status", value: seller?.status },
                                { label: "Payment Status", value: seller?.payment },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-2 font-medium text-gray-700 mb-2">
                                    <span>{item.label}:</span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-4/12 px-4">
                        <h2 className="text-lg py-2 font-semibold text-gray-700">Address</h2>
                        <div className="p-4 bg-gray-100 rounded-md">
                            {[ 
                                { label: "Shop Name", value: seller?.shopInfo?.shopName },
                                { label: "Division", value: seller?.shopInfo?.division },
                                { label: "District", value: seller?.shopInfo?.district },
                                { label: "State", value: seller?.shopInfo?.sub_district },
                            ].map((item, index) => (
                                <div key={index} className="flex gap-2 font-medium text-gray-700 mb-2">
                                    <span>{item.label}:</span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <form onSubmit={submit} className="mt-4">
                    <div className="flex gap-4 py-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring focus:ring-indigo-300"
                            required
                        >
                            <option value="">--Select Status--</option>
                            <option value="active">Active</option>
                            <option value="deactive">Deactive</option>
                        </select>
                        <button className="bg-green-500 px-7 py-2 text-white rounded-md hover:shadow-md">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerDetails;