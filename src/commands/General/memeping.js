const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memeping")
    .setDescription("Gives the person the memeping role"),
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

    // Give everyone who does this command this role (1098050551071133757) if they dont already have it
    const role = interaction.guild.roles.cache.get("1102254598485446677");

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

    client.commandDone(interaction.user, "memeping", channel);
  },
};
