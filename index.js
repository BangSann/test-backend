import express from "express";
import db from "./config/Database.js";
import Dongeng from "./Models/DongengModel.js";
import { getDongeng } from "./controller/DongengController.js";

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

app.get("/api/dongeng", getDongeng);

app.listen(3000);
