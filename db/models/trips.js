const { Schema, model } = require("mongoose");

const schema = new Schema({
  model: String,
});

module.exports = model("trips", schema);
