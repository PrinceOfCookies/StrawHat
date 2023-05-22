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


    await interaction.reply({
      content:
        "https://open.spotify.com/track/0GxIAMtKFYTQZpR1avO6HB?si=170d4f53fcd74897",
    });

    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the mann command in <#${interaction.channel.id}>`
      );
  },
};
