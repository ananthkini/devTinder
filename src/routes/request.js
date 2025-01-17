const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { getUserAuth } = require("../middlerware/auth");

const requestAuth = express.Router();



requestAuth.post(
  "/requests/send/:status/:toUserId",
  getUserAuth,
  async (req, res) => {
    const fromUserId = res.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    let statusMessage = "";

    try {
      const ALLOWED_STATUS = ["interested", "ignored"];
      const allowedStatus = ALLOWED_STATUS.includes(status);
      if (!allowedStatus) throw new Error("Status not allowed");
      status == "interested"
        ? (statusMessage = `${res.user.firstName} is Interested in you`)
        : (statusMessage = `${res.user.firstName} has Ignored you`);

      const existsConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      //   console.log(existsConnectionRequest);
      if (existsConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      const connectionRequestData = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestData.save();

      res.json({
        message: statusMessage,
        data: data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

requestAuth.post(
  "/requests/review/:status/:requestId",
  getUserAuth,
  async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInUser = res.user;

    try {
      const ALLOWED_STATUS = ["accepted", "rejected"];
      const isStatusAllowed = ALLOWED_STATUS.includes(status);

      if (!isStatusAllowed) throw new Error("Status not allowed");

      const isRequestValid = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!isRequestValid) throw new Error("Invalid request");

      isRequestValid.status = status;
      const data = await isRequestValid.save();
      if (data) res.status(200).send(`Request ${status}`);
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);

module.exports = requestAuth;
