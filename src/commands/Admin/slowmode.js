const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Sets slowmode")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("amount of time (in seconds) to set slowmode to")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel, options } = interaction;
    const time = options.getInteger("time");

    channel.setRateLimitPerUser(time);

    interaction.reply({
      content: `Channel slowmode has been set to ${time} second(s) by ${interaction.user.tag}`,
    });

    interaction.user.tag = interaction.user.tag.replace("#0", "");
    client.commandDone(interaction.user, "slowmode", channel);
  },
};
