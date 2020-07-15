const express = require("express");
const path = require("path");

const app = express();

app.get("/api/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static/api.html"))
});

app.listen(process.env.PORT || 3002);
