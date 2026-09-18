const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Something went wrong!!")
    }
})

app.get("/user", (req, res) => {
    try {
        throw new Error("Something went wrong!!")
        res.send("User data sent")
    } catch(err) {
        res.status(500).send("Some Error contact support")
    }
})

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("Something went wrong!!")
    }
})

app.listen(7777, () => {
    console.log("Server started successfylly on Port 7777")
})