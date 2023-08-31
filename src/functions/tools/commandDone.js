module.exports = (client) => {
  client.commandDone = async (user, command, channel, moreInfo) => {
    await client.checkProfile(user);
    moreInfo = moreInfo == null ? "" : `(${moreInfo})`;

    client.channels.cache
      .get("1120733360604594200")
      .send(
        `${user.username} (${user.id}) used the ${command} command in <#${channel.id}> ${moreInfo}`
      );
  };
};
