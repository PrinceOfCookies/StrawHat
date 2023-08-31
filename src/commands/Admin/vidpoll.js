const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vidpoll")
    .setDescription("Starts a poll for the video")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction, client) {
    client.checkVideo();
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel } = interaction;

    const rawData = fs.readFileSync(`${__dirname}/../../json/checkvideo.json`);

    const jsonData = JSON.parse(rawData);
    const title = JSON.stringify(jsonData.title);

    const Poll = new EmbedBuilder({
      color: 0x5fb041,
      titile: "Vote on the video!",
      description:
        "What did you think of it? Click the reactions below to vote",
      image: {
        url: jsonData.url,
      },
      author: {
        name: jsonData.author,
        iconURL:
          "https://cdn.discordapp.com/avatars/890994028672319499/6329cfd550e4534ebb498a1482b85dad.webp",
        url: `https://www.youtube.com/@Lifeline4603/sub_confirmation=1`,
      },
      footer: {
        text: `Title: ${jsonData.title}`,
      },
    });

    channel
      .send({
        embeds: [Poll],
      })
      .then(function (message) {
        message.react("👍");
        message.react("👎");
      });

    interaction.reply({
      content: "Poll Posted",
      ephemeral: true,
    });

    interaction.user.tag = interaction.user.tag.replace("#0", "");
    client.commandDone(interaction.user, "vidpoll", channel);
  },
};
