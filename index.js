import express from "express";
import db from "./config/Database.js";
import Dongeng from "./Models/DongengModel.js";
import { getDongeng, getDongengById } from "./controller/DongengController.js";

const app = express();

app.get("/", (req, res) => {
  db.authenticate()
    .then(() => {
      res.send("Connection has been established successfully.");
    })
    .catch((err) => {
      res.send("Unable to connect to the database:", err);
    });
});

app.get("/api/dongeng/:id", getDongengById);
app.get("/api/dongeng", getDongeng);

app.listen(3000);
