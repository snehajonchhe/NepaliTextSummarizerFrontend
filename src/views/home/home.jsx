import "./home.css"
import upload from "../../assets/upload_svg.svg"
import Title from "../../components/title/title";
import TopBar from "../../components/top-bar/topBar";
import book from "../../assets/Books.png"
import flag from "../../assets/flag.png"
import Header from "../../components/header/header";
import Button from "../../components/button/button";
import InputTextfield from "../../components/input-textfield/InputTextfield";
import OutputTextfield from "../../components/output-textfield/OutputTextfield";
import { useState } from "react";
import summaryController from "../../controller/summary-controller";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);

  const [fileContent, setFileContent] = useState('');
  const [selected, setSelected] = useState("Select an option");
  const options = ["abstractive", "extractive"];



  const [error, setError] = useState("");

  // const [inputTextWordCount, setInputTextWordCount] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Check if the file is a .txt file
      if (file.name.endsWith(".txt")) {
        setError(""); // Clear error if valid file
        console.log("Uploaded file:", file.name);

        setInputText('');
        const reader = new FileReader();
        reader.onload = () => {
          setInputText(reader.result); // Set the file content to state
          // setInputText(file.name); // Set the input text to the file content
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        setError("Only .txt files are allowed!");
      }
    }
  };


  const countWords = (text) => {
    if (!text) return 0; // Handle empty input

    return text
      .trim()
      .split(/\s+/) // Split by one or more whitespace characters (handles newlines, spaces, tabs)
      .filter(word => word !== "").length;
  };


  const handleChange = (e) => {
    console.log(e.target.value);
    if (countWords(e.target.value) > 200) {
      return
    } else {
      setInputText(e.target.value)
      console.log(countWords(e.target.value));
      // setInputTextWordCount(countWords(e.target.value))
    }
  }

  const handleSummarize = () => {
    setLoading(true);
    setOutputText("");
    if (inputText == "" || inputText == null) {
      setLoading(false);
      setError("Please enter some text to summarize");

    } else {
      console.log({ "text": inputText, "model-type": selected })
      setError("");
      summaryController({ "text": inputText, "model-type": selected }).then((response) => {
        console.log(response);
        setLoading(false);
        setOutputText(response.summary);
      }).catch((error) => {
        setLoading(false);
        console.log(error);
        setError(error.message);
      })
    }

  }


  return (
    <div className="base">
      <img
        src={flag}
        alt="Background"
        className="absolute bottom-0 left-0 w-[50vh] opacity-30 z-0"
      />
      <TopBar title="“नेपाली पाठ सारांश”" />
      <Header image={book} text="NTS" />
      <div className="pt-[24px] pl-[16px] pr-[50px] xl:pl-[50px] xl:pr-[50px] sm:pl-[18px] sm:pr-[60px]">
        <Title title="Nepali Text Summarizer" />
        {
          error && <div className="text-red-500 text-center text-sm underline italic pt-2">{error}</div>
        }

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-50 p-2 mt-5 ml-[16px] border rounded-md shadow-sm bg-white cursor-pointer"
        >
          <option disabled>Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="xl:flex justify-center  xl:pt-[24px]">
          {/* Left text field */}
          <InputTextfield
            words={countWords(inputText)}
            value={inputText}
            onChange={handleChange}
            onUpload={handleFileUpload}
            upload={upload} />
          {/* Right text field */}
          <OutputTextfield
            value={loading ? "Processing..." : outputText}
            word={countWords(outputText)} />

        </div>
      </div>
      {loading ? <Button title="Summarizing ..." onClick={() => { }} />
        : <Button title="Summarize" onClick={handleSummarize} />}

    </div>



  );

}

export default Home 