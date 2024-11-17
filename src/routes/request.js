const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { getUserAuth } = require("../middlerware/auth");

const requestAuth = express.Router();

requestAuth.get("/requests/sendRequest", getUserAuth, async (req, res) => {
  res.status(200).send("Request received");
});

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

module.exports = requestAuth;
