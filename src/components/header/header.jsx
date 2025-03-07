

const Header = (props) => {
    return <div className="flex bg-[#1F3A8B] items-center">
        <img src={props.image} alt="books image" className="h-8 sm:h-12 xl:h-20 pr-4 " />
        <h1 className="text-white xl:text-5xl sm:text-3xl text-2xl justify-center petite">{props.text}</h1>
    </div>
}

export default Header