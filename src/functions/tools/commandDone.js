module.exports = (client) => {
  client.commandDone = async (user, command, channel, moreInfo) => {
    let profile = await client.checkProfile(user);
    moreInfo = moreInfo == null ? "" : `(${moreInfo})`;

    client.channels.cache
      .get("1120733360604594200")
      .send(
        `${user.username} (${user.id}) used the ${command} command in <#${channel.id}> ${moreInfo}`
      );

    command = command.toLowerCase();

    switch (command) {
      case "beg":
        await profile.updateOne({ $inc: { "commandsUsed.beg": 1 } });
        console.log(`Beg: ${user.username}: Count: %d`, profile.commandsUsed.beg);
        break;
      case "attack":
        await profile.updateOne({ $inc: { "commandsUsed.attack": 1 } });
        console.log(`Attack: ${user.username}: Count: %d`, profile.commandsUsed.attack);
        break;
      case "logs":
        await profile.updateOne({ $inc: { "commandsUsed.logs": 1 } });
        console.log(`Logs: ${user.username}: Count: %d`, profile.commandsUsed.logs);
        break;
      case "balance":
        await profile.updateOne({ $inc: { "commandsUsed.balance": 1 } });
        console.log(`Balance: ${user.username}: Count: %d`, profile.commandsUsed.balance)
        break;
      case "monkey":
        await profile.updateOne({ $inc: { "commandsUsed.monkey": 1 } });
        console.log(`Monkey: ${user.username}: Count: %d`, profile.commandsUsed.monkey);
        break;
      case "foot":
        await profile.updateOne({ $inc: { "commandsUsed.foot": 1 } });
        console.log(`Foot: ${user.username}: Count: %d`, profile.commandsUsed.foot);
        break;
    }
  };
};
