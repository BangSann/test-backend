import express from "express";
import db from "./config/Database.js";
import Dongeng from "./Models/DongengModel.js";

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

export const getDongeng = async (req, res) => {
    try {
      const response = await Dongeng.findAll();
      return res.status(200).json(response);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  };

app.get("/api/dongeng" , getDongeng)

app.listen(3000);
