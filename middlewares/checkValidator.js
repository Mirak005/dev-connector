const { check, validationResult } = require("express-validator");

//Register Form
const registerRules = () => [
  check("name", "Name is required ").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
    max: 20
  })
];

//Login Form
const loginRules = () => [
  check("email", " this feild require a valid mail").isEmail(),
  check("password", "Password is required ").exists()
];

//Profile Form
const profileRules = () => [
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty()
];

//Experience Form
const experienceRules = () => [
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required").notEmpty()
];
//Education Form
const educationRules = () => [
  check("school", "school is required").notEmpty(),
  check("degree", "degree is required").notEmpty(),
  check("fieldofstudy", "Field of study is required").notEmpty(),
  check("from", "From date is required").notEmpty()
];

//Post Form
const postRules = () => [check("text", "text is required ").notEmpty()];

//comment Form
const commentRules = () => [check("text", "comment is required ").notEmpty()];

const validator = (req, res, next) => {
  const errors = validationResult(req);
  errors.isEmpty() ? next() : res.status(400).json({ errors: errors.array() });
};

module.exports = validationForms = {
  validator,
  registerRules,
  loginRules,
  profileRules,
  experienceRules,
  educationRules,
  postRules,
  commentRules
};
