const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("duhast").setDescription("duhast"),
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
        "https://open.spotify.com/track/4xIbLpddk8s7uis3iAQT98?si=PZU7ZunyThSKSvK3o_5Y5w",
    });

    client.commandDone(interaction.user, "duhast", channel);
  },
};
