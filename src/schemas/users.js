const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  createdAt: Number,
  balance: {
    default: 5,
    type: Number,
  },
  hp: {
    default: 100,
    type: Number,
  },
  cooldowns: {
    default: {
      shoot: 0,
    },
    type: Object,
  },
  deathCount: {
    default: 0,
    type: Number,
  },
  deaths: {
    default: [],
    type: Array,
  },
  killCount: {
    default: 0,
    type: Number,
  },
  kills: {
    default: [],
    type: Array,
  },
  BotBanned: {
    default: false,
    type: Boolean,
  },
});

module.exports = model("User", userSchema, "Users");
