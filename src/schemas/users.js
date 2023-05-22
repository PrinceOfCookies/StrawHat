const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  createdAt: Number,
  Balance: {
    default: 5,
    type: Number,
  },
  cooldowns: {
    default: {
      "beg": Date.now(),
      "daily": Date.now(),
      "slots": Date.now(),
      "work": Date.now(),
      "fish": Date.now(),
      "steal": Date.now(),
    },
    type: Object,
  },
  BotBanned: {
    default: false,
    type: Boolean,
  },
});

module.exports = model("User", userSchema, "Users");
