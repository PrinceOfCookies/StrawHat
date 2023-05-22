const { SlashCommandBuilder } = require("discord.js");

const math = require("mathjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("Calcutes a math problem")
    .addStringOption((option) =>
      option
        .setName("problem")
        .setDescription("The problem you want to calculate")
        .setRequired(true)
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


    const problem = interaction.options.getString("problem");

    // Check if the problem has any non math characters
    if (!/^[0-9()+-/*^]+$/.test(problem)) {
      return interaction.reply({
        content: "Please only use numbers and math symbols",
        ephemeral: true,
      });
    }

    const answer = math.evaluate(problem);

    await interaction.reply(answer.toString());

    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the calc (${problem} : ${answer})  command in <#${interaction.channel.id}>`
      );
  },
};
