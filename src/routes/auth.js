const express = require("express");
const { validateSignUpData, validateLoginData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const userData = await user.save();
    const token = await userData.getJWT();

    res.cookie("token", token);
    res.json({ message: "User Added Successfully!", data: userData });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message)
  }

});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(email, password);

    const user = await User.findOne({ emailId: email });
    if (!user) {
      throw new Error("Invalid credential!");
    }

    const isValidUser = await user.validatePassword(password);
    if (!isValidUser) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token").send("Logout successful");
})

module.exports = authRouter;