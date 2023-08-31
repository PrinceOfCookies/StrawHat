const { SlashCommandBuilder, version, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require("os");
let cpuStat = require("cpu-stat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("status command"),
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

    // Function to pick a random color
    function randomColor() {
      var colors = [
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#00FFFF",
        "#FF00FF",
        "#C0C0C0",
        "#FFA500",
        "#800080",
        "#008000",
        "#808000",
        "#800000",
        "#000080",
        "#808080",
        "#008080",
        "#0000A0",
        "#000000",
        "#FF6347",
        "#FF7F50",
        "#FF8C00",
        "#FFA500",
        "#FFD700",
        "#FFFF00",
        "#ADFF2F",
        "#00FF00",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    const embed = new EmbedBuilder()
      .setTitle("Status: ONLINE")
      .setColor(randomColor())
      .addFields(
        { name: "👾 DJS Version", value: version, inline: false },
        { name: "🤖 Node Version", value: process.version, inline: false },
        {
          name: "⌚️ Uptime",
          value: moment
            .duration(client.uptime)
            .format(" D [days], H [hrs], m [mins], s [secs]"),
          inline: false,
        },
        {
          name: "Memory Usage",
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
          inline: false,
        },
        {
          name: "CPU Usage",
          value: "Unknown",
          inline: false,
        },
        {
          name: "💻 OS",
          value: `${os.platform()} ${os.arch()}`,
          inline: false,
        },
        {
          name: "CPU",
          value: `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``,
          inline: false,
        },
        { name: "API Latency", value: `${client.ws.ping}ms`, inline: false },
        {
          name: "Client Ping",
          value: `${Date.now() - interaction.createdTimestamp}ms`,
          inline: false,
        }
      )
      .setFooter({
        text: "Credit to Jigzyy for the command",
      });

    await interaction.reply({
      embeds: [embed],
    });

    client.commandDone(interaction.user, "status", channel);
  },
};
