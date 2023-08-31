const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("steinumstein").setDescription("steinumstein Command"),
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
        "https://open.spotify.com/track/20hfLWeQSJnJ2CiPxmjzsj?si=12b30314ee084b30",
    });

    client.commandDone(interaction.user, "Steinumstein", channel)
  },
};
