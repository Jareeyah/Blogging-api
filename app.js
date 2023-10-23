const express = require("express");
const path = require("path");
const app = express();

const PORT = 7800;

app.listen(PORT, () => {
  console.log(`Server successfully running on ${PORT}`);
});
