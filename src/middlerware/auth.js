const getAdminAuth = (req, res, next) => {
  const token = "xyz";

  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(404).send("401 Unauthorized");
  } else {
    next();
  }
};

const getUserAuth = (req, res, next) => {
  const token = "abc";

  const isUserAuthorized = token === "abc";
  if (!isUserAuthorized) {
    res.status(404).send("401 Unauthorized");
  } else {
    next();
  }
};

module.exports = {
  getAdminAuth,
  getUserAuth,
};
