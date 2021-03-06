const REACT_APP_KAEDIM_API = "https://api.kaedim3d.com/";
const devID = "aa...";
const APIkey = "40e5ec...";
const refreshToken = "cf4f883bdd...";

let jwt = "eyJhbGciOiJIUz...";
const destination = "http://destination/webhook";

async function registerHook() {
    const url = `${REACT_APP_KAEDIM_API}api/v1/registerHook`;
    const headers = {
        "Content-Type": "application/json",
        "X-API-Key": APIkey,
    };
    const body = {
        devID: devID,
        destination: destination,
    };
    try {
        fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        }).then((res) => {
            res.json().then((data) => {
                console.log(data);
                jwt = data && data.jwt;
                refreshToken = data && data.refreshToken;
            });
        });
    } catch (e) {}
}

// Send image out for processing
async function processImage(image, multiple) {
    console.log('jwt', jwt)
    const url = `${REACT_APP_KAEDIM_API}api/v1/process`;
    const headers = {
        "X-API-Key": APIkey,
        Authorization: jwt,
    };
    const formData = new FormData();
    formData.append("devID", devID);
    if (multiple) {
        console.log("multiple");
        [...image].map((i, index) => formData.append(`image${index}`, i));
    } else {
        console.log("single");
        formData.append("image", image);
    }
    try {
        fetch(url, {
            method: "POST",
            headers,
            body: formData,
        }).then((res) => {
            res.json().then((data) => {
                console.log(data);
            });
        });
    } catch (e) {}
}

async function getAllAssets() {
    const start = "02-01-2022";
    const end = "04-5-2022";
    const url = `${REACT_APP_KAEDIM_API}api/v1/fetchAll/${devID}?start=${start}&end=${end}`;
    const headers = {
        "X-API-Key": APIkey,
        Authorization: jwt,
    };
    try {
        fetch(url, {
            method: "GET",
            headers,
        }).then((res) => {
            res.json().then((data) => {
                console.log(data);
            });
        });
    } catch (e) {}
}

async function refreshJWT() {
    const url = `${REACT_APP_KAEDIM_API}api/v1/refreshJWT`;
    const headers = {
        "Content-Type": "application/json",
        "X-API-Key": APIkey,
        "refresh-token": refreshToken,
    };
    const body = {
        devID: devID,
    };
    try {
        fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        }).then((res) => {
            console.log(res);
            res.json().then((data) => {
                console.log(data);
                jwt = data.jwt;
            });
        });
    } catch (e) {}
}

module.exports = {
    registerHook,
    processImage,
    getAllAssets,
    refreshJWT,
};