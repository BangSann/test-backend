import { Sequelize } from "sequelize";
import mysql from "mysql2";

const db = new Sequelize("b2ysrs0ge9xzwhcyr5ic", "uan8q6bqn2zfixz7", "LcqQeMGhNTiHiBEBTU4k", {
    host: "b2ysrs0ge9xzwhcyr5ic-mysql.services.clever-cloud.com",
    dialect: "mysql",
    dialectModule: mysql,
});


db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default db