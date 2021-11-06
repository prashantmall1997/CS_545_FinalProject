const routesAPI = require("./routesAPI");
const privateBlogRoutes = require("./privateBlogRoutes");

const constructorMethod = (app) => {
  app.use("/private", privateBlogRoutes);
  app.use("/", routesAPI);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
