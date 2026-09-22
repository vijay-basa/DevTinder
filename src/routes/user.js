const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills"

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggerInUser = req.user;

    const requestsRecievedData = await ConnectionRequest.find({
      toUserId: loggerInUser._id,
      status: "interested"
    }).populate("fromUserId", USER_SAFE_DATA);
    // .populate("fromUserId", [ "firstName", "lastName" ]);

    res.json({
      message: "Data fetched successfully!",
      data: requestsRecievedData,
    })

  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: "accepted" },
      ]
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map(connection => {
      if(connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    })

    res.json({ data });
  } catch(err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    const hideConnections = new Set();
    connectionRequests.map(request => {
      hideConnections.add(request.fromUserId.toString());
      hideConnections.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideConnections) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({ data: users });

  } catch(err) {
    res.status(400).json({ message: err.message });
  }
})

module.exports = userRouter;