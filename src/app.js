const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello World!!")
})

app.use("/test", (req, res) => {
    res.send("Namaste DevTinder!!")
})

app.listen(7777, () => {
    console.log("Server started successfylly on Port 7777")
})