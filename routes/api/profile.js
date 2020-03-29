const express = require("express");
const request = require("request");
const config = require("config");

const router = express.Router();
const auth = require("../../middlewares/auth");
const {
  validator,
  profileRules,
  experienceRules,
  educationRules
} = require("../../middlewares/checkValidator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//@route GET api/profile/me
//@desc  get current users profile
//@acess Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user " });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error !!!");
  }
});

//@route GET api/profile
//@desc  Get All profiles
//@acess Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.send(profiles);
  } catch (error) {
    console.error("Error get all profiles", err.message);
    res.status(500).send("server error! ");
  }
});

//@route GET api/profile/:user_id
//@desc  Get profile by user ID
//@acess Public
router.get(`/:user_id`, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not Found" });
    }
    res.send(profile);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not Found" });
    }
    console.error("Error get profile by id", error.message);
    res.status(500).send("Server error! ");
  }
});

//@route POST api/profile
//@desc  create or update user Profile
//@acess Private
router.post("/", auth, profileRules(), validator, async (req, res) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  //Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  if (skills) {
    profileFields.skills = skills.split(",").map(skill => skill.trim());
  }

  //Build Social Object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      //Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    //Create a profile
    profile = new Profile(profileFields);
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.send(500).send("Server Error !!");
  }
});

//@route DELETE api/profile
//@desc Delete Profile , user , posts
//@acess Private
router.delete(`/`, auth, async (req, res) => {
  try {
    //Remove Posts of auth user
    await Post.deleteMany({ user: req.user.id });
    //Remove Profile of auth user
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.send({ msg: "User deleted " });
  } catch (error) {
    console.error(error.message);
    res.send(500).send("Server Error !!");
  }
});

//@route PUT api/profile/experience
//@desc Add Profile Experience
//@acess Private
router.put(
  `/experience`,
  auth,
  experienceRules(),
  validator,
  async (req, res) => {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error !");
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc DELETE Profile Experience
//@acess Private
router.delete(`/experience/:exp_id`, auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index (brad solution)
    // const removeIndex = profile.experience
    //   .map(item => item.id)
    //   .indexOf(req.params.exp_id);
    // profile.experience.splice(removeIndex, 1);

    // My Solution
    profile.experience = profile.experience.filter(
      exp => exp.id !== req.params.exp_id
    );

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route PUT api/profile/education
//@desc Add Profile Education
//@acess Private
router.put(
  `/education`,
  auth,
  educationRules(),
  validator,
  async (req, res) => {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error !");
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc DELETE Profile education
//@acess Private
router.delete(`/education/:edu_id`, auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index (brad solution)
    // const removeIndex = profile.education
    //   .map(item => item.id)
    //   .indexOf(req.params.edu_id);
    // profile.education.splice(removeIndex, 1);

    // My Solution
    profile.education = profile.education.filter(
      exp => exp.id !== req.params.edu_id
    );

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route GET api/profile/github/:username
//@desc GET user repos from github
//@acess Public
router.get(`/github/:username`, (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_sercret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        res.send(404).json({ msg: "No Github Profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

module.exports = router;
