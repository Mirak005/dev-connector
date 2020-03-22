const express = require("express");
const router = express.Router();
const bycript = require("bcryptjs");
const auth = require("../../middlewares/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validator, loginRules } = require("../../middlewares/checkValidator");

const User = require("../../models/User");

//@route GET api/auth
//@desc get current user
//@acess Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error !!!");
  }
});

//@route POST api/auth
//@desc  Authenticate user & get token
//@acess Public
router.post("/", loginRules(), validator, async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    //Chek if user dont exists
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    // if user exists , we check for password
    const isMatch = await bycript.compare(password, user.password);

    // if Invalid password return errors
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.send({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error !! ");
  }
});

module.exports = router;
