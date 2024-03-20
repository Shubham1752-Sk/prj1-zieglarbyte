import React, { useState } from 'react'
import { NavbarLinks } from '../../UTILS/Navbar-links'
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Navbar = () => {
    const [hovered, setHovered] = useState(false)
    const [hoveredLink, setHoverdLink] = useState()
    return (
        <div className='w-full'>
            <div className='w-10/12 p-4 bg-white flex justify-center items-center gap-16'>
                <h1 className='text-3xl font-bold text-black'>Zeiglar Byte</h1>
                <div className='flex gap-8 p-2 text-lg '>
                    {
                        NavbarLinks.map((navlink) => {
                            return <a href={navlink?.path}
                                key={navlink.id} className={` font-normal cursor-pointer flex items-center gap-2 ${hoveredLink === navlink.id && " mb-1 border-b-2 border-black"}`}
                                onMouseEnter={() => { setHoverdLink(() => navlink.id); setHovered(true) }}
                                onMouseLeave={() => { setHoverdLink(null); setHovered(false) }}
                            >{navlink.name}{
                                    navlink?.sublinks && (<FaCaretDown className={`${hoveredLink === navlink.id && "rotate-180 duration-75 ease-linear"}`} />)
                            }</a>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar