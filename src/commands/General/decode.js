const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("decode")
    .setDescription("decodes a string from base64")
    .addStringOption((option) =>
      option
        .setName("str")
        .setDescription("The str to decode")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    const { channel, options } = interaction;
    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const str = options.getString("str");

    const decoded = Buffer.from(str, "base64").toString("ascii");

    interaction.reply({
      content: decoded,
      ephemeral: true,
    });

    client.commandDone(
      interaction.user,
      "decode",
      channel,
      str + " | " + decoded
    );
  },
};
