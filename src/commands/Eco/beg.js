const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money"),
  async execute(interaction, client) {
    // Wait TILL THIS CHECK ID DONE TO CONTINUE
    const Profile = await client.checkProfile(interaction.user);

    // If the user is banned, end the command
    if (Profile == "Banned") {
      return;
    }

    const { channel } = interaction;

    const Bal = await client.checkBalance(interaction.user);

    let randomMoney = Math.floor(Math.random() * 6);


    if (Profile.cooldowns.beg > Math.floor(Date.now() / 1000)) {
      interaction.reply({
        content: `You can beg again <t:${Profile.cooldowns.beg}:R>`
      })
      return;
    }

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
    console.log(`Celeb Chosen: ${celeb}`);

    let Message = "";
    // Make a table of messages the celeb can say
    const messages = {
      Yes: {
        1: `Here's: ${randomMoney.toString()} coins`,
        2: `Take this: ${randomMoney.toString()} coins`,
        3: `I'll give you some, here you go: ${randomMoney.toString()} coins`,
        4: `I'm feeling generous today, take this: ${randomMoney.toString()} coins`,
        5: `Ugh, fine, take this money: ${randomMoney.toString()} coins`,
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
    if (Success <= 49.9) {
      // Get a random message from the "No" table
      Message = messages["No"][Math.floor(Math.random() * 5) + 1];
    } else {
      // Get a random message from the "Yes" table
      Message = messages["Yes"][Math.floor(Math.random() * 5) + 1];
    }

    // If the beg was successful, add the money to the user's balance
    if (Success >= 45) {
      await Profile.updateOne({ Balance: Bal + randomMoney }).then(
        console.log(
          `4{interaction.user.username} now has ${await client.checkBalance(
            interaction.user
          )}`
        )
      );
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
        `${
          interaction.user.tag
        } successfully begged for ${randomMoney.toString()} coins from ${celeb}`
      );
      console.log(Success);
    }

    let begCD = Math.floor(Date.now() / 1000) + 15;
    let stabCD = Profile.cooldowns.stab;
    let shootCD = Profile.cooldowns.shoot;
    await Profile.updateOne({ cooldowns: {
      shoot: shootCD,
      stab: stabCD,
      beg: begCD,
    }})

    client.commandDone(
      interaction.user,
      "beg",
      channel,
      `Begged for ${randomMoney.toString()} coins from ${celeb}`
    );
  },
};
