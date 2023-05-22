const User = require(`../../schemas/users`);
const mongoose = require("mongoose");

module.exports = (client) => {
  client.checkCooldown = async (user, command) => {
    const profile = await User.findOne({ userID: user.id });

    // Check if the user is on cooldown
    if (profile.cooldowns[command] + 30 > Date.now()) {
      return true.Date.now() - profile.cooldowns[command];
    } else {
      // return how much longer they are on cooldown for
      return false, Date.now() - profile.cooldowns[command];
    }
  };
};
