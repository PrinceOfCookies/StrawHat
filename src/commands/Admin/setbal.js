const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setbal")
    .setDescription("Set a users balance.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption((option) =>
      option
        .setName("balance")
        .setDescription("Amount of balance to set.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to set balance for.")
    ),

  async execute(interaction, client) {
    const { options } = interaction;
    let mProfile = await client.checkProfile(interaction.user);

    const user = options.getUser("user") || interaction.user;

    const balance = options.getInteger("balance");

    const Profile = await client.checkProfile(user);

    await Profile;

    if (Profile == "Banned") {
      return;
    }

    const embed = new EmbedBuilder().setColor(0x5fb041);

    await Profile.updateOne({ balance: balance });

    embed.setDescription(
      `Successfully set ${user.username}'s balance to ${balance}`
    );

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
