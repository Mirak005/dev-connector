const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
  validator,
  registerRules
} = require("../../middlewares/checkValidator");

const User = require("../../models/User");

//@route POST api/users
//@desc  Register User
//@acess Public
router.post("/", registerRules(), validator, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User alreadt exists" }] });
    }

    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    // Re assign the user variable to store a new instance of User to be able to save it on the DB after password Hash
    user = new User({
      name,
      email,
      password,
      avatar
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(err.message);
    res.status(500).send("Server error !!!");
  }
});

module.exports = router;
