import React from 'react'
import '../../views/home/home.css'

const TopBar = (props) => {
    return <h1 className="text-center text-sm xl:text-4xl sm:text-xl text-white bg-gray-500 p-[4px] xl:p-[8px] sm:p-[6px] ">
        {props.title}
    </h1>
}

export default TopBar