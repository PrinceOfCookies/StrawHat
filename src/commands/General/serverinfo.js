const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Gives info of server"),
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
    // Gets the server info
    const serverInfo = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Server Info")
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        // Server Owner Tag
        {
          name: "Server Owner",
          value: `<@${interaction.guild.ownerId}>`,
          inline: true,
        },
        // Server Creation Date
        {
          name: "Server Creation Date",
          value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}>`,
          inline: true,
        },
        // Server Member Count
        {
          name: "Server Member Count",
          value: `${interaction.guild.memberCount}`,
          inline: true,
        },
        // Number of roles
        {
          name: "Number of Roles",
          value: `${interaction.guild.roles.cache.size}`,
          inline: true,
        },
        // Roles
        {
          name: "Roles",
          value: `${interaction.guild.roles.cache
            .map((role) => `<@&${role.id}>`)
            .join(", ")}`,
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [serverInfo],
    });

    client.commandDone(interaction.user, "serverinfo", channel)
  },
};
