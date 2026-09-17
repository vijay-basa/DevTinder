const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({ "first_name": "Vijay", "last_name": "Basa" });
})

app.post("/user", (req, res) => {
    res.send("Created a User");
})

app.delete("/user", (req, res) => {
    res.send("Deleted a User");
})

app.listen(7777, () => {
    console.log("Server started successfylly on Port 7777")
})