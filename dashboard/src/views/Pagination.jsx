import React from 'react'
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {

    let totalPage = Math.ceil(totalItem / parPage)
    let startPage = pageNumber

    let diff = totalPage - pageNumber

    if (diff <= showItem) {
        startPage = totalPage - showItem
    }

    let endPage = startPage < 0 ? showItem : showItem + startPage

    if (startPage <= 0) {
        startPage = 1
    }
    const createButtons = () => {
        const buttons = []
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li
                    onClick={() => setPageNumber(i)}
                    className={`
                        ${pageNumber === i
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 hover:bg-indigo-500 hover:text-white'
                        } w-8 h-8 rounded-full flex justify-center items-center cursor-pointer`
                    }
                    key={i}
                >
                    {i}
                </li>
            )
        }
        return buttons
    }

    return (
        <ul className='flex gap-3'>
            {
                pageNumber > 1 && <li onClick={() => setPageNumber(pageNumber - 1)} className='w-8 h-8 rounded-full flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowLeft />
                </li>
            }
            {createButtons()}
            {
                pageNumber < totalPage && <li onClick={() => setPageNumber(pageNumber + 1)} className='w-8 h-8 rounded-full flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <MdOutlineKeyboardDoubleArrowRight />
                </li>
            }
        </ul>
    )
}

export default Pagination