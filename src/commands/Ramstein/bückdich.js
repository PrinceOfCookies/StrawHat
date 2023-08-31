const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bückdich")
    .setDescription("bück dich Command"),
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
      content: "https://youtu.be/7T-CQTodzag",
    });

    client.commandDone(interaction.user, "bückdich", channel);
  },
};
