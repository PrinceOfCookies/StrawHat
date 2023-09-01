const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("get someones profile")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("eco")
        .setDescription("get someones eco profile")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who do you want to get the profile of?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("general")
        .setDescription("get someones general profile")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Who do you want to get the profile of?")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const { channel, options } = interaction;
    const type = options.getSubcommand();
    const ruser = options.getUser("user");
    switch (type) {
      case "eco":
        const Profile = await client.checkProfile(interaction.user);
        let Profile2;
        let hp = Profile.hp;
        // Get the LAST death time of the user, in the deaths array.
        let p1deaths = Profile.deaths[Profile.deaths.length - 1];
        let lastDeathTOD = Profile.deaths.length > 0 ? p1deaths.tod : "Never";

        if (Profile === "Banned") return end;
        let user = options.getUser("user");

        if (!user) {
          user = interaction.user;
        } else {
          Profile2 = await client.checkProfile(user);
          hp = Profile2.hp;
          let p2deaths = Profile2.deaths[Profile2.deaths.length - 1];
          lastDeathTOD = Profile2.deaths.length > 0 ? p2deaths.tod : "Never";
        }

        let Balance = await client.checkBalance(user);

        // Find out the last death by checking the `tod` inside the death info, in the deaths array. If there are no deaths, then it will say "Never"
        lastDeath = lastDeathTOD == "Never" ? "Never" : `<t:${lastDeathTOD}>`;
        const eEmbed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`${user.username}'s Profile`)
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .addFields(
            {
              name: "Name",
              value: user.username,
              inline: false,
            },
            {
              name: "Balance",
              value: Balance.toString(),
              inline: true,
            },
            {
              name: "HP",
              value: hp.toString(),
              inline: true,
            },
            {
              name: "Last Death",
              value: lastDeath,
              inline: false,
            }
          );

        await interaction.reply({
          embeds: [eEmbed],
        });
        break;
      case "general":
        const rProfile = await client.checkProfile(interaction.user);
        let guser = options.getUser("user");

        let createdAt = rProfile.createdAt;

        if (!guser) {
          guser = interaction.user;
        } else {
          rProfile2 = await client.checkProfile(guser);
          createdAt = rProfile2.createdAt;
        }

        let Nick = "";
        let joinedTimestamp = "";
        let Roles = "";
        let numRoles = "";

        const GuildUser = interaction.guild.members.cache.get(guser.id);
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
        } else if (
          GuildUser.nickname == null ||
          GuildUser.nickname == undefined
        ) {
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
          .setTitle(`Info About ${guser.username}`)
          .setThumbnail(guser.displayAvatarURL({ dynamic: true }))
          .addFields(
            {
              name: "Discord Name",
              value: guser.username,
              inline: true,
            },
            {
              name: "Discord ID",
              value: guser.id,
              inline: true,
            },
            {
              name: "Profile Made",
              value: `<t:${createdAt}>`,
              inline: true,
            },
            {
              name: "Account Creation Date",
              value: `<t:${Math.floor(guser.createdTimestamp / 1000)}>`,
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
        break;
    }

    client.commandDone(
      interaction.user,
      "profile",
      channel,
      `${ruser.username} (${type})`
    );
  },
};
