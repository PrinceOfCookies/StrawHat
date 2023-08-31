const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shoot")
    .setDescription("Shoot someone")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Who do you want to shoot?")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let { channel, options } = interaction;

    let vic = options.getUser("target");
    let Vic_Profile = await client.checkProfile(vic);
    let VicDeaths = Vic_Profile.deaths[Vic_Profile.deaths.length - 1];
    let VicLastDeath = Vic_Profile.deaths.length > 0 ? VicDeaths.tod : 0;
    let vichp = Vic_Profile.hp;

    let chance = Math.floor(Math.random() * 100) + 1;
    let damage = Math.floor(Math.random() * 30) + 1;
    let Miss = chance < 6 ? true : false;
    let Selfshot = chance < 1 ? true : false;
    let ded = vichp - damage <= 0 ? true : false;
    let Alive = ded ? "Dead" : "Alive";
    let Hit = Miss ? "Miss" : "Hit";

    let Atk_Profile = await client.checkProfile(interaction.user);
    if (Atk_Profile.BotBanned) return end;

    // Check if the victim got killed within the last 5 minutes
    if (VicLastDeath + 300 > Math.floor(Date.now() / 1000)) {
      interaction.reply({
        content: `Dude.. They just died.. Give them a break.. (<t:${
          VicLastDeath + 300
        }:R>)`,
      });
      return;
    }

    // Check if the attack is on cooldown for shoot
    if (Atk_Profile.cooldowns.shoot > Math.floor(Date.now() / 1000)) {
      interaction.reply({
        content: `You are on cooldown for shoot! Please wait <t:${Atk_Profile.cooldowns.shoot}:R> seconds!`,
      });
      return;
    }

    async function setCooldown(additional) {
      additional = additional >= 0 ? additional : 0;
      await Atk_Profile.updateOne({
        cooldowns: { shoot: Math.floor(Date.now() / 1000) + (30 + additional) },
      });
      await Atk_Profile.save().catch(console.error);
    }

    if (Miss) {
      interaction.reply({
        content: `You missed your shot!`,
      });

      // Put them on cooldown, but with an additional 5 seconds for missing
      setCooldown(5);
    }

    if (Selfshot && !Miss) {
      interaction.reply({
        content: `Your gun backfired and you shot yourself! (You died) (haha, loser)`,
      });

      // Put them on cooldown, but with an additional 10 seconds for shooting themselves
      setCooldown(10);
      // If you shoot yourself, its always in the head.. youre dead
      client.logdeath(interaction.user, interaction.user, "Gun", channel);
    }

    if (ded && !Miss && !Selfshot) {
      interaction.reply({
        content: `You shot ${vic.username} and killed them!`,
        ephemeral: true,
      });

      setCooldown();
      client.logDeath(vic, interaction.user, "Gun", channel);
    } else {
      interaction.reply({
        content: `You shot ${vic.username} and they now have ${
          vichp - damage
        } HP!`,
      });

      setCooldown();
      await Vic_Profile.updateOne({ hp: vichp - damage });
      console.log(
        `${vic.id} took ${damage} and now has ${vichp - damage} (had ${vichp})`
      );
      await Vic_Profile.save().catch(console.error);
    }

    client.commandDone(
      interaction.user,
      "shoot",
      channel,
      `${vic.username} (${vic.id}) | ${Alive} (${Hit}) (${vichp - damage} HP)`
    );
  },
};
