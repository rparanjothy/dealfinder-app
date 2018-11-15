const path = require('path');
const express = require("express");

app = express();

app.use(express.static('../client/build/'));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
