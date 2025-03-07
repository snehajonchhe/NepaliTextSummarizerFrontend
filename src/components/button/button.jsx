import "../../views/home/home.css";
const Button = (props) => {
    return <div className=" relative flex justify-center pt-[24px] z-10">
        <button className="bg-[#1F3A8B] text-white p-4 rounded-full vidaloka xl:text-4xl sm:text-2xl text-xl px-[14px] py-[8px] sm:px-[18px] sm:py-[14px] xl:px-[38px] xl:py-[11px] mb-5" onClick={props.onClick}>{props.title}</button>
    </div>;
}

export default Button