const validator = require('validator')

const sanitizeUserData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error(" Full name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Need strong password");
  }
};

module.exports = { sanitizeUserData };
