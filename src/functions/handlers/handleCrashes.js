const { EmbedBuilder, WebhookClient, version } = require("discord.js");
const { inspect } = require("util");
require("dotenv").config();
let { CrashLogs } = process.env;

const webhookClient = new WebhookClient({
  url: CrashLogs.toString(),
  id: "1147879903635722250",
});

module.exports = (client) => {
  const embed = new EmbedBuilder().setColor("ff0000");

  client.on("error", (error) => {
    embed
      .setTitle("Discord API Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setDescription(
        `\`\`\`js\n${inspect(error, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  // client.on("warn", (warn) => {
  //   embed
  //     .setTitle("Discord API Warning")
  //     .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
  //     .setDescription(
  //       `\`\`\`js\n${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``
  //     )
  //     .setTimestamp()
  //     .setFooter({
  //       text: `Warn Code: ${warn.code}`,
  //     });

  //   return webhookClient.send({ embeds: [embed] });
  // });

  client.on("shardError", (error) => {
    embed
      .setTitle("Shard Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setDescription(
        `\`\`\`js\n${inspect(error, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  client.on("shardDisconnect", (event, id) => {
    embed
      .setTitle("Shard Disconnect")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setDescription(
        `\`\`\`js\n${inspect(event, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version} | Shard ID: ${id}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  client.on("shardReconnecting", (id) => {
    embed
      .setTitle("Shard Reconnecting")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setDescription(
        `\`\`\`js\n${inspect(id, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp();

    return webhookClient.send({ embeds: [embed] });
  });

  process.on("uncaughtException", (error, origin) => {
    embed
      .setTitle("Uncaught Exception")
      .setURL(
        "https://nodejs.org/api/process.html#process_event_uncaughtexception"
      )
      .addFields(
        {
          name: "Error",
          value: `\`\`\`js\n${inspect(error, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`js\n${inspect(origin, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  process.on("unhandledRejection", (error, promise) => {
    embed
      .setTitle("Unhandled Rejection")
      .setURL(
        "https://nodejs.org/api/process.html#process_event_unhandledrejection"
      )
      .addFields(
        {
          name: "Error",
          value: `\`\`\`js\n${inspect(error, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        },
        {
          name: "Promise",
          value: `\`\`\`js\n${inspect(promise, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  // process.on("warning", (warning) => {
  //   embed
  //     .setTitle("Uncaught Exception Monitor Warning")
  //     .setURL("https://nodejs.org/api/process.html#process_event_warning")
  //     .setDescription(
  //       `\`\`\`js\n${inspect(warning, { depth: 0 }).slice(0, 1000)}\`\`\``
  //     )
  //     .setTimestamp()
  //     .setFooter({
  //       text: `Warn Code: ${warning.code}`,
  //     });

  //   return webhookClient.send({ embeds: [embed] });
  // });

  process.on("uncaughtExceptionMonitor", (error, origin) => {
    embed
      .setTitle("Uncaught Exception Monitor")
      .setURL(
        "https://nodejs.org/api/process.html#process_event_uncaughtexceptionmonitor"
      )
      .addFields(
        {
          name: "Error",
          value: `\`\`\`js\n${inspect(error, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`js\n${inspect(origin, { depth: 0 }).slice(
            0,
            1000
          )}\`\`\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `DJS Version: ${version}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });

  // process.on("multipleResolves", (type, promise, reason) => {
  //   embed
  //     .setTitle("Multiple Resolves")
  //     .setURL(
  //       "https://nodejs.org/api/process.html#process_event_multipleresolves"
  //     )
  //     .addFields(
  //       {
  //         name: "Type",
  //         value: `\`\`\`js\n${inspect(type, { depth: 0 }).slice(
  //           0,
  //           1000
  //         )}\`\`\``,
  //       },
  //       {
  //         name: "Promise",
  //         value: `\`\`\`js\n${inspect(promise, { depth: 0 }).slice(
  //           0,
  //           1000
  //         )}\`\`\``,
  //       },
  //       {
  //         name: "Reason",
  //         value: `\`\`\`js\n${inspect(reason, { depth: 0 }).slice(
  //           0,
  //           1000
  //         )}\`\`\``,
  //       }
  //     )
  //     .setTimestamp()
  //     .setFooter({
  //       text: `DJS Version: ${version}`,
  //     });

  //   return webhookClient.send({ embeds: [embed] });
  // });

  process.on("exit", (code) => {
    embed
      .setTitle("Process Exit")
      .setURL("https://nodejs.org/api/process.html#process_event_exit")
      .setDescription(
        `\`\`\`js\n${inspect(code, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp()
      .setFooter({
        text: `Exit Code: ${code}`,
      });

    return webhookClient.send({ embeds: [embed] });
  });
};
