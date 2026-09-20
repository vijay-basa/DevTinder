const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ValidateProfileEditData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateProfileEditData(req)) {
      throw new Error("Invalid Update");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, you profile updated successfully!`,
      data: loggedInUser,
    })
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
})

module.exports = profileRouter;