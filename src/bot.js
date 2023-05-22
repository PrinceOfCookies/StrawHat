//    ____            _    _
//   / ___|___   ___ | | _(_) ___
//  | |   / _ \ / _ \| |/ / |/ _ \
//  | |__| (_) | (_) |   <| |  __/
//  \____\___/ \___/|_|\_\_|\___|

require("dotenv").config();

const { TOKEN1, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Client: GuildedClient } = require('@guildedjs/guilded.js');
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

console.log(Date.now());

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
//client.checkUser();

// Run client.checkPedo() every 2 minutes
//setInterval(() => {
//  client.checkUser();
//}, 120000);

client.login(TOKEN1);
(async () => {
  await connect(databaseToken).catch(console.error);
})();