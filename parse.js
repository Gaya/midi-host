/**
 * Given a string from the output of `aconnect -i -l` return a list of information about the connected midi devices.
 * It will ignore client 0 and Midi Through.
 *
 * Example:
 * client 0: 'System' [type=kernel]
 *     0 'Timer           '
 *     1 'Announce        '
 * client 14: 'Midi Through' [type=kernel]
 *     0 'Midi Through Port-0'
 * client 20: 'MIDI Keyboard' [type=kernel,card=1]
 *     0 'MIDI Keyboard MIDI 1'
 * client 30: 'Synth' [type=kernel,card=2]
 *     0 'Synth MIDI 1'
 *     1 'Synth MIDI 2'
 *
 * return [
 *   {
 *     name: 'MIDI Keyboard',
 *     id: 20,
 *     ports: [0],
 *   },
 *   {
 *     name: 'Synth',
 *     id: 30,
 *     ports: [0, 1],
 *   }
 * ];
 *
 * @param input {string}
 * @returns {Array}
 */
function parse(input) {
  const clientRegexp = /^client (\d*): '(.*)' \[(.*)]\n(\s.+\n?)+/gm;
  const devices = [];

  let result;
  while (result = clientRegexp.exec(input)) {
    const [matched, rawId, name] = result;
    const id = parseInt(rawId, 10);

    // skip if device is client 0 or Midi Through
    if (id === 0 || name.indexOf('Through') > -1) {
      continue;
    }

    const device = {
      name,
      id,
      ports: [],
    };

    // get device ports
    const portRegexp = /^\s+(\d+).+/gm;

    let portResult;
    while (portResult = portRegexp.exec(matched)) {
      const [_, portRaw] = portResult;

      device.ports.push(parseInt(portRaw, 10));
    }

    devices.push(device);
  }

  return devices;
}

module.exports = parse;