const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var crypto = require("crypto");

app.post("/webhook", (request, response) => {
    const secret = "6deb2a5...";
    const payload = JSON.stringify(request.body);
    const API_SECRET = "3b99ca1fb8.....";
    console.log(request.body.results);
    const devID = request.body.results.devID;
    const signature = JSON.parse(request.headers["kaedim-signature"]);
    /* {
        t : 1235678,
        v1:80e62bdd6bddf54905d3cd6e13940626e16aedd....
      }*/
    const checkSignature = crypto
        .createHmac("sha256", secret)
        .update(`${signature.t}${payload}`)
        .digest("hex");

    if (
        crypto.timingSafeEqual(
            Buffer.from(signature.v1),
            Buffer.from(checkSignature)
        )
    ) {
        // Authenticity confirmed
        console.log("SUCCESS");
    } else {
        // Reject response
        console.log("FAIL");
    }
    // Please make sure to return a response (even an empty one)
    response.send();
});

app.listen(4242, () => console.log("Running on port 4242"));