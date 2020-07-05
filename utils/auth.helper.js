const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");

const createNewToken = (user) => {
  return jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.tokenLife,
  });
};

const checkIfPasswordsMatched = async (reqPassword, userPassword) => {
  return await bcrypt.compare(reqPassword, userPassword);
};

module.exports = {
  createNewToken,
  checkIfPasswordsMatched,
};
