require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const blogs = mongoCollections.blogs;
var ObjectID = require("mongodb").ObjectID;
const jwt_decode = require("jwt-decode");

//IMPLEMENT BLOG ROUTES HERE

// POST /private/blog - logged in user can create a blog
router.post("/blog", async (req, res) => {});

// GET /private/blog - logged in user can see a list of their blogs
router.get("/blog", async (req, res) => {});

// GET /private/blog/:blogId - logged in user can get a specific blogs
router.get("/blog/:blogId", async (req, res) => {});

// POST /private/blog/:blogId/comment - any logged in user can comment on the blog
router.get("/blog/comment", async (req, res) => {});

module.exports = router;
