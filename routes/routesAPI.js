require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
var ObjectID = require("mongodb").ObjectID;
const saltRounds = 8;
const jwt_decode = require("jwt-decode");

let blacklist = [];

router.post("/signup", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.send(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
  });
  try {
    var payload = jwt_decode(token);
    const usersCollection = await users();
    const alreadyRegistered = await usersCollection.findOne({
      username: payload.username,
    });
    if (alreadyRegistered === null) {
      await bcrypt.hash(payload.password, 12, async function (err, hash) {
        if (!err) {
          payload.password = hash;
          const newInsertInformation = await usersCollection.insertOne(payload);
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

router.post("/login", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.send(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
  });
  try {
    var payload = jwt_decode(token);
    const { username, password } = payload;

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
      const user = { user: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).send({
        error: "Username or Password is wrong!",
      });
    }
  } catch (e) {
    res.status(400).json({ message: e });
  }
});

//Modify this route
router.get("/private", async (req, res) => {
  res.status(200).send("MAKE BLOGS HERE");
});

router.get("/logout", async (req, res) => {
  blacklist.push(req.headers["authorization"].split(" ")[1]);
  res.status(200).send("User logged out");
  console.log(blacklist);
});

module.exports = router;
