const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("get info on someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User u want to whois")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const Profile = await client.checkProfile(interaction.user);
    let Profile2;

    if (Profile === "Banned") return end;

    const { channel, options } = interaction;
    let user = options.getUser("user");

    let createdAt = Profile.createdAt;

    if (!user) {
      user = interaction.user;
    } else {
      Profile2 = await client.checkProfile(user);
      createdAt = Profile2.createdAt;
    }

    

    let Nick = "";
    let joinedTimestamp = "";
    let Roles = "";
    let numRoles = "";

    const GuildUser = interaction.guild.members.cache.get(user.id);
    console.log(
      GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .join(", ")
    );
    console.log(
      GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.id)
        .slice(0, numRoles - 1)
        .join(", ")
    );
    if (!GuildUser) {
      Nick = "None";
      joinedTimestamp = 0;
      Roles = "None";
    } else if (GuildUser.nickname == null || GuildUser.nickname == undefined) {
      joinedTimestamp = GuildUser.joinedTimestamp / 1000;
      numRoles = GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role).size;
      Roles = `Debug ${GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.id)
        .slice(0, numRoles - 1)
        .join(", ")}`;
      Nick = "None";
    } else {
      Nick = GuildUser.nickname;
      joinedTimestamp = GuildUser.joinedTimestamp / 1000;
      numRoles = GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role)
        .join(", ").size;
      Roles = `Debug ${GuildUser.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((role) => role.id)
        .slice(0, numRoles - 1)
        .join(", ")}`;
    }

    const Embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Info About ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Discord Name",
          value: user.username,
          inline: true,
        },
        {
          name: "Discord ID",
          value: user.id,
          inline: true,
        },
        {
          name: "Profile Made",
          value: `<t:${createdAt}>`,
          inline: true,
        },
        {
          name: "Account Creation Date",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}>`,
          inline: true,
        },
        {
          name: "Server Join Date",
          value: `<t:${Math.floor(joinedTimestamp)}>`,
          inline: true,
        },
        {
          name: "Nickname",
          value: Nick,
          inline: true,
        },
        {
          name: "Roles",
          value: Roles.toString(),
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [Embed],
    });

    client.commandDone(interaction.user, "whois", channel);
  },
};
