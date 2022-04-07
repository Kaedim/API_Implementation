import React, { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import functions from "./functions.js";
import "./App.css";

export default function App() {
  const inputRef = useRef();
  const [imgFiles, setImgFiles] = useState([]);
  const [imgFile, setImageFile] = useState();
  const [imageObj, setImageObj] = useState();
  const [imgArrayDisplay, setImgArrayDisplay] = useState();

  const [multiple, setMultiple] = useState(false);
  // const [response, setResponse] = useState();

  //Multiple image input handling
  async function onMultipleFileSelect(ev) {
    if (ev.target.files[0] && ev.target.files.length < 7) {
      setMultiple(true);
      if (true) {
        const imageUrls = [];
        const images = [];
        let imageFile;
        ev.target.files.forEach(async (file) => {
          if (file.size / 1024 / 1024 > 4) {
            const options = {
              maxSizeMB: 4,
              useWebWorker: true,
            };
            imageFile = await imageCompression(file, options);
            imageUrls.push(imageFile);
          } else {
            imageUrls.push(file);
          }
          images.push(URL.createObjectURL(file));
        });
        setImgFiles(imageUrls);
        setImgArrayDisplay(images);
        console.log(imageUrls);
      }
    }
  }

  // Single image input handling
  async function onFileSelect(ev) {
    if (ev.target.files[0] && ev.target.files.length < 7) {
      setMultiple(false);
      let imageFile = ev.target.files[0];
      if (imageFile.size / 1024 / 1024 > 2) {
        const options = {
          maxSizeMB: 2,
          useWebWorker: true,
        };
        imageFile = await imageCompression(imageFile, options);
      }
      // console.log(imageFile.size);
      setImageFile(URL.createObjectURL(imageFile));
      setImageObj(imageFile);
    } else if (ev.target.files[0] && ev.target.files.length > 6) {
      console.log("Too many images");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {multiple ? (
          <div>
            {imgArrayDisplay.map((i) => (
              <img src={i} alt="" className="image" />
            ))}
          </div>
        ) : (
          <img src={imgFile} alt="" className="image" />
        )}

        <div className="button_row">
          <button
            type="button"
            className="button"
            onClick={functions.registerHook}
          >
            Register webhook
          </button>
          <input
            type="file"
            ref={inputRef}
            className="button"
            onChange={onFileSelect}
            // id={id}
            // name={name}
            accept="image/*"
            multiple={false}
          />
          <input
            type="file"
            ref={inputRef}
            className="button"
            onChange={onMultipleFileSelect}
            // id={id}
            // name={name}
            accept="image/*"
            multiple={true}
          />
          <button
            type="button"
            className="button"
            onClick={() => {
              console.log(multiple ? imgFiles : imageObj);
              functions.processImage(multiple ? imgFiles : imageObj, multiple);
            }}
          >
            Sent the image
          </button>
          <button
            type="button"
            className="button"
            onClick={() => {
              functions.getAllAssets();
            }}
          >
            Get all
          </button>
          <button
            type="button"
            className="button"
            onClick={() => {
              functions.refreshJWT();
            }}
          >
            Refresh JWT
          </button>
        </div>
        {/* <div>Response: {response}</div> */}
      </header>
    </div>
  );
}
