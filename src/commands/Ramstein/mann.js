const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("mann").setDescription("mann Command"),
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
        "https://open.spotify.com/track/0GxIAMtKFYTQZpR1avO6HB?si=170d4f53fcd74897",
    });

    client.commandDone(interaction.user, "mann", channel)
  },
};
