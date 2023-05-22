const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("donthelp")
    .setDescription("How may I help you today?"),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }


    const emojis = {
      general: "💬",
      admin: "🦢",
      friends: "🤼",
      other: "🛠",
    };

    const folders = [
      ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
    ];
    const format = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    let categories = folders.map((f) => {
      const commands = interaction.client.commands
        .filter((cmd) => cmd.folder === f)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description: cmd.data.description || "No description set.",
          };
        });

      return {
        directory: format(f),
        commands: commands,
      };
    });

    const exclude = [""]; //list of the folders you want to exclude with a capital letter for the 1st letter
    categories = categories.filter(
      ({ directory }) => !exclude.includes(directory)
    );

    const embed = new EmbedBuilder().setDescription("Choose a category.");

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Select a category.")
          .addOptions(
            categories.map((c) => ({
              label: c.directory,
              value: c.directory,
              description: c.directory,
              emoji: emojis[c.directory.toLowerCase()],
            }))
          )
          .setDisabled(state)
      ),
    ];

    const msg = await interaction.reply({
      content: "Loading...",
      embeds: [embed],
      components: components(true),
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });



    collector.on("collect", async (i) => {
      if (i.isSelectMenu()) {
        const category = categories.find(
          (c) => c.directory.toLowerCase() === i.values[0]
        );

        const embed = new EmbedBuilder()
          .setTitle(`${category.directory} Commands`)
          .setDescription(
            category.commands
              .map((cmd) => `\`${cmd.name}\` - ${cmd.description}`)
              .join("\n")
          );

        await i.update({
          embeds: [embed],
          components: components(false),
        });
        
      }

    });



    collector.on("end", async (i) => {
      if (i.size === 0) {
        await msg.edit({
          content: "Timed out.",
          components: [],
        });
      }
    });



    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the help command in <#${interaction.channel.id}>`
      );
  },
};
