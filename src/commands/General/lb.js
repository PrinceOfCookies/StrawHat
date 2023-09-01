const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Users = require(`../../schemas/users`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lb")
    .setDescription("leaderboards for the bot")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deaths")
        .setDescription("List the top 10 users with the most deaths")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kills")
        .setDescription("List the top 10 users with the most kills")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("balance")
        .setDescription("List the top 10 users with the most balance")
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

    const type = options.getSubcommand();

    Users.find({}, async (err, users) => {
      if (err) console.log(err);
      if (!users.length) {
        interaction.reply({
          content: "No users found",
        });
      }
      let Title = "";
      let Description = "";

      switch (type) {
        case "deaths":
          Title = "Top 10 Deaths (amounts)";

          for (user of users) {
            if (user.deathCount <= 0) {
              // Kick them out of the users array
              users.splice(user, 1);
            }
          }

          users.sort((a, b) => {
            return b.deathCount - a.deathCount;
          });

          let dlen = users.length > 10 ? 10 : users.length;
          for (let i = 0; i < dlen; i++) {
            Description += `${i + 1}. <@${users[i].userID}> - ${
              users[i].deathCount
            }\n`;
          }

          break;
        case "kills":
          Title = "Top 10 Kills (amounts)";

          for (user of users) {
            if (user.killCount <= 0) {
              users.splice(user, 1);
            }
          }

          users.sort((a, b) => {
            return b.killCount - a.killCount;
          });

          let klen = users.length > 10 ? 10 : users.length;
          for (let i = 0; i < klen; i++) {
            Description += `${i + 1}. <@${users[i].userID}> - ${
              users[i].killCount
            }\n`;
          }

          break;
        case "balance":
          Title = "Top 10 Balance (amounts)";

          for (user of users) {
            if (user.Balance <= 0) {
              users.splice(user, 1);
            }
          }

          users.sort((a, b) => {
            return b.balance - a.balance;
          });

          let blen = users.length > 10 ? 10 : users.length;
          for (let i = 0; i < blen; i++) {
            Description += `${i + 1}. <@${users[i].userID}> - ${
              users[i].balance
            }\n`;
          }

          break;
      }

      const lbList = new EmbedBuilder()
        .setTitle(Title)
        .setDescription(Description)
        .setColor(0x5fb041);

      await interaction.reply({
        embeds: [lbList],
      });
    });

    client.commandDone(interaction.user, "lb", channel, `${type}`);
  },
};
