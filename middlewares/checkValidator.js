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
const profileRules = ()=>[
  check('status' , 'Status is required').notEmpty() ,
  check('skills' , 'Skills is required').notEmpty()
]




const validator = (req, res, next) => {
  const errors = validationResult(req);
  errors.isEmpty() ? next() : res.status(400).json({ errors: errors.array() });
};

module.exports = validationForms = {
  validator,
  registerRules,
  loginRules,
  profileRules
};
