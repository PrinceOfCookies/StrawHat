//    ____            _    _
//   / ___|___   ___ | | _(_) ___
//  | |   / _ \ / _ \| |/ / |/ _ \
//  | |__| (_) | (_) |   <| |  __/
//  \____\___/ \___/|_|\_\_|\___|

require("dotenv").config();

const {
  TOKEN1,
  databaseToken,
  CrashLogs,
  mysqlhost,
  mysqluser,
  mysqlpassword,
} = process.env;
const { connect } = require("mongoose");
const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
  WebhookClient,
  version,
} = require("discord.js");
const chalk = require("chalk");
// const { inspect } = require("util");
const fs = require("fs");
const mysql = require("mysql");

// Get current unix timestamp
const mysqlStart = Math.floor(Date.now());

// Create a MySQL connection
const mysqlConnection = mysql.createConnection({
  host: mysqlhost,
  user: mysqluser,
  password: mysqlpassword,
  database: "s1288_Threads_and_Such",
});
const mysqlEnd = Math.floor(Date.now());
console.log(
  `Took ${chalk.yellow(
    Math.floor(mysqlEnd - mysqlStart)
  )}ms to create MySQL connection.`
);

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
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleEvents(mysqlConnection);
client.handleCommands();
client.handleComponents();

const startTime = Math.floor(Date.now());
client.login(TOKEN1);
(async () => {
  const endTime = Math.floor(Date.now());
  // Print how long it took to login
  console.log(
    `Took ${chalk.yellow(Math.floor(endTime - startTime))}ms to login.`
  );
  // Connect to the database
  const dbStart = Math.floor(Date.now());
  await connect(databaseToken).catch(console.error);
  const dbEnd = Math.floor(Date.now());
  console.log(
    `Took ${chalk.yellow(
      Math.floor(dbEnd - dbStart)
    )}ms to connect to the database.`
  );

  // Get the TOTAL time it took to start the bot
  const totalEnd = Math.floor(Date.now());
  console.log(
    `Took ${chalk.yellow(
      Math.floor(totalEnd - mysqlStart)
    )}ms to start the bot.`
  );
})();

// let webhook = new WebhookClient({
//   url: CrashLogs,
// });

// let embed = new EmbedBuilder().setColor("ff0000");

// process.on("uncaughtException", (err) => {
//   console.error(err);

//   embed
//     .setTitle("Uncaught Exception")
//     .setDescription(
//       `\`\`\`js\n${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
//     )
//     .setTimestamp()
//     .setFooter({
//       text: `DJS Version: ${version}`,
//     });

//   webhook.send({ embeds: [embed] });
// });

require("./functions/handlers/handleCrashes")(client);

// Run the checkForums function every 10 seconds
// setInterval(() => {
//   let sTime = Math.floor(Date.now());
//   client.cfbb();
//   console.log(
//     `Finished checking forums after ${chalk.yellow(
//       Math.floor(Date.now() - sTime)
//     )}ms.`
//   );
// }, 10000);
