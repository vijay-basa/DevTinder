const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {

    const { status, toUserId } = req.params;
    const fromUser = req.user;

    const allowedStatus = [ "interested", "ignored" ];
    if(!allowedStatus.includes(status)){
      throw new Error(`Status ${status} is not allowed`);
    }

    const toUser = await User.findById(toUserId);
    if(!toUser) {
      throw new Error("Invalid User request");
    }

    const fromUserId = fromUser._id;
    const connectionIsAlreadyFound = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ]
    })

    if(connectionIsAlreadyFound) {
      throw new Error("You have already sent a connection");
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    await newConnectionRequest.save();

    const message = status === 'interested' 
                                  ? `${fromUser.firstName} ${status} in ${toUser.firstName}` 
                                  : `${fromUser.firstName} ${status} ${toUser.firstName}`

    res.json({
      message,
      data: newConnectionRequest
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
})

module.exports = requestRouter;