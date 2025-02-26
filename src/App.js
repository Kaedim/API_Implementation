import React, { useEffect, useState } from "react";
import ErrorModal from "./components/ErrorModal.jsx";
import InputArea from "./components/InputArea.jsx";

export default function App() {
  const [imgFiles, setImgFiles] = useState([]);
  const [imgFile, setImageFile] = useState();
  const [resetImage, setResetImage] = useState(false);
  const [inputType, setInputType] = useState("single");
  const [devID, setDevID] = useState("");
  const [projectID, setProjectID] = useState("");
  const [APIkey, setAPIkey] = useState("");
  const [webhook, setWebhook] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [test, setTest] = useState(false);
  const [response, setResponse] = useState("");
  const [currentDetails, setCurrentDetails] = useState({
    devID: "",
    APIkey: "",
    webhook: "",
    refreshToken: "",
    jwt: "",
    webhookRegistered: false,
    projectID: "",
  });


  async function handleDetailSave(type, value) {
    if (type === "devID") {
      localStorage.setItem("devID", devID);
      setCurrentDetails({
        ...currentDetails,
        devID: devID,
      });
    } else if (type === "APIkey") {
      localStorage.setItem("APIkey", APIkey);
      setCurrentDetails({
        ...currentDetails,
        APIkey: APIkey,
      });
    } else if (type === "webhook") {
      localStorage.setItem("webhook", webhook);
      setCurrentDetails({
        ...currentDetails,
        webhook: webhook,
      });
    } else if (type === "refresh") {
      localStorage.setItem("refreshToken", value);
      setCurrentDetails({
        ...currentDetails,
        refreshToken: value,
      });
    } else if (type === "jwt") {
      console.log("jwt", value);
      localStorage.setItem("jwt", value);
      setCurrentDetails({
        ...currentDetails,
        jwt: value,
      });
    } else if (type === "projectID") {
      localStorage.setItem("projectID", projectID);
      setCurrentDetails({
        ...currentDetails,
        projectID: projectID,
      });
    } else if (type === "savedHook") {
      // console.log("savedHook", savedHook);
      localStorage.setItem("savedHook", true);
      setCurrentDetails({
        ...currentDetails,
        webhookRegistered: true,
      });
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const localDev = localStorage.getItem("devID")
        ? localStorage.getItem("devID")
        : "";
      const localKey = localStorage.getItem("APIkey")
        ? localStorage.getItem("APIkey")
        : "";
      const localHook = localStorage.getItem("webhook")
        ? localStorage.getItem("webhook")
        : "";
      const localRefresh = localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")
        : "";
      const localJwt = localStorage.getItem("jwt")
        ? localStorage.getItem("jwt")
        : "";
      const localProjectID = localStorage.getItem("projectID") 
        ? localStorage.getItem("projectID") 
        : "";
      const localSavedHook = localStorage.getItem("savedHook");
      setCurrentDetails({
        devID: localDev,
        APIkey: localKey,
        webhook: localHook,
        refreshToken: localRefresh,
        jwt: localJwt,
        webhookRegistered: localSavedHook,
        projectID: localProjectID,
      });
    }
    return () => {
      mounted = false;
    };
  }, [localStorage]);

  function handleInputClick() {
    if (inputType === "single") {
      setInputType("multiple");
    } else if (inputType === "multiple") {
      setInputType("single");
    }
  }

  async function process() {
    // make sure all the details are checked before sending off the request
    if (currentDetails["devID"] === "" || currentDetails["APIkey"] === "") {
      setErrorMessage("Please make sure devID and API keys are filled in");
      setErrorOccurred(true);
    } else if (currentDetails["jwt"] === "") {
      setErrorMessage("Please make sure you refresh your jwt");
      setErrorOccurred(true);
    } else {
      if (imgFile || imgFiles[0]) {
        try {
          const formData = new FormData();
          formData.append("apiKey", currentDetails["APIkey"]);
          formData.append("devID", currentDetails["devID"]);
          formData.append("jwt", currentDetails["jwt"]);
          formData.append("test", test);
          formData.append("projectID", currentDetails["projectID"]);
          if (imgFiles[0]) {
            imgFiles.forEach((image, index) => {
              formData.append(`image-${index}`, image);
            });
          } else {
            formData.append("image", imgFile);
          }
          const res = await fetch("http://localhost:4242/process", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log("data", data);
          setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrorMessage("Image required");
        setErrorOccurred(true);
      }
    }
  }

  async function refreshJWT() {
    if (
      currentDetails["refreshToken"] === "" ||
      currentDetails["devID"] === "" ||
      currentDetails["APIkey"] === ""
    ) {
      setErrorMessage("Details missing");
      setErrorOccurred(true);
    } else {
      const body = {
        devID: currentDetails["devID"],
        APIkey: currentDetails["APIkey"],
        refreshToken: currentDetails["refreshToken"],
      };
      try {
        const res = await fetch("http://localhost:4242/refreshJWT", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("data", data);
        if (data.status === "success") {
          handleDetailSave(
            "jwt",
            data.jwt,
          );
          // setJwt(data.jwt);
          // handleDetailSave("jwt");
        }
        // const res  = await fetch("http://localhost:4242/refreshJWT", {
        //   method: "POST",
        //   body: JSON.stringify(body),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // then(async (res) => {
        //   const data = await res.json();
        //   console.log("data", data);
        //   if (data.status === "success") {
        //     setJwt(data.jwt);
        //     handleDetailSave("jwt");
        //   }
        // }
        // );
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function registerWebhook() {
    if (
      currentDetails["webhook"] === "" ||
      currentDetails["devID"] === "" ||
      currentDetails["APIkey"] === ""
    ) {
      setErrorMessage("Details missing");
      setErrorOccurred(true);
    } else {
      const body = {
        devID: currentDetails["devID"],
        APIkey: currentDetails["APIkey"],
        // we should rename this
        destination: currentDetails["webhook"],
      };
      try {
        const res = await fetch("http://localhost:4242/registerHook", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
        // setResponse();
        if (
          data.status === "success" &&
          data.message !== "Webhook already registered"
        ) {
          setCurrentDetails({
            ...currentDetails,
            refreshToken: data.refreshToken,
            jwt: data.jwt,
            webhookRegistered: true,
          });
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("savedHook", true);
          localStorage.setItem("jwt", data.jwt);
        } else if (
          data.status === "success" &&
          data.message === "Webhook already registered"
        ) {
          setCurrentDetails({
            ...currentDetails,
            jwt: data.jwt,
          });
          localStorage.setItem("jwt", data.jwt);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  console.log("details", currentDetails);
  return (
    <div className="w-full h-full flex flex-col font-mono px-6 gap-2 items-center overflow-y-auto pb-20">
      <div className="text-center text-xl mt-2">Kaedim API Tutorial</div>
      <div className="text-sm">
        Please login into the{" "}
        <span className="text-orange-500">
          <a href="https://www.app.kaedim3d.com/" target="_blank">
            Kaedim Platform
          </a>
        </span>{" "}
        to access your API details, you will need them for this tutorial.
      </div>
      <div className="flex flex-row gap-2 text-sm items-center">
        <div>devID:</div>
        <input
          type="text"
          className="border border-black focus:outline-none rounded-sm px-2 flex-auto"
          onChange={(e) => {
            setDevID(e.target.value);
          }}
        />
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm flex-auto`}
          onClick={() => handleDetailSave("devID")}
        >
          Save
        </button>
      </div>
      <div className="flex flex-row gap-2 text-sm items-center">
        <div className="flex flex-col"> <span>projectID:</span>(optional) </div>
        <input
          type="text"
          className="border border-black focus:outline-none rounded-sm px-2 flex-auto"
          onChange={(e) => {
            setProjectID(e.target.value);
          }}
        />
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm flex-auto`}
          onClick={() => handleDetailSave("projectID")}
        >
          Save
        </button>
      </div>
      <div className="-ml-4 flex flex-row gap-2 text-sm items-center">
        <div>API key:</div>
        <input
          type="text"
          className="border border-black focus:outline-none rounded-sm px-2"
          onChange={(e) => {
            setAPIkey(e.target.value);
          }}
        />
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm`}
          onClick={() => handleDetailSave("APIkey")}
        >
          Save
        </button>
      </div>
      <div className="-ml-12 flex flex-row gap-2 text-sm items-center">
        <div>webhook url:</div>
        <input
          type="text"
          className="border border-black focus:outline-none rounded-sm px-2"
          onChange={(e) => {
            setWebhook(e.target.value);
          }}
        />
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm `}
          onClick={() => handleDetailSave("webhook")}
        >
          Save
        </button>
      </div>
      <div>
        For testing purposes you can use{" "}
        <a
          href="https://bin.webhookrelay.com"
          target="_blank"
          className="text-orange-500"
        >
          webhook relay
        </a>{" "}
        as a test webhook.
      </div>
      <button
        type="button"
        className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm border border-orange-400 `}
        disabled={currentDetails["webhook"] === ""}
        onClick={registerWebhook}
        // disabled if refreshjwt token is present
      >
        Register webhook
      </button>
      <div className="-ml-16 flex flex-row gap-2 text-sm items-center">
        <div>Refresh token:</div>
        <input
          type="text"
          className="border border-black focus:outline-none rounded-sm px-2"
          onChange={(e) => {
            setRefreshToken(e.target.value);
          }}
        />
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm `}
          onClick={() => handleDetailSave("refresh", refreshToken)}
        >
          Save
        </button>
      </div>
      <div>
        <button
          type="button"
          className={`bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm border border-orange-400 ${
            currentDetails["refreshToken"] === ""
              ? "hover:bg-white hover:text-black hover:border hover:border-black"
              : " hover:bg-orange-400"
          }`}
          disabled={currentDetails["refreshToken"] === ""}
          onClick={refreshJWT}
          // disabled if refreshjwt token is present
        >
          Refresh jwt
        </button>
      </div>
      <div className="flex flex-col gap-2 items-center text-sm">
        <div>Your current details are:</div>
        <div>
          devID:{" "}
          {currentDetails["devID"] === "" ? "missing" : currentDetails["devID"]}
        </div>
        <div>
          API key:{" "}
          {currentDetails["APIkey"] === ""
            ? "missing"
            : currentDetails["APIkey"]}
        </div>
        <div>
          Webhook url:{" "}
          <span className="text-xs">
            {currentDetails["webhook"] === ""
              ? "missing"
              : currentDetails["webhook"]}
          </span>
        </div>
        <div>
          projectID:{" "}
          <span className="text-xs">
            {currentDetails["projectID"] === ""
              ? "missing"
              : currentDetails["projectID"]}
          </span>
        </div>
        <div className="text-ellipsis w-2/3 overflow-hidden whitespace-nowrap">
          Refresh Token:{" "}
          <span className="text-xs">
            {currentDetails["refreshToken"] === ""
              ? "missing"
              : currentDetails["refreshToken"]}
          </span>
        </div>
        <div>
          {currentDetails["jwt"] === "" ? (
            <div className="text-red-600">
              Please refresh JWT before continuing
            </div>
          ) : (
            <div className="text-green-500">JWT exists</div>
          )}
        </div>
        <div>
          {!currentDetails["webhookRegistered"] ? (
            <div className="text-orange-600 flex flex-col justify-center items-center">
              <div>You currently don't have a registered webhook</div>
              <div>You can only send test requests</div>
            </div>
          ) : (
            <div className="text-green-500">Webhook registered</div>
          )}
        </div>
      </div>
      <div className="flex flex-row w-full relative">
        <div className="absolute z-10 -top-20 flex flex-col gap-4 text-sm">
          <div className="flex flex-row">
            <input id="inputType" type="checkbox" onClick={handleInputClick} />
            <label htmlFor="inputType">Multiple images</label>
          </div>
          <div className="flex flex-row">
            <input
              id="test"
              type="checkbox"
              onClick={() => setTest(!test)}
              value={test}
              // disabled={!currentDetails["webhookRegistered"]}
              // checked={!currentDetails["webhookRegistered"] ? test : false}
            />
            <label htmlFor="test">Test</label>
          </div>
        </div>
        <div className="w-1/2 h-80">
          <InputArea
            name="placeholder name"
            cb={(file) => setImageFile(file)}
            setMultiple={(images) => setImgFiles(images)}
            reset={resetImage}
            inputType={inputType}
            setErrorOccurred={setErrorOccurred}
            setErrorMessage={(message) => setErrorMessage(message)}
          />
        </div>
        <div className="flex flex-col gap-8 justify-center mx-2">
          <button
            onClick={process}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm"
          >
            Send
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded-sm"
            onClick={() => {
              setResetImage(true);
              setTimeout(() => {
                setResetImage(false);
              }, 200);
            }}
          >
            Reset
          </button>
        </div>
        <div className="w-1/2 bg-purple-400 rounded-lg border-2 border-purple-500 flex flex-col p-2 overflow-x-auto">
          <div>Response</div>
          <div className="text-xs">
            <pre>{response}</pre>
          </div>
          <div className="text-xs">Scroll --{">"} </div>
        </div>
      </div>
      <ErrorModal
        errorOccurred={errorOccurred}
        setErrorOccurred={setErrorOccurred}
        message={errorMessage}
      />
    </div>
  );
}
