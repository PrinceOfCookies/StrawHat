const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("wolltihrdasbettinflammensehen").setDescription("wolltihrdasbettinflammensehen"),
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
        "https://open.spotify.com/track/2MC5MLUdhrVUWGHUFHvaLF?si=1f622640ceff4d9e",
    });

    client.commandDone(interaction.user, "wolltihrdasbettinflammensehen", channel)
  },
};
