//    ____            _    _
//   / ___|___   ___ | | _(_) ___
//  | |   / _ \ / _ \| |/ / |/ _ \
//  | |__| (_) | (_) |   <| |  __/
//  \____\___/ \___/|_|\_\_|\___|

require("dotenv").config();

const { TOKEN1, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

// Get current unix timestamp
const startTime = Math.floor(Date.now() / 1000);

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
client.channelInfo();

client.login(TOKEN1);
(async () => {
  // Print how long it took to login
  console.log(`Logged in after ${(Math.floor(Date.now() / 1000) - startTime)} seconds.`);
  await connect(databaseToken).catch(console.error);
  console.log(`Connected to database after ${(Math.floor(Date.now() / 1000) - startTime)} seconds.`);
})();