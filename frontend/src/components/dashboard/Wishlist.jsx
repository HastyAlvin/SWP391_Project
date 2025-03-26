import React, { useEffect } from 'react';
import { FaEye, FaRegHeart, FaRegTrashAlt } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_wishlist_products, remove_wishlist, messageClear, add_to_card } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';

const Wishlist = () => { 
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { wishlist, successMessage } = useSelector(state => state.card);

    // Load danh sách wishlist
    useEffect(() => {
        if (userInfo?.id) {
            dispatch(get_wishlist_products(userInfo.id));
        }
    }, [dispatch, userInfo]);

    // Hiển thị thông báo thành công
    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());  
        }   
    }, [successMessage, dispatch]);

    // Thêm sản phẩm từ Wishlist vào giỏ hàng
    const handleAddToCart = (product) => {
        dispatch(add_to_card({
            productId: product._id,
            userId: userInfo.id,
            quantity: 1, // Đảm bảo quantity có giá trị
            price: product.price
        }));
    };

    return (
        <div className='w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
            {wishlist.length > 0 ? wishlist.map((p, i) => (
                <div key={i} className='border group transition-all duration-500 hover:shadow-md hover:-mt-3 bg-white'>
                    <div className='relative overflow-hidden'>
                        {p.discount !== 0 && (
                            <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>
                                {p.discount}%
                            </div>
                        )}
                        <img className='sm:w-full w-full h-[240px]' src={p.image} alt={p.name} />
                        <ul className='flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3'>
                            {/* Xóa khỏi Wishlist */}
                            <li onClick={() => dispatch(remove_wishlist(p._id))} 
                                className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-red-500 hover:text-white hover:rotate-[720deg] transition-all'>
                                <FaRegTrashAlt />
                            </li>
                            {/* Xem chi tiết sản phẩm */}
                            <Link to={`/product/details/${p.slug}`} 
                                className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-blue-500 hover:text-white hover:rotate-[720deg] transition-all'>
                                <FaEye />
                            </Link>
                            {/* Thêm vào giỏ hàng */}
                            <li onClick={() => handleAddToCart(p)}
                                className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-green-500 hover:text-white hover:rotate-[720deg] transition-all'>
                                <RiShoppingCartLine />
                            </li>
                        </ul>    
                    </div>
                    <div className='py-3 text-slate-600 px-2'>
                        <h2 className='font-bold'>{p.name}</h2>
                        <div className='flex justify-start items-center gap-3'>
                            <span className='text-md font-semibold'>${p.price}</span>
                            <div className='flex'>
                                <Rating ratings={p.rating} />
                            </div>
                        </div>
                    </div>    
                </div>
            )) : (
                <p className="text-center text-gray-500 col-span-4">Wishlist của bạn đang trống!</p>
            )}
        </div>
    );
};

export default Wishlist;
