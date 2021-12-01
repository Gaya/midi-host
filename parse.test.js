const parse = require('./parse');

const input = `client 0: 'System' [type=kernel]
    0 'Timer           '
    1 'Announce        '
client 14: 'Midi Through' [type=kernel]
    0 'Midi Through Port-0'
client 20: 'MIDI Keyboard' [type=kernel,card=1]
    0 'MIDI Keyboard MIDI 1'
client 30: 'Synth' [type=kernel,card=2]
    0 'Synth MIDI 1'
    1 'Synth MIDI 2'`;

describe('parse', () => {
  it('should correctly list MIDI devices and ports', () => {
    expect(parse(input)).toEqual([
      {
        name: 'MIDI Keyboard',
        id: 20,
        ports: [0],
      },
      {
        name: 'Synth',
        id: 30,
        ports: [0, 1],
      }
    ]);
  });
});