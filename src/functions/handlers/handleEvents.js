const fs = require("fs");
const { connection } = require("mongoose");

module.exports = (client) => {
  client.handleEvents = async (con) => {
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        case "mongo":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once)
              connection.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              connection.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        case "mysql": // Add a new case for MySQL events
          if (!con) con = console.error("No MySQL connection provided.");
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            // Assuming you have a MySQL connection already established
            // Replace `mysqlConnection` with your actual MySQL connection
            if (event.once)
              con.once(event.name, (...args) => event.execute(...args, client));
            else
              con.on(event.name, (...args) => event.execute(...args, client));
          }
          break;

        default:
          break;
      }
    }
  };
};
