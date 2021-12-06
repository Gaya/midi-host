const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

const path = process.env.SETTINGS_PATH || SETTINGS_PATH || `${os.homedir()}/midi.settings.json`;

/**
 * Returns device setting.
 *
 * 0 = off
 * 1 = in + out
 * 2 = in
 * 3 = out
 *
 * @param settings
 * @param device
 * @returns {number}
 */
function getDeviceSetting(settings, device) {
  const matched = settings[device.name];

  if (typeof matched === 'undefined') {
    // default to in + out on not found
    return 1;
  }

  return matched;
}

function canMidiIn(settings, device) {
  switch (getDeviceSetting(settings, device)) {
    case 1:
    case 2:
      return true;
    default:
      return false;
  }
}

function canMidiOut(settings, device) {
  switch (getDeviceSetting(settings, device)) {
    case 1:
    case 3:
      return true;
    default:
      return false;
  }
}

function loadSettings() {
  try {
    const settings = fs.readFileSync(path);
    return JSON.parse(settings.toString());
  } catch (err) {
    console.info(`No settings file found at ${path}`);

    return {};
  }
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(path, settings);
  } catch (err) {
    console.error(err);
  }
}

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

module.exports = {
  getDeviceSetting,
  canMidiIn,
  canMidiOut,
  loadSettings,
  execCommand,
}