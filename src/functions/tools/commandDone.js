module.exports = (client) => {
  client.commandDone = async (user, command, channel, moreInfo) => {
    let Profile = await client.checkProfile(user);
    moreInfo = moreInfo == null ? "" : `(${moreInfo})`;

    client.channels.cache
      .get("1120733360604594200")
      .send(
        `${user.username} (${user.id}) used the ${command} command in <#${channel.id}> ${moreInfo}`
      );

    command = command.toLowerCase();

    switch (command) {
      case "beg":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg + 1,
            attack: Profile.commandsUsed.attack,
            logs: Profile.commandsUsed.logs,
            balance: Profile.commandsUsed.balance,
            monkey: Profile.commandsUsed.monkey,
            foot: Profile.commandsUsed.foot,
          },
        });
        console.log(
          `Beg: ${user.username}: Count: %d`,
          Profile.commandsUsed.beg
        );
        break;
      case "attack":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg,
            attack: Profile.commandsUsed.attack + 1,
            logs: Profile.commandsUsed.logs,
            balance: Profile.commandsUsed.balance,
            monkey: Profile.commandsUsed.monkey,
            foot: Profile.commandsUsed.foot,
          },
        });
        console.log(
          `Attack: ${user.username}: Count: %d`,
          Profile.commandsUsed.attack
        );
        break;
      case "logs":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg,
            attack: Profile.commandsUsed.attack,
            logs: Profile.commandsUsed.logs + 1,
            balance: Profile.commandsUsed.balance,
            monkey: Profile.commandsUsed.monkey,
            foot: Profile.commandsUsed.foot,
          },
        });
        console.log(
          `Logs: ${user.username}: Count: %d`,
          Profile.commandsUsed.logs
        );
        break;
      case "balance":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg,
            attack: Profile.commandsUsed.attac,
            logs: Profile.commandsUsed.logs,
            balance: Profile.commandsUsed.balance + 1,
            monkey: Profile.commandsUsed.monkey,
            foot: Profile.commandsUsed.foot,
          },
        });
        console.log(
          `Balance: ${user.username}: Count: %d`,
          Profile.commandsUsed.balance
        );
        break;
      case "monkey":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg,
            attack: Profile.commandsUsed.attack,
            logs: Profile.commandsUsed.logs,
            balance: Profile.commandsUsed.balance,
            monkey: Profile.commandsUsed.monkey + 1,
            foot: Profile.commandsUsed.foot,
          },
        });
        console.log(
          `Monkey: ${user.username}: Count: %d`,
          Profile.commandsUsed.monkey
        );
        break;
      case "foot":
        await Profile.updateOne({
          commandsUsed: {
            beg: Profile.commandsUsed.beg,
            attack: Profile.commandsUsed.attack,
            logs: Profile.commandsUsed.logs,
            balance: Profile.commandsUsed.balance,
            monkey: Profile.commandsUsed.monkey,
            foot: Profile.commandsUsed.foot + 1,
          },
        });
        console.log(
          `Foot: ${user.username}: Count: %d`,
          Profile.commandsUsed.foot
        );
        break;
    }
  };
};
