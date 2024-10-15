const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstName and lastName is required!");
  }
  if (firstName.length < 3 && firstName.length > 50) {
    throw new Error("firstName should be between 3 to 50 characters!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email Id is not correct!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }
};

const validateEditProfileData = (req) => {
  const allowedFieldsForEdit = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "bio",
    "photoURL",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFieldsForEdit.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
