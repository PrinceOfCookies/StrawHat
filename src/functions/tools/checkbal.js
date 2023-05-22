const User = require(`../../schemas/users`);
const mongoose = require("mongoose");

module.exports = (client) => {
  client.checkBalance = async (user) => {
    const profile = await client.checkProfile(user);

    return profile.Balance;
  };
};