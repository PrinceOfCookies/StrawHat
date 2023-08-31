const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("get a users balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Persons balance u want to check")
        .setRequired(false)
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

    const user = await options.getUser("user");

    const ruser = !user ? interaction.user : user;

    let Balance = await client.checkBalance(ruser);
    await interaction.reply({
      content: `${user.username} has ${Balance} coins`,
    });

    // Log the command usage
    client.commandDone(interaction.user, "balance", channel, user.username);
  },
};
