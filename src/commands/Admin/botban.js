const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require(`../../schemas/users`);
const mongoose = require("mongoose");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("botban")
    .setDescription("Botban a user from using the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User whos name you want to change")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);
    await Profile;

    if (Profile == "Banned") {
      return;
    }

    const { channel, options } = interaction;
    const user = await options.getUser("user");

    let tUser = await User.findOne({ userID: user.id });

    if (tUser.BotBanned)
      return interaction.reply({
        content: "This user is already bot banned!",
        ephemeral: true,
      });

    if (user == interaction.user) {
      return interaction.reply({
        content: "You can't botban yourself!",
        ephemeral: true,
      });
    }

    if (user == client.user) {
      return interaction.reply({
        content: "You can't botban me!",
        ephemeral: true,
      });
    }

    if (user.id == "698793333178368040") {
      return interaction.reply({
        content: "You can't botban the owner!",
        ephemeral: true,
      });
    }

    if (!tUser) {
      return interaction.reply({
        content:
          "This user has not used the bot before so they have no profile!",
        ephemeral: true,
      });
    }

    await tUser.updateOne({ BotBanned: true });

    interaction.reply({
      content: `Bot banned ${user.tag} by ${interaction.user.username}`,
    });

    client.commandDone(
      interaction.user,
      "botban",
      channel,
      user.username.toString()
    );
  },
};
