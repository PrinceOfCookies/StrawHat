const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("deathlogs")
    .setDescription("gets the death logs on a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("user to check")
    ),

  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    let Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel, options } = interaction;

    const user =
      options.getUser("user") == null
        ? interaction.user
        : options.getUser("user");

    Profile = await client.checkProfile(user);

    // Get the last 10 death IDs from the user
    const deathIDS = {};

    let len = Profile.deaths.length > 10 ? 10 : Profile.deaths.length;
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
        text: "To see more info on a death, use /deathlog <deathID>",
      });

    interaction.reply({
      embeds: [lb],
    });

    client.commandDone(
      interaction.user,
      "deathlogs",
      channel,
      `${user.username} (${user.id})`
    );
  },
};
