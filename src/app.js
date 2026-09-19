const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require('./models/user.js');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {

  const user = new User(req.body);
  
  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(500).send("Error saving the user", err.message)
  }

});

connectDB()
  .then((data) => {
    console.log("Database connection establisheds");
    app.listen(7777, () => {
      console.log("Server started successfylly on Port 7777");
    })
  })
  .catch((err) => console.error("Database connection failed"));
