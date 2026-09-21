const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggerInUser = req.user;

    const requestsRecievedData = await ConnectionRequest.find({
      toUserId: loggerInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName age gender about photoUrl skills");
    // .populate("fromUserId", [ "firstName", "lastName" ]);

    res.json({
      message: "Data fetched successfully!",
      data: requestsRecievedData,
    })

  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

module.exports = userRouter;