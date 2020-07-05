const jwt = require("jsonwebtoken");
const config = require("../config");
const statusCodeMessages = require("../utils/status.codes");
const mockData = require("../utils/mock.data");

const verifyToken = async (token) => {
  try {
    // Remove Bearer word from string
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = await jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  // check if header has bearer token
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ status: false, message: statusCodeMessages[401] });
  }

  // remove Bearer word from string
  const token = bearer.split("Bearer ")[1].trim();

  try {
    const payload = await verifyToken(token);

    const user = mockData.filter((user) => user.id === payload.id)[0];

    // check if the user was not found
    if (!user) {
      return res
        .status(401)
        .send({ status: false, message: statusCodeMessages[401] });
    }

    req.user = user;
  } catch (error) {
    console.log(error);
    return res.status(401).send({ status: false, message: error.message });
  }

  next();
};
