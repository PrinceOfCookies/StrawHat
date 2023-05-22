const User = require(`../../schemas/users`);

module.exports = (client) => {
  client.setCooldown = async (user, command, time) => {
    const profile = await User.findOne({ userID: user.id });

    // Put the user on cooldown (Using updateOne)
    await profile.updateOne({ [`cooldowns.${command}`]: Date.now() + time });
  };
};
