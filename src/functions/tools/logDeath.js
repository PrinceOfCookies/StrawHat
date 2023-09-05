function randomID(len) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = (client) => {
  client.logDeath = async (victim, killer, weapon, channel) => {
    let Vic_Profile = await client.checkProfile(victim);
    let Atk_Profile = await client.checkProfile(killer);

    let ID = randomID(10);

    let VicDeaths = Vic_Profile.deaths;
    let AtkKills = Atk_Profile.kills;

    while (Vic_Profile.deaths.find((d) => d.id == ID)) {
      ID = randomID(10);
    }

    while (Atk_Profile.kills.find((k) => k.id == ID)) {
      ID = randomID(10);
    }

    let newDeath = {
      ID: ID,
      killer: `${killer.username} (${killer.id})`,
      tod: Math.floor(Date.now() / 1000),
      weapon: weapon,
    };

    let newKill = {
      ID: ID,
      victim: `${victim.username} (${victim.id})`,
      tod: Math.floor(Date.now() / 1000),
      weapon: weapon,
    };

    VicDeaths.push(newDeath);
    AtkKills.push(newKill);

    await Vic_Profile.updateOne({
      deaths: VicDeaths,
      hp: 100,
    });
    await Atk_Profile.updateOne({
      kills: AtkKills,
    });

    let deathCount = Vic_Profile.deaths.length;
    let killCount = Atk_Profile.kills.length;

    await Vic_Profile.updateOne({
      deathCount: deathCount,
    });
    await Atk_Profile.updateOne({
      killCount: killCount,
    });

    await Vic_Profile.save().catch(console.error);
    await Atk_Profile.save().catch(console.error);
    channel.send(
      `${victim.username} was killed by ${killer.username} with ${weapon} (ID: ${ID})`
    );
  };
};
