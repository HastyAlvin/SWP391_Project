import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { BsFillGridFill } from 'react-icons/bs';
import { FaThList } from 'react-icons/fa';
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { price_range_product, query_products, messageClear } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';

const CategoryShop = () => {
    const dispatch = useDispatch();
    const { products, totalProduct, priceRange, loading, errorMessage } = useSelector(state => state.home);

    let [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');

    const [filter, setFilter] = useState(true);
    const [state, setState] = useState({ values: [priceRange.low, priceRange.high] });
    const [rating, setRating] = useState('');
    const [styles, setStyles] = useState('grid');
    const [pageNumber, setPageNumber] = useState(1);
    const [sortPrice, setSortPrice] = useState('');

    useEffect(() => {
        dispatch(price_range_product());
    }, [dispatch]);

    useEffect(() => {
        setState({
            values: [priceRange.low, priceRange.high]
        });
    }, [priceRange]);

    useEffect(() => {
        dispatch(query_products({
            low: state.values[0],
            high: state.values[1],
            category,
            rating,
            sortPrice,
            pageNumber
        }));
    }, [state.values[0], state.values[1], category, rating, sortPrice, pageNumber, dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, dispatch]);

    const resetRating = () => {
        setRating('');
        dispatch(query_products({
            low: state.values[0],
            high: state.values[1],
            category,
            rating: '',
            sortPrice,
            pageNumber
        }));
    };

    return (
        <div>
            <Header />
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-3xl font-bold'>Shop by Category</h2>
                            <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'><IoIosArrowForward /></span>
                                <span>Category</span>
                                {category && (
                                    <>
                                        <span className='pt-1'><IoIosArrowForward /></span>
                                        <span>{category}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-16'>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                    <div className={`md:block hidden ${!filter ? 'mb-6' : 'mb-0'}`}>
                        <button onClick={() => setFilter(!filter)} className='text-center w-full py-2 px-3 bg-indigo-500 text-white'>
                            Filter Products
                        </button>
                    </div>
                    <div className='w-full flex flex-wrap'>
                        <div className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${filter ? 'md:h-0 md:overflow-hidden md:mb-6' : 'md:h-auto md:overflow-auto md:mb-0'}`}>
                            <div className='py-2 flex flex-col gap-5'>
                                <h2 className='text-3xl font-bold mb-3 text-slate-600'>Price</h2>
                                <Range
                                    step={5}
                                    min={priceRange.low}
                                    max={priceRange.high}
                                    values={state.values}
                                    onChange={(values) => setState({ values })}
                                    renderTrack={({ props, children }) => (
                                        <div {...props} className='w-full h-[6px] bg-slate-200 rounded-full cursor-pointer'>
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div className='w-[15px] h-[15px] bg-[#059473] rounded-full' {...props} />
                                    )}
                                />
                                <div>
                                    <span className='text-lg font-bold text-slate-600'>
                                        ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                    </span>
                                </div>
                            </div>
                            <div className='py-3 flex flex-col gap-4'>
                                <h2 className='text-3xl font-bold text-slate-600'>Rating</h2>
                                <div className='flex flex-col gap-3'>
                                    {[5, 4, 3, 2, 1].map((r, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setRating(r)}
                                            className={`flex items-center gap-2 text-xl cursor-pointer ${rating === r ? 'text-[#059473]' : 'text-slate-600'}`}
                                        >
                                            {[...Array(r)].map((_, i) => (
                                                <AiFillStar key={i} />
                                            ))}
                                            {[...Array(5 - r)].map((_, i) => (
                                                <CiStar key={i} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {rating && (
                                    <button
                                        onClick={resetRating}
                                        className='text-sm px-3 py-1 bg-red-500 text-white rounded w-fit'
                                    >
                                        Reset Rating
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='w-9/12 md-lg:w-8/12 md:w-full'>
                            <div className='pl-8 md:pl-0'>
                                <div className='py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-center border'>
                                    <h2 className='text-lg font-bold text-slate-600'>
                                        {totalProduct} Products
                                    </h2>
                                    <div className='flex justify-center items-center gap-3'>
                                        <select
                                            onChange={(e) => setSortPrice(e.target.value)}
                                            className='p-1 border outline-0 text-slate-600 font-semibold'
                                        >
                                            <option value="">Sort By</option>
                                            <option value="low-to-high">Low to High Price</option>
                                            <option value="high-to-low">High to Low Price</option>
                                        </select>
                                        <div className='flex gap-4 items-center text-slate-600'>
                                            <BsFillGridFill
                                                onClick={() => setStyles('grid')}
                                                className={`text-xl cursor-pointer ${styles === 'grid' ? 'text-[#059473]' : ''}`}
                                            />
                                            <FaThList
                                                onClick={() => setStyles('list')}
                                                className={`text-xl cursor-pointer ${styles === 'list' ? 'text-[#059473]' : ''}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='pb-8'>
                                    {loading ? (
                                        <div className="flex justify-center items-center h-[200px]">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#059473] border-t-transparent"></div>
                                        </div>
                                    ) : products.length > 0 ? (
                                        <ShopProducts products={products} styles={styles} />
                                    ) : (
                                        <div className="flex justify-center items-center h-[200px]">
                                            <p className="text-xl text-gray-400">No products found</p>
                                        </div>
                                    )}
                                </div>
                                {totalProduct > 0 && (
                                    <div className='flex justify-end'>
                                        <Pagination
                                            pageNumber={pageNumber}
                                            setPageNumber={setPageNumber}
                                            totalItem={totalProduct}
                                            parPage={12}
                                            showItem={4}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default CategoryShop;