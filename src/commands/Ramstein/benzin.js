const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("benzin").setDescription("benzin Command"),
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
        "https://www.youtube.com/watch?v=z0wK6s-6cbo",
    });

    client.commandDone(interaction.user, "Benzin", channel)
  },
};
