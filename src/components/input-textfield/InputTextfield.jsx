const InputTextfield = (props) => {
    return <div className="relative w-full h-[30vh] xl:h-[55vh] p-4 bg-transparent border-2 border-gray-500 rounded-lg shadow-md m-4">
        <textarea
            value={props.value}
            onChange={props.onChange}
            placeholder="Enter your text here..."
            className="w-full h-full p-2 border-none outline-none resize-none bg-transparent text-gray-700"
        />
        <div className="absolute bottom-4 left-4">
            <input
                type="file"
                accept=".txt"
                onChange={props.onUpload}
                className="hidden"
                id="fileUpload"
            />
            <label htmlFor="fileUpload" className="flex items-center cursor-pointer">
                <img src={props.upload} alt="upload icon" className="h-4 w-4 xl:h-6 xl:w-6 mr-2" />
                <span className="text-[#1F3A8B] text-sm underline">Upload Doc</span>
            </label>
        </div>

        <div className="absolute bottom-4 right-4 text-sm text-gray-400">{props.words} words</div>

    </div>
}

export default InputTextfield;