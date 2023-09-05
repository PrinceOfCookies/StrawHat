const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("attack")
    .setDescription("Attack someone")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("shoot")
        .setDescription("Shoot someone")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do you want to shoot?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stab")
        .setDescription("Stab someone")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do you want to stab?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("slap")
        .setDescription("Slap someone")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Who do you want to slap?")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    let { channel, options } = interaction;
    const type = options.getSubcommand();
    let vic = options.getUser("target");
    let Vic_Profile = await client.checkProfile(vic);
    let VicDeaths = Vic_Profile.deaths[Vic_Profile.deaths.length - 1];
    let VicLastDeath = Vic_Profile.deaths.length > 0 ? VicDeaths.tod : 0;
    let vichp = Vic_Profile.hp;
    let chance = Math.floor(Math.random(100));

    let ded = "";
    let Alive = "";
    let Hit = "";
    let damage = "";
    let Miss = "";
    let Selfshot = "";
    let StabSelf = "";

    let atk = interaction.user;
    let Atk_Profile = await client.checkProfile(atk);
    if (Atk_Profile.BotBanned) return end;

    if (VicLastDeath + 300 > Math.floor(Date.now() / 1000)) {
      interaction.reply({
        content: `Dude.. They just died.. Give them a break.. (<t:${
          VicLastDeath + 300
        }:R>)`,
      });
      return;
    }

    switch (type) {
      case "shoot":
        damage = Math.floor(Math.random() * 45) + 1;
        Miss = chance < 3 && chance > 1 ? true : false;
        Selfshot = chance == 1 ? true : false;
        ded = vichp - damage <= 0 ? true : false;
        Alive = ded ? "Dead" : "Alive";
        Hit = Miss ? "Miss" : "Hit";

        // Check if the attack is on cooldown for shoot
        if (Atk_Profile.cooldowns.shoot > Math.floor(Date.now() / 1000)) {
          interaction.reply({
            content: `You are on cooldown for shoot! You can shoot again <t:${Atk_Profile.cooldowns.shoot}:R>!`,
          });
          return;
        }

        if (Miss) {
          interaction.reply({
            content: `You missed your shot!`,
          });

          // Put them on cooldown, but with an additional 5 seconds for missing
          client.setCooldown(interaction.user, "shoot", 5, "src/commands/Eco/attack.js", 94);
          break;
        }

        if (Selfshot && !Miss) {
          interaction.reply({
            content: `Your gun backfired and you shot yourself! (You died) (haha, loser)`,
          });

          // Put them on cooldown, but with an additional 10 seconds for shooting themselves
          client.setCooldown(interaction.user, "shoot", 30, "src/commands/Eco/attack.js", 104);
          // If you shoot yourself, its always in the head.. youre dead
          client.logDeath(interaction.user, interaction.user, "Gun", channel);
          break;
        }

        if (ded && !Miss && !Selfshot) {
          interaction.reply({
            content: `You shot ${vic.username} and killed them!`,
            ephemeral: true,
          });

          client.setCooldown(interaction.user, "shoot", 0,  "src/commands/Eco/attack.js", 116);
          client.logDeath(vic, interaction.user, "Gun", channel);
          break;
        } else {
          if (!Miss && !Selfshot) {
            interaction.reply({
              content: `You shot ${vic.username} and they now have ${
                vichp - damage
              } HP!`,
            });

            client.setCooldown(interaction.user, "shoot", 0,  "src/commands/Eco/attack.js", 127);
            await Vic_Profile.updateOne({ hp: vichp - damage });
            console.log(
              `${vic.id} took ${damage} and now has ${
                vichp - damage
              } (had ${vichp})`
            );

            break;
          }
        }

        break;
      case "stab":
        damage = Math.floor(Math.random() * 25 )+ 1;
        Miss = chance < 3 && chance > 1 ? true : false;
        StabSelf = chance == 1 ? true : false;
        ded = vichp - damage <= 0 ? true : false;
        Alive = ded ? "Dead" : "Alive";
        Hit = Miss ? "Miss" : "Hit";
        // Check if the attack is on cooldown for stab
        if (Atk_Profile.cooldowns.stab > Math.floor(Date.now() / 1000)) {
          interaction.reply({
            content: `You are on cooldown for stab! You can stab again <t:${Atk_Profile.cooldowns.stab}:R>!`,
          });
          return;
        }

        if (Miss) {
          interaction.reply({
            content: `You missed your stab! (How??)`,
          });

          // Put them on cooldown, but with an additional 5 seconds for missing
          client.setCooldown(interaction.user, "stab", 5, "src/commands/Eco/attack.js", 161);
          break;
        }

        if (StabSelf && !Miss) {
          interaction.reply({
            content: `You stabbed yourself! (You died) (How.. The.. Fuck..)`,
          });

          // You get an extra 15 seconds for stabbing yourself..
          client.setCooldown(interaction.user, "stab", 15, "src/commands/Eco/attack.js", 171)
          // You stab yourself in the heart
          client.logDeath(interaction.user, interaction.user, "Knife", channel);
          break;
        }

        if (ded && !Miss && !StabSelf) {
          interaction.reply({
            content: `You stabbed ${vic.username} and killed them!`,
            ephemeral: true,
          });

          client.setCooldown(interaction.user, "stab", 0, "src/commands/Eco/attack.js", 183)
          client.logDeath(vic, interaction.user, "Knife", channel);
        } else {
          if (!Miss && !StabSelf) {
            interaction.reply({
              content: `You stabbed ${vic.username} and they now have ${
                vichp - damage
              } HP!`,
            });

            client.setCooldown(interaction.user, "stab", 0, "src/commands/Eco/attack.js", 193)
            await Vic_Profile.updateOne({ hp: vichp - damage });
            console.log(
              `${vic.id} took ${damage} and now has ${
                vichp - damage
              } (had ${vichp})`
            );
            break;
          }
        }
        break;
      case "slap": 
        damage = 1
        Miss = chance < 3 && chance > 1 ? true : false;
        ded = vichp - damage <= 0 ? true : false;
        Alive = ded ? "Dead" : "Alive";
        Hit = Miss ? "Miss" : "Hit";
        
        if (Miss) {
          interaction.reply({
            content: `You missed your slap! (L)`,
          });
          break;
        }

        if (ded && !Miss) {
          interaction.reply({
            content: `You slapped ${vic.username} and killed them!`,
            ephemeral: true,
          });

          client.logDeath(vic, interaction.user, "Hand", channel);
          break;
        } else {
          if (!Miss) {
            interaction.reply({
              content: `You slapped ${vic.username} and they now have ${
                vichp - damage
              } HP!`,
            });

            await Vic_Profile.updateOne({ hp: vichp - damage });
            console.log(
              `${vic.id} took ${damage} and now has ${
                vichp - damage
              } (had ${vichp})`
            );

            break;
          }
        }
        break;
    }

    client.setCooldown(interaction.user, "attack", 0, "src/commands/Eco/attack.js", 244)
    let VDID = ""; // Victim Death ID

    if (Alive == "Dead") {
      VDID = Vic_Profile.deaths[Vic_Profile.deaths.length - 1].ID;
    }

    client.commandDone(
      interaction.user,
      "attack",
      channel,
      `${vic.username} (${vic.id}) | ${Alive} (${Hit}) (${
        vichp - damage
      } HP) (${type}) (${VDID})`
    );
  },
};
