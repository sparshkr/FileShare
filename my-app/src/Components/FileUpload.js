import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";

import Modal from "react-bootstrap/Modal";

// Loader component

export default function FileUpload(props) {
  const [fileName, setFileName] = useState(""); // State to hold the file name
  const [file, setFile] = useState(""); // State to hold the file name
  const [title, setTitle] = useState(""); // State to hold the title
  const [price, setPrice] = useState(""); // State to hold the price
  const [uploadActive, setUploadActive] = useState(false); // State to track upload button activity
  const [uploading, setUploading] = useState(false); // State to track uploading state
  const [show, setShow] = useState(false);
  const [Message, setMessage] = useState("Successful");

  const handleClose = () => window.location.reload();

  async function sendTransaction(_title, _price, _cid) {
    try {
      const tx = await props.state.contract.listFile(_title, _price, _cid);
      await tx.wait();
      console.log("Transaction is Successful");
      // window.location.reload();
      setShow(true);
    } catch (e) {
      console.log(e);
      setMessage(e);
      setShow(true);
    }
  }

  useEffect(() => {
    checkFormCompletion();
    // console.log(props.state);
  }, [file, title, price]);

  // Function to check form completion and activate/deactivate upload button
  const checkFormCompletion = () => {
    if (title && price && file) {
      setUploadActive(true);
    } else {
      setUploadActive(false);
    }
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  // Function to handle title change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // Function to handle price change
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  // Function to handle upload button click
  const handleUpload = async () => {
    try {
      setUploading(true); // Set uploading state to true
      let data = new FormData();
      data.append("file", file);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", `{"name": "${title}"}`);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NjAwNGJmMi1lYWNkLTRhZjktYTVmZS04MWE3MTljZjY1YjAiLCJlbWFpbCI6InNwYXJzaGt1bWFyOTEwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhNTI5ZDQ4NGI5N2U5ZGVjZjU3ZiIsInNjb3BlZEtleVNlY3JldCI6ImU0MmViZWVkZGMzYjAxMDgzZjhiODlmYmIwMzk0NDYwNjVkZmU4YWQ4Y2ViNDI2Y2Q3NDI5NDdmNjE1NGMzMDkiLCJpYXQiOjE3MDY0MjA4MTB9.pi0zcmW3hutQjHEaY8bQ7oIYgTGrF3EPHgj6lc5_WWw",
          },
        }
      );

      console.log("File uploaded:", fileName);
      console.log("IPFS hash:", res.data.IpfsHash);
      console.log(
        "View the file here:",
        `https://yellow-accessible-marten-682.mypinata.cloud/ipfs/${res.data.IpfsHash}`
      );
      await sendTransaction(
        title,
        price,
        `https://yellow-accessible-marten-682.mypinata.cloud/ipfs/${res.data.IpfsHash}`
      );

      // Reset the form
      setFileName("");
      setTitle("");
      setPrice("");
      setFile("");
      setUploadActive(false);
      setUploading(false); // Set uploading state to false
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage(error.message);
      setShow(true);
      setUploading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Message from FileShare</Modal.Title>
        </Modal.Header>
        <Modal.Body>{Message}</Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleClose}
            className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <div className="h-screen font-sans text-gray-900 bg-gray-300 border-box">
        {uploading && <Loader />} {/* Conditionally render loader */}
        <div className="flex justify-center w-full mx-auto sm:max-w-lg">
          <div className="flex flex-col items-center justify-center w-full h-auto my-10 bg-white sm:w-3/4 sm:rounded-lg sm:shadow-xl">
            <div className="mt-10 mb-10 text-center">
              <h2 className="text-2xl font-semibold mb-2">Upload your files</h2>
            </div>
            <form className="w-4/5 mb-10">
              <div className="flex flex-col mb-4">
                <label htmlFor="title" className="text-sm mb-1">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="border border-gray-400 rounded-sm px-3 py-2"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="price" className="text-sm mb-1">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={handlePriceChange}
                  className="border border-gray-400 rounded-sm px-3 py-2"
                />
              </div>
              <div className="relative w-full h-32 max-w-xs mb-6 bg-gray-100 rounded-lg shadow-inner">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                >
                  <p className="text-xs font-light text-gray-500">
                    {fileName ? fileName : "Drag & Drop your files here"}
                  </p>
                  <svg
                    className="w-8 h-8 text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </label>
              </div>
            </form>
            {/* Upload button conditionally rendered */}
            {uploadActive && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-1 -mt-10"
                onClick={handleUpload}
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
