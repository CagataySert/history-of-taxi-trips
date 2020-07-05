const mongoose = require("mongoose");
const config = require("../config");

const connectionString = `mongodb+srv://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.database}`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});
