const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a users avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User u want to get avatar")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel, options } = interaction;
    let user = options.getUser("user");

    if (!user) {
      user = interaction.user;
    }

    await interaction.reply({
      content: user.displayAvatarURL({ dynamic: true }),
    });

    client.commandDone(interaction.user, "avatar", channel);
  },
};
