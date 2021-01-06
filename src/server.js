var express = require("express");
var http = require("http");
var server = express(http);
var PORT = 3005;
// get handlers
var handlers = require("./index");

// get all zip codes
server.get("/zips", (req, res) => {
  handlers.getZips({ params: req.query }, (error, data) => {
    if (error) {
      res.send({
        error: error,
        message: "There was some error fetching the data.",
      });
    }
    res.send(data);
  });
});
// initialize routes
server.get("/", (req, res) => {
  res.send("hello world!");
});
// start server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
