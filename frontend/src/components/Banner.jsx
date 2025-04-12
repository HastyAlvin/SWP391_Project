import React, { useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css'
import { useDispatch, useSelector } from 'react-redux';
import { get_banners } from '../store/reducers/homeReducer';

const Banner = () => {
    const dispatch = useDispatch()
    const { banners } = useSelector(state => state.home)

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        },
    }

    useEffect(() => {
        dispatch(get_banners())
    }, [dispatch])

    return (
        <div className='w-full md-lg:mt-6'>
            <div className='w-[85%] lg:w-[90%] mx-auto'>
                <div className='w-full flex flex-wrap md-lg:gap-8'>
                    <div className='w-full'>
                        <div className='my-8'>
                            <Carousel
                                autoPlay={true}
                                infinite={true}
                                arrows={true}
                                showDots={true}
                                responsive={responsive}
                                autoPlaySpeed={4000}
                                keyBoardControl={true}
                                transitionDuration={500}
                            >
                                {banners.length > 0 && banners.map((banner, i) => (
                                    <Link key={i} to={`/product/details/${banner.link}`} className="block w-full">
                                        <img
                                            src={banner.banner}
                                            alt={`Banner ${i + 1}`}
                                            className="w-full h-[400px] object-cover rounded-lg"
                                        />
                                    </Link>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;