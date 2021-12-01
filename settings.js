const fs = require('fs');

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
    const settings = fs.readFileSync(`${__dirname}/settings.json`);
    return JSON.parse(settings.toString());
  } catch (err) {
    return {};
  }
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(`${__dirname}/settings.json`, settings);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  canMidiIn,
  canMidiOut,
  loadSettings,
}