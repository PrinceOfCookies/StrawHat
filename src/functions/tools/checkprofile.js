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
        Balance: 5,
        cooldowns: {
          beg: Date.now(),
          daily: Date.now(),
          slots: Date.now(),
          work: Date.now(),
          fish: Date.now(),
          steal: Date.now(),
        },
        // Current Time Unix Timestamp
        createdAt: Math.floor(Date.now() / 1000),
        BotBanned: false,
      });

      await Profile.save().catch(console.error);

      // If possible send user a DM saying that a new profile was created, if not send it in this channel tagging them (994261901473218573)
      try {
        await user.send(`Your profile was created!`);
      } catch (err) {
        client.channels.cache
          .get("994261901473218573")
          .send(`${user}, your profile was created!`);
      }

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
