import imageCompression from "browser-image-compression";
import React, {useEffect, useState} from "react";

export default function InputArea({
  name,
  cb,
  setMultiple,
  inputType,
  setErrorMessage,
  setErrorOccurred,
  reset,
}) {
  const [multiple, setMult] = useState(false);
  const [imgFiles, setImgFiles] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [tempFiles, setTempFiles] = useState([]);

  useEffect(() => {
    if (inputType === "multiple") {
      setMult(true);
      // setHidden(true);
    } else {
      setMult(false);
      // setHidden(true);
    }
    setTempFiles([]);
  }, [inputType]);

  useEffect(() => {
    let mounted = true;
    if (mounted && reset) {
      setImgFiles([]);
      setHidden(false);
      setTempFiles([]);
    }
    return () => {
      mounted = false;
    };
  }, [reset]);

  async function onFileSelect(ev) {
    if (ev.target.files[0] && ev.target.files.length + tempFiles.length < 7) {
      if (multiple) {
        // console.log(tempFiles);
        const temp = tempFiles;
        const filesArray = Array.from(ev.target.files);
        filesArray.forEach((file) => {
          // console.log(file);
          temp.push(file);
        });
        const imageUrls = [];
        const images = [];
        let imageFile;
        let totalMb = 0;
        temp.forEach(async (file) => {
          totalMb += file.size / 1024 / 1024;
          imageFile = URL.createObjectURL(file);
          imageUrls.push(imageFile);
          images.push(file);
        });
        if (totalMb > 5) {
          // setUploadError(true);
          setErrorMessage(
            "Please make sure the images you upload are maximum 5MB",
          );
          setErrorOccurred(true);
        }

        setTempFiles(temp);
        setImgFiles(imageUrls);
        setMultiple(images);
        setHidden(true);
        // console.log(tempFiles);
        /* eslint-disable no-param-reassign */
        ev.target.value = null; // so that user can choose a file again immedeately
      } else {
        setTempFiles(ev.target.files);
        // console.log("target", ev.target.files);
        if (ev.target.files[0].size / 1024 / 1024 > 5) {
          setErrorMessage(
            "Please make sure the images you upload are maximum 5MB",
          );
          setErrorOccurred(true);
          return;
        }
        const imageFile = ev.target.files[0];
        console.log("file", imageFile);
        cb(imageFile);
        const imageUrl = URL.createObjectURL(imageFile);
        let imageUrls = [imageUrl];
        setImgFiles(imageUrls);
        setHidden(true);
        /* eslint-disable no-param-reassign */
        ev.target.value = null;
      }
    } else if (
      ev.target.files[0] &&
      ev.target.files.length + tempFiles.length > 6
    ) {
      console.log("error");
      // setHidden(true);
      setErrorMessage("Please upload a maximum of 6 images");
      setErrorOccurred(true);
    }
  }
  return (
    <div className="w-full h-full flex flex-col gap-2 relative border-2 border-orange-500 rounded-xl bg-orange-400 p-2">
      {hidden ? (
        <></>
      ) : (
        <input
          type="file"
          className="text-sm"
          onChange={onFileSelect}
          name={name}
          accept="image/jpeg, image/png"
          multiple={multiple}
        />
      )}

      <div className="flex flex-wrap flex-row justify-center items-center gap-4">
        {imgFiles.map((img, i) => (
          <div
            className="relative max-h-20"
            id={"uploaded" + i}
            key={"uploaded" + i}
          >
            <img src={img} alt="uploaded" className="max-h-20 " />
          </div>
        ))}
      </div>
    </div>
  );
}
