"use strict";
const http = require("http"),
      fs = require("fs"),
			matchReg = /([a-zA-Z0-9. ]+?)(?=<\/td>|<\/div>)/g;

let trainDB = null;
try {
  trainDB = require("./trainDB.json");
} catch (e) {
  // if not exists, fetch again
  trainDB = require("./parser").fetch().trainDB;
}


let parseTrainInfo = (data) => {
  // the log, need for comparing with new fetched data
  let logs = [];
  let isNew = false;
  let delayed = false;

  try {
    logs = require("./logDB.json");
  } catch (e) {
    // no history, send anyway
    isNew = true;
  };

  let logItem = {fetchTime: Date.now()};

  let parsedData = data.match(matchReg).filter(v => v.trim() && v.trim() !== "mobile").slice(2).map(v => v.indexOf(".") === -1 ? v.replace(/ /g, "_") : v);

  // Assumption: always have three trains for north and sourth
  // [ '152 Local 20 min', '254 Limited 52 min', '156 Local 83 min' ]
  // Baby Bullet
  let southBound = parsedData.slice(0, 9).join("-").split(".").map(v => v.replace(/-/g, " ").trim()).filter(v => !!v);
  let northBound = parsedData.slice(9).join("-").split(".").map(v => v.replace(/-/g, " ").trim()).filter(v => !!v);

  southBound.forEach(train => {
    train = train.split(" ");
    logItem.southbound = logItem.southbound || [];
    logItem.southbound.push({
      train: train[0],
      type: train[1],
      remain: train[2],
      unit: train[3]
    });
  });
  northBound.forEach(train => {
    train = train.split(" ");
    logItem.northbound = logItem.northbound || [];
    logItem.northbound.push({
      train: train[0],
      type: train[1],
      remain: train[2],
      unit: train[3]
    });
  });

  // Assumption: all use min
  // make sure the train will stop at your destination
  if ((!logItem.southbound || !logItem.southbound.length) && (!logItem.northbound || !logItem.northbound.length)) return;
  let southTrain = logItem.southbound.filter(v => trainDB.southbound[v.train].mountainviewstation)[0];
  let northTrain = logItem.northbound.filter(v => trainDB.northbound[v.train].paloaltostation)[0];
  let message = "";

  // compare with standard time to find the delay
  // only check the most recent one
  if (!isNew) {
    // the train exists and has delay
    if(southTrain && checkDelay(southTrain)) {
      delay = true;
      message += `Delayed Train ${southTrain.train}! Expected departure at: ${southTrain.remain} ${southTrain.unit} \n`;
    };
    if(northTrain && checkDelay(northTrain)) {
      delay = true;
      message += `Delayed Train ${northTrain.train}! Expected departure at: ${northTrain.remain } ${southTrain.unit} \n`;
    };
  } else {
    if (southTrain) {
      message += `SouthBound - ${southTrain.train} - ${southTrain.remain} - ${southTrain.unit} \n`;
    }
    if (northTrain) {
      message += `NorthBound - ${northTrain.train} - ${northTrain.remain} - ${northTrain.unit} \n`;
    }
  }


  if (isNew || delayed) sendSMS(message);
  //console.log(message); 
};

let checkDelay = (train) => {
  // only for me now
  let eta = trainDB.southbound[southTrain.train].paloaltostation;

  // impossible => api will be wrong if happened
  if (!eta) return;

  let trainHour = new Date().getHours() % 12 + Math.floor((new Date().getMinutes() + parseInt(southTrain.remain)) / 60);
  let etaHour = parseInt(eta.split(":")[0]);
  let trainMinute = (new Date().getMinutes() + parseInt(southTrain.remain)) % 60;
  let etaMinute = parseInt(eta.split(":")[1]);
  if (trainHour > etaHour || (trainHour == etaHour && trainMinute > etaMinute)) {
    return true;
  }
  return false;
};


let sendSMS = (body) => {
  // Twilio Credentials
  const accountSid = '',
  authToken = '';

  //require the Twilio module and create a REST client
  var client = require('twilio')(accountSid, authToken);

  client.messages.create({
    to: '',
    from: '',
    body: body,
  }, function (err, message) {
    console.log(err);
    console.log(message.sid);
  });
};

http.get("http://www.caltrain.com/schedules/realtime/stations/paloaltostation-mobile.html", (res) => {
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
