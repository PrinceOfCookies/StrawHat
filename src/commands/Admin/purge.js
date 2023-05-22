const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  channelMention,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clear a specific amount of messages from a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to clear.")
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

    const amount = options.getInteger("amount");

    const purge = new EmbedBuilder().setColor(0x5fb041);
    await channel.bulkDelete(amount, true).then((messages) => {
      purge.setDescription(
        `Succesfully deleted ${messages.size} messages from the channel.`
      );
      interaction.reply({ embeds: [purge], ephemeral: true });
    });

    client.channels.cache.get("1013569553353150556").send(`${interaction.user.tag} used the purge command and purged ${amount} messages in <#${interaction.channel.id}>`)
  },
};
