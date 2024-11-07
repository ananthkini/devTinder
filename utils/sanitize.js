const validator = require("validator");

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

const validatePatchRequestData = (data) => {
  const validColumn = [
     "firstName",
    "lastname",
    "about",
    "skills",
    "photo",
    "gender",
    "age",
    "password"
  ];

  const isRequestValid = Object.keys(data).every((columnName) =>
    validColumn.includes(columnName) 
  );

  return isRequestValid;
};

module.exports = { sanitizeUserData, validatePatchRequestData };
