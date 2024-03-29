const path = require('path');
const express = require("express");

const app = express();
const port=process.env.PORT||3000;
app.use(express.static('./build/'));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});


app.listen(port, () => {
  console.log(`PCF-DEPLOY- Dealfinder Server Started on port ${port}`);
});
