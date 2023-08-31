const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const chalk = require("chalk");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`)

    
    function myFunction(CF) {
      console.log(chalk.blue(`Command Category: ${chalk.yellow(CF)} have been loaded`));
    }

    commandFolders.forEach(myFunction)


    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        let commandSTime = Math.floor(Date.now());
        const command = require(`../../commands/${folder}/${file}`);
        const properties = { folder, ...command }; //add that line for the help command
        commands.set(command.data.name, properties); //line 19 or something like that, edit command > properties
        commandArray.push(command.data.toJSON());
        console.log(chalk.blue(`Command: ${chalk.yellow(command.data.name)} took ${chalk.yellow(Math.floor(Date.now()) - commandSTime)}ms to load`));
      };
    }




    const clientId = `1013168527831744534`;
    const guildId = `994261901473218570`;
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN1);
    try {
      console.log(chalk.cyan("Started refreshing application (/) commands."));

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      console.log(chalk.green("Successfully reloaded application (/) commands."));
    } catch (error) {
      console.log(error);
    }
  };
};

