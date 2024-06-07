const multer = require("multer");
const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const FormData = require("form-data");
const { Readable } = require("stream");
// import fetch from "node-fetch";
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
var crypto = require("crypto");

const upload = multer({ storage: multer.memoryStorage(), preservePath: true });

// app.post("/webhook", (request, response) => {
//   const secret = "6deb2a5...";
//   const payload = JSON.stringify(request.body);
//   const API_SECRET = "3b99ca1fb8.....";
//   console.log(request.body.results);
//   const devID = request.body.results.devID;
//   const signature = JSON.parse(request.headers["kaedim-signature"]);
//   /* {
//         t : 1235678,
//         v1:80e62bdd6bddf54905d3cd6e13940626e16aedd....
//       }*/
//   const checkSignature = crypto
//     .createHmac("sha256", secret)
//     .update(`${signature.t}${payload}`)
//     .digest("hex");

//   if (
//     crypto.timingSafeEqual(
//       Buffer.from(signature.v1),
//       Buffer.from(checkSignature),
//     )
//   ) {
//     // Authenticity confirmed
//     console.log("SUCCESS");
//   } else {
//     // Reject response
//     console.log("FAIL");
//   }
//   // Please make sure to return a response (even an empty one)
//   response.send();
// });
// route from frontend to request backend
app.post("/process", upload.any("image"), async (req, res, next) => {
  try {
    const body = {
      devID: req.body.devID,
      highDetail: false,
      test: req.body.test,
    };
    let formData = new FormData();
    formData.append("devID", req.body.devID);
    formData.append("polycount", 20000);
    formData.append("test", req.body.test);
    formData.append("LoQ", "standard");

    if (req.files && req.files[0]) {
      req.files.forEach((image, index) => {
        formData.append(`image-${index}`, image.buffer, {
          filename: image.originalname,
        });
      });
    } else {
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
      });
    }
    const results = await fetch("https://api.kaedim3d.com/api/v1/process", {
      method: "POST",
      body: formData,
      headers: {
        "x-api-key": req.body.apiKey,
        authorization: req.body.jwt,
      },
    });
    const data = await results.json();
    res.status(200).json(data);
    next();
  } catch (e) {
    next(e);
  }
});

app.post("/refreshJWT", async (req, res, next) => {
  try {
    const body = {
      devID: req.body.devID,
    };
    const results = await fetch("https://api.kaedim3d.com/api/v1/refreshJWT", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": req.body.APIkey,
        "refresh-token": req.body.refreshToken,
      },
    });
    const data = await results.json();
    res.status(200).json(data);

    next();
  } catch (e) {
    next(e);
  }
});

app.post("/registerHook", async (req, res, next) => {
  try {
    const body = {
      devID: req.body.devID,
      destination: req.body.destination,
    };
    const results = await fetch(
      "https://api.kaedim3d.com/api/v1/registerHook",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": req.body.APIkey,
        },
      }
    );
    const data = await results.json();
    res.status(200).json(data);

    next();
  } catch (e) {
    next(e);
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
