const express = require("express");
const app = new express();

require("dotenv").config();

const morgan = require("morgan");
const fs = require("fs");
const api = require("./route");

app.use(morgan("dev"));
app.use("/api", api);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});