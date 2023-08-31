const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Sets someones nickname")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User whos name you want to change")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("What you want to set this users nickname to")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel, options } = interaction;
    const user = options.getUser("user");
    const Nick = options.getString("nickname");

    if (Nick.length > 25) {
      interaction.reply({
        content:
          "That nickname is to long! Try something under 25 characters please",
        ephermeral: true,
      });
    }

    const GuildUser = interaction.guild.members.cache.get(user.id);

    GuildUser.setNickname(Nick);

    client.users.send(
      user.id,
      `Your nickname in Strawhat Fanclub has been changed to ${Nick} by ${interaction.user.tag}`
    );

    interaction.reply({
      content: `Nickname of ${user.tag} set to \`${Nick}\` by ${interaction.user.tag}`,
    });

    interaction.user.tag = interaction.user.tag.replace("#0", "");
    client.commandDone(interaction.user, "setnick", channel, Nick);
  },
};
