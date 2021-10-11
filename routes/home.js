const express = require("express");
const router = express.Router();
const data = require("../data");

router.get("/", async (req, res) => {
    const categoryList = data.constants.categories;
    try {
		res.status(200).render("home", { title: "WeBlog", categories: categoryList });
        return;
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }
});

router.post("/", async (req, res) => {
    data.blog.new(userId, req.body.newBlogPost, req.body.newPostCategory)
});

module.exports = router;