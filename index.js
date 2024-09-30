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

// app.use(express.static(path.join(__dirname, "public")));

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

const allowedOrigins = ['http://localhost:5173', 'https://ceritapanjikediri.my.id'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies or authentication headers
}));

app.get('/pdf/:fileName', (req, res) => {
  // Serve your file, e.g., KEONG MAS.pdf
  res.sendFile(`path/to/your/pdf/${req.params.fileName}`);
});

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
