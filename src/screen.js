const express = require('express');
const { WebSocketServer } = require('ws');

const { loadSettings, execCommand, getDeviceSetting } = require('./settings');
const parse = require('./parse');

const webpage = require('./screen.html');

const app = express();
const wss = new WebSocketServer({ port: 4000 });

const clients = {};

app.get('/', function (req, res) {
  res.send(webpage.default);
});

function getDeviceList() {
  return execCommand('aconnect -i -l')
    .then(parse)
    .catch(() => [
      {
        name: 'LPK25',
        id: 20,
        ports: [0],
      },
      {
        name: 'microKEY2',
        id: 30,
        ports: [0],
      },
      {
        name: 'Deepmind12D',
        id: 40,
        ports: [0, 1],
      },
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

app.listen(3000);

console.info('Started app on port 3000');