const User = require(`../../schemas/users`);
const mongoose = require("mongoose");

module.exports = (client) => {
  client.checkProfile = async (user) => {
    let Profile = await User.findOne({ userID: user.id });

    // If user is not in the database, create a new profile
    if (!Profile) {
      Profile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: user.id,
        createdAt: Math.floor(Date.now() / 1000),
        balance: 5,
        hp: 100,
        cooldowns: {
          shoot: 0,
        },
        deathCount: 0,
        deaths: [],
        killCount: 0,
        kills: [],
        BotBanned: false,
      });

      await Profile.save().catch(console.error);

      // If possible send user a DM saying that a new profile was created, if not send it in this channel tagging them (994261901473218573)
      client.channels.cache
        .get("1120733360159985759")
        .send(`${user.username}, your profile was created!`);

      return Profile;
    }

    // If the user already has a profile, just save and return it
    await Profile.save().catch(console.error);
    if (Profile.BotBanned) {
      return "Banned";
    }

    return Profile;
  };
};
