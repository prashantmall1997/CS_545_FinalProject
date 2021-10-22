const routesAPI = require("./routesAPI");

const constructorMethod = (app) => {
  app.use("/", routesAPI);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
