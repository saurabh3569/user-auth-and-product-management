const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    require("./entity/User"),
    require("./entity/Product"),
    require("./entity/Otp"),
  ],
});

module.exports = AppDataSource;
