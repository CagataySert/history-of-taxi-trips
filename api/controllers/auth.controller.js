const statusCodeMessages = require("../../utils/status.codes");
const mockData = require("../../utils/mock.data");
const {
  createNewToken,
  checkIfPasswordsMatched,
} = require("../../utils/auth.helper");

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  // request body must have username and password.
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: false, message: statusCodeMessages[400] });
  }

  try {
    const user = mockData.filter((user) => user.username === username)[0];

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: statusCodeMessages[401] });
    }

    // check incoming password if it matched with user real password or not
    const isPasswordMatched = await checkIfPasswordsMatched(
      req.body.password,
      user.password
    );

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ status: false, message: statusCodeMessages[401] });
    }

    const token = createNewToken(user);
    return res
      .status(200)
      .json({ success: true, token, message: statusCodeMessages[200] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
