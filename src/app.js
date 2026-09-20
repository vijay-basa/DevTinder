const express = require("express");
const { connectDB } = require("./config/database.js");
const User = require('./models/user.js');
const { validateSignUpData, validateLoginData } = require("./utils/validations.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName, 
      lastName, 
      emailId, 
      password: hashedPassword,
    });
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(500).send("ERROR : " + err.message)
  }

});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(email, password);

    const user = await User.findOne({ emailId: email });
    if(!user) {
      throw new Error("Invalid credential!");
    }

    const isValidUser = await user.validatePassword(password);
    if(!isValidUser) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token);
    res.send("Login successfully!");
  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch(err) {
    res.status(400).send("Error : " + err.message);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(req.user.firstName + " sending connection  request");
  } catch(err) {
    res.status(400).send("Error : " + err.message);
  }
})

connectDB()
  .then((data) => {
    console.log("Database connection establisheds");
    app.listen(7777, () => {
      console.log("Server started successfylly on Port 7777");
    })
  })
  .catch((err) => console.error("Database connection failed"));
