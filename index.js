import express from "express";
import db from "./config/Database.js";
import router from "./api/api.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
app.use(cors());

app.use(express.static(path.resolve("./public")))
// app.use(express.static(path.join('public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static("public" , {
  setHeaders: (res, path, stat) => {
    if (path.endsWith(".pdf")) {
      res.set("Content-Type", "application/pdf");
    }
  }
}));


app.use(router)

app.get("/", (req, res) => {
  db.authenticate()
    .then(() => {
      res.send("Connection has been established successfully.");
    })
    .catch((err) => {
      res.send("Unable to connect to the database:", err);
    });
});

app.listen(3000);
