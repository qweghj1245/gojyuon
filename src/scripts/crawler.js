const request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");

const syncWords = function (link, title) {
  request({
    url: link,
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body);
    const result = [];
    const table_tr = $("table tr");

    for (let i = 0; i < table_tr.length; i++) {
      const table_td = table_tr.eq(i).find('td');
      const japanese = table_td.eq(0).text();
      const hiragana = table_td.eq(1).text();
      const accent = table_td.eq(2).text();
      const chinese = table_td.eq(3).text();

      if (japanese && hiragana && accent && chinese) {
        result.push(Object.assign({ japanese, accent, hiragana, chinese }));
      }
    }

    fs.writeFileSync(`src/data/${title}.json`, JSON.stringify(result));
  });
};

const loopLinksToGetJSON = function () {
  request({
    url: "https://www.sigure.tw/learn-japanese/vocabulary/n5/",
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body);
    const result = [];
    const table_tr = $("table tr td");

    for (let i = 1; i < table_tr.length; i++) {
      const table_td = table_tr.eq(i).find('a');
      const link = table_td.eq(0).attr('href');
      const text = table_td.eq(0).text();
      const title = link.replace('/learn-japanese/vocabulary/n5/', '').replace('.php', '');
      result.push(Object.assign({ engTitle: title, chTitle: text }));
      syncWords("https://www.sigure.tw" + link, title);
    }

    fs.writeFileSync('src/data/title.json', JSON.stringify(result));
  });
};

loopLinksToGetJSON();