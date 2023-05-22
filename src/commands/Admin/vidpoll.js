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
          "https://media.discordapp.net/attachments/1021097558942175292/1047885083060740216/cozy.png",
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

    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the vidpoll command in <#${interaction.channel.id}>`
      );
  },
};
