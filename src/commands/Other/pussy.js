const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("pussy")
    .setDescription("Pussy Command"),
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
        "https://open.spotify.com/track/50AB24h51HlBrp6PqOg50k?si=27abd30f996b480c",
    });

    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the pussy command in <#${interaction.channel.id}>`
      );
  },
};
