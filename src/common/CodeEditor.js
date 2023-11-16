import React, { useState } from "react";
import { BiErrorCircle } from "react-icons/bi";

const CodeEditor = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [text, setText] = useState("");

  const calculateNumbers = () => {
    const numLines = text?.split("\n").length;
    return Array.from({ length: numLines }, (_, index) => index + 1);
  };

  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  

  const validateInput = () => {

    // Split the input text into lines
    const lines = text.split("\n");

    const validFormat = /^(0x[0-9a-fA-F]{40})[=, ](\d+)$/;

    const errorMessages = [];
    const encounteredLines = new Map();

    // Check each line for valid format, length, and duplicates
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim(); // Remove leading/trailing whitespace

      if (!validFormat.test(line)) {
        if (line.length > 44) {
          errorMessages.push(
            `Line ${i + 1}: Invalid Ethereum address due to length`
          );
        } else if (!line.startsWith("0x")) {
          errorMessages.push(`Line ${i + 1}: Invalid Ethereum address`);
        } else {
          const amountPart = line.split(/[=, ]/)[1];
          if (!/^\d+$/.test(amountPart)) {
            errorMessages.push(`Line ${i + 1}: Wrong Amount`);
          }
        }
      }

      if (encounteredLines.has(line)) {
        const duplicateLines = [i + 1, encounteredLines.get(line) + 1];
        errorMessages.push(
          `${line} duplicate in Line: ${duplicateLines.join(",")}`
        );
      } else {
        encounteredLines.set(line, i);
      }
    }

    setErrorMessages(errorMessages);
    setShowError(errorMessages.length > 0);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <div className="w-[750px] bg-gray-900 text-white p-4 shadow-lg relative">
        <div className="mt-4 mb-2">
          <div className="text-white">Eth Addresses with Amounts</div>
        </div>
        <div className="absolute right-0 top-6 p-2 mr-2">
          <div className="text-white">Upload Files</div>
        </div>

        {/* Textarea */}
        <div className="flex rounded-md bg-black">
          <div className="px-2 my-6 border-r ml-4">
            {calculateNumbers().map((e, i) => {
              return <div className="flex flex-col font-bold">{e}</div>;
            })}
          </div>

          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full h-52 bg-black text-white p-2 mt-4 outline-none resize-none"
            placeholder=""
          ></textarea>
        </div>

        <div className="flex justify-between mt-4">
          <div>
            <div className="text-white">Separated by ',' or '' or '='</div>
          </div>
          <div className="mr-4">
            <div className="text-gray-500 font-bold">Show Example</div>
          </div>
        </div>

        {/* Error Messages */}
        {showError && (
          <div className="border-2 border-red-600 rounded-md p-2 mt-4 flex flex-col">
            {errorMessages.map((errorMessage, index) => (
              <div key={index} className="flex">
                <BiErrorCircle className="text-red-600 mr-2" size={20} />
                <p className="text-red-600">{errorMessage}</p>
              </div>
            ))}
          </div>
        )}

        {/* Next Button */}
        <button
          className={
            "py-3 w-full px-4 mt-6 rounded-3xl font-semibold " +
            (showError
              ? "bg-black text-gray-500"
              : "bg-gradient-to-br from-purple-500 to-blue-500 text-white")
          }
          onClick={validateInput}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
