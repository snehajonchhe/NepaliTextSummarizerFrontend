const OutputTextfield = (props) => {
    return <div className="relative w-full h-[30vh] xl:h-[55vh] p-4 bg-transparent border-2 border-gray-500 rounded-lg shadow-md m-4">
        <textarea
            value={props.value}
            readOnly
            placeholder=""
            className="w-full h-full p-2 border-none outline-none resize-none bg-transparent text-gray-700"
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-400">{props.word} words</div>
    </div>

}

export default OutputTextfield;