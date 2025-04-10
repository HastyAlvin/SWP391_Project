import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { get_category, messageClear } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';

const Categories = () => {
    const dispatch = useDispatch();
    const { categorys, loading, errorMessage } = useSelector(state => state.home);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        dispatch(get_category());
    }, [dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [errorMessage, dispatch]);

    // Theo dõi kích thước màn hình để tối ưu responsive
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1440 },
            items: 5,
        },
        desktop: {
            breakpoint: { max: 1439, min: 1024 },
            items: 4,
        },
        tablet: {
            breakpoint: { max: 1023, min: 768 },
            items: 3,
        },
        mobileLandscape: {
            breakpoint: { max: 767, min: 480 },
            items: 2,
        },
        mobilePortrait: {
            breakpoint: { max: 479, min: 0 },
            items: 1,
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto px-4 py-10">
                <div className="text-center mb-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="w-24 h-1 bg-gray-200 rounded-full mx-auto"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="h-[200px] bg-gray-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Grid view for smaller screens
    if (windowWidth < 640) {
        return (
            <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
                <div className="text-center flex flex-col items-center mb-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                        Top Categories
                    </h2>
                    <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#059473] to-emerald-400 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {categorys.map((category) => (
                        <Link
                            key={category._id}
                            to={`/products?category=${category.name}`}
                            className="block"
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden aspect-square relative group">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                        <h2 className="text-white text-sm font-bold truncate">
                                            {category.name}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Carousel for larger screens
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <div className="text-center flex flex-col items-center mb-6 md:mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Top Categories
                </h2>
                <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-[#059473] to-emerald-400 rounded-full"></div>
            </div>

            <div className="relative">
                <Carousel
                    autoPlay={true}
                    infinite={true}
                    arrows={true}
                    responsive={responsive}
                    transitionDuration={500}
                    autoPlaySpeed={3000}
                    removeArrowOnDeviceType={["mobilePortrait"]}
                    itemClass="px-2"
                    containerClass="pb-2"
                    ssr={true} // Server-side rendering support
                    swipeable={true} // Improved touch support
                    draggable={true}
                    keyBoardControl={true}
                    customTransition="transform 500ms ease-in-out"
                >
                    {categorys.map((category) => (
                        <Link
                            key={category._id}
                            to={`/products?category=${category.name}`}
                        >
                            <div className="transform transition-all duration-300 hover:scale-105 h-full">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden h-[180px] md:h-[200px] relative group">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={category.image}
                                        alt={category.name}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/80 transition-all duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                                            <h2 className="text-white text-lg md:text-xl font-bold mb-1 transform transition-all duration-300 group-hover:translate-y-[-5px] truncate">
                                                {category.name}
                                            </h2>
                                            <div className="w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default Categories;