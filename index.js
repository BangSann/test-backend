import express from "express";
import router from "./routes/api.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(router)

app.listen(3000);