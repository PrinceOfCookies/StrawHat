const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money"),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // Wait to continue till we get profile back
    await Profile;

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    // Check if the user is on cooldown for this command
    const Passed = await client.checkCooldown(interaction.user, "beg");

    console.log("Time Left" + Passed);

    if (!Passed) {
      return interaction.reply({
        content: `You are on cooldown for this command, please wait ${Passed} seconds before using this command again`,
        ephemeral: true,
      });
    }

    // Set Cooldown for user
    client.setCooldown(interaction.user, "beg", 300);

    const Bal = Profile.Balance;

    // Make a table of celeb names
    const celebs = {
      1: "Elon Musk",
      2: "Jeff Bezos",
      3: "Bill Gates",
      4: "Mark Zuckerberg",
      5: "Steve Jobs",
      6: "Tim Cook",
      7: "Steve Wozniak",
      8: "Larry Page",
      9: "Sergey Brin",
      10: "Larry Ellison",
      11: "Sundar Pichai",
      12: "Satya Nadella",
      13: "Jack Dorsey",
    };

    // Get a random celeb
    let celeb = celebs[Math.floor(Math.random() * 13)];
    // Get a random amount of money
    let Money = Math.floor(Math.random() * 9);

    let Message = "";

    // Make a table of messages the celeb can say
    const messages = {
      Yes: {
        1: `Here's: ${Money} coins`,
        2: `Take this: ${Money} coins`,
        3: `I'll give you some, here you go: ${Money} coins`,
        4: `I'm feeling generous today, take this: ${Money} coins`,
        5: `Ugh, fine, take this money: ${Money} coins`,
      },
      No: {
        1: "No",
        2: "I don't have any money",
        3: "I'm not giving you any money",
        4: "Ew, get away from me",
        5: "Go get your own money",
      },
    };

    // Is the beg successful? (45% chance of failing)
    let Success = Math.floor(Math.random() * 100);
    if (Success <= 45) {
      // Get a random message from the "No" table
      Message = messages["No"][Math.floor(Math.random() * 5)];
    } else {
      // Get a random message from the "Yes" table
      Message = messages["Yes"][Math.floor(Math.random() * 5)];
    }

    // If the beg was successful, add the money to the user's balance
    if (Success >= 45) {
      Profile.updateOne({ Balance: Bal + Money });

      // Send the message
      interaction.reply({
        content: `${celeb}: ${Message}`,
      });
    } else {
      // Send the message
      interaction.reply({
        content: `${celeb}: ${Message}`,
      });
    }

    // Console logs
    if (Success >= 45) {
      console.log(
        `${interaction.user.tag} successfully begged for ${Money} coins from ${celeb}`
      );
      console.log(Success);
    }

    // Log the command usage
    client.channels.cache
      .get("1013569553353150556")
      .send(
        `${interaction.user.tag} used the beg command in <#${interaction.channel.id}>`
      );
  },
};
