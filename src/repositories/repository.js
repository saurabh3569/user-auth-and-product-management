const AppDataSource = require("../data-source");

const getUserRepository = () => AppDataSource.getRepository("User");
const getOtpRepository = () => AppDataSource.getRepository("Otp");
const getProductRepository = () => AppDataSource.getRepository("Product");

module.exports = { getUserRepository, getOtpRepository, getProductRepository };
