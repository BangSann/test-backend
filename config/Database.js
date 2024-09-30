import { Sequelize } from "sequelize";
import mysql from "mysql2";

const db = new Sequelize("u216976409_dongeng", "u216976409_CVSrikandiKr", "e2J0sR+Q",{
//   password: "@W34@h9Z",
  host: "154.41.240.52:3306",
  dialect: "mysql",
  dialectModule: mysql,
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default db;
