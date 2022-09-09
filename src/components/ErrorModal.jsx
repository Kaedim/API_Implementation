import React, {useEffect, useRef, useState} from "react";
import {ReactComponent as CrossIcon} from "../icons/cross.svg";

export default function ErrorModal({errorOccurred, message, setErrorOccurred}) {
  if (!errorOccurred) {
    return null;
  }

  return (
    <div className="w-full h-full absolute z-20 flex flex-col items-center justify-center">
      <div className="absolute bg-black opacity-40 inset-0 w-full h-full" />
      <div className="bg-white w-80 h-max flex flex-col gap-2 rounded-xl z-30 p-2 items-center justify-center">
        <div>An error has occured:</div>
        <div>{message}</div>
        <button onClick={() => setErrorOccurred(false)}>
          <CrossIcon fill="black" className="h-6" />
        </button>
      </div>
    </div>
  );
}
