const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("sex").setDescription("Sex Command"),
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
        "https://open.spotify.com/track/15f16lrsDzFeNpHYBTzHLI?si=2e70a9903a8b45b5",
    });

    client.commandDone(interaction.user, "sex", channel);
  },
};
