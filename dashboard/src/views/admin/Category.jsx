import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaE } from 'react-icons/fa6';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaImage } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { categoryAdd, messageClear, get_category, updateCategory, deleteCategory } from '../../store/Reducers/categoryReducer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Search from '../components/Search';

const Category = () => {

    const dispatch = useDispatch()
    const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category)



    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] = useState(false)
    const [imageShow, setImage] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [editId, setEditId] = useState(null)

    const [state, setState] = useState({

        name: '',
        image: ''

    })


    const imageHandle = (e) => {
        let files = e.target.files
        if (files.length > 0) {
            setImage(URL.createObjectURL(files[0]))
            setState({
                ...state,
                image: files[0]
            })
        }
    }


    const addOrUpdateCategory = (e) => {
        e.preventDefault()
        if (isEdit) {
            dispatch(updateCategory({ id: editId, ...state }))
        } else {
            dispatch(categoryAdd(state))
        }

        // console.log(state)
    }

    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setState({
                name: '',
                image: ''
            })
            setImage('')
            setIsEdit(false)
            setEditId(null)

        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }


    }, [successMessage, errorMessage, dispatch])

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_category(obj))

    }, [searchValue, currentPage, parPage])

    /// Handle Edit Button 
    const handleEdit = (category) => {
        setState({
            name: category.name,
            image: category.image
        })
        setImage(category.image)
        setEditId(category._id)
        setIsEdit(true)
        setShow(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure to delete category?')) {
            console.log("delete category id", id);
            dispatch(deleteCategory(id));
        }
    }

    return (
        <div className='px-2 lg:px-7 pt-5 bg-white text-black'>
            <div className='flex lg:hidden justify-between items-center mb-5 p-4 bg-gray-100 rounded-md'>
                <h1 className='font-semibold text-lg'>Category</h1>
                <button onClick={() => setShow(true)} className='bg-blue-500 shadow-lg hover:shadow-blue-500/40 px-4 py-2 cursor-pointer text-white rounded-sm text-sm'>Add</button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className='w-full p-4 bg-gray-100 rounded-md'>
                        <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />
                        <div className='relative overflow-x-auto'>
                            <table className='w-full text-sm text-left'>
                                <thead className='text-sm uppercase border-b border-gray-300'>
                                    <tr>
                                        <th scope='col' className='py-3 px-4'>No</th>
                                        <th scope='col' className='py-3 px-4'>Image</th>
                                        <th scope='col' className='py-3 px-4'>Name</th>
                                        <th scope='col' className='py-3 px-4'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorys.map((d, i) => (
                                        <tr key={i} className='border-b border-gray-300'>
                                            <td className='py-2 px-4'>{i + 1}</td>
                                            <td className='py-2 px-4'>
                                                <img className='w-[45px] h-[45px]' src={d.image} alt='' />
                                            </td>
                                            <td className='py-2 px-4'>{d.name}</td>
                                            <td className='py-2 px-4'>
                                                <div className='flex items-center gap-4'>
                                                    <Link className='p-2 bg-yellow-500 rounded hover:shadow-lg' onClick={() => handleEdit(d)}><FaEdit /></Link>
                                                    <Link className='p-2 bg-red-500 rounded hover:shadow-lg' onClick={() => handleDelete(d._id)}><FaTrash /></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full flex justify-end mt-4'>
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={50}
                                parPage={parPage}
                                showItem={3}
                            />
                        </div>
                    </div>
                </div>
                <div className={`w-[320px] lg:w-5/12 fixed ${show ? 'right-0' : '-right-[340px]'} z-50 top-0 transition-all duration-500 lg:relative lg:right-0`}> 
                    <div className='w-full pl-5'>
                        <div className='bg-gray-100 h-screen lg:h-auto px-3 py-2 lg:rounded-md'>
                            <div className='flex justify-between items-center mb-4'>
                                <h1 className='font-semibold text-xl mb-4 w-full text-center'>{isEdit ? 'Edit Category' : 'Add Category'}</h1>
                                <div onClick={() => setShow(false)} className='block lg:hidden cursor-pointer'>
                                    <IoMdCloseCircle />
                                </div>
                            </div>
                            <form onSubmit={addOrUpdateCategory}>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor='name'>Category Name</label>
                                    <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className='px-4 py-2 outline-none bg-white border border-gray-300 rounded-md' type='text' id='name' name='category_name' placeholder='Category Name' />
                                </div>
                                <div>
                                    <label className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-gray-500 w-full border-gray-300' htmlFor='image'>
                                        {imageShow ? <img className='w-full h-full' src={imageShow} /> : <>
                                            <span><FaImage /></span>
                                            <span>Select Image</span>
                                        </>}
                                    </label>
                                    <input onChange={imageHandle} className='hidden' type='file' name='image' id='image' />
                                    <div className='mt-4'>
                                        <button disabled={loader} className='bg-blue-500 w-full hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                            {loader ? <PropagateLoader color='#fff' /> : isEdit ? 'Update Category' : 'Add Category'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default Category;