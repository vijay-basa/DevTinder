const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

app.use("/admin", adminAuth)

app.get("/user", userAuth, (req, res) => {
    res.send("User data sent")
})

app.post("/user/login", (req, res, next) => {
    res.send("User logged in successfully")
})

app.get("/admin/getAllData", (req, res, next) => {
    res.send("Send All data")
})

app.get("/admin/deleteUser", (req, res, next) => {
    res.send("Deleted a user")
})

app.listen(7777, () => {
    console.log("Server started successfylly on Port 7777")
})