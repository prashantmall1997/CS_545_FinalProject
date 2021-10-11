const homeRoutes = require("./home");

const constructorMethod = (app) => {
    app.use("/", homeRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Page not found." });
    });
};

module.exports = constructorMethod;
