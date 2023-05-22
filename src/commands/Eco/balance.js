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

    let Balance = 0;

    if (user) {
      let Balance = await client.checkBalance(user);
      await interaction.reply({
        content: `${user.tag} has ${Balance} coins`,
      });
    } else {
      let Balance = await client.checkBalance(interaction.user);
      await interaction.reply({
        content: `You have ${Balance} coins`,
      });
    }

    // Log the command usage
    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the balance command in <#${interaction.channel.id}>`
      );
  },
};
