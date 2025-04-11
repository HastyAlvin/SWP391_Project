import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_banner, get_banner, messageClear, update_banner } from '../../store/reducers/bannerReducer';
import toast from 'react-hot-toast';

const AddBanner = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, banner } = useSelector(state => state.banner);
  
  const [imageShow, setImageShow] = useState('');
  const [image, setImage] = useState('');

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

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImage(files[0]);
      setImageShow(URL.createObjectURL(files[0]));
    }
  };

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('mainban', image);
    dispatch(add_banner(formData));
  };

  const update = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('mainban', image);
    dispatch(update_banner({ info: formData, bannerId: banner._id }));
  };

  useEffect(() => {
    dispatch(get_banner(productId));
  }, [productId]);

  return (
    <div className='px-4 py-6'>
      <h1 className='text-lg font-semibold mb-4 text-gray-800'>Add Banner</h1>
      <div className='w-full p-5 bg-white rounded-lg shadow-md'>
        {!banner ? (
          <form onSubmit={add}>
            <div className='mb-4'>
              <label className='flex flex-col items-center justify-center h-44 cursor-pointer border border-dashed border-gray-300 hover:border-red-500 rounded-lg w-full text-gray-700' htmlFor='image'>
                <span className='text-4xl'><FaRegImage /></span>
                <span>Select Banner Image</span>
              </label>
              <input required onChange={imageHandle} className='hidden' type='file' id='image' />
            </div>
            {imageShow && <img className='w-full h-72 object-cover rounded-md mb-4' src={imageShow} alt='Preview' />}
            <button disabled={loader} className='bg-red-500 text-white rounded-md px-6 py-2 w-full hover:shadow-lg hover:shadow-red-300/50'>
              {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Add Banner'}
            </button>
          </form>
        ) : (
          <div>
            <img className='w-full h-72 object-cover rounded-md mb-4' src={banner.banner} alt='Banner' />
            <form onSubmit={update}>
              <div className='mb-4'>
                <label className='flex flex-col items-center justify-center h-44 cursor-pointer border border-dashed border-gray-300 hover:border-red-500 rounded-lg w-full text-gray-700' htmlFor='image'>
                  <span className='text-4xl'><FaRegImage /></span>
                  <span>Select Banner Image</span>
                </label>
                <input required onChange={imageHandle} className='hidden' type='file' id='image' />
              </div>
              {imageShow && <img className='w-full h-72 object-cover rounded-md mb-4' src={imageShow} alt='Preview' />}
              <button disabled={loader} className='bg-red-500 text-white rounded-md px-6 py-2 w-full hover:shadow-lg hover:shadow-red-300/50'>
                {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Banner'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBanner;