const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const {
  validator,
  postRules,
  commentRules
} = require("../../middlewares/checkValidator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//@route POST api/posts
//@desc  Create Post
//@acess Private
router.post("/", auth, postRules(), validator, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const newPost = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    const post = await new Post(newPost).save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route GET api/posts
//@desc  get all posts
//@acess Private
router.get(`/`, auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route GET api/posts/:id
//@desc  get post by id
//@acess Private
router.get(`/:id`, auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found " });
    }
    res.send(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found " });
    }
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route DELETE api/posts/:id
//@desc  delete post by id
//@acess Private
router.delete(`/:id`, auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found " });
    }

    //Check on the user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found " });
    }
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route PUT api/posts/like/:id
//@desc  like post by id
//@acess Private
router.put(`/like/:id`, auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the posts exists
    if (!post) {
      return res.status(404).json({ msg: "Post not found " });
    }
    //Check if the post has already been liked
    if (post.likes.find(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Cannot add more than one like " });
    }

    const like = {
      user: req.user.id
    };
    post.likes.unshift(like);
    await post.save();
    res.send(post.likes);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found " });
    }
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route PUT api/posts/unlike/:id
//@desc  unlike post by id
//@acess Private
router.put(`/unlike/:id`, auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //Check if the posts exists
    if (!post) {
      return res.status(404).json({ msg: "Post not found " });
    }
    //Check if the post has already been liked
    if (!post.likes.find(like => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "You didn't like this post " });
    }
    //Remove the like
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user.id
    );

    await post.save();
    res.send(post.likes);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found " });
    }
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});

//@route POST api/posts/comment/:id
//@desc  Comment Post
//@acess Private
router.post(
  "/comment/:id",
  auth,
  commentRules(),
  validator,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error !");
    }
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete Comment
//@acess Private
router.delete(`/comment/:id/:comment_id`, auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull Comment
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(401).json({ msg: "Comment does not exist" });
    }
    //Check User is owner of the comment or the post (authorized persons to delete the comment)
    if (
      comment.user.toString() !== req.user.id &&
      post.user.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //remove the comment

    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.comment_id
    );
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error !");
  }
});
module.exports = router;
