const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const TagSchema = require(`../../schemas/tags`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("taglist")
    .setDescription("Command to list the tags"),

  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel } = interaction;

    TagSchema.find({}, async (err, data) => {
      if (err) return console.log(err);
      if (!data.length) {
        interaction.reply({
          content: "There are currently no tags!",
        });
        return;
      }

      let description = "";

      const TagList = new EmbedBuilder()
        .setTitle("List of tags")
        .setDescription("No tags have been made yet");

      for (const dat of data) {
        description +=
          "- Tag Name: " +
          dat.tagName +
          "\nMade by: <@" +
          dat.createdBy +
          ">\n";
      }
      await TagList.setDescription(description);

      await interaction.reply({
        embeds: [TagList],
      });
    });

    client.commandDone(interaction.user, "taglist", channel);
  },
};
