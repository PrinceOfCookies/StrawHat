const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");

module.exports = (client) => {
  client.checkVideo = async () => {
    const data = await parser
      .parseURL(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCEG5VK8Qi_aiqgGypC-fEWw"
      )
      .catch(console.error);

    const rawData = fs.readFileSync(`${__dirname}/../../json/checkvideo.json`);

    const jsonData = JSON.parse(rawData);

    if (jsonData.id !== data.items[0].id) {
      // New video or video not sent

      const { title, link, id, author } = data.items[0]

      fs.writeFileSync(
        `${__dirname}/../../json/checkvideo.json`,
        JSON.stringify({ id: id, title: title, link: link, author: author, url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`})
      );

    }
  };
};
