import express from "express";
import db from "./config/Database.js";
import router from "./api/api.js";

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

app.use(router)

// auth
// app.post("/api/login", login);

app.listen(3000);
