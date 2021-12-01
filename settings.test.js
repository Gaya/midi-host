const { canMidiIn, canMidiOut } = require('./settings');

describe('settings', () => {
  const device = {
    name: 'MIDI device',
  };

  describe('canMidiIn', () => {
    it('should accept midi input when not in settings', () => {
      expect(canMidiIn({}, device)).toBeTruthy();
    });

    it('should not accept midi input when "off" in settings', () => {
      expect(canMidiIn({ 'MIDI device': 0 }, device)).toBeFalsy();
    });

    it('should accept midi input when "in + out" in settings', () => {
      expect(canMidiIn({ 'MIDI device': 1 }, device)).toBeTruthy();
    });

    it('should accept midi input when "in" in settings', () => {
      expect(canMidiIn({ 'MIDI device': 2 }, device)).toBeTruthy();
    });

    it('should not accept midi input when "out" in settings', () => {
      expect(canMidiIn({ 'MIDI device': 3 }, device)).toBeFalsy();
    });
  });

  describe('canMidiOut', () => {
    it('should allow midi output when not in settings', () => {
      expect(canMidiOut({}, device)).toBeTruthy();
    });

    it('should not allow midi output when "off" in settings', () => {
      expect(canMidiOut({ 'MIDI device': 0 }, device)).toBeFalsy();
    });

    it('should allow midi output when "in + out" in settings', () => {
      expect(canMidiOut({ 'MIDI device': 1 }, device)).toBeTruthy();
    });

    it('should not allow midi output when "in" in settings', () => {
      expect(canMidiOut({ 'MIDI device': 2 }, device)).toBeFalsy();
    });

    it('should allow midi output when "out" in settings', () => {
      expect(canMidiOut({ 'MIDI device': 3 }, device)).toBeTruthy();
    });
  });
});