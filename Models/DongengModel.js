import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// const Dongeng = db.define(
//   "dongeng",
//   {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: DataTypes.STRING,
//     fileName: DataTypes.STRING,
//     PdfPath: DataTypes.STRING,
//     view: DataTypes.INTEGER,
//     cover: DataTypes.STRING,
//   },
//   { freezeTableName: true }
// );

// title:varchar, pdfURL:varchar, cover:varchar, filename:varchar
const Dongeng = db.define(
  "dongeng",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    pdfURL: DataTypes.STRING,
    cover: DataTypes.STRING,
    filename: DataTypes.STRING,
    view: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);

export default Dongeng;
