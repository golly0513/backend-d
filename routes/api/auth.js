const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../../models/User");

// @route GET api/auth
// @desc get user token

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route POST api/auth/sign-up
// @desc sign-up user

router.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let userinfo = await User.findOne({ email });
    if (!userinfo) {
      return res.status(400).json({ errors: [{ msg: "Aleady Email" }] });
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const newUser = new User({
          name,
          email,
          password: hash
        });
        newUser
          .save()
          .then((user) => {
            jwt.sign(
              {
                user: {
                  id: user._id
                }
              },
              "jwtSecretKey",
              { expiresIn: "1 days" },
              (err, token) => {
                res.json({ token });
              }
            );
          })
          .catch((error) => {
            console.error(error, "Server Error");
            res.status(500).send("Server Error");
          });
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/auth/sign-in
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, "jwtSecretKey", { expiresIn: "1 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
