const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");

module.exports = (client) => {
  client.channelInfo = async () => {
    // Get sub count
    const data = await parser
      .parseURL(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCEG5VK8Qi_aiqgGypC-fEWw"
      )
      .catch(console.error);

    const rawData = fs.readFileSync(`${__dirname}/../../json/channelinfo.json`);

    const jsonData = JSON.parse(rawData);

    // Get the sub count for (https://www.youtube.com/channel/UCEG5VK8Qi_aiqgGypC-fEWw) without using google api
    let subs = fetch("https://www.youtube.com/channel/UCEG5VK8Qi_aiqgGypC-fEWw")
      .then((res) => res.text())
      .then((body) => {
        const regex = /subscriber-count" content="(.+?)"/;
        const found = body.match(regex);
        return found;
      });

    if (jsonData.id !== data.items[0].id) {
      // New video or video not sent

      const { title, link, id, author, } = data.items[0];

      // Get view count for video (https://www.youtube.com/watch?v=Zi_XLOBDo_Y) without using google api
        let views = fetch("https://www.youtube.com/watch?v=Zi_XLOBDo_Y")
            .then((res) => res.text())
            

      fs.writeFileSync(
        `${__dirname}/../../json/checkvideo.json`,
        JSON.stringify({
          id: id,
          title: title,
          link: link,
          author: author,
          url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`,
          views: views,
          subs: subs,
        })
      );
    }
  };
};
