"use strict";
const http = require("http"),
      fs = require("fs"),
      tableMatch = /<table.*?>([\s\S]*?)<\/table>/g,
      theadMatch = /([\d*]+?)(?=<\/th>)/g,
      stopsMatch = /(\w+?)(?=.html)/g,
      trMatch = /<tr.*?>([\s\S]*?)<\/tr>/g,
      tdMatch = /<(?:td).*?>([\s\S]*?)<\/(?:td)>/g,
			StopsMatch = /<th.*>(.*?)<\/a>/g;

module.exports = {
  fetch() {
    let parseTrainInfo = (data) => {
      let tables = data.match(tableMatch).slice(1, 3);
      let northbound = {};
      let southbound = {};
      tables.forEach((table, i) => {
        let dataContainer = i == 0 ? northbound : southbound;
        let tNo = table.match(theadMatch).filter(v => v.length > 2);
        let stops = table.match(stopsMatch);
        let timeRows = table.match(trMatch).slice(1);

        timeRows.forEach((timeRow, j) => {
          let stop = stops[j];
          timeRow = timeRow.match(tdMatch).map(v => {
            if (v.length > 20) {
              return v.split(/>|</g)[4].replace(/(<\/td>|<td>|&nbsp;|—|-)/g,"");
            }
            return v.replace(/(<\/td>|<td>|&nbsp;|—|-)/g,"");
          });
          timeRow.forEach((time, t) => {
            let trainNo = tNo[t];
            dataContainer[trainNo] = dataContainer[trainNo] || {};
            dataContainer[trainNo][stop] = time;
          });
        });
      })
      fs.writeFile('./trainDB.json', JSON.stringify({northbound, southbound}), 'utf8');
      this.trainDB = {northbound, southbound};
    };
    http.get("http://www.caltrain.com/schedules/weekdaytimetable/weekdaytimetable-scrolling.html", (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        parseTrainInfo(body);
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
    return this;
  },
  trainDB: {}
};
