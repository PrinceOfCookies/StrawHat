const {
  SlashCommandBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  ComponentType,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
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
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Select a category.")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands in ${cmd.directory} category.`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const firstMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
    });

    collector.on("collect", (interaction, client) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );
      const categoryEmbed = new EmbedBuilder()
        .setTitle(
          `${emojis[directory.toLowerCase() || null]} ${format(
            directory
          )} commands`
        )
        .setDescription(`All commands in ${directory} category.`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`/${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      firstMessage.edit({ components: components(true) });
    });

    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the help command in <#${interaction.channel.id}>`
      );
  },
};
