const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("puppe").setDescription("puppe Command"),
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
        "https://open.spotify.com/track/2iFgHPoa7FNHwgLnjXzu7F?si=9ddc7579ea124796",
    });

    client.commandDone(interaction.user, "puppe", channel)
  },
};
