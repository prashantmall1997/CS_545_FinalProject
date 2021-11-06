require("dotenv").config();
const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const path = require("path");
const jwt = require("jsonwebtoken");

const configRoutes = require("./routes");
app.use("/public", static);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let blacklist = [];

app.use("/private", async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.send(401);
  if (blacklist.includes(token)) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
});

app.use("/logout", (req, res, next) => {
  blacklist.push(req.headers["authorization"].split(" ")[1]);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
