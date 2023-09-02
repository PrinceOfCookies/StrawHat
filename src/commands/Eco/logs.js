const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require(`../../schemas/users`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Get the logs for a user")
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("death")
        .setDescription("Get the death logs for a user")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("view")
            .setDescription("View a death log")
            .addStringOption((option) =>
              option
                .setName("deathid")
                .setDescription("The death ID to view")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription("List the last 15 death logs")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to list the death logs for")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("kill")
        .setDescription("Get the kill logs for a user")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("view")
            .setDescription("View a kill log")
            .addStringOption((option) =>
              option.setName("killid").setDescription("The kill ID to view")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription("List the last 15 kill logs")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user to list the kill logs for")
            )
        )
    ),

  async execute(interaction, client) {
    const { channel, options } = interaction;
    const group = options.getSubcommandGroup();
    const type = options.getSubcommand();
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    let Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const user =
      options.getUser("user") == null
        ? interaction.user
        : options.getUser("user");

    Profile = await client.checkProfile(user);

    switch (group) {
      case "death":
        switch (type) {
          case "view":
            const deathID = options.getString("deathid");
            let deathP = await User.findOne({
              deaths: { $elemMatch: { deathID: deathID } },
            });

            if (!deathP) {
              interaction.reply({
                content: "That kill ID does not exist",
                ephemeral: true,
              });
              break;
            }

            let death = deathP.deaths.find((k) => k.deathID == deathID);
            let deduser = await client.users.fetch(deathP.userID);

            const deathEmbed = new EmbedBuilder()
              .setTitle(`Deathlog for ${deduser.username}`)
              .setColor(0x5fb041)
              .setDescription(
                `**Death ID:** ${deathID}\n**Attacker:** ${death.killer}\n**Time of Death:** <t:${death.tod}>\n**Weapon:** ${death.weapon}`
              );

            interaction.reply({
              embeds: [deathEmbed],
            });
            break;

          case "list":
            // Get the last 10 death IDs from the user
            const deathIDS = {};

            let len = Profile.deaths.length > 15 ? 15 : Profile.deaths.length;
            let Description = "";
            for (let i = 0; i < len; i++) {
              deathIDS[i] = Profile.deaths[i].deathID;
              Description += `${i + 1}. ${Profile.deaths[i].deathID}\n`;
            }

            const lb = new EmbedBuilder()
              .setTitle("Deathlog for " + user.username)
              .setColor(0x5fb041)
              .setDescription(Description)
              .setFooter({
                text: "To see more info on a death, use /log death <deathID>",
              });

            interaction.reply({
              embeds: [lb],
            });
            break;
        }
        break;

      case "kill":
        switch (type) {
          case "view":
            const killID = options.getString("killid");
            let KillP = await User.findOne({
              kills: { $elemMatch: { killID: killID } },
            });

            if (!KillP) {
              interaction.reply({
                content: "That kill ID does not exist",
                ephemeral: true,
              });
              break;
            }

            let Killer = KillP.kills.find((k) => k.killID == killID);
            let killeruser = await client.users.fetch(KillP.userID);

            const killEmbed = new EmbedBuilder()
              .setTitle(`Killlog for ${killeruser.username}`)
              .setColor(0x5fb041)
              .setDescription(
                `**Kill ID:** ${killID}\n**Victim:** ${Killer.victim}\n**Time of Death:** <t:${Killer.tod}>\n**Weapon:** ${Killer.weapon}`
              );

            interaction.reply({
              embeds: [killEmbed],
            });

            break;

          case "list":
            // Get the last 10 death IDs from the user
            const killIDS = {};

            len = Profile.kills.length > 15 ? 15 : Profile.kills.length;
            Description = "";
            for (let i = 0; i < len; i++) {
              killIDS[i] = Profile.kills[i].killID;
              Description += `${i + 1}. ${Profile.kills[i].killID}\n`;
            }

            const lb2 = new EmbedBuilder()
              .setTitle("Killlog for " + user.username)
              .setColor(0x5fb041)
              .setDescription(Description)
              .setFooter({
                text: "To see more info on a kill, use /log kill <killID>",
              });

            interaction.reply({
              embeds: [lb2],
            });
            break;
        }
        break;
    }

    client.commandDone(
      interaction.user,
      "logs",
      channel,
      `${user.username} (${group} & ${type})`
    );
  },
};
