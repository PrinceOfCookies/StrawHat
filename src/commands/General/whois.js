const { SlashCommandBuilder, EmbedBuilder, Guild } = require("discord.js");

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

    if (Profile == "Banned") return end;

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

    const GuildUser = interaction.guild.members.cache.get(user.id);

    if (
      !GuildUser ||
      GuildUser.nickname == null ||
      GuildUser.nickname == undefined
    ) {
      Nick = "None";
      joinedTimestamp = 0;
      Roles = "None";
    } else {
      Nick = GuildUser.nickname;
      joinedTimestamp = GuildUser.joinedTimestamp / 1000;
      Roles = `${GuildUser.roles.cache
        .map((role) => `<@&${role.id}>`)
        .join(", ")}`;
    }

    const Embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Info About ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "Discord Tag",
          value: user.tag,
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
          value: `<t:${joinedTimestamp}>`,
          inline: true,
        },
        {
          name: "Nickname",
          value: Nick,
          inline: true,
        },
        {
          name: "Roles",
          value: Roles,
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [Embed],
    });

    client.channels.cache
      .get("1013569553353150556")
      .send(`${interaction.user.tag} used the whois command on ${user.tag}`);
  },
};
