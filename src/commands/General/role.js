const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Gives the person the bot notified role")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("botnotified")
        .setDescription("Gives the person the bot notified role")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("memeping")
        .setDescription("Gives the person the memeping role")
    ),
  async execute(interaction, client) {
    const { channel, options } = interaction;
    const type = options.getSubcommand();
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    let role = null
    switch (type) {
      case "botnotified":
        role = interaction.guild.roles.cache.get("1120733358394200168");

        if (!interaction.member.roles.cache.has(role.id)) {
          interaction.member.roles.add(role);
          interaction.reply({
            content: "You have been given the role",
          });
        } else {
          interaction.member.roles.remove(role);
          interaction.reply({
            content: "You have been removed from the role",
          });
        }
        break;

      case "memeping":
        role = interaction.guild.roles.cache.get("1120733358394200167");

        if (!interaction.member.roles.cache.has(role.id)) {
          interaction.member.roles.add(role);
          interaction.reply({
            content: "You have been given the role",
          });
        } else {
          interaction.member.roles.remove(role);
          interaction.reply({
            content: "You have been removed from the role",
          });
        }
        break;
    }

    client.commandDone(interaction.user, "role", channel, type);
  },
};
