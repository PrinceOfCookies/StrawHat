const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
  _id: Schema.Types.ObjectId,
  createdBy: String,
  tagName: String,
  tagContent: String,
});

module.exports = model("tag", tagSchema, "Tags");
