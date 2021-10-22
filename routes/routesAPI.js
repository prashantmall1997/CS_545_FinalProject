const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt_decode = require("jwt-decode");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
var ObjectID = require("mongodb").ObjectID;
const saltRounds = 8;

/*
jwt payload -->
{
  "username": "test",
  "password": "test"
}
*/

router.post("/signup", async (req, res) => {
  try {
    var jwt = jwt_decode(req.body.jwt);
    const usersCollection = await users();

    const alreadyRegistered = await usersCollection.findOne({
      username: jwt.username,
    });

    if (alreadyRegistered === null) {
      await bcrypt.hash(jwt.password, 12, async function (err, hash) {
        if (!err) {
          jwt.password = hash;
          const newInsertInformation = await usersCollection.insertOne(jwt);
          if (newInsertInformation.insertedCount === 0) {
            return res.send("MongoDB function failed to add user!");
          } else {
            return res.send("User signed up!");
          }
        } else {
          console.log(err);
          return res.send("Error in bcrypt funciton: " + err);
        }
      });
    } else {
      return res.send("User is already registered!");
    }
  } catch (e) {
    return res.send("CATCH BLOCK ERROR: " + e);
  }
});

//POST /login
router.post("/login", async (req, res) => {
  try {
    var jwt = jwt_decode(req.body.jwt);
    const { username, password } = jwt;

    if (!username || !password) {
      res.status(401).send({
        error: "Username & Password must be provided!",
      });
      return;
    }

    const usersCollection = await users();

    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return res.send("User does not exsist!");
    }

    let match = await bcrypt.compare(password, user.password);

    if (match) {
      res.cookie("AuthCookie", { user: user });

      res.redirect("/private");
    } else {
      res.status(401).send({
        error: "Username or Password is wrong!",
      });
    }
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

//This is where blogs should be visible and posted
router.get("/private", async (req, res) => {
  var user = req.cookies.AuthCookie;
  res.status(200).send("MAKE BLOGS HERE");
});

router.get("/logout", async (req, res) => {
  res.clearCookie("AuthCookie");
  req.session.destroy();
  res.status(200).send("User logged out");
});

module.exports = router;
