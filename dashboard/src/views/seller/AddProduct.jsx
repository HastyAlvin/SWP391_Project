import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categorys } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(get_category({ searchValue: '', parPage: '', page: '' }));
    }, []);

    const [state, setState] = useState({ name: '', description: '', discount: '', price: '', brand: '', stock: '' });
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        if (!state.name) newErrors.name = 'Product name is required';
        if (!state.brand) newErrors.brand = 'Brand is required';
        if (!state.price || state.price <= 0) newErrors.price = 'Valid price is required';
        if (state.discount < 0 || state.discount > 100) newErrors.discount = 'Discount must be between 0-100%';
        if (!state.description) newErrors.description = 'Description is required';
        if (!category) newErrors.category = 'Category is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const inputHandle = (e) => setState({ ...state, [e.target.name]: e.target.value });

    const imageHandle = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        setImageShow([...imageShow, ...files.map(file => ({ url: URL.createObjectURL(file) }))]);
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({ name: '', description: '', discount: '', price: '', brand: '', stock: '' });
            setImageShow([]);
            setImages([]);
            setCategory('');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    const removeImage = (i) => {
        setImages(images.filter((_, index) => index !== i));
        setImageShow(imageShow.filter((_, index) => index !== i));
    };

    const add = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const formData = new FormData();
        Object.entries(state).forEach(([key, value]) => formData.append(key, value));
        formData.append('shopName', 'Sport shop');
        formData.append('category', category);
        images.forEach(img => formData.append('images', img));
        dispatch(add_product(formData));
    };

    return (
        <div className='p-5 bg-white text-black min-h-screen flex justify-center items-start'>
            <div className='w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-lg'>
                <div className='flex justify-between items-center pb-4 border-b border-gray-300'>
                    <h1 className='text-xl font-semibold'>Add Product</h1>
                    <Link to='/seller/dashboard/products' className='bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded'>All Products</Link>
                </div>
                <form onSubmit={add} className='space-y-4'>
                    <input className='w-full p-3 bg-white border border-gray-300 rounded text-black' onChange={inputHandle} value={state.name} type='text' name='name' placeholder='Product Name' />
                    {errors.name && <p className='text-red-500'>{errors.name}</p>}
                    <input className='w-full p-3 bg-white border border-gray-300 rounded text-black' onChange={inputHandle} value={state.brand} type='text' name='brand' placeholder='Brand Name' />
                    {errors.brand && <p className='text-red-500'>{errors.brand}</p>}
                    <input className='w-full p-3 bg-white border border-gray-300 rounded text-black' onChange={inputHandle} value={state.price} type='number' name='price' placeholder='Price' />
                    {errors.price && <p className='text-red-500'>{errors.price}</p>}
                    <input className='w-full p-3 bg-white border border-gray-300 rounded text-black' onChange={inputHandle} value={state.discount} type='number' name='discount' placeholder='Discount (%)' />
                    {errors.discount && <p className='text-red-500'>{errors.discount}</p>}
                    <textarea className='w-full p-3 bg-white border border-gray-300 rounded text-black' onChange={inputHandle} value={state.description} name='description' placeholder='Description'></textarea>
                    {errors.description && <p className='text-red-500'>{errors.description}</p>}
                    <div className='grid grid-cols-3 gap-4'>
                        {imageShow.map((img, i) => (
                            <div key={i} className='relative'>
                                <img className='w-full h-32 object-cover rounded border border-gray-300' src={img.url} alt='' />
                                <button type='button' onClick={() => removeImage(i)} className='absolute top-1 right-1 bg-gray-200 text-black p-1 rounded-full'>
                                    <IoMdCloseCircle />
                                </button>
                            </div>
                        ))}
                        <label className='flex items-center justify-center h-32 border-2 border-dashed border-gray-300 text-gray-600 cursor-pointer'>
                            <IoMdImages className='text-2xl' />
                            <input type='file' multiple className='hidden' onChange={imageHandle} />
                        </label>
                    </div>
                    <button type='submit' disabled={loader} className='bg-gray-200 hover:bg-gray-300 w-full p-3 rounded text-black font-semibold'>
                        {loader ? <PropagateLoader color='#000' /> : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;