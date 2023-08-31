const { SlashCommandBuilder } = require("discord.js");
const TagSchema = require(`../../schemas/tags`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tag")
    .setDescription("Command to use a tag")
    .addStringOption((option) =>
      option.setName("tagname").setDescription("Name Of Tag").setRequired(true)
    ),

  async execute(interaction, client) {
    const { channel, options } = interaction;

    const tag_name = options.getString("tagname");
    let TagSchem = await TagSchema.findOne({
      tagName: options.getString("tagname"),
    });
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    if (!TagSchem) {
      interaction.reply({
        content: `Tag non existant!`,
      });
      return;
    } else {
      interaction.reply({
        content: TagSchem.tagContent,
      });
    }

    await TagSchem.save().catch(console.error);

    client.commandDone(interaction.user, "tag", channel, tag_name);
  },
};
