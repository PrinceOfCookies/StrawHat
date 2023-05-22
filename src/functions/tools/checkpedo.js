// Require Neccesary Modules
const fs = require("fs");
const { API_KEY } = process.env;
const { queryMasterServer, REGIONS } = require("steam-server-query");
const Gamedig = require("gamedig");
const chalk = require("chalk");

const TARGET_STEAMID = "STEAM_0:1:438873409"; // GBO
// const TARGET_STEAMID = "STEAM_0:1:493430482"; // Mine
let it = 0;
module.exports = (client) => {
  client.checkUser = async () => {
    queryMasterServer("hl2master.steampowered.com:27011", REGIONS.ALL, {
      empty: 1,
      appid: 4000,
    })
      .then(async (servers) => {
        for (const server of servers) {
          it = it + 1;
          // Wait 0.5 seconds before checking the next server
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Get the IP from servers (everything before the :)
          const serverhost = server.split(":")[0];
          // Get the port from servers (everything after the :)
          const serverport = server.split(":")[1];

          console.log(
            "Looking at server: " +
              chalk.yellow(serverhost) +
              ":" +
              chalk.yellow(serverport) +
              " for " +
              chalk.cyan(TARGET_STEAMID)
          );

          // Check if the server is online before querying it
          try {
            const state = await Gamedig.query({
              type: "garrysmod",
              host: serverhost,
              port: serverport,
              maxAttempts: 1,
              socketTimeout: 250,
              attemptTimeout: 250,
              udpTimeout: 250,
            });

            // Check if TARGET_STEAMID is in the players array
            if (
              state.players.some((player) => player.steamid === TARGET_STEAMID)
            ) {
              // If the TARGET_STEAMID is in the players array, send a message to the channel
              client.channels.cache
                .get("994290515694596176")
                .send(
                  `AT_EVERYONE ${serverhost}:${serverport} has ${TARGET_STEAMID} on it!`
                );
            } else {
              // If the TARGET_STEAMID is not in the players array, send a message to the channel
              console.log(
                chalk.blue(it) +
                  `: ${chalk.cyan(TARGET_STEAMID)} is ${chalk.red(
                    "not"
                  )} on ${chalk.yellow(serverhost)}:${chalk.yellow(serverport)}`
              );
            }
          } catch (err) {
            console.error(
              chalk.blue(it) +
                `: Failed to query server ${chalk.yellow(
                  serverhost
                )}:${chalk.yellow(serverport)}: ${chalk.red(err.message)}`
            );
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
};
