const express = require("express");
const { getUserAuth } = require("../middlerware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const ALLOWED_GET_COLUMNS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skills",
  "about",
  "age",
  "photoUrl"
];

userRouter.get("/user/requests/received", getUserAuth, async (req, res) => {
  const loggedInUser = res.user;

  try {
    const isUserValid = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ALLOWED_GET_COLUMNS);

    if (!isUserValid) throw new Error("No requests received");

    res.status(200).json({ message: "Requests received", data: isUserValid });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/connections", getUserAuth, async (req, res) => {
  const loggedInUser = res.user;

  try {
    const myConnectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", ALLOWED_GET_COLUMNS)
      .populate("toUserId", ALLOWED_GET_COLUMNS);
    // console.log(myConnectionRequests)

    if (!myConnectionRequests) throw new Error("No connections found");

    const data = myConnectionRequests.map((item) => {
      if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });
    res.status(200).json({ message: "Found connections", data: data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/feed", getUserAuth, async (req, res) => {
  const loggedInUser = res.user;
  try {

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(ALLOWED_GET_COLUMNS)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
