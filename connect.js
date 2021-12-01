const { exec } = require('child_process');

const parse = require('./parse');
const { loadSettings, canMidiIn, canMidiOut } = require('./settings');

function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }

      resolve(stdout);
    });
  });

}

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