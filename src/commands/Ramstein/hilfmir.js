const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hilfmir")
    .setDescription("hilfmir Command"),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }
    const { channel } = interaction;

    await interaction.reply({
      content:
        "https://open.spotify.com/track/2STUa7rb27i7mCX7eOvr5K?si=f270c033beb7459d",
    });

    client.commandDone(interaction.user, "hilfmir", channel);
  },
};
