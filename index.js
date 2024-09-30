import express from "express";
import db from "./config/Database.js";
import router from "./api/api.js";
import cors from "cors";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
// app.use(cors({
//   origin : "https://ceritapanjikediri.my.id"
// }));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   if (req.url.endsWith(".js")) {
//     res.setHeader("Content-Type", "application/javascript");
//   }
//   next();
// });
// app.use((req, res, next) => {
//   res.setHeader("Content-Type", "application/javascript");
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(cors({
  origin: 'https://ceritapanjikediri.my.id', // Izinkan origin ini
  credentials: true, // Izinkan kredensial jika diperlukan (untuk cookies atau header otentikasi)
}));

app.use(router);

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
