const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("get someones profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User u want to get the profile of")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const Profile = await client.checkProfile(interaction.user);
    let Profile2;
    let hp = Profile.hp;
    // Get the LAST death time of the user, in the deaths array.
    let p1deaths = Profile.deaths[Profile.deaths.length - 1];
    let lastDeathTOD = Profile.deaths.length > 0 ? p1deaths.tod : "Never";

    if (Profile === "Banned") return end;

    const { channel, options } = interaction;
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
    const Embed = new EmbedBuilder()
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
      embeds: [Embed],
    });

    client.commandDone(
      interaction.user,
      "profile",
      channel,
      `${user.username}`
    );
  },
};
