const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the ping"),
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
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const NewMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${
      message.createdTimestamp - interaction.createdTimestamp
    }`;
    await interaction.editReply({
      content: NewMessage,
    });

    client.commandDone(interaction.user, "ping", channel);
  },
};
