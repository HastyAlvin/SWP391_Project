import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/reducers/categoryReducer';
import { add_product, messageClear } from '../../store/reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categorys } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);

    // Form state
    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    });

    // Form errors state
    const [errors, setErrors] = useState({});

    // Category states
    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    // Image states
    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);

    // Load categories on component mount
    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }));
    }, [dispatch]);

    // Update allCategory when categorys changes
    useEffect(() => {
        setAllCategory(categorys);
    }, [categorys]);

    // Handle form input changes
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
        // Clear error for this field when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    // Handle category search
    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
            setAllCategory(srcValue);
        } else {
            setAllCategory(categorys);
        }
    };

    // Handle image upload
    const imageHandle = (e) => {
        const files = e.target.files;
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files]);
            let imageUrl = [];
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    // Change image at specific index
    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow;
            let tempImages = images;

            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setImageShow([...tempUrl]);
            setImages([...tempImages]);
        }
    };

    // Remove image at specific index
    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i);
        const filterImageUrl = imageShow.filter((img, index) => index !== i);

        setImages(filterImage);
        setImageShow(filterImageUrl);
    };

    // Handle form submission success/error
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            });
            setImageShow([]);
            setImages([]);
            setCategory('');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!state.name.trim()) {
            newErrors.name = 'Product name is required';
            isValid = false;
        }

        if (!state.brand.trim()) {
            newErrors.brand = 'Brand name is required';
            isValid = false;
        }

        if (!category.trim()) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        if (!state.stock || isNaN(state.stock) || parseInt(state.stock) < 0) {
            newErrors.stock = 'Stock must be a valid positive number';
            isValid = false;
        }

        if (!state.price || isNaN(state.price) || parseFloat(state.price) <= 0) {
            newErrors.price = 'Price must be a valid positive number';
            isValid = false;
        }

        if (state.discount && (isNaN(state.discount) || parseFloat(state.discount) < 0 || parseFloat(state.discount) > 100)) {
            newErrors.discount = 'Discount must be a valid percentage between 0 and 100';
            isValid = false;
        }

        if (!state.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (images.length === 0) {
            newErrors.images = 'At least one product image is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const add = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please correct all the errors');
            return;
        }

        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('stock', state.stock);
        formData.append('discount', state.discount);
        formData.append('brand', state.brand);
        formData.append('shopName', 'EasyShop');
        formData.append('category', category);

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        
        dispatch(add_product(formData));
    };

    return (
        <div className="p-4 lg:p-6 ">
            <div className="w-full p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-6">
                    <h1 className="text-gray-800 text-2xl font-semibold mb-2 sm:mb-0">Add Product</h1>
                    <Link to="/seller/dashboard/products" className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 transition-all duration-300 shadow-sm">
                        All Products
                    </Link>
                </div>

                <form onSubmit={add} className="space-y-6">
                    {/* Product Name and Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-gray-700 font-medium mb-1">Product Name</label>
                            <input 
                                className={`px-4 py-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                                onChange={inputHandle} 
                                value={state.name} 
                                type="text" 
                                name="name" 
                                id="name" 
                                placeholder="Enter product name" 
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="brand" className="text-gray-700 font-medium mb-1">Product Brand</label>
                            <input 
                                className={`px-4 py-2 rounded-md border ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                                onChange={inputHandle} 
                                value={state.brand} 
                                type="text" 
                                name="brand" 
                                id="brand" 
                                placeholder="Enter brand name" 
                            />
                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                        </div>
                    </div>

                    {/* Category and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col relative">
                            <label htmlFor="category" className="text-gray-700 font-medium mb-1">Category</label>
                            <input 
                                readOnly 
                                onClick={() => setCateShow(!cateShow)} 
                                className={`px-4 py-2 rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800 cursor-pointer`} 
                                value={category} 
                                type="text" 
                                id="category" 
                                placeholder="Select category" 
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}

                            <div className={`absolute z-10 top-full left-0 right-0 bg-white shadow-lg rounded-md border border-gray-200 mt-1 transition-all ${cateShow ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <div className="p-3 border-b border-gray-200">
                                    <input 
                                        value={searchValue} 
                                        onChange={categorySearch} 
                                        className="px-3 py-2 w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800" 
                                        type="text" 
                                        placeholder="Search categories" 
                                    />
                                </div>
                                <div className="max-h-[200px] overflow-y-auto">
                                    {allCategory.length > 0 ? (
                                        allCategory.map((c, i) => (
                                            <div 
                                                key={i} 
                                                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${category === c.name ? 'bg-blue-100' : ''}`} 
                                                onClick={() => {
                                                    setCateShow(false);
                                                    setCategory(c.name);
                                                    setSearchValue('');
                                                    setAllCategory(categorys);
                                                    // Clear error if exists
                                                    if (errors.category) {
                                                        setErrors({...errors, category: ''});
                                                    }
                                                }}
                                            >
                                                {c.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500">No categories found</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="stock" className="text-gray-700 font-medium mb-1">Product Stock</label>
                            <input 
                                className={`px-4 py-2 rounded-md border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                                onChange={inputHandle} 
                                value={state.stock} 
                                type="number" 
                                name="stock" 
                                id="stock" 
                                placeholder="Enter stock quantity" 
                            />
                            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="price" className="text-gray-700 font-medium mb-1">Price</label>
                            <input 
                                className={`px-4 py-2 rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                                onChange={inputHandle} 
                                value={state.price} 
                                type="number" 
                                name="price" 
                                id="price" 
                                placeholder="Enter price" 
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="discount" className="text-gray-700 font-medium mb-1">Discount (%)</label>
                            <input 
                                className={`px-4 py-2 rounded-md border ${errors.discount ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                                onChange={inputHandle} 
                                value={state.discount} 
                                type="number" 
                                name="discount" 
                                id="discount" 
                                placeholder="Enter discount percentage" 
                            />
                            {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-gray-700 font-medium mb-1">Description</label>
                        <textarea 
                            className={`px-4 py-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white text-gray-800`} 
                            onChange={inputHandle} 
                            value={state.description} 
                            name="description" 
                            id="description" 
                            placeholder="Enter product description" 
                            rows="4"
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="text-gray-700 font-medium mb-2 block">Product Images</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {imageShow.map((img, i) => (
                                <div key={i} className="h-[180px] relative border border-gray-200 rounded-md overflow-hidden">
                                    <label htmlFor={`image-${i}`} className="block h-full cursor-pointer">
                                        <img className="w-full h-full object-cover" src={img.url} alt={`Product ${i}`} />
                                    </label>
                                    <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={`image-${i}`} className="hidden" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(i)} 
                                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition-all"
                                    >
                                        <IoMdCloseCircle className="text-xl" />
                                    </button>
                                </div>
                            ))}
                            
                            <label 
                                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-md transition-all bg-gray-50"
                                htmlFor="image"
                            >
                                <IoMdImages className="text-4xl text-gray-400" />
                                <span className="mt-2 text-gray-600">Add Images</span>
                            </label>
                            <input className="hidden" onChange={imageHandle} multiple type="file" id="image" accept="image/*" />
                        </div>
                        {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-start pt-3">
                        <button 
                            disabled={loader} 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;