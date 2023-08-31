module.exports = (client) => {
  client.checkBalance = async (user) => {
    const profile = await client.checkProfile(user);

    if (profile == "Banned") {
      return "Banned";
    }

    return profile.balance;
  };
};
