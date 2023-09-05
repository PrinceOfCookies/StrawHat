//    ____            _    _
//   / ___|___   ___ | | _(_) ___
//  | |   / _ \ / _ \| |/ / |/ _ \
//  | |__| (_) | (_) |   <| |  __/
//  \____\___/ \___/|_|\_\_|\___|

require("dotenv").config();

const { TOKEN1, databaseToken, CrashLogs } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits, EmbedBuilder, WebhookClient, version } = require("discord.js");
const chalk = require("chalk");
const { inspect } = require("util");
const fs = require("fs");

// Get current unix timestamp
const startTime = Math.floor(Date.now());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(TOKEN1);
(async () => {
  // Print how long it took to login
  console.log(`Logged in after ${chalk.yellow(Math.floor(Date.now() - startTime))}ms.`);
  await connect(databaseToken).catch(console.error);
  console.log(`Connected to database after ${chalk.yellow(Math.floor(Date.now() - startTime))}ms.`);
})();

let webhook = new WebhookClient({
  url: CrashLogs,
});

let embed = new EmbedBuilder()
  .setColor("ff0000")
  
process.on("uncaughtException", (err) => {
  console.error(err);
  
  embed
    .setTitle("Uncaught Exception")
    .setDescription(`\`\`\`js\n${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
    .setTimestamp()
    .setFooter({
      text: `DJS Version: ${version}`
    });

  webhook.send({ embeds: [embed] });
});

require("./functions/handlers/handleCrashes")(client);