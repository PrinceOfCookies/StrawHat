const { SlashCommandBuilder } = require("discord.js");
const TagSchema = require(`../../schemas/tags`);
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tagcreate")
    .setDescription("Command to Create a tag")
    .addStringOption((option) =>
      option.setName("tagname").setDescription("Name Of Tag").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tagcontent")
        .setDescription("Contents of the tag")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    const tag_name = options.getString("tagname");
    const tag_content = options.getString("tagcontent");
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


    if (
      interaction.member.roles.cache.has("994262105568059502") ||
      interaction.member.roles.cache.has("994261958641598534")
    ) {
      if (TagSchem) {
        interaction.reply({
          content: `A tag with the name ${tag_name} already exists, it was made by <@${TagSchem.createdBy}> on !`,
        });
        return;
      } else {
        TagSchem = await new TagSchema({
          _id: mongoose.Types.ObjectId(),
          createdBy: interaction.user.id,
          tagName: tag_name,
          tagContent: tag_content,
        });
      }

      interaction.reply({
        content: `Tag ${tag_name} successfully created!`,
      });
    } else {
      interaction.reply({
        content:
          'Sorry, You dont have the "Friends" role or the "Moderation" role so you cant do this command!',
      });
      return
    }

    await TagSchem.save().catch(console.error);
    await Profile.save().catch(console.error);

    client.channels.cache.get("1013569553353150556").send(`${interaction.user.tag} used the tagcreate command, and made a tag with the name \`${tag_name}\``)
  },
};
