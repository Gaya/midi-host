const { exec } = require('child_process');

const parse = require('./parse');
const { loadSettings, canMidiIn, canMidiOut, execCommand } = require('./settings');

async function connectAll() {
  // disconnect current Midi devices
  await execCommand('aconnect -x');

  const devices = await execCommand('aconnect -i -l')
    .then(parse);

  const settings = loadSettings();

  // go through all devices, its ports, and connect them
  devices.forEach((a) => {
    if (!canMidiOut(settings, a)) {
      // cannot send out, abort
      return;
    }

    a.ports.forEach((ap) => {
      devices
        // prevent connecting to self
        .filter((d) => d.id !== a.id)
        .forEach((b) => {
          if (!canMidiIn(settings, b)) {
            // cannot receive midi, abort
            return;
          }

          b.ports.forEach((bp) => {
            execCommand(`aconnect ${a.id}:${ap} ${b.id}:${bp}`);
          });
      });
    });
  });
}

connectAll()
  .catch((error) => {
    console.error(error);
  });