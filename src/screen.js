const express = require('express');
const { WebSocketServer } = require('ws');

const { loadSettings, execCommand, getDeviceSetting } = require('./settings');
const parse = require('./parse');

const webpage = require('./screen.html');

const app = express();
const wss = new WebSocketServer({ port: 4000 });

const clients = {};

function getDeviceList() {
  return execCommand('aconnect -i -l')
    .then(parse)
    .catch(() => [
      {
        name: 'Cannot find devices',
        id: 0,
        ports: [0],
      }
    ]);
}

function sendUpdate(list) {
  const settings = loadSettings();

  getDeviceList()
    .then((devices) => {
      const devicesWithSettings = devices.map((device) => {
        return {
          ...device,
          setting: getDeviceSetting(settings, device),
        };
      });

      list.forEach((ws) => {
        console.info('Sending update');
        ws.send(JSON.stringify({ devices: devicesWithSettings }));
      });
    });
}

wss.on('connection', (ws) => {
  const id = +new Date();

  clients[id] = ws;

  ws.on('disconnect', () => {
    delete clients[id];
  });

  sendUpdate([ws]);
});

app.get('/', function (req, res) {
  res.send(webpage.default);
});

setInterval(() => {
  sendUpdate(Object.values(clients));
}, 2000);

app.listen(3000);

console.info('Started app on port 3000');