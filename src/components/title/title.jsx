import React from 'react'
import '../../views/home/home.css'
const Title = (props) => {
    return <div className="text-4xl px-[14px] py-[8px] sm:px-[18px] sm:py-[14px] xl:px-[38px] xl:py-[11px] bg-[#1F3A8B] max-w-max rounded-full">
        <h1 className="text-white vidaloka xl:text-4xl sm:text-2xl text-sm">{props.title}</h1>
    </div>
}

export default Title